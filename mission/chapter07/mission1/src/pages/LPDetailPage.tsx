import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useEffect, useState } from "react";
import CommentsSection from "./CommentsSection";

export default function LPDetailPage() {
  const { lpId } = useParams<{ lpId: string }>();
  const numericLpId = Number(lpId);

  const { value: token } = useLocalStorage<string | null>("auth_token", null);
  const queryClient = useQueryClient();

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loadingLike, setLoadingLike] = useState(false);

  useEffect(() => {
    if (!token) return;

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/v1/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCurrentUserId(res.data.data.id))
      .catch(() => setCurrentUserId(null));
  }, [token]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["lp", numericLpId],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/v1/lps/${numericLpId}`
      );
      return res.data.data;
    },
  });

  if (isLoading) return <div className="min-h-screen">로딩 중...</div>;
  if (isError || !data) return <div className="min-h-screen text-red-400">LP 정보를 불러올 수 없습니다.</div>;

  const likeList = data.likes ?? [];
  const userLiked = likeList.some((like: { userId: number }) => like.userId === currentUserId);

  // 좋아요
  const handleLike = async () => {
    if (!token) return alert("로그인이 필요합니다.");

    try {
      setLoadingLike(true);

      await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/v1/lps/${numericLpId}/likes`,
        {
          method: userLiked ? "DELETE" : "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      queryClient.invalidateQueries({ queryKey: ["lp", numericLpId] });
    } catch (err) {
      console.error("좋아요 오류:", err);
    } finally {
      setLoadingLike(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <img src={data.thumbnail} className="w-72 h-72 rounded-2xl mb-6" />

      <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
      <p className="text-zinc-400">by {data.author.name}</p>

      <button
        onClick={handleLike}
        disabled={loadingLike}
        className="mt-4 px-6 py-2 rounded-full bg-zinc-800 hover:bg-pink-500"
      >
        ❤️ {likeList.length}
      </button>

      <div className="w-full max-w-2xl mt-12">
        <CommentsSection lpId={numericLpId} currentUserId={currentUserId} />
      </div>
    </div>
  );
}
