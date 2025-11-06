import { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

type AuthContextType = {
  token: string | null;
  login: (token: string, refreshToken: string, expiresIn?: number) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { value: token, setValue, remove } = useLocalStorage<string | null>("auth_token", null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    setIsAuthenticated(!!token);
  }, [token]);

  const login = (t: string, refresh: string, expiresIn = 10) => {
    const expireAt = Date.now() + expiresIn * 1000;
    localStorage.setItem("auth_expire", expireAt.toString());
    localStorage.setItem("refresh_token", refresh);

    setValue(t);
    setIsAuthenticated(true);
  };

  const logout = () => {
    remove();
    localStorage.removeItem("auth_expire");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const expire = localStorage.getItem("auth_expire");
      if (expire && Date.now() > Number(expire)) {
        logout();
        alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요!");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
