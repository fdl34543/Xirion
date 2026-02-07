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
  return {
    system: `
You are Agent Xerion, a crypto risk analysis AI.
You only reason based on provided signals.
Do not invent data.
Return valid JSON only.
    `.trim(),

    user: `
Token:
Name: ${input.name}
Symbol: ${input.symbol}

Heuristic risk signals (0–100, higher = riskier):
- Honeypot Risk: ${input.heuristics.honeypotRisk}
- Rug Pull Risk: ${input.heuristics.rugPullRisk}
- Liquidity Risk: ${input.heuristics.liquidityRisk}
- Concentration Risk: ${input.heuristics.concentrationRisk}

Return JSON in this exact format:
{
  "honeypot": number,
  "rugPull": number,
  "liquidity": number,
  "concentration": number,
  "overallRisk": number,
  "summary": "1 paragraph explanation",
  "confidence": "low | medium | high"
}
    `.trim(),
  };
}
