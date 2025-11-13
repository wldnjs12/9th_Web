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
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["lpComments", lpId, order],
    queryFn: ({ pageParam = 0 }) =>
      getComments(lpId, pageParam, 10, order, token),
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    initialPageParam: 0,
    enabled: !!token,
  });

  const loaderRef = useInfiniteScroll({
    enabled: !!hasNextPage && !isFetchingNextPage,
    onReachBottom: () => fetchNextPage(),
  });

  const mutationCreate = useMutation({
    mutationFn: (content: string) => {
      if (!token) throw new Error("need-login");
      return createComment(lpId, content, token);
    },
    onSuccess: () => {
      setText("");
      qc.invalidateQueries({ queryKey: ["lpComments", lpId, order] });
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: ({ id, content }: { id: number; content: string }) => {
      if (!token) throw new Error("need-login");
      return updateComment(lpId, id, content, token);
    },
    onSuccess: () => {
      setEditingId(null);
      setEditValue("");
      qc.invalidateQueries({ queryKey: ["lpComments", lpId, order] });
    },
  });

  const mutationDelete = useMutation({
    mutationFn: (id: number) => {
      if (!token) throw new Error("need-login");
      return deleteComment(lpId, id, token);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lpComments", lpId, order] });
    },
  });

  const flat = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  );

  const showError = isError && flat.length === 0;

  if (!token) {
    return (
      <section className="max-w-2xl w-full mt-10">
        <h3 className="text-lg font-semibold mb-2">댓글</h3>
        <p className="text-sm text-zinc-400">
          로그인 후 댓글을 확인하고 작성할 수 있습니다.
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-2xl w-full mt-10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">댓글</h3>
        <button
          onClick={() => setOrder((o) => (o === "desc" ? "asc" : "desc"))}
          className="px-3 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-sm"
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
            onClick={() => text.trim() && mutationCreate.mutate(text.trim())}
            disabled={!text.trim() || mutationCreate.isPending}
            className="px-3 py-1 rounded-md bg-pink-600 hover:bg-pink-500 disabled:bg-zinc-700 text-sm"
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

      {showError && (
        <p className="text-red-400 text-sm">댓글 불러오기 오류가 발생했습니다.</p>
      )}

      {!isLoading && flat.length > 0 && (
        <ul className="space-y-3">
          {flat.map((c: any) => {
            const mine = c.authorId === currentUserId;

            return (
              <li key={c.id} className="p-3 rounded-lg bg-zinc-900/70 relative">
                <div className="flex items-center gap-2 mb-1">
                  {/* 아바타 */}
                  <img
                    src={c.author?.avatar ?? "/default_avatar.png"}
                    className="w-7 h-7 rounded-full object-cover"
                  />

                  {/* 작성자 */}
                  <div className="text-sm text-zinc-300">
                    {c.author?.name ?? "익명"}
                  </div>

                  {/* 날짜 */}
                  <div className="ml-auto text-xs text-zinc-500">
                    {new Date(c.createdAt).toLocaleString()}
                  </div>

                  {/* … 메뉴 (본인 댓글만) */}
                  {mine && (
                    <details className="relative">
                      <summary className="list-none cursor-pointer px-2 select-none">
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
                          className="block w-full text-left px-3 py-1 hover:bg-zinc-700 text-red-400 text-sm"
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
                      className="w-full bg-zinc-800 p-2 rounded-md border border-zinc-700 text-sm"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() =>
                          mutationUpdate.mutate({
                            id: c.id,
                            content: editValue,
                          })
                        }
                        className="px-3 py-1 bg-pink-600 rounded-md text-sm"
                      >
                        저장
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditValue("");
                        }}
                        className="px-3 py-1 bg-zinc-700 rounded-md text-sm"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-zinc-100 whitespace-pre-wrap text-sm">
                    {c.content}
                  </p>
                )}
              </li>
            );
          })}
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
