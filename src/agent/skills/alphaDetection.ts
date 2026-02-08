import { fetchTrendingTokens } from "../../utils/moralis.js";
import { analyzeToken } from "../analyzeToken.js";
import { runAgentXirion } from "../../ai/config.js";
import { selectBestTokenPrompt } from "../../ai/prompts.js";
import { sendAlphaAlert } from "../../telegram/alert.js";
import { alphaTrade } from "../trade/alphaTrade.js";

let isInitialized = false;
let lastRunAt = 0;

const ONE_HOUR = 60 * 60 * 1000;

export async function run(agentName: string): Promise<void> {
  const now = Date.now();

  if (!isInitialized) {
    isInitialized = true;
    console.log(`[${agentName}] AlphaDetection scheduler initialized`);
  }

  // run only once per hour
  if (now - lastRunAt < ONE_HOUR) {
    return;
  }

  lastRunAt = now;
  console.log(`[${agentName}] AlphaDetection tick`);

  let tokens;
  try {
    tokens = await fetchTrendingTokens();
  } catch {
    console.error(`[${agentName}] Failed to fetch Moralis trending tokens`);
    return;
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
    return;
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
    return;
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
    return;
  }

  if (parsed.noWinner) {
    console.log(`[${agentName}] No alpha winner`);
    return;
  }

  console.log(`
[${agentName}] ALPHA DETECTED

Token: ${parsed.symbol}
Address: ${parsed.tokenAddress}
Score: ${parsed.score}
Confidence: ${parsed.confidence}
`);

  await sendAlphaAlert({
    agent: agentName,
    symbol: parsed.symbol,
    address: parsed.tokenAddress,
    score: parsed.score,
    confidence: parsed.confidence,
    reasons: parsed.reasons ?? [],
  });

  await alphaTrade({
    agent: agentName,
    symbol: parsed.symbol,
    address: parsed.tokenAddress,
    score: parsed.score,
    confidence: parsed.confidence,
  });
}
export { run as alphaDetection };
