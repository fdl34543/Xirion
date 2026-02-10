import { runForumAgent } from "./forumAgent.js";
import { loadForumState } from "./forumState.js";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log("[ForumAgent] Runner started.");

  while (true) {
    const state = loadForumState();

    if (!state.running) {
      console.log("[ForumAgent] Stop signal detected. Exiting.");
      process.exit(0);
    }

    try {
      await runForumAgent();
    } catch (err) {
      console.error("[ForumAgent] Error:", err);
    }

    // ⏱ interval antar cycle (misal 30 menit)
    await sleep(30 * 60 * 1000);
  }
}

main();
