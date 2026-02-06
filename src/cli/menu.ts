import inquirer from "inquirer";
import { adminMenu } from "./admin.js";
import { walletMenu } from "../x402/wallet.js";

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

    case "wallet":
      await walletMenu();
      break;

    case "telegram":
      console.log("Telegram bot setup is not implemented yet.");
      break;

    case "admin":
      await adminMenu();
      break;

    case "exit":
      process.exit(0);
  }

  await mainMenu();
}
