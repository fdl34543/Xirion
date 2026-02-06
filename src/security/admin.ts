import fs from "fs-extra";
import { encrypt, decrypt } from "./crypto.js";

const FILE = "src/storage/admin.json.enc";
const SECRET = process.env.ADMIN_SECRET || "xirion-secret";

export function loadAdmins(): any[] {
  if (!fs.existsSync(FILE)) return [];
  const raw = fs.readFileSync(FILE, "utf-8");
  return JSON.parse(decrypt(raw, SECRET));
}

export function saveAdmins(admins: any[]) {
  const enc = encrypt(JSON.stringify(admins), SECRET);
  fs.ensureFileSync(FILE);
  fs.writeFileSync(FILE, enc);
}
