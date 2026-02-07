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
import { handleScanCommand } from "./tgScan.js";
import { createAgentInternal } from "../agent/internal/createAgentInternal.js";
import { startAgents } from "../cli/startAgent.js";
import { showAgentStatus } from "../cli/agentStatus.js";
import { startSingleAgent } from "../cli/startSingleAgent.js";

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

type CreateAgentState = {
  step: "name" | "skill";
  baseName?: string;
};

type CreateAgentSession = {
  step: "name" | "skill";
  baseName?: string;
};

const createAgentSession = new Map<number, CreateAgentSession>();

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

  // FLUSH OLD UPDATES
  await axios.get(`${baseUrl}/getUpdates`, {
    params: { offset: -1 },
  });

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

        const chatId =
          update.message?.chat?.id ??
          update.callback_query?.message?.chat?.id;

        if (!chatId) continue;

        /* ========= MESSAGE ========= */

        if (update.message?.text === "/start") {
          await handleStartCommand(baseUrl, chatId);
          continue;
        }

        if (update.message?.text === "/wallet") {
          await showTelegramWalletMenu(baseUrl, chatId);
          continue;
        }

        if (update.message?.text?.startsWith("/scan ")) {
          await handleScanCommand({
            baseUrl,
            chatId,
            text: update.message.text,
          });
          continue;
        }

        if (update.message?.text === "/scan") {
          await axios.post(`${baseUrl}/sendMessage`, {
            chat_id: chatId,
            text: "Usage: /scan <token_address> [x_link]",
          });
          continue;
        }

        if (update.message?.text === "/status") {
          const lines: string[] = [];
          const originalLog = console.log;

          console.log = (...args: any[]) => {
            lines.push(args.join(" "));
          };

          showAgentStatus();
          console.log = originalLog;

          await axios.post(`${baseUrl}/sendMessage`, {
            chat_id: chatId,
            text: lines.length ? lines.join("\n") : "No agent status available",
          });

          continue;
        }

        if (update.message?.text === "/createagent") {
          createAgentSession.set(chatId, { step: "name" });

          await axios.post(`${baseUrl}/sendMessage`, {
            chat_id: chatId,
            text: "Enter agent base name:",
          });

          continue;
        }

        if (update.message?.text?.startsWith("/startagent")) {
          const parts = update.message.text.split(" ");
          const agentName = parts[1];

          if (!agentName) {
            startAgents();

            await axios.post(`${baseUrl}/sendMessage`, {
              chat_id: chatId,
              text: "All agents started",
            });

            continue;
          }

          const agentFile = path.join(
            process.cwd(),
            "src",
            "agent",
            "user",
            `${agentName}.json`
          );

          if (!fs.existsSync(agentFile)) {
            await axios.post(`${baseUrl}/sendMessage`, {
              chat_id: chatId,
              text: `Agent not found: ${agentName}`,
            });
            continue;
          }

          startSingleAgent(agentName);

          await axios.post(`${baseUrl}/sendMessage`, {
            chat_id: chatId,
            text: `Agent started: ${agentName}`,
          });

          continue;
        }

        // ===== CREATE AGENT FLOW (NON-COMMAND MESSAGE) =====
        const session = createAgentSession.get(chatId);

        if (
          session &&
          update.message?.text &&
          !update.message.text.startsWith("/")
        ) {
          const text = update.message.text.trim();

          // STEP 1: BASE NAME
          if (session.step === "name") {
            session.baseName = text.toLowerCase();
            session.step = "skill";

            await axios.post(`${baseUrl}/sendMessage`, {
              chat_id: chatId,
              text: [
                "Select agent skill:",
                "",
                "1. DAO_TREASURY",
                "2. RETAIL_YIELD",
                "3. ALPHA_DETECTION",
                "4. PREDICTION_ARBITRAGE",
                "",
                "Reply with number",
              ].join("\n"),
            });

            continue;
          }

          // STEP 2: SKILL
          if (session.step === "skill") {
            const skillMap: Record<string, any> = {
              "1": "DAO_TREASURY",
              "2": "RETAIL_YIELD",
              "3": "ALPHA_DETECTION",
              "4": "PREDICTION_ARBITRAGE",
            };

            const skill = skillMap[text];
            if (!skill) {
              await axios.post(`${baseUrl}/sendMessage`, {
                chat_id: chatId,
                text: "Invalid selection. Reply with 1, 2, 3, or 4.",
              });
              continue;
            }

            const result = createAgentInternal(session.baseName!, skill);

            createAgentSession.delete(chatId);

            await axios.post(`${baseUrl}/sendMessage`, {
              chat_id: chatId,
              text: result.message,
            });

            continue;
          }
        }

        /* ========= CALLBACK ========= */

        if (update.callback_query) {
          await handleCallbackQuery(baseUrl, update.callback_query);
          continue;
        }
      }
    } catch (error) {
      console.error("Telegram polling error:", String(error));
      await new Promise((r) => setTimeout(r, 2000));
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
        [
          {
            text: "Analyze Token",
            callback_data: "analyze_token",
          },
        ],
        [
          {
            text: "Available Commands",
            callback_data: "show_commands",
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

  if (data === "show_commands") {
    await axios.post(`${baseUrl}/sendMessage`, {
        chat_id: chatId,
        text: `
    Available Commands

/start        Initialize bot and show main menu
/status       Show current agent status
/scan         Trigger token scan
/startagent   Start agent(s)
/createagent  Create new agent
/alerts off   Disable Telegram alerts
/wallet       Open wallet menu (balances, stats, funding)
    `.trim(),
    });
    return;
  }

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

  if (data === "analyze_token") {
    await axios.post(`${baseUrl}/sendMessage`, {
      chat_id: chatId,
      text: "Use /scan <token_address> [x_link] to analyze a token.",
    });
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
