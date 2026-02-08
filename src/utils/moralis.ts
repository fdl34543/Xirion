import axios from "axios";
import type { AxiosInstance } from "axios";


/* =========================
   Internal helpers
========================= */

function requireMoralisApiKey(): string {
  const key = process.env.MORALIS_API_KEY;

  if (!key) {
    throw new Error(
      "MORALIS_API_KEY is not set. Please add it to your .env file."
    );
  }

  return key;
}

function createMoralisClient(baseURL: string): AxiosInstance {
  return axios.create({
    baseURL,
    headers: {
      accept: "application/json",
      "X-API-Key": requireMoralisApiKey(),
    },
  });
}

/* =========================
   Lazy singletons
========================= */

let _moralisSolana: AxiosInstance | null = null;
let _moralisEvm: AxiosInstance | null = null;

/* =========================
   Public API (KEEP THIS)
========================= */

/**
 * Moralis Solana client
 */
export function moralisSolana(): AxiosInstance {
  if (!_moralisSolana) {
    _moralisSolana = createMoralisClient(
      "https://solana-gateway.moralis.io"
    );
  }
  return _moralisSolana;
}

/**
 * Moralis EVM client
 */
export function moralisEvm(): AxiosInstance {
  if (!_moralisEvm) {
    _moralisEvm = createMoralisClient(
      "https://deep-index.moralis.io/api/v2.2"
    );
  }
  return _moralisEvm;
}

export type MoralisTrendingToken = {
  chainId: string;
  tokenAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  logo?: string;
  usdPrice?: number;
  createdAt?: number;
  marketCap?: number;
  liquidityUsd?: number;
  holders?: number;
  pricePercentChange?: Record<string, number>;
  totalVolume?: Record<string, number>;
  transactions?: Record<string, number>;
  buyTransactions?: Record<string, number>;
  sellTransactions?: Record<string, number>;
  buyers?: Record<string, number>;
  sellers?: Record<string, number>;
};

export async function fetchTrendingTokens(): Promise<MoralisTrendingToken[]> {
  const apiKey = process.env.MORALIS_API_KEY;
  if (!apiKey) {
    throw new Error("MORALIS_API_KEY is missing");
  }

  const res = await fetch(
    "https://deep-index.moralis.io/api/v2.2/tokens/trending?chain=solana&limit=30",
    {
      method: "GET",
      headers: {
        accept: "application/json",
        "X-API-Key": apiKey,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Moralis API error: ${res.status}`);
  }

  return res.json();
}
