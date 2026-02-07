import { stopAgent } from "./stopAgent.js";
import { startSingleAgent } from "./startSingleAgent.js";

export async function restartAgent(agentName: string): Promise<void> {
  stopAgent(agentName);
  await new Promise((r) => setTimeout(r, 1000));
  startSingleAgent(agentName);
}
