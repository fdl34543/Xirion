import inquirer from "inquirer";
import { walletMenu } from "../x402/wallet.js";
import { telegramMenu } from "../telegram/menu.js";
import { analyzeToken } from "../agent/analyzeToken.js";

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
      console.log("Agent started in dry-run mode.");
      break;

    case "status":
      console.log("Agent status: IDLE.");
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
      console.log("Access denied. Admin privileges required.");
      break;

    case "exit":
      process.exit(0);
  }

  await mainMenu();
}
