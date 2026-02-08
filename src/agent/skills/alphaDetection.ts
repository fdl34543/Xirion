import { fetchTrendingTokens } from "../../utils/moralis.js";
import { analyzeToken } from "../analyzeToken.js";
import { runAgentXirion } from "../../ai/config.js";
import { selectBestTokenPrompt } from "../../ai/prompts.js";
import { sendAlphaAlert } from "../../telegram/alert.js";
import { alphaTrade } from "../trade/alphaTrade.js";
import { DummySolanaSigner } from "../signer/DummySolanaSigner.js";

let isInitialized = false;
let lastRunAt = 0;

const ONE_HOUR = 60 * 60 * 1000;
const signer = new DummySolanaSigner();

/* =========================
   Types
========================= */

export type AlphaMode = "cli" | "api";

export type AlphaDetectionResult = {
  agent: string;
  symbol: string;
  tokenAddress: string;
  score: number;
  confidence: number;
  reasons?: string[];
};

/* =========================
   Runner
========================= */

export async function alphaDetectionCore(
  agentName: string,
  mode: AlphaMode = "cli"
): Promise<AlphaDetectionResult | null> {
  const now = Date.now();

  if (!isInitialized) {
    isInitialized = true;
    console.log(`[${agentName}] AlphaDetection scheduler initialized`);
  }

  // run only once per hour (CLI only)
  if (mode === "cli" && now - lastRunAt < ONE_HOUR) {
    return null;
  }

  lastRunAt = now;
  console.log(`[${agentName}] AlphaDetection tick (${mode})`);

  let tokens;
  try {
    tokens = await fetchTrendingTokens();
  } catch {
    console.error(`[${agentName}] Failed to fetch Moralis trending tokens`);
    return null;
  }

  const analyzedResults: any[] = [];

  for (const token of tokens) {
    try {
      const analysis = await analyzeToken({
        address: token.tokenAddress,
      });

      if (analysis) {
        analyzedResults.push(analysis);
      }
    } catch {
      continue;
    }
  }

  if (analyzedResults.length === 0) {
    console.log(`[${agentName}] No analyzable tokens`);
    return null;
  }

  let aiResponse;
  try {
    aiResponse = await runAgentXirion({
      messages: [
        {
          role: "system",
          content: "You are a crypto alpha detection AI.",
        },
        {
          role: "user",
          content: selectBestTokenPrompt(analyzedResults),
        },
      ],
    });
  } catch {
    console.error(`[${agentName}] AI decision failed`);
    return null;
  }

  // ===== PARSE AI RESPONSE (MATCH analyzeToken EXACTLY) =====
  const rawText = aiResponse?.text ?? "";

  const cleaned = rawText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    console.error(`[${agentName}] Failed to parse AI JSON response`);
    console.error(cleaned);
    return null;
  }

  if (parsed.noWinner) {
    console.log(`[${agentName}] No alpha winner`);
    return null;
  }

  const result: AlphaDetectionResult = {
    agent: agentName,
    symbol: parsed.symbol,
    tokenAddress: parsed.tokenAddress,
    score: parsed.score,
    confidence: parsed.confidence,
    reasons: parsed.reasons ?? [],
  };

  console.log(`
[${agentName}] ALPHA DETECTED

Token: ${result.symbol}
Address: ${result.tokenAddress}
Score: ${result.score}
Confidence: ${result.confidence}
`);

  /* =========================
     SIDE EFFECTS (CLI ONLY)
  ========================= */

  try {
    if (mode === "cli") {
      await sendAlphaAlert({
        agent: agentName,
        symbol: result.symbol,
        address: result.tokenAddress,
        score: result.score,
        confidence: result.confidence,
        reasons: parsed.reasons ?? [],
      });

      await alphaTrade(
        {
          agent: agentName,
          symbol: result.symbol,
          address: result.tokenAddress,
          score: result.score,
          confidence: result.confidence,
        },
        signer
      );
    }
  } catch (err) {
    console.error(
      `[${agentName}] Alpha execution error`,
      err instanceof Error ? err.message : err
    );
  }


  /* =========================
     ALWAYS RETURN RESULT
  ========================= */

  return result;
}

// export { run as alphaDetection };
export async function alphaDetection(agentName: string): Promise<void> {
  await alphaDetectionCore(agentName, "cli");
}
