import fs from "fs";
import path from "path";
import { SkillRoleMap } from "../types.js";
import type { AgentConfig, AgentSkill } from "../types.js";

export function createAgentInternal(
  baseName: string,
  skill: AgentSkill
): { ok: boolean; message: string; agentName?: string } {
  const role = SkillRoleMap[skill];
  const agentName = `${baseName}-${role}`;

  const ROOT = process.cwd();
  const agentDir = path.join(ROOT, "src", "agent", "user");

  fs.mkdirSync(agentDir, { recursive: true });

  const filePath = path.join(agentDir, `${agentName}.json`);

  if (fs.existsSync(filePath)) {
    return {
      ok: false,
      message: `Agent already exists: ${agentName}`,
    };
  }

  const agent: AgentConfig = {
    name: agentName,
    baseName,
    role,
    skill,
    createdAt: new Date().toISOString(),
  };

  fs.writeFileSync(filePath, JSON.stringify(agent, null, 2));

  return {
    ok: true,
    message: `Agent created: ${agentName}`,
    agentName,
  };
}
