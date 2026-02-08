import type { YieldPool, YieldPoolsResult } from "./types.js";

const LLAMA_POOLS_API = "https://yields.llama.fi/pools";

function safeNumber(value: number | null | undefined): number {
  return typeof value === "number" ? value : -Infinity;
}

export async function loadSolanaPools(): Promise<YieldPoolsResult> {
  const res = await fetch(LLAMA_POOLS_API);
  if (!res.ok) {
    throw new Error("Failed to fetch pools data");
  }

  const json = await res.json();

  const solanaPools: YieldPool[] = json.data
    .filter((p: any) => p.chain === "Solana")
    .map((p: any): YieldPool => ({
      poolId: p.pool,
      chain: p.chain,
      project: p.project,
      symbol: p.symbol,
      tvlUsd: p.tvlUsd,
      apy: p.apy,

      apyPct1D: p.apyPct1D ?? null,
      apyPct7D: p.apyPct7D ?? null,
      apyPct30D: p.apyPct30D ?? null,

      stablecoin: p.stablecoin,
      exposure: p.exposure,
      ilRisk: p.ilRisk,
      predictions: p.predictions ?? undefined,
    }))
    .sort((a: YieldPool, b: YieldPool) => {
      return (
        safeNumber(b.apyPct30D) - safeNumber(a.apyPct30D) ||
        safeNumber(b.apyPct7D) - safeNumber(a.apyPct7D) ||
        safeNumber(b.apyPct1D) - safeNumber(a.apyPct1D)
      );
    })
    .slice(0, 50);

  return {
    timestamp: Date.now(),
    chain: "Solana",
    pools: solanaPools,
  };
}
