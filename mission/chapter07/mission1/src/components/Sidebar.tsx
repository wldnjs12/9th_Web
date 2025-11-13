import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useMutation } from "@tanstack/react-query";
import { deleteAccount } from "../api/userapi";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { value: token, remove: clearToken } = useLocalStorage("auth_token", null);

  const [showConfirm, setShowConfirm] = useState(false);

  const mutationWithdraw = useMutation({
    mutationFn: () => deleteAccount(token!), 

    onSuccess: () => {
      alert("탈퇴가 완료되었습니다.");
      clearToken();
      navigate("/login");
    },

    onError: (err: any) => {
      console.error("🔴 탈퇴 실패:", err.response?.data || err);
      alert("탈퇴 중 오류가 발생했습니다.");
    },
  });

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-zinc-900 z-50 shadow-lg transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <h2 className="text-pink-500 font-bold text-2xl mb-8">DOLIGO</h2>

          <nav className="flex flex-col gap-4 text-lg text-zinc-300">
            <Link to="/" onClick={onClose} className="hover:text-pink-400">홈</Link>
            <Link to="/search" onClick={onClose} className="hover:text-pink-400">찾기</Link>
            <Link to="/mypage" onClick={onClose} className="hover:text-pink-400">마이페이지</Link>
          </nav>

          <button
            onClick={() => setShowConfirm(true)}
            className="mt-auto mb-2 text-sm text-zinc-400 hover:text-red-500 transition text-left"
          >
            탈퇴하기
          </button>

          <button
            onClick={onClose}
            className="text-sm text-zinc-500 hover:text-pink-400 transition text-left"
          >
            닫기
          </button>
        </div>
      </aside>

      {showConfirm && (
        <div
          onClick={() => setShowConfirm(false)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 p-6 rounded-2xl text-center w-[90%] max-w-sm"
          >
            <p className="text-lg font-semibold text-white mb-4">
              정말 탈퇴하시겠습니까?
            </p>

            <div className="flex justify-around">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600"
              >
                취소
              </button>

              <button
                onClick={() => mutationWithdraw.mutate()}
                disabled={mutationWithdraw.isPending}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-500"
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
