import axios from "axios";

export const toggleLike = async (lpId: number, token: string | null) => {
  if (!token) throw new Error("로그인이 필요합니다.");

  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/v1/lps/${lpId}/likes`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
