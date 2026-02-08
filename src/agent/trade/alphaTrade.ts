// src/agent/trade/alphaTrade.ts
import axios from "axios";
import { loadWallet } from "../../x402/wallet.js";
import { sendAlphaAlert, tradeAlphaAlert } from "../../telegram/alert.js";
import type { SignerAdapter } from "../signer/SignerAdapter.js";

const JUP_API_KEY = process.env.JUP_API_KEY!;
const SOL_MINT = "So11111111111111111111111111111111111111112";

type AlphaTradeInput = {
  agent: string;
  symbol: string;
  address: string;
  confidence: number;
  score: number;
};

export async function alphaTrade(
  input: AlphaTradeInput,
  signer: SignerAdapter
) {
  const wallet = loadWallet();

  if (!wallet || !wallet.solanaAddress) {
    throw new Error("Wallet not initialized or Solana address missing");
  }

  const userPublicKey = wallet.solanaAddress;


  // Decide buy size (deterministic)
  const amountLamports = Math.round(
    (0.2 + input.confidence * 0.8) * 1e9
  ).toString(); // SOL → lamports

  console.log(
    `[${input.agent}] Executing BUY ${input.symbol} with ${amountLamports} lamports`
  );

  //  /order (quote)
  const orderRes = await axios.get(
    "https://api.jup.ag/ultra/v1/order",
    {
      params: {
        inputMint: SOL_MINT,
        outputMint: input.address,
        amount: amountLamports,
        taker: userPublicKey,
      },
      headers: {
        "x-api-key": JUP_API_KEY,
      },
    }
  );

  const order = orderRes.data;

  // /swap (build tx)
  const swapRes = await axios.post(
    "https://api.jup.ag/swap/v1/swap",
    {
      quoteResponse: {
        inputMint: order.inputMint,
        inAmount: order.inAmount,
        outputMint: order.outputMint,
        outAmount: order.outAmount,
        otherAmountThreshold: order.otherAmountThreshold,
        swapMode: order.swapMode,
        slippageBps: 50,
        priceImpactPct: order.priceImpactPct,
        routePlan: order.routePlan,
      },
      userPublicKey,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": JUP_API_KEY,
      },
    }
  );

  const { swapTransaction } = swapRes.data;

  // SIGN (MCPay / agentwallet)
  const signedTx = await signer.signTransaction(swapTransaction);

  // EXECUTE
  const execRes = await axios.post(
    "https://api.jup.ag/ultra/v1/execute",
    {
      signedTransaction: signedTx,
      requestId: order.requestId,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": JUP_API_KEY,
      },
    }
  );

  const result = execRes.data;

  console.log(
    `[${input.agent}] BUY EXECUTED ${input.symbol} tx=${result.signature}`
  );

  // Telegram alert (trade)
  await tradeAlphaAlert({
    agent: input.agent,
    symbol: input.symbol,
    address: input.address,
    score: input.score,
    confidence: input.confidence,
    amountUsd: order.inUsdValue,
    entryPriceUsd: order.outUsdValue / Number(order.outAmount),
    txHash: result.signature,
  });

  return {
    txHash: result.signature,
    inputAmount: result.totalInputAmount,
    outputAmount: result.totalOutputAmount,
  };
}
