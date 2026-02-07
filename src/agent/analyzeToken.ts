import { fetchTokenMetadata } from "../intelligence/metadata.js";
import { fetchMarketData } from "../intelligence/market.js";
import { fetchOnchainData } from "../intelligence/onchain.js";
import { fetchMemecoinData } from "../intelligence/memecoin.js";

import { runAgentXerion } from "../ai/config.js";
import { buildRiskPrompt } from "./prompts/riskPrompt.js";
import { renderBar } from "../utils/render.js";

type AiRiskResult = {
  honeypot: number;
  rugPull: number;
  liquidity: number;
  concentration: number;
  overallRisk: number;
  summary: string;
};

type Recommendation = "ACCUMULATE" | "MONITOR" | "AVOID";

function getRecommendation(overallRisk: number): Recommendation {
  if (overallRisk < 35) return "ACCUMULATE";
  if (overallRisk < 65) return "MONITOR";
  return "AVOID";
}


export async function analyzeToken(input: {
  address: string;
  twitter?: string;
}) {
  const address = input.address;

  const [metadata, market, onchain, memecoin] = await Promise.all([
    fetchTokenMetadata(address),
    fetchMarketData(address),
    fetchOnchainData(address),
    fetchMemecoinData(address),
  ]);

  const liquidityUsd = market.totalLiquidityUsd
    ? Number(market.totalLiquidityUsd)
    : 0;

  const top10Percent =
    onchain.holderSupply?.top10?.supplyPercent ?? 0;

  const honeypotRisk = metadata.possibleSpam ? 90 : 20;

  const rugPullRisk =
    memecoin.isPumpFun && memecoin.bonding?.graduated === false
      ? 75
      : top10Percent > 80
      ? 85
      : 30;

  const liquidityRisk = liquidityUsd < 50_000 ? 80 : 30;

  const concentrationRisk = top10Percent > 70 ? 90 : 35;

  const heuristics = {
    honeypotRisk,
    rugPullRisk,
    liquidityRisk,
    concentrationRisk,
  };

  const prompt = buildRiskPrompt({
    name: metadata.name,
    symbol: metadata.symbol,
    heuristics,
  });

  const ai = await runAgentXerion({
    system: prompt.system,
    messages: [{ role: "user", content: prompt.user }],
  });

  const aiRisk: AiRiskResult = JSON.parse(ai.text);
  const recommendation = getRecommendation(aiRisk.overallRisk);

  console.log(`
${metadata.name} (${metadata.symbol})
${metadata.logo ? `Logo: ${metadata.logo}` : ""}

Recommendation: ${recommendation}

Risk Analysis
Honeypot Risk      ${renderBar(aiRisk.honeypot)}
Rug Pull Risk      ${renderBar(aiRisk.rugPull)}
Liquidity Risk     ${renderBar(aiRisk.liquidity)}
Concentration Risk ${renderBar(aiRisk.concentration)}

Overall Risk: ${aiRisk.overallRisk}%

AI Analysis:
${aiRisk.summary}
`);

  return {
    metadata,
    market,
    onchain,
    memecoin,
    heuristics,
    aiRisk,
  };
}
