import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import { startTelegramBot } from "./bot.js";

const STORAGE_DIR = "src/storage";
const STATE_FILE = path.join(STORAGE_DIR, "telegram.state.json");
const LOG_FILE = path.join(STORAGE_DIR, "telegram.logs.json");

type TelegramState = {
  botToken: string;
  defaultChatId: string;
  enabled: boolean;
  createdAt: string;
};

type Action =
  | "register"
  | "show"
  | "start"
  | "disable"
  | "back";

function ensureStorage() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
}

function loadState(): TelegramState | null {
  if (!fs.existsSync(STATE_FILE)) return null;
  return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
}

function saveState(state: TelegramState) {
  ensureStorage();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function log(action: string) {
  const logs = fs.existsSync(LOG_FILE)
    ? JSON.parse(fs.readFileSync(LOG_FILE, "utf-8"))
    : [];

  logs.push({
    action,
    timestamp: new Date().toISOString(),
  });

  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

export async function telegramMenu(): Promise<void> {
  const { action } = await inquirer.prompt<{ action: Action }>([
    {
      type: "select",
      name: "action",
      message: "Telegram bot menu:",
      choices: [
        { name: "Register bot", value: "register" },
        { name: "Show current config", value: "show" },
        { name: "Start bot listener", value: "start" },
        { name: "Disable bot", value: "disable" },
        { name: "Back", value: "back" },
      ],
    },
  ]);

  switch (action) {
    case "register":
      await registerBot();
      break;

    case "show":
      showConfig();
      break;

    case "start":
      startBot();
      break;

    case "disable":
      disableBot();
      break;

    case "back":
      return;
  }

  await telegramMenu();
}

/* =========================
   Actions
   ========================= */

async function registerBot() {
  const input = await inquirer.prompt<{
    token: string;
    chatId: string;
    confirm: boolean;
  }>([
    {
      type: "input",
      name: "token",
      message: "Telegram bot token:",
      validate: (v) => v.length > 10 || "Invalid token",
    },
    {
      type: "input",
      name: "chatId",
      message: "Default chat ID:",
      validate: (v) => v.length > 3 || "Invalid chat ID",
    },
    {
      type: "confirm",
      name: "confirm",
      message: "Save Telegram bot configuration?",
    },
  ]);

  if (!input.confirm) return;

  const state: TelegramState = {
    botToken: input.token,
    defaultChatId: input.chatId,
    enabled: true,
    createdAt: new Date().toISOString(),
  };

  saveState(state);
  log("register");

  console.log("Telegram bot configuration saved.");
}

function showConfig() {
  const state = loadState();

  if (!state) {
    console.log("Telegram bot is not configured.");
    return;
  }

  console.log("Enabled:", state.enabled);
  console.log("Default Chat ID:", state.defaultChatId);
  console.log("Created At:", state.createdAt);
}

function disableBot() {
  const state = loadState();

  if (!state) {
    console.log("Telegram bot is not configured.");
    return;
  }

  state.enabled = false;
  saveState(state);
  log("disable");

  console.log("Telegram bot disabled.");
}

function startBot() {
  console.log("Starting Telegram bot listener...");
  startTelegramBot();
}
