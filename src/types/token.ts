export type TokenMetadata = {
  name: string;
  symbol: string;
  description?: string;
  isVerified: boolean;
  possibleSpam: boolean;
  marketCapUsd?: number;
  fullyDilutedValueUsd?: number;
};

export type MarketData = {
  usdPrice: number;
  priceChange24hPercent: number;
  liquidityUsd?: number;
  exchange: string;
};

export type OnchainData = {
  totalHolders: number;
  holderChange24h: number;
  top10SupplyPercent: number;
};

export type MemecoinData = {
  isPumpFun: boolean;
  bondingProgress?: number;
  graduatedAt?: string;
};

export type AlphaResult = {
  score: number;
  risk: "low" | "medium" | "high";
  recommendation: "buy" | "watch" | "avoid";
  reasoning: string[];
};
