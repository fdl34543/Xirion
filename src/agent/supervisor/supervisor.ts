import fs from "fs";
import path from "path";
import readline from "readline";
import { spawn } from "child_process";

const ROOT = process.cwd();
const AGENT_BASE = path.join(ROOT, "src", "agent");

const USER_DIR = path.join(AGENT_BASE, "user");
const PID_DIR = path.join(AGENT_BASE, "pids");
const HEARTBEAT_DIR = path.join(AGENT_BASE, "heartbeat");

const CHECK_INTERVAL_MS = 5000;
const HEARTBEAT_TIMEOUT_MS = 15000;

function isProcessRunning(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function startAgent(agentName: string) {
  spawn(
    "cmd.exe",
    [
      "/c",
      "start",
      "cmd.exe",
      "/k",
      `npx tsx src/agent/runner/runAgent.ts ${agentName}`,
    ],
    {
      cwd: ROOT,
      shell: true,
    }
  );
}

function restartAgent(agentName: string) {
  const pidFile = path.join(PID_DIR, `${agentName}.pid`);
  if (fs.existsSync(pidFile)) {
    const pid = Number(fs.readFileSync(pidFile, "utf-8"));
    try {
      process.kill(pid, "SIGTERM");
    } catch {}
    fs.unlinkSync(pidFile);
  }

  startAgent(agentName);
  console.log(`Restarted agent: ${agentName}`);
}

function getAgents(): string[] {
  if (!fs.existsSync(USER_DIR)) return [];
  return fs
    .readdirSync(USER_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));
}

function checkAgents() {
  const now = Date.now();
  const agents = getAgents();

  for (const agent of agents) {
    const pidFile = path.join(PID_DIR, `${agent}.pid`);
    const heartbeatFile = path.join(HEARTBEAT_DIR, `${agent}.json`);

    if (!fs.existsSync(pidFile)) continue;

    const pid = Number(fs.readFileSync(pidFile, "utf-8"));
    const running = isProcessRunning(pid);

    if (!running) {
      console.log(`Detected crashed agent: ${agent}`);
      restartAgent(agent);
      continue;
    }

    if (!fs.existsSync(heartbeatFile)) continue;

    try {
      const hb = JSON.parse(fs.readFileSync(heartbeatFile, "utf-8"));
      const lastTick = new Date(hb.lastTick).getTime();

      if (now - lastTick > HEARTBEAT_TIMEOUT_MS) {
        console.log(`Detected hung agent: ${agent}`);
        restartAgent(agent);
      }
    } catch {}
  }
}

/* ---------------- CLI ---------------- */

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function printHelp() {
  console.log("");
  console.log("Supervisor commands:");
  console.log("status        Show agent health summary");
  console.log("restart <id>  Restart agent manually");
  console.log("exit          Exit supervisor");
  console.log("");
}

function showStatus() {
  const agents = getAgents();
  const now = Date.now();

  console.log("");
  for (const agent of agents) {
    const pidFile = path.join(PID_DIR, `${agent}.pid`);
    const heartbeatFile = path.join(HEARTBEAT_DIR, `${agent}.json`);

    let status = "STOPPED";

    if (fs.existsSync(pidFile)) {
      const pid = Number(fs.readFileSync(pidFile, "utf-8"));
      status = isProcessRunning(pid) ? "RUNNING" : "CRASHED";
    }

    if (fs.existsSync(heartbeatFile)) {
      const hb = JSON.parse(fs.readFileSync(heartbeatFile, "utf-8"));
      const lastTick = new Date(hb.lastTick).getTime();
      if (now - lastTick > HEARTBEAT_TIMEOUT_MS) {
        status = "HANG";
      }
    }

    console.log(`${agent} -> ${status}`);
  }
}

rl.on("line", (input) => {
  const [cmd, arg] = input.trim().split(" ");

  if (cmd === "help") printHelp();
  else if (cmd === "status") showStatus();
  else if (cmd === "restart" && arg) restartAgent(arg);
  else if (cmd === "exit") process.exit(0);
  else printHelp();
});

/* ---------------- START ---------------- */

console.log("Supervisor started");
printHelp();

setInterval(checkAgents, CHECK_INTERVAL_MS);
