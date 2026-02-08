import { loadSolanaPools } from "./pools.js";
import { runAgentXirion } from "../../ai/config.js";
import { yieldAnalysisPrompt } from "../../ai/prompts.js";

export async function analyzeYield() {
  const poolsResult = await loadSolanaPools();

  const userPayload = {
    chain: "Solana",
    pools: poolsResult.pools,
  };

  // DEBUG: payload masuk
  console.log("[YieldAgent] Payload:");
//   console.dir(userPayload, { depth: null });

  const response = await runAgentXirion({
    system: yieldAnalysisPrompt(userPayload),
    messages: [
      {
        role: "user",
        content: "Return the JSON now.",
      },
    ],
  });

  // DEBUG: raw AI text
//   console.log("[YieldAgent] Raw AI text:");
//   console.log(response.text);

  // PARSE JSON STRING → OBJECT
  const parsed = JSON.parse(response.text);

  // DEBUG: parsed object
//   console.log("[YieldAgent] Parsed result:");
//   console.dir(parsed, { depth: null });

  return parsed;
}
