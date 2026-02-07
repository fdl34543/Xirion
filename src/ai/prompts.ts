export function buildRiskPrompt(input: {
  name: string;
  symbol: string;
  heuristics: {
    honeypotRisk: number;
    rugPullRisk: number;
    liquidityRisk: number;
    concentrationRisk: number;
  };
}) {
  return `
Token:
- Name: ${input.name}
- Symbol: ${input.symbol}

Raw heuristic risk signals (0–100, higher = riskier):
- Honeypot Risk: ${input.heuristics.honeypotRisk}
- Rug Pull Risk: ${input.heuristics.rugPullRisk}
- Liquidity Risk: ${input.heuristics.liquidityRisk}
- Concentration Risk: ${input.heuristics.concentrationRisk}

Tasks:
- Normalize the scores
- Do not invent new risks
- Keep scores realistic
- Return JSON ONLY in this format:

{
  "honeypot": number,
  "rugPull": number,
  "liquidity": number,
  "concentration": number,
  "overallRisk": number,
  "summary": "short 1–2 line explanation"
}
`;
}
