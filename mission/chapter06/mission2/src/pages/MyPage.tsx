import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLocalStorage } from "../hooks/useLocalStorage";
import LPCard from "../components/LPCard";

export default function MyPage() {
  const { value: token } = useLocalStorage<string | null>("auth_token", null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["myLps"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/v1/lps/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data.data;
    },
  });

  if (isLoading) return <p>로딩 중...</p>;
  if (isError) return <p>내 LP를 불러오지 못했습니다.</p>;

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h1 className="text-2xl mb-4">내가 올린 LP</h1>
      {data.length === 0 ? (
        <p>아직 업로드한 LP가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.map((lp: any) => (
            <LPCard key={lp.id} lp={lp} />
          ))}
        </div>
      )}
    </div>
  );
}
