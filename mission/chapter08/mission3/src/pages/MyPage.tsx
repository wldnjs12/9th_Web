import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useLocalStorage } from "../hooks/useLocalStorage";
import LPCard from "../components/LPCard";
import { updateProfile } from "../api/userApi";

export default function MyPage() {
  const { value: token } = useLocalStorage<string | null>("auth_token", null);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const queryClient = useQueryClient();

  const { data: myInfo } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/v1/users/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const d = res.data.data;
      setName(d.name || "");
      setBio(d.bio || "");
      return d;
    },
  });

  const { data: myLps } = useQuery({
    queryKey: ["myLps"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/v1/lps/user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.data.data;
    },
  });

  // ⭐ 닉네임 / bio 낙관적 업데이트 적용
  const mutation = useMutation({
    mutationFn: () => updateProfile(token!, name, bio, file ? URL.createObjectURL(file) : undefined),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["me"] });

      const previous = queryClient.getQueryData(["me"]);

      // Optimistic Update
      queryClient.setQueryData(["me"], (old: any) => ({
        ...old,
        name,
        bio,
      }));

      // NavBar 用
      localStorage.setItem("user_name", name);

      return { previous };
    },

    onError: (err, _, context) => {
      // 롤백
      if (context?.previous) {
        queryClient.setQueryData(["me"], context.previous);
      }
      alert("프로필 수정 중 오류가 발생했습니다.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  if (!myInfo) return <p>로딩 중...</p>;

  return (
    <div className="bg-black text-white min-h-screen p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-5 mb-8">
        <div className="relative w-28 h-28 rounded-full overflow-hidden bg-zinc-800">
          <img
            src={
              file
                ? URL.createObjectURL(file)
                : myInfo.profileImage || "/default-avatar.png"
            }
            alt="프로필"
            className="object-cover w-full h-full"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-transparent border-b border-zinc-600 text-xl outline-none focus:border-pink-500"
          />
          <input
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="자기소개를 입력하세요"
            className="bg-transparent border-b border-zinc-600 text-sm outline-none focus:border-pink-500"
          />

          <p className="text-zinc-400 text-sm">{myInfo.email}</p>

          <button
            onClick={() => mutation.mutate()}
            className="self-start mt-2 px-3 py-1 bg-pink-600 rounded hover:bg-pink-500"
          >
            저장
          </button>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-3">내 LP 목록</h2>
      {myLps?.length ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {myLps.map((lp: any) => (
            <LPCard key={lp.id} lp={lp} />
          ))}
        </div>
      ) : (
        <p>등록한 LP가 없습니다.</p>
      )}
    </div>
  );
}
