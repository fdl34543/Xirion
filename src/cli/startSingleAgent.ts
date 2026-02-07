import { spawn } from "child_process";

export function startSingleAgent(agentName: string): void {
  const ROOT = process.cwd();

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

  console.log(`Agent ${agentName} started`);
}
