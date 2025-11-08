import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LPCard from "../components/LPCard";
import FloatingButton from "../components/FloatingButton";
import Sidebar from "../components/Sidebar";

type LP = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  createdAt: string;
  author: { name: string };
  likes: { id: number }[];
};

export default function HomePage() {
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["lps", order],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/v1/lps?order=${order}`
      );
      return res.data.data.data as LP[];
    },
    staleTime: 1000 * 60,
  });

  const toggleOrder = () => {
    setOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    refetch();
  };

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
            {/* 햄버거 아이콘 */}
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

        {isLoading && <p className="text-zinc-400">로딩 중...</p>}
        {isError && (
          <p className="text-red-400">LP 목록을 불러오는 중 오류가 발생했습니다.</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {data?.map((lp) => (
            <LPCard key={lp.id} lp={lp} />
          ))}
        </div>

        <FloatingButton />
      </main>
    </div>
  );
}
