import { moralisSolana } from "../utils/moralis.js";

export interface MarketData {
  usdPrice?: string | number;
  usdPrice24hrPercentChange?: number;
  totalLiquidityUsd?: string;
  fullyDilutedValuationUsd?: string;
}

export async function fetchMarketData(
  address: string
): Promise<MarketData> {
  const res = await moralisSolana().get(
    `/token/mainnet/${address}/price`
  );

  return res.data;
}
