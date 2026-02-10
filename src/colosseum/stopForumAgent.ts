import { loadForumState, saveForumState } from "./forumState.js";

export function stopForumAgent() {
  const state = loadForumState();
  state.running = false;
  saveForumState(state);

  console.log("[ForumAgent] Stop signal saved.");
}
