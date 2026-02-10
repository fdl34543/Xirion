import axios from "axios";

const API_BASE = "https://agents.colosseum.com/api";

export async function listForumPosts() {
  const res = await axios.get(
    `${API_BASE}/forum/posts?sort=new&limit=30`
  );
  return res.data.posts ?? res.data;
}

export async function getForumPost(postId: number) {
  const res = await axios.get(
    `${API_BASE}/forum/posts/${postId}`
  );
  return res.data.post ?? res.data;
}

export async function commentOnPost(
  postId: number,
  comment: string,
  apiKey: string
) {
  return axios.post(
    `${API_BASE}/forum/posts/${postId}/comments`,
    { body: comment },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );
}
