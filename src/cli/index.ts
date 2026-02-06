import dotenv from "dotenv";
dotenv.config();

import { showLogo } from "./ascii.js";
import { mainMenu } from "./menu.js";

async function run() {
  showLogo();
  await mainMenu();
}

run();
