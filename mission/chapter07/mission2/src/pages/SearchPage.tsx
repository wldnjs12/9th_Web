import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LPCard from "../components/LPCard";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["search", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/v1/lps?search=${searchTerm}`
      );
      return res.data.data.data;
    },
    enabled: !!searchTerm,
  });

  const handleSearch = () => {
    setSearchTerm(query);
  };

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <div className="flex gap-2 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="검색어를 입력하세요"
          className="bg-zinc-800 rounded p-2 w-1/2"
        />
        <button
          onClick={handleSearch}
          className="bg-pink-600 hover:bg-pink-500 px-3 py-1 rounded"
        >
          검색
        </button>
      </div>

      {isLoading && <p>검색 중...</p>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data?.map((lp: any) => (
          <LPCard key={lp.id} lp={lp} />
        ))}
      </div>
    </div>
  );
}
