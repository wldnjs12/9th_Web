import { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

// 유저 타입 정의 (확장 가능)
export type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
};

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, userData?: User | null) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { value: token, save, remove, ready } =
    useLocalStorage<string | null>("auth_token", null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  //로그인: 토큰 저장 + 유저 정보 저장
  const login = (t: string, userData?: User | null) => {
    save(t);
    if (userData) {
      localStorage.setItem("user_info", JSON.stringify(userData));
      setUser(userData);
    }
  };

  //로그아웃
  const logout = () => {
    remove();
    localStorage.removeItem("user_info");
    setUser(null);
    window.location.href = "/login";
  };

  //초기 로드 시 localStorage 또는 서버에서 유저 정보 복구
  useEffect(() => {
    const storedUser = localStorage.getItem("user_info");

    //localStorage에 유저 정보가 있을 경우
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("❌ 로컬 유저 정보 파싱 실패:", err);
        localStorage.removeItem("user_info");
      }
      setIsLoading(false);
      return;
    }

    //토큰이 있지만 로컬 정보가 없을 경우 → 서버 요청
    if (token) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.status && data?.data) {
            const userData: User = {
              id: data.data.id,
              name: data.data.name,
              email: data.data.email,
              avatar: data.data.avatar ?? null,
              bio: data.data.bio ?? null,
            };
            setUser(userData);
            localStorage.setItem("user_info", JSON.stringify(userData));
          }
        })
        .catch((err) => console.error("유저 정보 요청 실패:", err))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token]);

  if (!ready) return null;

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 커스텀 훅
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
