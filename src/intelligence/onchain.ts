import { moralisSolana } from "../utils/moralis.js";

export interface OnchainData {
  totalHolders: number;

  holderSupply?: {
    top10?: {
      supply: string;
      supplyPercent: number;
    };
    top25?: {
      supplyPercent: number;
    };
  };

  holderDistribution?: {
    whales: number;
    sharks: number;
    dolphins: number;
    fish: number;
    shrimps: number;
  };
}

export async function fetchOnchainData(
  address: string
): Promise<OnchainData> {
  const res = await moralisSolana().get(
    `token/mainnet/holders/${address}`
  );

  return res.data;
}
