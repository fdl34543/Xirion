import fs from "fs";
import path from "path";

import { skillMap } from "../skills/index.js";
import type { AgentConfig } from "../types.js";

const agentName = process.argv[2];
if (!agentName) {
  console.error("Agent name missing");
  process.exit(1);
}

const ROOT = process.cwd();
const AGENT_BASE = path.join(ROOT, "src", "agent");

const USER_DIR = path.join(AGENT_BASE, "user");
const LOG_DIR = path.join(AGENT_BASE, "log");
const PID_DIR = path.join(AGENT_BASE, "pids");

fs.mkdirSync(LOG_DIR, { recursive: true });
fs.mkdirSync(PID_DIR, { recursive: true });

const agentFile = path.join(USER_DIR, `${agentName}.json`);
const logFile = path.join(LOG_DIR, `${agentName}.log`);
const pidFile = path.join(PID_DIR, `${agentName}.pid`);

const config: AgentConfig = JSON.parse(
  fs.readFileSync(agentFile, "utf-8")
);

const HEARTBEAT_DIR = path.join(AGENT_BASE, "heartbeat");
fs.mkdirSync(HEARTBEAT_DIR, { recursive: true });

const heartbeatFile = path.join(
  HEARTBEAT_DIR,
  `${config.name}.json`
);

function writeHeartbeat(status: string) {
  fs.writeFileSync(
    heartbeatFile,
    JSON.stringify(
      {
        agent: config.name,
        skill: config.skill,
        status,
        lastTick: new Date().toISOString(),
        pid: process.pid,
      },
      null,
      2
    )
  );
}


// ===== save PID =====
fs.writeFileSync(pidFile, String(process.pid));

// ===== logger =====
const logStream = fs.createWriteStream(logFile, { flags: "a" });
const nativeLog = console.log;

console.log = (...args: any[]) => {
  const msg = args.join(" ");
  logStream.write(msg + "\n");
  nativeLog(msg);
};

// ===== graceful shutdown =====
function shutdown() {
  console.log(`[${config.name}] Shutting down`);
  if (fs.existsSync(pidFile)) fs.unlinkSync(pidFile);
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// ===== agent loop =====
async function start() {
  console.log(`[${config.name}] Agent started`);
  console.log(`[${config.name}] Role: ${config.role} | Skill: ${config.skill}`);
  writeHeartbeat("STARTED");

  const skillFn = skillMap[config.skill];
  if (!skillFn) throw new Error(`Skill not found: ${config.skill}`);

  while (true) {
    await skillFn(config.name);
    writeHeartbeat("RUNNING");
    await new Promise((r) => setTimeout(r, 5000));
  }
}

start().catch((err) => {
  console.error(`[${config.name}] Fatal error`, err);
  writeHeartbeat("STOPPED");
  shutdown();
});
