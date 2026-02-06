import axios from "axios";
import fs from "fs";
import path from "path";

/* =========================
   Types & Constants
========================= */

type WalletConfig = {
  username: string | null;
  email: string | null;
  evmAddress: string | null;
  solanaAddress: string | null;
  apiToken: string | null;
  moltbookLinked: boolean;
  moltbookUsername: string | null;
  xHandle: string | null;
};

const WALLET_FILE = path.join("src/storage", "wallet.json");
const BASE_URL = "https://agentwallet.mcpay.tech/api";

/* =========================
   Helpers
========================= */

function normalizeBalance(b: any): { label: string; value: string } | null {
  const label =
    typeof b.symbol === "string"
      ? b.symbol
      : typeof b.assetSymbol === "string"
      ? b.assetSymbol
      : typeof b.name === "string"
      ? b.name
      : null;

  if (!label) return null;

  const value =
    typeof b.formatted === "string"
      ? b.formatted
      : typeof b.amount === "string"
      ? b.amount
      : typeof b.balance === "string"
      ? b.balance
      : null;

  if (!value) return null;

  return { label, value };
}


function loadWallet(): WalletConfig | null {
  if (!fs.existsSync(WALLET_FILE)) return null;
  return JSON.parse(fs.readFileSync(WALLET_FILE, "utf-8"));
}

async function send(
  baseUrl: string,
  chatId: number,
  text: string,
  keyboard?: any
) {
  await axios.post(`${baseUrl}/sendMessage`, {
    chat_id: chatId,
    text,
    parse_mode: "Markdown",
    reply_markup: keyboard,
  });
}

function notConnectedText(): string {
  return (
    "Wallet is not connected.\n\n" +
    "Please connect your wallet using the CLI first."
  );
}

/* =========================
   Menu
========================= */

export async function showTelegramWalletMenu(
  baseUrl: string,
  chatId: number
): Promise<void> {
  const wallet = loadWallet();

  if (!wallet || !wallet.username) {
    await send(baseUrl, chatId, notConnectedText());
    return;
  }

  const text = `
Wallet Menu

Username
\`${wallet.username}\`

EVM Address
\`${wallet.evmAddress ?? "Not available"}\`

Solana Address
\`${wallet.solanaAddress ?? "Not available"}\`
`.trim();

  await send(baseUrl, chatId, text, {
    inline_keyboard: [
      [
        { text: "Stats", callback_data: "wallet_stats" },
        { text: "Balance", callback_data: "wallet_balance" },
      ],
      [
        { text: "Activity", callback_data: "wallet_activity" },
        { text: "Funding", callback_data: "wallet_fund" },
      ],
    ],
  });
}

/* =========================
   Stats
========================= */

export async function showTelegramWalletStats(
  baseUrl: string,
  chatId: number
): Promise<void> {
  const w = loadWallet();
  if (!w || !w.username || !w.apiToken) {
    await send(baseUrl, chatId, notConnectedText());
    return;
  }

  const res = await axios.get(
    `${BASE_URL}/wallets/${w.username}/stats`,
    { headers: { Authorization: `Bearer ${w.apiToken}` } }
  );

  const s = res.data;

  const text = `
Wallet Stats

Username
\`${s.username}\`

Rank
\`#${s.rank}\`

Joined At
\`${new Date(s.joinedAt).toISOString().split("T")[0]}\`

Transactions
- Total: ${s.transactions.total}
- Last 24h: ${s.transactions.last24h}
- Last 7d: ${s.transactions.last7d}
- Success Rate: ${s.transactions.successRate}%

Volume
- USDC: ${s.volume.usdc}

Referrals
- Total: ${s.referrals.count}
- Converted: ${s.referrals.converted}
- Airdrop Points: ${s.referrals.airdropPoints}
- Tier: ${s.referrals.tier}

Streak Days
\`${s.streakDays}\`
`.trim();

  await send(baseUrl, chatId, text, {
    inline_keyboard: [[{ text: "Back to Wallet", callback_data: "wallet_menu" }]],
  });
}

/* =========================
   Balance
========================= */

export async function showTelegramWalletBalance(
  baseUrl: string,
  chatId: number
): Promise<void> {
  const w = loadWallet();
  if (!w || !w.username || !w.apiToken) {
    await send(baseUrl, chatId, notConnectedText());
    return;
  }

  const res = await axios.get(
    `${BASE_URL}/wallets/${w.username}/balances`,
    { headers: { Authorization: `Bearer ${w.apiToken}` } }
  );

  const d = res.data;

  const evmLines = (d.evm?.balances || [])
    .map(normalizeBalance)
    .filter(Boolean)
    .slice(0, 5)
    .map((b: any) => `- ${b.label}: ${b.value}`)
    .join("\n");

  const solLines = (d.solana?.balances || [])
    .map(normalizeBalance)
    .filter(Boolean)
    .slice(0, 5)
    .map((b: any) => `- ${b.label}: ${b.value}`)
    .join("\n");

  const text = `
Wallet Balances

EVM Wallet
\`${d.evm?.address ?? "Not available"}\`
${evmLines || "- No balances"}

Solana Wallet
\`${d.solana?.address ?? "Not available"}\`
${solLines || "- No balances"}
`.trim();

  await send(baseUrl, chatId, text, {
    inline_keyboard: [[{ text: "Back to Wallet", callback_data: "wallet_menu" }]],
  });
}

/* =========================
   Activity
========================= */

export async function showTelegramWalletActivity(
  baseUrl: string,
  chatId: number
): Promise<void> {
  const w = loadWallet();
  if (!w || !w.username || !w.apiToken) {
    await send(baseUrl, chatId, notConnectedText());
    return;
  }

  const res = await axios.get(
    `${BASE_URL}/wallets/${w.username}/activity`,
    { headers: { Authorization: `Bearer ${w.apiToken}` } }
  );

  const events = res.data.events || [];

  if (events.length === 0) {
    await send(baseUrl, chatId, "No activity found.", {
      inline_keyboard: [[{ text: "Back to Wallet", callback_data: "wallet_menu" }]],
    });
    return;
  }

  const lines = events.slice(0, 5).map((e: any) => {
    const time = new Date(e.occurredAt)
      .toISOString()
      .replace("T", " ")
      .slice(0, 16);
    const addr = e.metadata?.address ? `\n\`${e.metadata.address}\`` : "";
    return `${time} | ${e.eventType}\n${e.description}${addr}`;
  });

  const text = `
Activity Log
${lines.join("\n\n")}
`.trim();

  await send(baseUrl, chatId, text, {
    inline_keyboard: [[{ text: "Back to Wallet", callback_data: "wallet_menu" }]],
  });
}

/* =========================
   Funding
========================= */

export async function showTelegramWalletFunding(
  baseUrl: string,
  chatId: number
): Promise<void> {
  const w = loadWallet();
  if (!w || !w.username) {
    await send(baseUrl, chatId, notConnectedText());
    return;
  }

  const url = `https://agentwallet.mcpay.tech/u/${w.username}`;

  const text = `
How to fund your agent wallet

1. Visit
\`${url}\`

2. Click "Fund" next to the wallet you want to fund
3. Complete the Coinbase checkout flow
4. Wait for funds to arrive
`.trim();

  await send(baseUrl, chatId, text, {
    inline_keyboard: [[{ text: "Back to Wallet", callback_data: "wallet_menu" }]],
  });
}
