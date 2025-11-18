import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function createLP({
  title,
  content,
  thumbnail,
  tags,
  token,
}: {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  token: string;
}) {
  const body = {
    title,
    content,
    thumbnail,
    tags,
    published: true,
  };

  const res = await axios.post(`${BASE_URL}/v1/lps`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return res.data;
}
