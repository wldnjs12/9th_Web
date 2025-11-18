import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import LPCard from "../components/LPCard";
import { useDebounce } from "../hooks/useDebounce";
import { useThrottle } from "../hooks/useThrottle";
import SkeletonCard from "../components/SkeletonCard";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/v1/lps?cursor=${pageParam}&search=${debouncedQuery}`
      );
      return res.data.data; // { data, nextCursor, hasNext }
    },
    getNextPageParam: (last) =>
      last.hasNext ? last.nextCursor : undefined,
    enabled: debouncedQuery.trim().length > 0,
    initialPageParam: 0,
  });

  // throttle scroll
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
      console.log("🔥 throttled search fetchNextPage()");
      fetchNextPage();
    }
  }, [throttledScrollY]);

  const flatItems = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <div className="bg-black text-white min-h-screen p-6">
      {/* 검색창 */}
      <div className="flex justify-center items-center gap-4 mb-10">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="검색어를 입력하세요"
          className="w-[600px] max-w-[90%] bg-zinc-800 rounded-lg px-4 py-3 text-lg"
        />
        <button
          onClick={() => setQuery(query)}
          className="bg-pink-600 hover:bg-pink-500 px-6 py-3 rounded-lg text-lg"
        >
          검색
        </button>
      </div>

      {isLoading && <p className="text-center">검색 중...</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {flatItems.map((lp) => (
          <LPCard key={lp.id} lp={lp} />
        ))}
      </div>

      {isFetchingNextPage && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}
    </div>
  );
}
