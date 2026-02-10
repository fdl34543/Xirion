import { daoTreasury } from "./daoTreasury.js";
import { retailYield } from "./retailYield.js";
import { alphaDetection } from "./alphaDetection.js";
import { predictionArb } from "./predictionArb.js";
import { runForumAgent } from "../../colosseum/forumAgent.js"

import type { AgentSkill } from "../types.js";

export const skillMap: Record<
  AgentSkill,
  (agent: string) => Promise<void>
> = {
  DAO_TREASURY: daoTreasury,
  RETAIL_YIELD: retailYield,
  ALPHA_DETECTION: alphaDetection,
  PREDICTION_ARBITRAGE: predictionArb,
  COLOSSEUM_FORUM: runForumAgent,
};
