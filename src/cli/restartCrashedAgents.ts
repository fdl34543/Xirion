import fs from "fs";
import path from "path";
import { spawn } from "child_process";

function isProcessRunning(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

export function restartCrashedAgents(): void {
  const ROOT = process.cwd();
  const AGENT_DIR = path.join(ROOT, "src", "agent");
  const PID_DIR = path.join(AGENT_DIR, "pids");
  const USER_DIR = path.join(AGENT_DIR, "user");

  if (!fs.existsSync(USER_DIR)) {
    console.log("No agents found");
    return;
  }

  const agents = fs
    .readdirSync(USER_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));

  for (const agent of agents) {
    const pidFile = path.join(PID_DIR, `${agent}.pid`);

    if (!fs.existsSync(pidFile)) continue;

    const pid = Number(fs.readFileSync(pidFile, "utf-8"));

    if (isProcessRunning(pid)) continue;

    fs.unlinkSync(pidFile);

    spawn(
      "cmd.exe",
      [
        "/c",
        "start",
        "cmd.exe",
        "/k",
        `npx tsx src/agent/runner/runAgent.ts ${agent}`,
      ],
      {
        cwd: ROOT,
        shell: true,
      }
    );

    console.log(`Restarted crashed agent: ${agent}`);
  }
}
