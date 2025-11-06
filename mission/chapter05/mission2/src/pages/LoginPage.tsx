import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginValues } from "../schemas/auth";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const nav = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = (values: LoginValues) => {
    // 서버 연동 대신 mock
    const mockAccessToken = "mock_access_token";
    const mockRefreshToken = "mock_refresh_token";
    const expiresIn = 10; // 10초로 테스트

    login(mockAccessToken, mockRefreshToken, expiresIn);
    nav("/");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-screen bg-black text-white flex items-center justify-center"
    >
      <div className="p-6 border border-zinc-700 rounded-xl w-80">
        <h1 className="text-lg font-semibold mb-4">로그인</h1>

        <input
          {...register("email")}
          placeholder="이메일"
          className="w-full mb-3 bg-transparent border rounded px-3 py-2"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <input
          {...register("password")}
          type="password"
          placeholder="비밀번호"
          className="w-full mb-3 bg-transparent border rounded px-3 py-2"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <button
          type="submit"
          disabled={!isValid}
          className="w-full bg-pink-600 py-2 rounded mt-2 hover:bg-pink-500"
        >
          로그인
        </button>
      </div>
    </form>
  );
}
