import fs from "fs";
import path from "path";
import axios from "axios";
import inquirer from "inquirer";

const STORAGE_PATH = path.join("src", "storage", "wallet.json");
const BASE_URL = "https://agentwallet.mcpay.tech/api";

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

/* =========================
   Helpers
========================= */

function getBalanceLabel(b: any): string {
  if (typeof b.symbol === "string" && b.symbol.length > 0) {
    return b.symbol;
  }

  if (typeof b.assetSymbol === "string" && b.assetSymbol.length > 0) {
    return b.assetSymbol;
  }

  if (typeof b.name === "string" && b.name.length > 0) {
    return b.name;
  }

  return "UNKNOWN";
}


/* =========================
   Storage Helpers
========================= */

function loadWallet(): WalletConfig | null {
  if (!fs.existsSync(STORAGE_PATH)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(STORAGE_PATH, "utf-8"));
}


function saveWallet(data: WalletConfig) {
  fs.writeFileSync(STORAGE_PATH, JSON.stringify(data, null, 2));
}

async function promptConnectWallet(): Promise<boolean> {
  const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
    {
      type: "confirm",
      name: "confirm",
      message: "Wallet is not connected. Do you want to connect now?",
    },
  ]);

  return confirm;
}

function printStats(stats: any) {
  console.log("\nWallet Stats");
  console.log("--------------------------------");

  console.log(`Username        : ${stats.username}`);
  console.log(`Rank            : #${stats.rank}`);
  console.log(
    `Joined At       : ${new Date(stats.joinedAt).toISOString().split("T")[0]}`
  );

  console.log("\nTransactions");
  console.log(`- Total         : ${stats.transactions.total}`);
  console.log(`- Last 24h      : ${stats.transactions.last24h}`);
  console.log(`- Last 7 days   : ${stats.transactions.last7d}`);
  console.log(`- Success Rate  : ${stats.transactions.successRate}%`);

  console.log("\nVolume");
  console.log(`- USDC          : ${stats.volume.usdc}`);

  console.log("\nReferrals");
  console.log(`- Total         : ${stats.referrals.count}`);
  console.log(`- Converted     : ${stats.referrals.converted}`);
  console.log(`- Airdrop Pts   : ${stats.referrals.airdropPoints}`);
  console.log(`- Tier          : ${stats.referrals.tier}`);

  console.log(`\nStreak Days     : ${stats.streakDays}\n`);
}

function printBalances(data: any) {
  console.log("\nWallet Balances");
  console.log("--------------------------------");

  if (data.evm) {
    console.log("\nEVM Wallet");
    console.log(`Address : ${data.evm.address}`);

    const balances = data.evm.balances || [];
    balances.slice(0, 2).forEach((b: any) => {
      const label = getBalanceLabel(b);
      const value =
        typeof b.formatted === "string"
          ? b.formatted
          : typeof b.amount === "string"
          ? b.amount
          : "0";

      console.log(`- ${label.padEnd(9)}: ${value}`);
    });

    if (balances.length > 2) {
      console.log(`- Other     : ${balances.length - 2} assets`);
    }
  }

  if (data.solana) {
    console.log("\nSolana Wallet");
    console.log(`Address : ${data.solana.address}`);

    const balances = data.solana.balances || [];
    balances.slice(0, 2).forEach((b: any) => {
      const label = getBalanceLabel(b);
      const value =
        typeof b.formatted === "string"
          ? b.formatted
          : typeof b.amount === "string"
          ? b.amount
          : "0";

      console.log(`- ${label.padEnd(9)}: ${value}`);
    });

    if (balances.length > 2) {
      console.log(`- Other     : ${balances.length - 2} assets`);
    }
  }

  console.log("");
}

function printActivity(events: any[]) {
  console.log("\nActivity Log");
  console.log("--------------------------------");

  if (events.length === 0) {
    console.log("No activity found.\n");
    return;
  }

  for (const e of events) {
    const time = new Date(e.occurredAt)
      .toISOString()
      .replace("T", " ")
      .slice(0, 16);

    console.log(
      `${time} | ${e.eventType} | ${e.description}`
    );

    if (e.metadata?.address) {
      console.log(`  Address : ${e.metadata.address}`);
    }

    console.log("");
  }
}

