import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useState, useEffect } from "react";

export default function LPDetailPage() {
  const { lpId } = useParams<{ lpId: string }>();
  const { value: token } = useLocalStorage<string | null>("auth_token", null);
  const queryClient = useQueryClient();
  const [loadingLike, setLoadingLike] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/v1/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCurrentUserId(res.data.data.id))
      .catch((err) => console.error("❌ 유저 ID 로드 실패:", err));
  }, [token]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["lp", lpId],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/v1/lps/${lpId}`
      );
      return res.data.data;
    },
  });

  if (isLoading) return <p>로딩 중...</p>;
  if (isError || !data) return <p>LP 정보를 불러오지 못했습니다.</p>;

  const likeList = data.likes ?? [];
  const currentUserLiked = likeList.some(
    (like: { userId: number }) => like.userId === currentUserId
  );

  const handleLike = async () => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      setLoadingLike(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/v1/lps/${lpId}/likes`,
        {
          method: currentUserLiked ? "DELETE" : "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("좋아요 요청 실패");

      await queryClient.invalidateQueries({ queryKey: ["lp", lpId] });
    } catch (err) {
      console.error("❌ 좋아요 처리 에러:", err);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    } finally {
      setLoadingLike(false);
    }
  };

  const likeCount = data.likes?.length ?? 0;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-8">
      <img
        src={data.thumbnail}
        alt={data.title}
        className="w-72 h-72 rounded-xl shadow-lg mb-6 object-cover"
      />
      <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
      <p className="text-zinc-400 mb-4">by {data.author.name}</p>
      <p className="text-center text-zinc-200 leading-relaxed max-w-lg">
        {data.content}
      </p>

      <button
        onClick={handleLike}
        disabled={loadingLike}
        className={`mt-6 px-6 py-2 rounded-full font-semibold transition ${
          currentUserLiked
            ? "bg-pink-700 hover:bg-pink-600"
            : "bg-zinc-800 hover:bg-pink-500"
        }`}
      >
        ❤️ {likeCount}
      </button>
    </div>
  );
}
