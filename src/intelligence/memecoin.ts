import { moralisSolana } from "../utils/moralis.js";

export interface MemecoinData {
  isPumpFun: boolean;
  bonding?: {
    progress?: number;
    graduated?: boolean;
  };
}

export async function fetchMemecoinData(
  address: string
): Promise<MemecoinData> {
  try {
    const res = await moralisSolana().get(
      `/token/mainnet/${address}/bonding-status`
    );

    return {
      isPumpFun: true,
      bonding: {
        progress: res.data?.progress,
        graduated: res.data?.graduated,
      },
    };
  } catch {
    return {
      isPumpFun: false,
    };
  }
}
