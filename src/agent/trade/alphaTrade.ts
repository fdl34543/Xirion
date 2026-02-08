// src/agent/trade/alphaTrade.ts
import { tradeAlphaAlert } from "../../telegram/alert.js";

type AlphaTradeInput = {
  agent: string;
  symbol: string;
  address: string;
  confidence: number;
  score: number;
};

type SimulatedTradeResult = {
  txHash: string;
  amountUsd: number;
  entryPriceUsd: number;
  timestamp: number;
};

function simulateBuyTrade(input: AlphaTradeInput): SimulatedTradeResult {
  const amountUsd = Math.round(500 + input.confidence * 1500);
  const entryPriceUsd = Math.random() * 0.01 + 0.001;

  return {
    txHash: `SIMULATED_TX_${Date.now()}`,
    amountUsd,
    entryPriceUsd,
    timestamp: Date.now(),
  };
}

export async function alphaTrade(
  input: AlphaTradeInput
): Promise<SimulatedTradeResult> {
  console.log(
    `[${input.agent}] Executing simulated BUY for alpha token ${input.symbol}`
  );
  console.log(
    `[${input.agent}] Confidence=${input.confidence}, Score=${input.score}`
  );

  const trade = simulateBuyTrade(input);

  console.log(
    `[${input.agent}] BUY EXECUTED (SIMULATION)`
  );
  console.log(
    `[${input.agent}] Token=${input.symbol}`
  );
  console.log(
    `[${input.agent}] Address=${input.address}`
  );
  console.log(
    `[${input.agent}] Amount=$${trade.amountUsd}`
  );
  console.log(
    `[${input.agent}] EntryPrice=$${trade.entryPriceUsd.toFixed(6)}`
  );
  console.log(
    `[${input.agent}] TxHash=${trade.txHash}`
  );

  await tradeAlphaAlert({
    agent: input.agent,
    symbol: input.symbol,
    address: input.address,
    score: input.score,
    confidence: input.confidence,
    amountUsd: trade.amountUsd,
    entryPriceUsd: trade.entryPriceUsd,
    txHash: trade.txHash,
  });

  return trade;
}
