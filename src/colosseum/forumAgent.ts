import {
  listForumPosts,
  getForumPost,
  commentOnPost,
} from "./forumClient.js";

import fs from "fs";
import path from "path";

import { loadXirionContext } from "./xirionContext.js";
import { buildForumReplyPrompt } from "../ai/prompts.js";
import { runAgentXirion } from "../ai/config.js";
import { loadForumState, saveForumState } from "./forumState.js";

const STATE_FILE = path.join("src/storage", "colosseum.state.json");

type ColosseumState = {
  agent?: {
    apiKey: string;
  };
};

function loadState(): ColosseumState {
  if (!fs.existsSync(STATE_FILE)) return {};
  return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
}

function getApiKey(): string {
  const state = loadState();
  if (!state.agent?.apiKey) {
    throw new Error("Agent is not registered. API key not found.");
  }
  return state.agent.apiKey;
}

const xirionContext = loadXirionContext();
const ONE_HOUR = 60 * 60 * 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runOneCycle(apiKey: string) {
  const forumState = loadForumState();

  if (!forumState.running) {
    console.log("[ForumAgent] Agent is stopped.");
    return;
  }

  forumState.commentedPosts ??= {};

  const posts = await listForumPosts();

  for (const post of posts) {
    if (!forumState.running) break;
    if (!post.title || !post.body) continue;
    if (forumState.commentedPosts[post.id]) continue;

    const fullPost = await getForumPost(post.id);

    const systemPrompt = buildForumReplyPrompt({
      postTitle: fullPost.title,
      postBody: fullPost.body,
      xirionContext,
    });

    const result = await runAgentXirion({
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: "Write the forum reply now.",
        },
      ],
    });

    const replyText = result.text;
    if (!replyText || replyText.length < 30) continue;

    await commentOnPost(fullPost.id, replyText, apiKey);

    forumState.commentedPosts[post.id] = {
      commentedAt: new Date().toISOString(),
      excerpt: replyText.slice(0, 120),
    };

    saveForumState(forumState);

    console.log(`[ForumAgent] Commented on post ${fullPost.id}`);
  }

  forumState.lastRun = new Date().toISOString();
  saveForumState(forumState);
}

export async function runForumAgent() {
  console.log("[ForumAgent] Agent started. Interval: 1 hour.");

  const apiKey = getApiKey();

  while (true) {
    const state = loadForumState();

    if (!state.running) {
      console.log("[ForumAgent] Stop signal detected. Exiting.");
      return;
    }

    try {
      console.log("[ForumAgent] Running forum cycle...");
      await runOneCycle(apiKey);
      console.log("[ForumAgent] Cycle finished.");
    } catch (err) {
      console.error("[ForumAgent] Cycle error:", err);
      console.log("[ForumAgent] Waiting 1 hour after error.");
    }

    // ⏱️ ALWAYS wait 1 hour (success OR error)
    await sleep(ONE_HOUR);
  }
}
