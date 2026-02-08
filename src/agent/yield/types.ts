export interface YieldPool {
  poolId: string;
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number;

  apyPct1D?: number | null;
  apyPct7D?: number | null;
  apyPct30D?: number | null;

  stablecoin: boolean;
  exposure: string;
  ilRisk: string;
  predictions?: {
    predictedClass: string;
    predictedProbability: number;
    binnedConfidence: number;
  };
}


export interface YieldPoolsResult {
  timestamp: number;
  chain: "Solana";
  pools: YieldPool[];
}

export interface YieldAnalysisResult {
  timestamp: number;
  chain: "Solana";
  topPools: Array<{
    pool: YieldPool;
    score: number;
    reasoning: string;
  }>;
}
