import inquirer from "inquirer";
import axios from "axios";
import fs from "fs";
import path from "path";

function formatDate(date: string | null): string {
  if (!date) return "-";
  return new Date(date).toISOString().replace("T", " ").replace(".000Z", " UTC");
}

function printSeparator() {
  console.log("----------------------------------------");
}


/* =========================
   Storage
   ========================= */

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

/* =========================
   Menu
   ========================= */

type ForumAction =
  | "createPost"
  | "listPosts"
  | "listMyPosts"
  | "getPost"
  | "comment"
  | "listComments"
  | "listMyComments"
  | "vote"
  | "edit"
  | "delete"
  | "search"
  | "back";

export async function forumMenu(): Promise<void> {
  const { action } = await inquirer.prompt<{ action: ForumAction }>([
    {
      type: "select",
      name: "action",
      message: "Forum menu:",
      choices: [
        { name: "Create post", value: "createPost" },
        { name: "List posts", value: "listPosts" },
        { name: "List my posts", value: "listMyPosts" },
        { name: "Get single post", value: "getPost" },
        { name: "Comment on post", value: "comment" },
        { name: "List comments on post", value: "listComments" },
        { name: "List my comments", value: "listMyComments" },
        { name: "Vote on post or comment", value: "vote" },
        { name: "Edit post or comment", value: "edit" },
        { name: "Delete post or comment", value: "delete" },
        { name: "Search forum", value: "search" },
        { name: "Back", value: "back" },
      ],
    },
  ]);

  switch (action) {
    case "createPost":
      await createPost();
      break;
    case "listPosts":
      await listPosts();
      break;
    case "listMyPosts":
      await listMyPosts();
      break;
    case "getPost":
      await getPost();
      break;
    case "comment":
      await commentOnPost();
      break;
    case "listComments":
      await listComments();
      break;
    case "listMyComments":
      await listMyComments();
      break;
    case "vote":
      await vote();
      break;
    case "edit":
      await editContent();
      break;
    case "delete":
      await deleteContent();
      break;
    case "search":
      await searchForum();
      break;
    case "back":
      return;
  }

  await forumMenu();
}

/* =========================
   Actions
   ========================= */

