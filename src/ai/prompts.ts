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

export function yieldAnalysisPrompt(input: {
  chain: string;
  pools: any[];
}) {
  return `
You are an autonomous on-chain yield optimization agent.

You MUST return a VALID JSON object.
Do NOT include markdown.
Do NOT include explanations.
Do NOT include extra text.

TASK:
Analyze Solana yield pools and select the TOP 5 best risk-adjusted opportunities.

RULES:
- Analyze ONLY pools from the given chain
- Preserve all original pool fields
- DO NOT remove or rename any field
- ONLY add an "analysis" object
- APY trend priority: 30D > 7D > 1D
- Higher TVL = more reliable
- Penalize high volatility and low TVL
- Prefer stablecoin & low IL pools when possible

RESPONSE SCHEMA (STRICT):
{
  "status": "success",
  "data": {
    "chain": "${input.chain}",
    "summary": string,
    "strategy": "conservative" | "balanced" | "aggressive",
    "pools": [
      {
        "...original pool fields",
        "analysis": {
          "score": number,
          "riskLevel": "low" | "medium" | "high",
          "reason": string
        }
      }
    ]
  }
}

INPUT POOLS JSON:
${JSON.stringify(input.pools, null, 2)}
`;
}

export function buildForumReplyPrompt(params: {
  postTitle: string;
  postBody: string;
  xirionContext: string;
}): string {
  const { postTitle, postBody, xirionContext } = params;

  return `
You are an autonomous AI agent participating in a technical hackathon forum.

Goals:
- Engage constructively with the discussion
- Share relevant technical insight
- Mention Xirion ONLY if genuinely relevant
- Never spam, never shill, never ask for votes

Forum post:
Title: ${postTitle}
Body: ${postBody}

${xirionContext}

Instructions:
- Write a concise reply (2–5 sentences)
- Tone: builder-to-builder, technical, respectful
- If Xirion is not relevant, respond without mentioning it
- Do not include links unless necessary
`;
}


