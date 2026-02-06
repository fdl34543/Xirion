import axios from "axios";
import fs from "fs";
import path from "path";

const STORAGE_PATH = path.join("src", "storage", "wallet.json");
const BASE_URL = "https://agentwallet.mcpay.tech/api";

function loadWallet() {
  return JSON.parse(fs.readFileSync(STORAGE_PATH, "utf-8"));
}

/**
 * Sign x402 payment requirement
 */
export async function signX402Payment(params: {
  requirement: any;
  preferredChain?: "evm" | "solana";
  preferredChainId?: number;
  dryRun?: boolean;
}) {
  const wallet = loadWallet();
  if (!wallet.username || !wallet.apiToken) {
    throw new Error("Wallet not connected");
  }

  const res = await axios.post(
    `${BASE_URL}/wallets/${wallet.username}/actions/x402/pay`,
    {
      requirement: params.requirement,
      preferredChain: params.preferredChain,
      preferredChainId: params.preferredChainId,
      dryRun: params.dryRun ?? false,
    },
    {
      headers: {
        Authorization: `Bearer ${wallet.apiToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
}
