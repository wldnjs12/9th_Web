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

  try {
    const res = await axios.get(`${BASE_URL}/v1/lps/${lpId}/comments`, {
      params: { cursor, limit, order },
      headers,
    });

    return {
      items: res.data.data.data ?? [],
      nextCursor: res.data.data.nextCursor,
      hasNext: res.data.data.hasNext,
    };
  } catch (err: any) {
    if (err.response?.status === 401) {
      console.warn("댓글 조회 401 → 로그인 필요 → 빈 리스트 반환");
      return { items: [], nextCursor: null, hasNext: false };
    }

    throw err;
  }
}

export async function createComment(lpId: number, content: string, token: string) {
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

export async function updateComment(lpId: number, commentId: number, content: string, token: string) {
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

export async function deleteComment(lpId: number, commentId: number, token: string) {
  return axios.delete(`${BASE_URL}/v1/lps/${lpId}/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
