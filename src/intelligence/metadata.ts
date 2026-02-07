import { moralisSolana } from "../utils/moralis.js";

export interface TokenMetadata {
  mint: string;
  name: string;
  symbol: string;
  logo?: string;
  description?: string;

  decimals?: number | string;
  score?: number | null;

  isVerifiedContract?: boolean;
  possibleSpam?: boolean;

  links?: {
    website?: string;
    twitter?: string;
    discord?: string;
    reddit?: string;
    medium?: string;
  };
}

export async function fetchTokenMetadata(
  address: string
): Promise<TokenMetadata> {
  const res = await moralisSolana().get(
    `/token/mainnet/${address}/metadata`
  );

  return res.data;
}
