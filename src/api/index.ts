import { startApiServer } from "./server.js";
import dotenv from "dotenv";
dotenv.config();

startApiServer().catch((err) => {
  console.error("[API] Failed to start", err);
  process.exit(1);
});
