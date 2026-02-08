import inquirer from "inquirer";
import { loadAdmins, saveAdmins } from "../security/admin.js";
import { registMenu } from "../colosseum/regist.js";
import { forumMenu, createForumPost } from "../colosseum/forum.js";

type AdminAnswer = {
  action: string;
};

export async function createForumPostCli(): Promise<void> {
  const answers = await inquirer.prompt([
    {
      type: "password",
      name: "apiKey",
      message: "Colosseum API Key:",
      mask: "*",
    },
    {
      type: "input",
      name: "title",
      message: "Forum post title:",
      validate: (v: string) =>
        v.length > 5 || "Title must be at least 6 characters",
    },
    {
      type: "editor",
      name: "body",
      message: "Forum post body (editor will open):",
      validate: (v: string) =>
        v.length > 20 || "Body must be at least 20 characters",
    },
    {
      type: "input",
      name: "tags",
      message: "Tags (comma separated):",
      filter: (v: string) =>
        v
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
    },
  ]);

  try {
    const post = await createForumPost({
      apiKey: answers.apiKey,
      title: answers.title,
      body: answers.body,
      tags: answers.tags,
    });

    console.log("Forum post created successfully");
    console.log("Post ID:", post.id);
    console.log("Title:", post.title);
    console.log("Tags:", post.tags.join(", "));
  } catch (err) {
    console.error("Failed to create forum post", err);
  }
}

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
          name: "Create Colosseum Forum Post",
          value: "create_forum",
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

    case "create_forum":
      await createForumPostCli();
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
