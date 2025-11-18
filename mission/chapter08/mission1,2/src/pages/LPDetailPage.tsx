import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

  useEffect(() => {
    if (!token) return;
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/v1/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCurrentUserId(res.data.data.id))
      .catch(() => setCurrentUserId(null));
  }, [token]);

  const lpQuery = useQuery({
    queryKey: ["lp", numericLpId],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/v1/lps/${numericLpId}`
      );
      return res.data.data;
    },
    enabled: !Number.isNaN(numericLpId),
  });

  const data = lpQuery.data;
  const isLoading = lpQuery.isLoading;
  const isError = lpQuery.isError;

  const likeList = data?.likes ?? [];

  const userLiked =
    currentUserId != null &&
    likeList.some((l: { userId: number }) => l.userId === currentUserId);

  const mutationLike = useMutation({
    mutationFn: async () => {
      return fetch(
        `${import.meta.env.VITE_API_BASE_URL}/v1/lps/${numericLpId}/likes`,
        {
          method: userLiked ? "DELETE" : "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["lp", numericLpId] });

      const previous = queryClient.getQueryData(["lp", numericLpId]);

      queryClient.setQueryData(["lp", numericLpId], (old: any) => {
        if (!old) return old;

        const updatedLikes = userLiked
          ? old.likes.filter((l: any) => l.userId !== currentUserId)
          : [...old.likes, { userId: currentUserId }];

        return {
          ...old,
          likes: updatedLikes,
        };
      });

      return { previous };
    },

    onError: (_, __, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["lp", numericLpId], ctx.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["lp", numericLpId] });
    },
  });

  // 🔥 이제 여기서부터는 조건부 렌더링만 수행 (Hook 없음)
  if (isLoading)
    return <div className="min-h-screen text-white px-6 py-10">로딩 중...</div>;

  if (isError || !data)
    return (
      <div className="min-h-screen text-red-400 px-6 py-10">
        LP 정보를 불러올 수 없습니다.
      </div>
    );

  const authorName = data.author?.name ?? "작성자 없음";

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <img src={data.thumbnail} className="w-72 h-72 rounded-2xl mb-6" />

      <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
      <p className="text-zinc-400">by {authorName}</p>

      <button
        onClick={() => mutationLike.mutate()}
        disabled={mutationLike.isPending}
        className={`mt-4 px-6 py-2 rounded-full font-semibold transition ${
          userLiked ? "bg-pink-700" : "bg-zinc-800 hover:bg-pink-500"
        }`}
      >
        ❤️ {likeList.length}
      </button>

      <div className="w-full max-w-2xl mt-12">
        <CommentsSection
          lpId={numericLpId}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
}
