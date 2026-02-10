import fs from "fs";
import path from "path";

export function loadXirionContext(): string {
  const readmePath = path.resolve(process.cwd(), "README.md");

  if (!fs.existsSync(readmePath)) {
    throw new Error("README.md not found");
  }

  const content = fs.readFileSync(readmePath, "utf-8");

  return `
You are representing the Xirion project.

Below is the authoritative description of Xirion.
Use it to explain concepts, architecture, and vision when relevant.
Do NOT hype. Do NOT promise. Be factual and technical.

=== XIRION CONTEXT ===
${content}
`;
}
