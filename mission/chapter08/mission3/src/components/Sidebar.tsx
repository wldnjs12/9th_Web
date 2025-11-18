import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useMutation } from "@tanstack/react-query";
import { deleteAccount } from "../api/userApi";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { value: token, remove: clearToken } = useLocalStorage(
    "auth_token",
    null
  );

  const [showConfirm, setShowConfirm] = useState(false);
  const [query, setQuery] = useState("");

  // 🔥 ESC → 사이드바 닫기
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        console.log("ESC detected inside Sidebar");
        onClose();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const mutationWithdraw = useMutation({
    mutationFn: () => {
      if (!token) throw new Error("토큰 없음 — 로그인 다시 필요!");
      return deleteAccount(token);
    },
    onSuccess: () => {
      alert("탈퇴가 완료되었습니다.");
      clearToken();
      navigate("/login");
    },
    onError: () => {
      alert("탈퇴 중 오류가 발생했습니다.");
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?query=${query}`);
    onClose();
  };

  return (
    <>
      {/* 오버레이 */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 z-[5000] transition-opacity duration-300 
          ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* 사이드바 */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-zinc-900 z-[6000] shadow-xl 
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6 flex flex-col h-full">
          <h2 className="text-pink-500 font-bold text-2xl mb-6">DOLIGO</h2>

          {/* 검색 */}
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.stopPropagation();
                  onClose();
                }
              }}
              placeholder="LP 검색..."
              className="w-full px-3 py-2 mb-6 bg-zinc-800 text-zinc-200 rounded-md focus:outline-none"
            />
          </form>

          {/* 메뉴 */}
          <nav className="flex flex-col gap-4 text-lg text-zinc-300">
            <Link to="/" onClick={onClose}>홈</Link>
            <Link to="/search" onClick={onClose}>찾기</Link>
            <Link to="/mypage" onClick={onClose}>마이페이지</Link>
          </nav>

          {/* 탈퇴하기 */}
          <button
            onClick={() => setShowConfirm(true)}
            className="mt-auto text-sm text-zinc-400 hover:text-red-500"
          >
            탈퇴하기
          </button>

          <button
            onClick={onClose}
            className="text-sm text-zinc-500 hover:text-pink-400 mt-2"
          >
            닫기
          </button>
        </div>
      </aside>

      {/* 탈퇴 모달 */}
      {showConfirm && (
        <div
          onClick={() => setShowConfirm(false)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 p-6 rounded-xl text-center w-[90%] max-w-sm"
          >
            <p className="text-lg mb-4">정말 탈퇴하시겠습니까?</p>

            <div className="flex justify-around">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-zinc-700 rounded"
              >
                취소
              </button>

              <button
                onClick={() => mutationWithdraw.mutate()}
                disabled={mutationWithdraw.isPending}
                className="px-4 py-2 bg-red-600 rounded"
              >
                {mutationWithdraw.isPending ? "처리 중..." : "탈퇴"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
