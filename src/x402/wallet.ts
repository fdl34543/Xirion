import fs from "fs";
import { isConnected, CONFIG_PATH } from "./connect.js";

export async function walletMenu() {
  if (!isConnected()) {
    console.log("❌ Wallet not connected");
    console.log("Follow wallet.md to connect via OTP");
    return;
  }

  const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
  console.log("✅ Wallet connected:", cfg.username);
}
