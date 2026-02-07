import fs from "fs";
import path from "path";

export function stopAgent(agentName: string): void {
  const ROOT = process.cwd();
  const pidFile = path.join(ROOT, "src", "agent", "pids", `${agentName}.pid`);

  if (!fs.existsSync(pidFile)) {
    console.log(`Agent ${agentName} is not running`);
    return;
  }

  const pid = Number(fs.readFileSync(pidFile, "utf-8"));

  try {
    process.kill(pid, "SIGTERM");
    fs.unlinkSync(pidFile);
    console.log(`Agent ${agentName} stopped`);
  } catch (err) {
    console.error(`Failed to stop agent ${agentName}`, err);
  }
}
