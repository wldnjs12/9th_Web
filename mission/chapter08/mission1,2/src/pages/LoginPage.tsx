import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginValues } from "../schemas/auth";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function LoginPage() {
  const nav = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  // ✅ 구글 로그인 콜백 처리
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");

    if (accessToken) {
      console.log("✅ 구글 로그인 토큰 감지:", accessToken);

      fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/users/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          const name =
            data?.data?.user?.name ||
            data?.data?.name ||
            null;

          if (name) {
            login(accessToken, name);
            window.history.replaceState({}, document.title, "/");
            window.location.reload();
          }
        })
        .catch((err) => console.error("❌ 구글 로그인 실패:", err));
    }
  }, [login]);

  // ✅ 일반 로그인 담당 함수
  const onSubmit = async (values: LoginValues) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/v1/auth/signin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      const data = await res.json();

      if (data?.status && data?.data?.accessToken) {
        const accessToken = data.data.accessToken;

        const userName =
          data.data.user?.name ||
          data.data.name ||
          null;

        console.log("🎉 로그인 성공 - 저장되는 토큰:", accessToken);
        console.log("🎉 로그인 성공 - 저장되는 이름:", userName);

        login(accessToken, userName);
        window.location.href = "/";
      } else {
        alert(
          "로그인 실패: " +
            (data.message || "아이디/비밀번호를 확인해주세요.")
        );
      }
    } catch (err) {
      console.error("로그인 에러:", err);
      alert("로그인 중 문제가 발생했습니다.");
    }
  };

  // ✅ 구글 로그인 페이지로 redirect
  const handleGoogleLogin = () => {
    const base = import.meta.env.VITE_API_BASE_URL;
    if (!base) {
      alert("API BASE URL이 설정되지 않았습니다. .env 파일을 확인하세요.");
      return;
    }
    window.location.href = `${base}/v1/auth/google/login`;
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white flex justify-center items-center"
    >
      <div className="w-full max-w-sm border border-zinc-700/70 rounded-2xl bg-zinc-900/50 p-6 shadow-lg shadow-pink-500/10">
        <h1 className="text-2xl font-semibold text-center mb-6">
          로그인하기
        </h1>

        {/* 🔥 구글 로그인 버튼 */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full border border-zinc-600 rounded-lg py-2 mb-4 flex items-center justify-center gap-2 hover:bg-zinc-800/40 transition"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="h-5"
          />
          구글로 로그인
        </button>

        {/* OR 구분선 */}
        <div className="flex items-center gap-3 my-4">
          <span className="flex-1 h-px bg-zinc-700" />
          <span className="text-zinc-400 text-sm">OR</span>
          <span className="flex-1 h-px bg-zinc-700" />
        </div>

        {/* 이메일 */}
        <input
          {...register("email")}
          placeholder="이메일"
          className={`w-full mb-3 bg-transparent border rounded-lg px-3 py-2 outline-none ${
            errors.email
              ? "border-red-500"
              : "border-zinc-600 focus:border-pink-500"
          }`}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}

        {/* 비밀번호 */}
        <input
          {...register("password")}
          type="password"
          placeholder="비밀번호"
          className={`w-full mb-3 bg-transparent border rounded-lg px-3 py-2 outline-none ${
            errors.password
              ? "border-red-500"
              : "border-zinc-600 focus:border-pink-500"
          }`}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}

        {/* 로그인 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg py-2 mt-4 bg-pink-600 hover:bg-pink-500 transition font-semibold"
        >
          {isSubmitting ? "로그인 중..." : "로그인"}
        </button>

        {/* 회원가입 이동 버튼 */}
        <button
          type="button"
          onClick={() => nav("/signup")}
          className="mt-3 w-full rounded-lg py-2 border border-zinc-600 hover:bg-zinc-800/40 transition"
        >
          회원가입
        </button>
      </div>
    </form>
  );
}
