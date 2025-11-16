import { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomeLayout from "./layouts/HomeLayout";
import HomePage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { useLocalStorage } from "./hooks/useLocalStorage";
import LPDetailPage from "./pages/LPDetailPage";
import LPCreationPage from "./pages/LPCreationPage";
import MyPage from "./pages/MyPage";
import SearchPage from "./pages/SearchPage";

function useGoogleAuthRedirect() {
  const { save } = useLocalStorage<string | null>("auth_token", null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");

    if (!accessToken) return;

    console.log("🔐 구글 로그인 토큰 감지:", accessToken);
    save(accessToken);

    // 사용자 정보 불러오기
    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();

        if (data?.status && data?.data?.name) {
          console.log("✅ 구글 로그인 이름:", data.data.name);
          localStorage.setItem("user_name", data.data.name);

          // ✅ URL 정리 (쿼리스트링 제거)
          window.history.replaceState({}, document.title, "/");
        } else {
          console.warn("⚠️ 사용자 이름을 불러오지 못했습니다:", data);
        }
      } catch (err) {
        console.error("❌ /v1/users/me 요청 실패:", err);
      }
    };

    fetchUser();
  }, [save]);
}

/* ✅ React Query 클라이언트 생성 */
const queryClient = new QueryClient();

/* ✅ 라우터 정의 */
const router = createBrowserRouter([
  {
    element: <HomeLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "/lps/:lpId", element: <LPDetailPage /> },
          { path: "/create", element: <LPCreationPage /> },
          { path: "/mypage", element: <MyPage /> },
          { path: "/search", element: <SearchPage /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

/* ✅ 최종 App 컴포넌트 */
export default function App() {
  useGoogleAuthRedirect(); // 로그인 리디렉션 처리

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
