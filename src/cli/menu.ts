import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import { adminMenu } from "./admin.js";
import { walletMenu } from "../x402/wallet.js";
import { telegramMenu } from "../telegram/menu.js";
import { analyzeToken } from "../agent/analyzeToken.js";
import { createAgent } from "./createAgent.js";
import { startAgents } from "./startAgent.js";
import { stopAgent } from "./stopAgent.js";
import { restartAgent } from "./restartAgent.js";
import { showAgentStatus } from "./agentStatus.js";
import { restartCrashedAgents } from "./restartCrashedAgents.js";
import { startSupervisor } from "./startSupervisor.js";

function getAgentList(): string[] {
  const dir = path.join(process.cwd(), "src", "agent", "user");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).map(f => f.replace(".json", ""));
}


export async function mainMenu(): Promise<void> {
  const answer = await inquirer.prompt<{
    action: string;
  }>([
    {
      type: "select", // IMPORTANT: Inquirer v9
      name: "action",
      message: "Select menu:",
      choices: [
        {
          name: "Start Agent",
          value: "start",
        },
        { name: "Create Agent", value: "create-agent" },
        { name: "Stop Agent", value: "stop" },
        { name: "Restart Agent", value: "restart" },
        {
          name: "Agent Status",
          value: "status",
        },
        {
          name: "Analyze Token / Memecoin",
          value: "analyze_token",
        },
        {
          name: "Wallet",
          value: "wallet",
        },
        {
          name: "Telegram Bot",
          value: "telegram",
        },
        {
          name: "Admin",
          value: "admin",
        },
        {
          name: "Exit",
          value: "exit",
        },
      ],
    },
  ]);

  switch (answer.action) {
    case "start":
      startAgents();
      // startSupervisor();
      break;

    case "create-agent":
      await createAgent();
      break;

    case "stop": {
      const agents = getAgentList();
      if (!agents.length) {
        console.log("No agents found");
        break;
      }

      const { agent } = await inquirer.prompt({
        type: "select",
        name: "agent",
        message: "Select agent to stop:",
        choices: agents,
      });

      stopAgent(agent);
      break;
    }

    case "restart": {
      const agents = getAgentList();
      if (!agents.length) {
        console.log("No agents found");
        break;
      }

      const { agent } = await inquirer.prompt({
        type: "select",
        name: "agent",
        message: "Select agent to restart:",
        choices: agents,
      });

      await restartAgent(agent);
      break;
    }

    case "status":
      restartCrashedAgents();
      showAgentStatus();
      break;

    case "analyze_token": {
      const input = await inquirer.prompt<{
        address: string;
        twitter?: string;
      }>([
        {
          type: "input",
          name: "address",
          message: "Token address:",
          validate: (v) => (v ? true : "Token address is required"),
        },
        {
          type: "input",
          name: "twitter",
          message: "Twitter/X username (optional):",
        },
      ]);

      const context = await analyzeToken({
        address: input.address,
        twitter: input.twitter || undefined,
      });

      // console.log("\nAnalyze Token Context:");
      // console.dir(context, { depth: null });
      break;
    }


    case "wallet":
      await walletMenu();
      break;

    case "telegram":
      await telegramMenu();
      break;

    case "admin":
      await adminMenu();
      break;

    case "exit":
      process.exit(0);
  }

  await mainMenu();
}
