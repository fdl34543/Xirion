export type AgentSkill =
  | "DAO_TREASURY"
  | "RETAIL_YIELD"
  | "ALPHA_DETECTION"
  | "PREDICTION_ARBITRAGE";

export const SkillRoleMap: Record<AgentSkill, string> = {
  DAO_TREASURY: "dao",
  RETAIL_YIELD: "yield",
  ALPHA_DETECTION: "alpha",
  PREDICTION_ARBITRAGE: "prediction",
};

export interface AgentConfig {
  name: string;        // full agent name: verlion-alpha
  baseName: string;    // verlion
  skill: AgentSkill;
  role: string;        // alpha / dao / yield / prediction
  createdAt: string;
}
