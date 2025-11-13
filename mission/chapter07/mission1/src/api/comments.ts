import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getComments(
  lpId: number,
  cursor: number,
  limit: number,
  order: "asc" | "desc",
  token?: string | null
) {
  const headers: any = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await axios.get(`${BASE_URL}/v1/lps/${lpId}/comments`, {
    params: { cursor, limit, order },
    headers,
  });

  return {
    items: res.data.data.data ?? [],
    nextCursor: res.data.data.nextCursor,
    hasNext: res.data.data.hasNext,
  };
}

export async function createComment(lpId: number, content: string, token: string | null) {
  return axios.post(
    `${BASE_URL}/v1/lps/${lpId}/comments`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export async function updateComment(lpId: number, commentId: number, content: string, token: string | null) {
  return axios.patch(
    `${BASE_URL}/v1/lps/${lpId}/comments/${commentId}`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export async function deleteComment(lpId: number, commentId: number, token: string | null) {
  return axios.delete(`${BASE_URL}/v1/lps/${lpId}/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
