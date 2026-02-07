import { spawn } from "child_process";

export function startSupervisor(): void {
  spawn(
    "cmd.exe",
    [
      "/c",
      "start",
      "cmd.exe",
      "/k",
      "npx tsx src/agent/supervisor/supervisor.ts",
    ],
    {
      shell: true,
    }
  );

  console.log("Supervisor started in new window");
}
