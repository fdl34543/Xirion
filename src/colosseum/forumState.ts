import fs from "fs";
import path from "path";

const STATE_FILE = path.join(
  "src/storage",
  "colosseum.forum.json"
);

export type ForumState = {
  running: boolean;
  lastRun?: string;
  commentedPosts: Record<
    string,
    {
      commentedAt: string;
      excerpt: string;
    }
  >;
};

export function loadForumState(): ForumState {
  if (!fs.existsSync(STATE_FILE)) {
    return {
      running: true,
      commentedPosts: {},
    };
  }

  const raw = JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));

  return {
    running:
      typeof raw.running === "boolean"
        ? raw.running
        : true,
    commentedPosts: raw.commentedPosts ?? {},
    lastRun: raw.lastRun,
  };
}

export function saveForumState(state: ForumState) {
  fs.writeFileSync(
    STATE_FILE,
    JSON.stringify(state, null, 2)
  );
}
