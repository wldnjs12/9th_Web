import { useState, useMemo } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../api/comments";
import SkeletonComment from "../components/SkeletonComment";

export default function CommentsSection({
  lpId,
  currentUserId,
}: {
  lpId: number;
  currentUserId: number | null;
}) {
  const { value: token } = useLocalStorage<string | null>("auth_token", null);
  const qc = useQueryClient();

  const [text, setText] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["lpComments", lpId, order],
    queryFn: ({ pageParam = 0 }) =>
      getComments(lpId, pageParam, 10, order, token),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: 0,
    retry: false,
  });

  const loaderRef = useInfiniteScroll({
    enabled: !!hasNextPage && !isFetchingNextPage,
    onReachBottom: () => fetchNextPage(),
  });

  const flat = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  const mutationCreate = useMutation({
    mutationFn: (content: string) =>
      createComment(lpId, content, token as string),
    onSuccess: () => {
      setText("");
      qc.invalidateQueries({ queryKey: ["lpComments", lpId] });
    },
    onError: (err: any) => {
      console.error("댓글 생성 실패:", err.response?.data || err);
      alert("댓글 등록 중 오류가 발생했습니다.");
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: ({ id, content }: { id: number; content: string }) =>
      updateComment(lpId, id, content, token as string),
    onSuccess: () => {
      setEditingId(null);
      setEditValue("");
      qc.invalidateQueries({ queryKey: ["lpComments", lpId] });
    },
    onError: (err: any) => {
      console.error("댓글 수정 실패:", err.response?.data || err);
      alert("댓글 수정 중 오류가 발생했습니다.");
    },
  });

  const mutationDelete = useMutation({
    mutationFn: (id: number) => deleteComment(lpId, id, token as string),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lpComments", lpId] });
    },
    onError: (err: any) => {
      console.error("댓글 삭제 실패:", err.response?.data || err);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    },
  });

  return (
    <section className="max-w-2xl w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">댓글</h3>
        <button
          onClick={() => setOrder((o) => (o === "desc" ? "asc" : "desc"))}
          className="px-3 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700"
        >
          {order === "desc" ? "최신순" : "오래된순"}
        </button>
      </div>

      {!token && (
        <p className="text-sm text-zinc-400 mb-2">
          로그인 후 댓글을 작성하고 볼 수 있습니다.
        </p>
      )}

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
            onClick={() => {
              if (!token) return alert("로그인이 필요합니다.");
              if (!text.trim()) return;
              mutationCreate.mutate(text.trim());
            }}
            disabled={!text.trim() || mutationCreate.isPending}
            className="px-3 py-1 rounded-md bg-pink-600 hover:bg-pink-500 disabled:bg-zinc-700"
          >
            {mutationCreate.isPending ? "등록 중..." : "등록"}
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonComment key={i} />
          ))}
        </div>
      )}

      {!isLoading && (
        <ul className="space-y-3">
          {flat.map((c: any) => {
            const mine = c.authorId === currentUserId;

            return (
              <li key={c.id} className="p-3 rounded-lg bg-zinc-900/70 relative">
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src={c.author?.avatar ?? "/default_avatar.png"}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div className="text-sm text-zinc-300">{c.author?.name}</div>
                  <div className="ml-auto text-xs text-zinc-500">
                    {new Date(c.createdAt).toLocaleString()}
                  </div>

                  {mine && (
                    <details className="relative ml-2">
                      <summary className="list-none cursor-pointer px-2">
                        ⋯
                      </summary>
                      <div className="absolute right-0 mt-1 w-24 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg z-10">
                        <button
                          onClick={() => {
                            setEditingId(c.id);
                            setEditValue(c.content);
                          }}
                          className="block w-full text-left px-3 py-1 hover:bg-zinc-700 text-sm"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => mutationDelete.mutate(c.id)}
                          className="block w-full text-left px-3 py-1 hover:bg-zinc-700 text-sm text-red-400"
                        >
                          삭제
                        </button>
                      </div>
                    </details>
                  )}
                </div>

                {editingId === c.id ? (
                  <div>
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full bg-zinc-800 p-2 rounded-md border border-zinc-700"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() =>
                          mutationUpdate.mutate({
                            id: c.id,
                            content: editValue,
                          })
                        }
                        className="px-3 py-1 bg-pink-600 rounded-md"
                      >
                        저장
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditValue("");
                        }}
                        className="px-3 py-1 bg-zinc-700 rounded-md"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-zinc-100 whitespace-pre-wrap">
                    {c.content}
                  </p>
                )}
              </li>
            );
          })}

          {flat.length === 0 && (
            <li className="text-sm text-zinc-500">아직 댓글이 없습니다.</li>
          )}
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
