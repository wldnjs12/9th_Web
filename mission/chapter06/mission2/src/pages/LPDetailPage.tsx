import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useState, useEffect, useMemo } from "react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import SkeletonComment from "../components/SkeletonComment";
import { getComments, createComment } from "../api/comments";

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

      <CommentsSection lpId={Number(lpId)} />
    </div>
  );
}

function CommentsSection({ lpId }: { lpId: number }) {
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const { value: token } = useLocalStorage<string | null>("auth_token", null);
  const [text, setText] = useState("");
  const qc = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["lpComments", lpId, order],
    queryFn: ({ pageParam = 0 }) => getComments(lpId, pageParam, 10, order),
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    initialPageParam: 0, 
  });

  const loaderRef = useInfiniteScroll({
    enabled: !!hasNextPage && !isFetchingNextPage,
    onReachBottom: () => fetchNextPage(),
  });
  


  const mutation = useMutation({
    mutationFn: (content: string) => {
      if (!token) throw new Error("need-login");
      return createComment(lpId, content, token);
    },
    onSuccess: () => {
      setText("");
      qc.invalidateQueries({ queryKey: ["lpComments", lpId] });
    },
  });

  const flat = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  return (
    <section className="mt-10 max-w-2xl w-full mx-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">댓글</h3>
        <button
          onClick={() => setOrder((p) => (p === "desc" ? "asc" : "desc"))}
          className="px-3 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700"
        >
          {order === "desc" ? "최신순" : "오래된순"}
        </button>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="댓글을 입력하세요"
          className="w-full bg-transparent resize-none outline-none p-2 rounded-md border border-zinc-800 focus:border-pink-500"
          rows={3}
        />
        <div className="mt-2 flex justify-end">
          <button
            onClick={() => text.trim() && mutation.mutate(text.trim())}
            disabled={mutation.isPending || !text.trim()}
            className="px-3 py-1 rounded-md bg-pink-600 hover:bg-pink-500 disabled:bg-zinc-800"
          >
            등록
          </button>
        </div>
        {mutation.isError && (
          <p className="mt-2 text-sm text-red-400">
            댓글 등록 중 오류가 발생했습니다.
          </p>
        )}
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonComment key={i} />
          ))}
        </div>
      )}
      {isError && <p className="text-red-400">댓글 불러오기 오류</p>}

      {!isLoading && (
        <ul className="space-y-3">
          {flat.map((c: any) => (
            <li key={c.id} className="p-3 rounded-lg bg-zinc-900/70">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-full bg-pink-600 grid place-items-center text-xs">
                  귤
                </div>
                <div className="text-sm text-zinc-300">
                  {c.author?.name ?? "익명"}
                </div>
                <div className="ml-auto text-xs text-zinc-500">
                  {new Date(c.createdAt).toLocaleString()}
                </div>
              </div>
              <p className="text-zinc-100 whitespace-pre-wrap">{c.content}</p>
            </li>
          ))}
        </ul>
      )}

      {isFetchingNextPage && (
        <div className="space-y-3 mt-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonComment key={i} />
          ))}
        </div>
      )}

      <div ref={loaderRef} className="h-10" />
    </section>
  );
}
