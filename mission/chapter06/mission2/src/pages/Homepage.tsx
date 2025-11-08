import { useState, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import LPCard from "../components/LPCard";
import FloatingButton from "../components/FloatingButton";
import Sidebar from "../components/Sidebar";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import SkeletonCard from "../components/SkeletonCard";

type LP = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  createdAt: string;
  author: { name: string };
  likes: { id: number }[];
};

type Page = {
  items: LP[];
  nextCursor: number | null;
  hasNext: boolean;
};

async function fetchLps(params: { cursor?: number; order: "asc" | "desc" }): Promise<Page> {
  const { cursor = 0, order } = params;
  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/v1/lps?cursor=${cursor}&order=${order}`
  );
  const d = res.data.data; // { data: LP[], nextCursor, hasNext }
  return {
    items: d.data as LP[],
    nextCursor: d.hasNext ? d.nextCursor : null,
    hasNext: d.hasNext,
  };
}

export default function HomePage() {
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["lps", order],
    queryFn: ({ pageParam = 0 }) => fetchLps({ cursor: pageParam, order }),
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    initialPageParam: 0,
    staleTime: 60_000,
  });

  const loaderRef = useInfiniteScroll({
    enabled: !!hasNextPage && !isFetchingNextPage,
    onReachBottom: () => fetchNextPage(),
  });

  const toggleOrder = useCallback(() => {
    setOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  }, []);

  const flatItems = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className="flex bg-black text-white min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-white"
            aria-label="open sidebar"
          >
            <svg width="32" height="32" viewBox="0 0 48 48">
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
                d="M7.95 11.95h32m-32 12h32m-32 12h32"
              />
            </svg>
          </button>

          <div className="flex gap-2">
            <button
              onClick={toggleOrder}
              className="px-3 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700"
            >
              {order === "desc" ? "최신순" : "오래된순"}
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {isError && (
          <p className="text-red-400">LP 목록을 불러오는 중 오류가 발생했습니다.</p>
        )}

        {!isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {flatItems.map((lp) => (
              <LPCard key={lp.id} lp={lp} />
            ))}
          </div>
        )}

        {isFetchingNextPage && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        <div ref={loaderRef} className="h-12" />

        <FloatingButton />
      </main>
    </div>
  );
}
