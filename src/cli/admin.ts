import inquirer from "inquirer";
import { loadAdmins, saveAdmins } from "../security/admin.js";
import { registMenu } from "../colosseum/regist.js";
import { forumMenu } from "../colosseum/forum.js";

type AdminAnswer = {
  action: string;
};

export async function adminMenu(): Promise<void> {
  let admins = loadAdmins();

  // Auto-create first admin if none exists
  if (admins.length === 0) {
    const setup = await inquirer.prompt<{
      email: string;
    }>([
      {
        type: "input",
        name: "email",
        message: "No admin found. Enter email to create first admin:",
        validate: (value) => value.length > 3 || "Invalid email",
      },
    ]);

    admins.push({
      email: setup.email,
      createdAt: new Date().toISOString(),
    });

    saveAdmins(admins);
    console.log("Admin account created.");
  }

  const answer = await inquirer.prompt<AdminAnswer>([
    {
      type: "select", // Inquirer v9 navigation (up/down)
      name: "action",
      message: "Admin menu:",
      choices: [
        {
          name: "Register agent to Colosseum",
          value: "register",
        },
        {
          name: "Read Colosseum forum",
          value: "forum",
        },
        {
          name: "Confirm agent update",
          value: "confirm",
        },
        {
          name: "Back to main menu",
          value: "back",
        },
      ],
    },
  ]);

  switch (answer.action) {
    case "register":
      await registMenu();
      break;

    case "forum":
      await forumMenu();
      break;

    case "confirm":
      console.log("No pending agent updates.");
      break;

    case "back":
      return;
  }

  // Return to admin menu after action
  await adminMenu();
}
