import { useState } from "react";
import axios from "axios";

export default function LPCreationPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const handleSubmit = async () => {
    const payload = {
      title,
      content,
      thumbnail,
      published: true,
      tags: ["새LP"],
    };
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/v1/lps`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    alert("LP 생성 완료!");
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl mb-4">새 LP 만들기</h1>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
        className="w-full p-2 bg-zinc-800 rounded mb-2"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="내용"
        className="w-full p-2 bg-zinc-800 rounded mb-2"
      />
      <input
        value={thumbnail}
        onChange={(e) => setThumbnail(e.target.value)}
        placeholder="썸네일 URL"
        className="w-full p-2 bg-zinc-800 rounded mb-4"
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-pink-600 rounded hover:bg-pink-500"
      >
        업로드
      </button>
    </div>
  );
}
