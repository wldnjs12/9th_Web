import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function updateProfile(
  token: string,
  name?: string,
  bio?: string,
  avatarUrl?: string
) {
  const body: any = {};
  if (name) body.name = name;
  if (bio) body.bio = bio;
  if (avatarUrl) body.avatar = avatarUrl;

  const res = await axios.patch(`${BASE_URL}/v1/users`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res.data;
}


// 회원 탈퇴
export async function deleteAccount(token: string) {
  const res = await axios.delete(`${BASE_URL}/v1/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}
