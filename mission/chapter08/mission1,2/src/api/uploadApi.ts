import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(`${BASE_URL}/v1/uploads/public`, formData);
  return res.data.data.imageUrl; 
}
