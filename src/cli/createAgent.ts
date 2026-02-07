import inquirer from "inquirer";
import fs from "fs";
import path from "path";

import type { AgentConfig, AgentSkill } from "../agent/types.js";
import { SkillRoleMap } from "../agent/types.js";

export async function createAgent(): Promise<void> {
  const { baseName } = await inquirer.prompt<{ baseName: string }>([
    {
      type: "input",
      name: "baseName",
      message: "Agent base name:",
      validate: (v) => (v ? true : "Base name is required"),
    },
  ]);

  const { skill } = await inquirer.prompt<{ skill: AgentSkill }>([
    {
      type: "select",
      name: "skill",
      message: "Select agent skill:",
      choices: [
        { name: "DAO treasury management", value: "DAO_TREASURY" },
        { name: "Retail yield optimization", value: "RETAIL_YIELD" },
        { name: "Token & memecoin alpha detection", value: "ALPHA_DETECTION" },
        { name: "Prediction market arbitrage", value: "PREDICTION_ARBITRAGE" },
      ],
    },
  ]);

  const role = SkillRoleMap[skill];
  const fullName = `${baseName}-${role}`;

  const agent: AgentConfig = {
    name: fullName,
    baseName,
    role,
    skill,
    createdAt: new Date().toISOString(),
  };

  const ROOT = process.cwd();
  const agentDir = path.join(ROOT, "src", "agent", "user");

  fs.mkdirSync(agentDir, { recursive: true });

  const filePath = path.join(agentDir, `${fullName}.json`);

  if (fs.existsSync(filePath)) {
    console.log(`❌ Agent "${fullName}" already exists`);
    return;
  }

  fs.writeFileSync(filePath, JSON.stringify(agent, null, 2));

  console.log(`✅ Agent created: ${fullName}`);
}
