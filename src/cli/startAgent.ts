import fs from "fs";
import path from "path";
import { spawn } from "child_process";

export function startAgents(): void {
  const ROOT = process.cwd();
  const AGENT_USER_DIR = path.join(ROOT, "src", "agent", "user");

  if (!fs.existsSync(AGENT_USER_DIR)) {
    console.log("No agents found");
    return;
  }

  const agents = fs.readdirSync(AGENT_USER_DIR)
    .filter(f => f.endsWith(".json"))
    .map(f => f.replace(".json", ""));

  for (const agentName of agents) {
    spawn(
    "cmd.exe",
    [
        "/c",
        "start",
        "cmd.exe",
        "/k",
        `npx tsx src/agent/runner/runAgent.ts ${agentName}`
    ],
    {
        cwd: ROOT,
        shell: true,
    }
    );

    console.log(`🚀 Agent ${agentName} started`);
  }
}
