import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const nav = useNavigate();
  const { isAuthenticated, userName, logout, isLoading } = useAuth();

  if (isLoading) return null;

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="h-[3px] w-full bg-purple-500" />
      <div className="w-full bg-black/95 border-b border-zinc-800">
        <nav className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          {/* 왼쪽: 햄버거 + 로고 */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="text-2xl text-zinc-300 hover:text-pink-500 transition"
            >
              ☰
            </button>
            <Link to="/" className="text-pink-500 font-bold text-lg">
              돌려돌려LP판
            </Link>
          </div>

          {/* 오른쪽: 로그인 / 로그아웃 */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-zinc-300">
                  {/* ✅ null 체크 */}
                  {userName
                    ? `${userName}님 반갑습니다.`
                    : "로그인 중입니다..."}
                </span>
                <button
                  onClick={handleLogout}
                  className="h-9 px-3 rounded-md text-sm font-medium bg-zinc-900 hover:bg-zinc-800 transition"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="h-9 px-3 rounded-md text-sm font-medium bg-zinc-900 hover:bg-zinc-800 transition"
                >
                  로그인
                </NavLink>
                <NavLink
                  to="/signup"
                  className="h-9 px-3 rounded-md text-sm font-medium bg-pink-600 hover:bg-pink-500 transition"
                >
                  회원가입
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
