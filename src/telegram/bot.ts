import axios from "axios";
import fs from "fs";
import path from "path";
import FormData from "form-data";
import {
  showTelegramWalletMenu,
  showTelegramWalletStats,
  showTelegramWalletBalance,
  showTelegramWalletActivity,
  showTelegramWalletFunding,
} from "./telegramWallet.js";


/* =========================
   Types
   ========================= */

type TelegramState = {
  botToken: string;
  enabled: boolean;
};

type CallbackQuery = {
  id: string;
  data: string;
  message: {
    chat: {
      id: number;
    };
  };
};

/* =========================
   Constants
   ========================= */

const STATE_FILE = path.join("src/storage", "telegram.state.json");
const ASSET_PATH = path.join("assets", "xirion-logo.png");

const XIRION_DESCRIPTION = `
What is Xirion?

Xirion is an autonomous AI agent built on Solana that continuously observes, analyzes, and executes decisions across crypto markets.

Xirion combines:
- On-chain intelligence
- Community intelligence (X and Telegram)
- Autonomous decision-making
- Optional real transaction execution

Xirion can operate in multiple modes:
- DAO treasury management
- Retail yield optimization
- Token and memecoin alpha detection
- Prediction market arbitrage

All powered by one unified intelligence core.
`.trim();

/* =========================
   State Loader
   ========================= */

function loadTelegramState(): TelegramState | null {
  if (!fs.existsSync(STATE_FILE)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
}

/* =========================
   Bot Runner
   ========================= */

/**
 * Start Telegram bot using long polling
 * This function should be triggered from Telegram menu
 */
export async function startTelegramBot(): Promise<void> {
  const state = loadTelegramState();

  if (!state || !state.enabled) {
    console.log("Telegram bot is disabled or not configured.");
    return;
  }

  const baseUrl = `https://api.telegram.org/bot${state.botToken}`;
  let offset = 0;

  console.log("Telegram bot listener started.");

  while (true) {
    try {
      const response = await axios.get(`${baseUrl}/getUpdates`, {
        params: {
          timeout: 30,
          offset,
        },
      });

      const updates = response.data.result ?? [];

      for (const update of updates) {
        offset = update.update_id + 1;

        if (update.message?.text === "/start") {
          await handleStartCommand(baseUrl, update.message.chat.id);
        }

        if (update.message?.text === "/wallet") {
          await showTelegramWalletMenu(baseUrl, update.message.chat.id);
        }

        if (update.callback_query) {
          await handleCallbackQuery(baseUrl, update.callback_query);
        }
      }
    } catch (error) {
      console.error("Telegram polling error:", String(error));
    }
  }
}

/* =========================
   Command Handlers
   ========================= */

async function handleStartCommand(baseUrl: string, chatId: number) {
  // Send logo image
  const form = new FormData();
  form.append("chat_id", chatId);
  form.append("photo", fs.createReadStream(ASSET_PATH));

  await axios.post(`${baseUrl}/sendPhoto`, form, {
    headers: form.getHeaders(),
  });

  // Send description and menu buttons
  await axios.post(`${baseUrl}/sendMessage`, {
    chat_id: chatId,
    text: XIRION_DESCRIPTION,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Open CLI Docs",
            url: "https://github.com/fdl34543/Xirion",
          },
          {
            text: "View Project",
            url: "https://colosseum.com/agent-hackathon",
          },
        ],
        [
          {
            text: "Agent Menu",
            callback_data: "agent_menu",
          },
          {
            text: "Wallet",
            callback_data: "wallet_menu",
          },
        ],
      ],
    },
  });
}

/* =========================
   Callback Handler
   ========================= */

async function handleCallbackQuery(
  baseUrl: string,
  query: CallbackQuery
) {
  const chatId = query.message.chat.id;
  const data = query.data;

  // Acknowledge callback
  await axios.post(`${baseUrl}/answerCallbackQuery`, {
    callback_query_id: query.id,
  });

  if (data === "agent_menu") {
    await showAgentMenu(baseUrl, chatId);
    return;
  }

  if (data === "wallet_menu") {
    await showTelegramWalletMenu(baseUrl, chatId);
    return;
  }

  if (data === "agent_start") {
    await showAgentStartPlaceholder(baseUrl, chatId);
    return;
  }

  if (data === "wallet_menu") {
    await showTelegramWalletMenu(baseUrl, chatId);
    return;
  }

  if (data === "wallet_stats") {
    await showTelegramWalletStats(baseUrl, chatId);
    return;
  }

  if (data === "wallet_balance") {
    await showTelegramWalletBalance(baseUrl, chatId);
    return;
  }

  if (data === "wallet_activity") {
    await showTelegramWalletActivity(baseUrl, chatId);
    return;
  }

  if (data === "wallet_fund") {
    await showTelegramWalletFunding(baseUrl, chatId);
    return;
  }

}

/* =========================
   Menus
   ========================= */

async function showAgentMenu(baseUrl: string, chatId: number) {
  const text = `
Agent Status

Name        : Agent Xerion
State       : IDLE
Execution   : Disabled
Last Update : Not started
`.trim();

  await axios.post(`${baseUrl}/sendMessage`, {
    chat_id: chatId,
    text,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Start Agent",
            callback_data: "agent_start",
          },
        ],
      ],
    },
  });
}

async function showWalletPlaceholder(baseUrl: string, chatId: number) {
  await axios.post(`${baseUrl}/sendMessage`, {
    chat_id: chatId,
    text: "Wallet menu is not implemented yet.",
  });
}

async function showAgentStartPlaceholder(baseUrl: string, chatId: number) {
  await axios.post(`${baseUrl}/sendMessage`, {
    chat_id: chatId,
    text:
      "Agent start request received.\n" +
      "Execution is currently disabled pending admin approval.",
  });
}
