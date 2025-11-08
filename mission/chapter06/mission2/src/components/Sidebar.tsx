import { Link } from "react-router-dom";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* 어두운 배경 */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* 사이드바 */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-zinc-900 z-50 shadow-lg transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <h2 className="text-pink-500 font-bold text-2xl mb-8">DOLIGO</h2>

          <nav className="flex flex-col gap-4 text-lg text-zinc-300">
            <Link to="/" onClick={onClose} className="hover:text-pink-400">
              홈
            </Link>
            <Link to="/search" onClick={onClose} className="hover:text-pink-400">
              찾기
            </Link>
            <Link to="/mypage" onClick={onClose} className="hover:text-pink-400">
              마이페이지
            </Link>
          </nav>

          <button
            onClick={onClose}
            className="mt-auto text-sm text-zinc-500 hover:text-pink-400 transition"
          >
            닫기
          </button>
        </div>
      </aside>
    </>
  );
}
