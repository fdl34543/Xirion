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

export function selectBestTokenPrompt(tokens: any[]) {
  return `
You are a crypto alpha detection AI.

Input is a list of analyzed tokens with Risk Analysis, Honeypot Risk, Rug Pull Risk, Liquidity Risk, Liquidity Risk, Concentration Risk, AI Analysis, metrics, scores, risks, and momentum.

Your task:
- Select exactly ONE best token OR decide "noWinner"
- Prefer strong momentum, healthy liquidity, low risk
- Avoid scams, illiquid tokens, or extreme sell pressure

Respond ONLY in JSON format:

{
  "noWinner": boolean,
  "tokenAddress": string,
  "symbol": string,
  "score": number,
  "confidence": number,
  "reasons": string[]
}

Tokens:
${JSON.stringify(tokens, null, 2)}
`;
}
