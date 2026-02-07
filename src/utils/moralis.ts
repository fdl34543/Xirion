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