/* =========================
   Wallet Menu (Cursor Nav)
========================= */

export async function walletMenu(): Promise<void> {
  const { action } = await inquirer.prompt<{ action: string }>([
    {
      type: "select",
      name: "action",
      message: "Wallet Menu",
      choices: [
        {
          name: "Connect Wallet (Get API Token)",
          value: "connect",
        },
        {
          name: "Check Stats",
          value: "stats",
        },
        {
          name: "Check Balance",
          value: "balance",
        },
        {
          name: "Activity Log",
          value: "activity",
        },
        {
          name: "Funding Instructions",
          value: "fund",
        },
        new inquirer.Separator(),
        {
          name: "Back",
          value: "back",
        },
      ],
    },
  ]);

  switch (action) {
    case "connect":
      await connectWallet();
      break;

    case "stats":
      await checkStats();
      break;

    case "balance":
      await checkBalance();
      break;

    case "activity":
      await checkActivity();
      break;

    case "fund":
      fundingInfo();
      break;

    case "back":
      return;
  }

  await walletMenu();
}

/* =========================
   Connect Flow (OTP)
========================= */

async function connectWallet(): Promise<void> {
  const { email } = await inquirer.prompt<{ email: string }>([
    {
      type: "input",
      name: "email",
      message: "Email:",
    },
  ]);

  const start = await axios.post(`${BASE_URL}/connect/start`, { email });

  const username = start.data.username;

  const { otp } = await inquirer.prompt<{ otp: string }>([
    {
      type: "input",
      name: "otp",
      message: "Enter OTP:",
    },
  ]);

  const complete = await axios.post(`${BASE_URL}/connect/complete`, {
    username,
    email,
    otp,
  });

  const wallet: WalletConfig = {
    username: complete.data.username,
    email,
    evmAddress: complete.data.evmAddress,
    solanaAddress: complete.data.solanaAddress,
    apiToken: complete.data.apiToken,
    moltbookLinked: complete.data.moltbookLinked,
    moltbookUsername: null,
    xHandle: null,
  };

  saveWallet(wallet);

  console.log("Wallet connected and saved.");
}

/* =========================
   Wallet Queries
========================= */

async function checkStats(): Promise<void> {
  const w = loadWallet();

  if (!w || !w.username || !w.apiToken) {
    const goConnect = await promptConnectWallet();
    if (goConnect) {
      await connectWallet();
    }
    return;
  }

  const res = await axios.get(
    `${BASE_URL}/wallets/${w.username}/stats`,
    {
      headers: { Authorization: `Bearer ${w.apiToken}` },
    }
  );

  printStats(res.data);
}


async function checkBalance(): Promise<void> {
  const w = loadWallet();

  if (!w || !w.username || !w.apiToken) {
    const goConnect = await promptConnectWallet();
    if (goConnect) {
      await connectWallet();
    }
    return;
  }

  const res = await axios.get(
    `${BASE_URL}/wallets/${w.username}/balances`,
    {
      headers: { Authorization: `Bearer ${w.apiToken}` },
    }
  );

  printBalances(res.data);
}

async function checkActivity(): Promise<void> {
  const w = loadWallet();

  if (!w || !w.username || !w.apiToken) {
    const goConnect = await promptConnectWallet();
    if (goConnect) {
      await connectWallet();
    }
    return;
  }

  const res = await axios.get(
    `${BASE_URL}/wallets/${w.username}/activity`,
    {
      headers: { Authorization: `Bearer ${w.apiToken}` },
    }
  );

  printActivity(res.data.events);
}

function fundingInfo(): void {
  const w = loadWallet();

  if (!w || !w.username) {
    console.log("Wallet is not connected.");
    return;
  }

  const url = `https://agentwallet.mcpay.tech/u/${w.username}`;

  console.log("\nHow to fund your agent wallet");
  console.log("--------------------------------");
  console.log(`1. Visit ${url}`);
  console.log('2. Click "Fund" next to the wallet you want to fund');
  console.log("3. Complete the Coinbase checkout flow");
  console.log("4. Wait for funds to arrive\n");
}