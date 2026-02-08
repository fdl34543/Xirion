import fs from "fs";
import path from "path";
import { analyzeYield } from "../yield/analyzeYield";

/* =========================
   CONSTANTS
========================= */

const ONE_HOUR = 60 * 60 * 1000;

const STORAGE_DIR = path.resolve(process.cwd(), "src/storage");
const STORAGE_FILE = path.join(STORAGE_DIR, "yield.json");

/* =========================
   UTILS
========================= */

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ensureStorage() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }

  if (!fs.existsSync(STORAGE_FILE)) {
    writeJSONSafe(STORAGE_FILE, {
      lastUpdated: null,
      history: [],
    });
  }
}

function readJSONSafe(filePath: string) {
  try {
    const raw = fs.readFileSync(filePath, "utf-8").trim();
    if (!raw) throw new Error("Empty file");
    return JSON.parse(raw);
  } catch {
    return {
      lastUpdated: null,
      history: [],
    };
  }
}

function writeJSONSafe(filePath: string, data: any) {
  const tempPath = `${filePath}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2));
  fs.renameSync(tempPath, filePath);
}

/* =========================
   LOGGING HELPERS
========================= */

function section(title: string) {
  console.log(`\n=== ${title.toUpperCase()} ===`);
}

function kv(key: string, value: any) {
  console.log(`- ${key}:`, value);
}

/* =========================
   CORE RUNNER
========================= */

async function runOnce(agentName: string) {
  console.log(`[${agentName}] Running retail yield optimization...`);

  /* ---- ANALYZE ---- */
  const result = await analyzeYield();

  /* ---- HUMAN READABLE LOG ---- */
  // section("Yield Analysis");
  // kv("Chain", result.data.chain);
  // kv("Strategy", result.data.strategy);
  // kv("Summary", result.data.summary);
  // kv("Selected Pools", result.data.pools.length);

  console.log("\nTop Pools:");
  result.data.pools.forEach((p: any, i: number) => {
    console.log(
      `${i + 1}. ${p.project} | ${p.symbol}
   TVL   : $${Math.round(p.tvlUsd).toLocaleString()}
   APY   : ${p.apy.toFixed(2)}%
   Score : ${p.analysis.score}
   Risk  : ${p.analysis.riskLevel}`
    );
  });

  /* ---- STORAGE ---- */
  const store = readJSONSafe(STORAGE_FILE);
  const timestamp = Date.now();

  store.lastUpdated = timestamp;
  store.history.push({
    timestamp,
    data: result,
  });

  writeJSONSafe(STORAGE_FILE, store);

  console.log(
    `\n[${agentName}] Yield snapshot saved at ${new Date(
      timestamp
    ).toISOString()}`
  );
}

/* =========================
   PUBLIC API (DO NOT RENAME)
========================= */

export async function retailYield(agentName: string) {
  ensureStorage();

  console.log(`[${agentName}] Retail yield agent started`);

  while (true) {
    const start = Date.now();

    try {
      await runOnce(agentName);
    } catch (err) {
      console.error(`[${agentName}] Retail yield error`, err);
    }

    const elapsed = Date.now() - start;
    const waitTime = Math.max(ONE_HOUR - elapsed, 0);

    console.log(
      `[${agentName}] Next run in ${Math.round(waitTime / 60000)} minutes`
    );

    await sleep(waitTime);
  }
}
