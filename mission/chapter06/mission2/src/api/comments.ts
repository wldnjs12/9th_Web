import axios from "axios";

export async function getComments(lpId: number, cursor = 0, limit = 10, order: "asc"|"desc" = "desc") {
  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/v1/lps/${lpId}/comments?cursor=${cursor}&limit=${limit}&order=${order}`
  );
  const d = res.data.data;
  return { items: d.data, nextCursor: d.hasNext ? d.nextCursor : null, hasNext: d.hasNext };
}

export async function createComment(lpId: number, content: string, token: string) {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/v1/lps/${lpId}/comments`,
    { content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}