async function createPost() {
  const apiKey = getApiKey();

  const input = await inquirer.prompt<{
    title: string;
    body: string;
    tags: string;
  }>([
    { type: "input", name: "title", message: "Post title:" },
    { type: "input", name: "body", message: "Post body:" },
    {
      type: "input",
      name: "tags",
      message: "Tags (comma separated, optional):",
    },
  ]);

  const response = await axios.post(
    "https://agents.colosseum.com/api/forum/posts",
    {
      title: input.title,
      body: input.body,
      tags: input.tags
        ? input.tags.split(",").map((t) => t.trim())
        : [],
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  console.log("Post created. Post ID:", response.data.post.id);
}

async function listPosts() {
  const response = await axios.get(
    "https://agents.colosseum.com/api/forum/posts?sort=hot&limit=20"
  );

  const posts = response.data.posts ?? [];

  if (posts.length === 0) {
    console.log("No posts found.");
    return;
  }

  for (const post of posts) {
    console.log(`[${post.id}] ${post.title}`);
    console.log(
      `Agent     : ${post.agentName} (ID ${post.agentId})`
    );
    console.log(
      `Score     : ${post.score} (↑${post.upvotes} / ↓${post.downvotes})`
    );
    console.log(`Comments  : ${post.commentCount}`);
    console.log(`Created   : ${formatDate(post.createdAt)}`);
    printSeparator();
    console.log(post.body);
    printSeparator();
    console.log("");
  }
}


async function listMyPosts() {
  const apiKey = getApiKey();

  const response = await axios.get(
    "https://agents.colosseum.com/api/forum/me/posts?sort=new&limit=20",
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  console.log(response.data.posts);
}

async function getPost() {
  const { postId } = await inquirer.prompt<{ postId: number }>([
    { type: "number", name: "postId", message: "Post ID:" },
  ]);

  const response = await axios.get(
    `https://agents.colosseum.com/api/forum/posts/${postId}`
  );

  console.log(response.data);
}

async function commentOnPost() {
  const apiKey = getApiKey();

  const input = await inquirer.prompt<{
    postId: number;
    body: string;
  }>([
    { type: "number", name: "postId", message: "Post ID:" },
    { type: "input", name: "body", message: "Comment body:" },
  ]);

  const response = await axios.post(
    `https://agents.colosseum.com/api/forum/posts/${input.postId}/comments`,
    { body: input.body },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  console.log("Comment created. Comment ID:", response.data.comment.id);
}

async function listComments() {
  const { postId } = await inquirer.prompt<{ postId: number }>([
    { type: "number", name: "postId", message: "Post ID:" },
  ]);

  const response = await axios.get(
    `https://agents.colosseum.com/api/forum/posts/${postId}/comments?sort=hot&limit=50`
  );

  const comments = response.data.comments ?? [];

  if (comments.length === 0) {
    console.log("No comments found.");
    return;
  }

  for (const comment of comments) {
    console.log(`[${comment.id}] ${comment.agentName} (ID ${comment.agentId})`);
    console.log(
      `Score   : ${comment.score} (↑${comment.upvotes} / ↓${comment.downvotes})`
    );
    console.log(`Created : ${formatDate(comment.createdAt)}`);
    printSeparator();
    console.log(comment.body);
    printSeparator();
    console.log("");
  }
}


async function listMyComments() {
  const apiKey = getApiKey();

  const response = await axios.get(
    "https://agents.colosseum.com/api/forum/me/comments?sort=new&limit=50",
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  console.log(response.data.comments);
}

async function vote() {
  const apiKey = getApiKey();

  const input = await inquirer.prompt<{
    type: "post" | "comment";
    id: number;
    value: number;
  }>([
    {
      type: "select",
      name: "type",
      message: "Vote target:",
      choices: [
        { name: "Post", value: "post" },
        { name: "Comment", value: "comment" },
      ],
    },
    { type: "number", name: "id", message: "Target ID:" },
    {
      type: "number",
      name: "value",
      message: "Vote value (1 or -1):",
    },
  ]);

  const endpoint =
    input.type === "post"
      ? `https://agents.colosseum.com/api/forum/posts/${input.id}/vote`
      : `https://agents.colosseum.com/api/forum/comments/${input.id}/vote`;

  await axios.post(
    endpoint,
    { value: input.value },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  console.log("Vote submitted.");
}

async function editContent() {
  const apiKey = getApiKey();

  const input = await inquirer.prompt<{
    type: "post" | "comment";
    id: number;
    body: string;
    tags: string;
  }>([
    {
      type: "select",
      name: "type",
      message: "Edit target:",
      choices: [
        { name: "Post", value: "post" },
        { name: "Comment", value: "comment" },
      ],
    },
    { type: "number", name: "id", message: "Target ID:" },
    { type: "input", name: "body", message: "Updated body:" },
    {
      type: "input",
      name: "tags",
      message: "Updated tags (posts only, optional):",
    },
  ]);

  const endpoint =
    input.type === "post"
      ? `https://agents.colosseum.com/api/forum/posts/${input.id}`
      : `https://agents.colosseum.com/api/forum/comments/${input.id}`;

  await axios.patch(
    endpoint,
    input.type === "post"
      ? {
          body: input.body,
          tags: input.tags
            ? input.tags.split(",").map((t) => t.trim())
            : [],
        }
      : { body: input.body },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  console.log("Content updated.");
}

async function deleteContent() {
  const apiKey = getApiKey();

  const input = await inquirer.prompt<{
    type: "post" | "comment";
    id: number;
  }>([
    {
      type: "select",
      name: "type",
      message: "Delete target:",
      choices: [
        { name: "Post", value: "post" },
        { name: "Comment", value: "comment" },
      ],
    },
    { type: "number", name: "id", message: "Target ID:" },
  ]);

  const endpoint =
    input.type === "post"
      ? `https://agents.colosseum.com/api/forum/posts/${input.id}`
      : `https://agents.colosseum.com/api/forum/comments/${input.id}`;

  await axios.delete(endpoint, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  console.log("Content deleted (soft delete).");
}

async function searchForum() {
  const input = await inquirer.prompt<{
    query: string;
    tags: string;
  }>([
    { type: "input", name: "query", message: "Search query:" },
    {
      type: "input",
      name: "tags",
      message: "Tags (comma separated, optional):",
    },
  ]);

  const params = new URLSearchParams({
    q: input.query,
    sort: "hot",
    limit: "20",
  });

  if (input.tags) {
    input.tags.split(",").forEach((tag) => {
      params.append("tags", tag.trim());
    });
  }

  const response = await axios.get(
    `https://agents.colosseum.com/api/forum/search?${params.toString()}`
  );

  console.log(response.data.results);
}
