import fs from "fs";
import path from "path";

function isProcessRunning(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

export function showAgentStatus(): void {
  const ROOT = process.cwd();
  const AGENT_DIR = path.join(ROOT, "src", "agent");

  const USER_DIR = path.join(AGENT_DIR, "user");
  const PID_DIR = path.join(AGENT_DIR, "pids");
  const HEARTBEAT_DIR = path.join(AGENT_DIR, "heartbeat");

  if (!fs.existsSync(USER_DIR)) {
    console.log("No agents found");
    return;
  }

  const agents = fs
    .readdirSync(USER_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));

  console.log("");
  console.log("Agent Status");
  console.log("----------------------------------------------");

  for (const agent of agents) {
    const pidFile = path.join(PID_DIR, `${agent}.pid`);
    const heartbeatFile = path.join(HEARTBEAT_DIR, `${agent}.json`);

    let status = "STOPPED";
    let pidInfo = "-";
    let lastTick = "N/A";

    if (fs.existsSync(pidFile)) {
      const pid = Number(fs.readFileSync(pidFile, "utf-8"));
      pidInfo = String(pid);

      if (isProcessRunning(pid)) {
        status = "RUNNING";
      } else {
        status = "CRASHED";
      }
    }

    if (fs.existsSync(heartbeatFile)) {
      try {
        const heartbeat = JSON.parse(
          fs.readFileSync(heartbeatFile, "utf-8")
        );
        if (heartbeat.lastTick) {
          lastTick = heartbeat.lastTick;
        }
      } catch {
        // ignore malformed heartbeat
      }
    }

    console.log(
      `${status.padEnd(8)}  ${agent.padEnd(20)}  pid=${pidInfo.padEnd(
        8
      )}  lastTick=${lastTick}`
    );
  }

  console.log("");
}
