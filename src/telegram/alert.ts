// src/telegram/alert.ts
import fs from "fs";
import path from "path";
import axios from "axios";

type TelegramState = {
  enabled: boolean;
  botToken: string;
  defaultChatId: string | number;
};

type AlphaAlertPayload = {
  agent: string;
  symbol: string;
  address: string;
  score: number;
  confidence: number;
  reasons: string[];
};

type AlphaTradeAlertPayload = {
  agent: string;
  symbol: string;
  address: string;
  score: number;
  confidence: number;
  amountUsd: number;
  entryPriceUsd: number;
  txHash: string;
};

const STATE_FILE = path.join("src/storage", "telegram.state.json");

function loadTelegramState(): TelegramState | null {
  if (!fs.existsSync(STATE_FILE)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
  } catch {
    return null;
  }
}

export async function sendAlphaAlert(
  payload: AlphaAlertPayload
): Promise<void> {
  const state = loadTelegramState();

  if (!state || !state.enabled) {
    return;
  }

  const chatId = Number(state.defaultChatId);
  if (!Number.isInteger(chatId) || chatId <= 0) {
    console.error("Invalid Telegram defaultChatId:", state.defaultChatId);
    return;
  }

  if (!state.botToken) {
    console.error("Missing Telegram botToken");
    return;
  }

  const baseUrl = `https://api.telegram.org/bot${state.botToken}`;

  const message = `
ALPHA DETECTED

Agent: ${payload.agent}
Token: ${payload.symbol}
Address: ${payload.address}

Score: ${payload.score}
Confidence: ${payload.confidence}

Reasons:
- ${payload.reasons.join("\n- ")}
`;

  try {
    await axios.post(`${baseUrl}/sendMessage`, {
      chat_id: chatId,
      text: message,
      disable_web_page_preview: true,
    });
  } catch (err) {
    console.error("Failed to send Telegram alert", err);
  }
}

export async function tradeAlphaAlert(
  payload: AlphaTradeAlertPayload
): Promise<void> {
  const state = loadTelegramState();
  if (!state || !state.enabled) return;

  const chatId = Number(state.defaultChatId);
  if (!Number.isInteger(chatId) || chatId <= 0) return;
  if (!state.botToken) return;

  const baseUrl = `https://api.telegram.org/bot${state.botToken}`;

  const message = `
ALPHA TRADE EXECUTED

Agent: ${payload.agent}
Token: ${payload.symbol}
Address: ${payload.address}

Score: ${payload.score}
Confidence: ${payload.confidence}

Buy Amount: $${payload.amountUsd}
Entry Price: $${payload.entryPriceUsd.toFixed(6)}

Transaction:
${payload.txHash}
`;

  try {
    await axios.post(`${baseUrl}/sendMessage`, {
      chat_id: chatId,
      text: message,
      disable_web_page_preview: true,
    });
  } catch (err) {
    console.error("Failed to send alpha trade alert", err);
  }
}