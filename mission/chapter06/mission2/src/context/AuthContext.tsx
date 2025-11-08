import { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  userName: string | null;
  login: (token: string, name?: string | null) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { value: token, save, remove, ready } =
    useLocalStorage<string | null>("auth_token", null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ 로그인 시 토큰 저장 + 이름도 저장
  const login = (t: string, name?: string | null) => {
    save(t);
    if (name) {
      localStorage.setItem("user_name", name);
      setUserName(name);
    }
  };

  // ✅ 로그아웃 시 초기화
  const logout = () => {
    remove();
    localStorage.removeItem("user_name");
    setUserName(null);
    window.location.href = "/login";
  };

  // ✅ 초기 로딩 시 localStorage와 서버에서 유저정보 가져오기
  useEffect(() => {
    const storedName = localStorage.getItem("user_name");
    if (storedName) {
      console.log("📦 localStorage에서 이름 로드:", storedName);
      setUserName(storedName);
      setIsLoading(false);
    } else if (token) {
      console.log("🔍 토큰 감지됨, 서버에서 유저정보 요청");
      fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.status && data?.data?.name) {
            localStorage.setItem("user_name", data.data.name);
            setUserName(data.data.name);
          }
        })
        .catch((err) => console.error("❌ 유저 정보 요청 실패:", err))
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
        userName,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
