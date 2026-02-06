import inquirer from "inquirer";
import axios from "axios";
import fs from "fs";
import path from "path";

/* =========================
   Storage Paths
   ========================= */

const STORAGE_DIR = "src/storage";

const STATE_FILE = path.join(STORAGE_DIR, "colosseum.state.json");
const RESPONSE_FILE = path.join(STORAGE_DIR, "colosseum.responses.json");
const LOG_FILE = path.join(STORAGE_DIR, "colosseum.logs.json");

/* =========================
   Types
   ========================= */

type RegistAction =
  | "registerAgent"
  | "createProject"
  | "submitProject"
  | "showInfo"
  | "back";

type ColosseumState = {
  agent?: {
    id: number;
    name: string;
    apiKey: string;
    claimUrl: string;
    skillUrl?: string;
    heartbeatUrl?: string;
  };
  project?: {
    id: number;
    name: string;
    status: string;
  };
};

type LogEntry = {
  action: string;
  status: "success" | "failed";
  timestamp: string;
  message?: string;
};

/* =========================
   Helpers
   ========================= */

function ensureStorage() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
}

function loadJson<T>(file: string, fallback: T): T {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

function saveJson(file: string, data: unknown) {
  ensureStorage();
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function appendLog(entry: LogEntry) {
  const logs = loadJson<LogEntry[]>(LOG_FILE, []);
  logs.push(entry);
  saveJson(LOG_FILE, logs);
}

function saveResponse(key: string, response: unknown) {
  const responses = loadJson<Record<string, unknown>>(RESPONSE_FILE, {});
  responses[key] = {
    timestamp: new Date().toISOString(),
    response,
  };
  saveJson(RESPONSE_FILE, responses);
}

/* =========================
   Menu
   ========================= */

export async function registMenu(): Promise<void> {
  const answer = await inquirer.prompt<{ action: RegistAction }>([
    {
      type: "select",
      name: "action",
      message: "Colosseum registration:",
      choices: [
        { name: "Register agent", value: "registerAgent" },
        { name: "Create project (draft)", value: "createProject" },
        { name: "Submit project", value: "submitProject" },
        { name: "Show registration info", value: "showInfo" },
        { name: "Back", value: "back" },
      ],
    },
  ]);

  switch (answer.action) {
    case "registerAgent":
      await registerAgent();
      break;
    case "createProject":
      await createProject();
      break;
    case "submitProject":
      await submitProject();
      break;
    case "showInfo":
      showInfo();
      break;
    case "back":
      return;
  }

  await registMenu();
}

/* =========================
   1. Register Agent
   ========================= */

async function registerAgent() {
  const state = loadJson<ColosseumState>(STATE_FILE, {});

  if (state.agent) {
    console.log("Agent already registered.");
    return;
  }

  const input = await inquirer.prompt<{
    name: string;
    confirm: boolean;
  }>([
    {
      type: "input",
      name: "name",
      message: "Agent name:",
      default: "Xerion",
    },
    {
      type: "confirm",
      name: "confirm",
      message: "Proceed with agent registration?",
    },
  ]);

  if (!input.confirm) return;

  try {
    const response = await axios.post(
      "https://agents.colosseum.com/api/agents",
      { name: input.name }
    );

    saveResponse("registerAgent", response.data);

    state.agent = {
      id: response.data.agent.id,
      name: response.data.agent.name,
      apiKey: response.data.apiKey,
      claimUrl: response.data.claimUrl,
      skillUrl: response.data.skillUrl,
      heartbeatUrl: response.data.heartbeatUrl,
    };

    saveJson(STATE_FILE, state);

    appendLog({
      action: "registerAgent",
      status: "success",
      timestamp: new Date().toISOString(),
    });

    console.log("Agent registered successfully.");
  } catch (error) {
    appendLog({
      action: "registerAgent",
      status: "failed",
      timestamp: new Date().toISOString(),
      message: String(error),
    });
    console.log("Agent registration failed.");
  }
}

/* =========================
   2. Create Project
   ========================= */

async function createProject() {
  const state = loadJson<ColosseumState>(STATE_FILE, {});

  if (!state.agent) {
    console.log("Agent is not registered.");
    return;
  }

  const input = await inquirer.prompt<{
    name: string;
    description: string;
    repoLink: string;
    solanaIntegration: string;
    tags: string;
    confirm: boolean;
  }>([
    { type: "input", name: "name", message: "Project name:" },
    { type: "input", name: "description", message: "Project description:" },
    { type: "input", name: "repoLink", message: "Repository link:" },
    {
      type: "input",
      name: "solanaIntegration",
      message: "Solana integration description:",
    },
    {
      type: "input",
      name: "tags",
      message: "Tags (comma separated, max 3):",
    },
    {
      type: "confirm",
      name: "confirm",
      message: "Create project in draft status?",
    },
  ]);

  if (!input.confirm) return;

  try {
    const response = await axios.post(
      "https://agents.colosseum.com/api/my-project",
      {
        name: input.name,
        description: input.description,
        repoLink: input.repoLink,
        solanaIntegration: input.solanaIntegration,
        tags: input.tags.split(",").map((t) => t.trim()),
      },
      {
        headers: {
          Authorization: `Bearer ${state.agent.apiKey}`,
        },
      }
    );

    saveResponse("createProject", response.data);

    state.project = {
      id: response.data.project.id,
      name: response.data.project.name,
      status: response.data.project.status,
    };

    saveJson(STATE_FILE, state);

    appendLog({
      action: "createProject",
      status: "success",
      timestamp: new Date().toISOString(),
    });

    console.log("Project created in draft status.");
  } catch (error) {
    appendLog({
      action: "createProject",
      status: "failed",
      timestamp: new Date().toISOString(),
      message: String(error),
    });
    console.log("Project creation failed.");
  }
}

/* =========================
   3. Submit Project
   ========================= */

async function submitProject() {
  const state = loadJson<ColosseumState>(STATE_FILE, {});

  if (!state.project || state.project.status !== "draft") {
    console.log("No draft project available to submit.");
    return;
  }

  const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
    {
      type: "confirm",
      name: "confirm",
      message:
        "Submitting the project will lock it. Are you sure you want to proceed?",
    },
  ]);

  if (!confirm) return;

  try {
    const response = await axios.post(
      "https://agents.colosseum.com/api/my-project/submit",
      {},
      {
        headers: {
          Authorization: `Bearer ${state.agent?.apiKey}`,
        },
      }
    );

    saveResponse("submitProject", response.data);

    state.project.status = "submitted";
    saveJson(STATE_FILE, state);

    appendLog({
      action: "submitProject",
      status: "success",
      timestamp: new Date().toISOString(),
    });

    console.log("Project submitted successfully.");
  } catch (error) {
    appendLog({
      action: "submitProject",
      status: "failed",
      timestamp: new Date().toISOString(),
      message: String(error),
    });
    console.log("Project submission failed.");
  }
}

/* =========================
   4. Show Info
   ========================= */

function showInfo() {
  const state = loadJson<ColosseumState>(STATE_FILE, {});

  if (!state.agent) {
    console.log("No registration information found.");
    return;
  }

  console.log("Agent ID:", state.agent.id);
  console.log("Agent Name:", state.agent.name);
  console.log("Claim URL:", state.agent.claimUrl);
  console.log("Heartbeat URL:", state.agent.heartbeatUrl);

  if (state.project) {
    console.log("Project Name:", state.project.name);
    console.log("Project Status:", state.project.status);
  }
}
