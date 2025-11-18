import { useState, useEffect, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import FloatingButton from "../components/FloatingButton";
import Sidebar from "../components/Sidebar";
import SkeletonCard from "../components/SkeletonCard";
import LPCard from "../components/LPCard";
import { useThrottle } from "../hooks/useThrottle";
import { useSidebar } from "../hooks/useSidebar";

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
  const d = res.data.data;
  return {
    items: d.data as LP[],
    nextCursor: d.hasNext ? d.nextCursor : null,
    hasNext: d.hasNext,
  };
}

export default function HomePage() {
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const { open, closeSidebar, toggleSidebar } = useSidebar();

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

  const [scrollY, setScrollY] = useState(0);
  const throttledScrollY = useThrottle(scrollY, 800);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const bottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 300;

    if (bottom) {
      console.log("🔥 throttled fetchNextPage()");
      fetchNextPage();
    }
  }, [throttledScrollY, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const toggleOrder = useCallback(() => {
    setOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  }, []);

  const flatItems = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className="flex bg-black text-white min-h-screen">
      <Sidebar open={open} onClose={closeSidebar} />

      <main className="flex-1 px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={toggleSidebar}
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

          <button
            onClick={toggleOrder}
            className="px-3 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700"
          >
            {order === "desc" ? "최신순" : "오래된순"}
          </button>
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {isError && <p className="text-red-400">LP 목록 불러오기 오류</p>}

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

        <FloatingButton />
      </main>
    </div>
  );
}
