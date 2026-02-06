import fs from "fs";
import os from "os";
import path from "path";

export const CONFIG_PATH = path.join(os.homedir(), ".agentwallet/config.json");

export function isConnected() {
  return fs.existsSync(CONFIG_PATH);
}
