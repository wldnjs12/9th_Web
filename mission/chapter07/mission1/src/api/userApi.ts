import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function updateProfile(token: string, name?: string, bio?: string, file?: File | null) {
  const form = new FormData();
  if (name) form.append("name", name);
  if (bio) form.append("bio", bio);
  if (file) form.append("file", file);

  const res = await axios.patch(`${BASE_URL}/v1/users`, form, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function deleteAccount(token: string) {
  const res = await axios.delete(`${BASE_URL}/v1/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
