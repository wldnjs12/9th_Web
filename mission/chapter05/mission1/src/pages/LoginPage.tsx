import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginValues } from "../schemas/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function LoginPage() {
  const nav = useNavigate();
  const tokenStore = useLocalStorage<string | null>("auth_token", null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, touchedFields },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    const token = "mock-token";
    tokenStore.setValue(token);
    nav("/");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-screen bg-black text-white flex items-start justify-center"
    >
      <div className="w-full max-w-sm mx-auto mt-16 px-4">
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => nav(-1)}
            className="rounded px-2 py-1 hover:bg-zinc-800"
          >
            &lt;
          </button>
          <h1 className="text-xl font-semibold">로그인</h1>
        </div>

        <div className="rounded-xl border border-zinc-700/70 bg-zinc-900/40 p-4">
          <button
            type="button"
            className="w-full border border-zinc-600 rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-zinc-800/40 transition"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt=""
              className="h-5"
            />
            구글 로그인
          </button>

          <div className="flex items-center gap-3 my-4">
            <span className="flex-1 h-px bg-zinc-700" />
            <span className="text-zinc-400 text-sm">OR</span>
            <span className="flex-1 h-px bg-zinc-700" />
          </div>

          <input
            {...register("email")}
            placeholder="이메일"
            type="email"
            autoComplete="email"
            className={`w-full bg-transparent border rounded-lg px-3 py-2 outline-none
            ${
              errors.email && touchedFields.email
                ? "border-red-500"
                : "border-zinc-600 focus:border-zinc-300"
            }`}
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
          )}

          <input
            {...register("password")}
            placeholder="비밀번호"
            type="password"
            autoComplete="current-password"
            className={`mt-4 w-full bg-transparent border rounded-lg px-3 py-2 outline-none
            ${
              errors.password && touchedFields.password
                ? "border-red-500"
                : "border-zinc-600 focus:border-zinc-300"
            }`}
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>
          )}

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="mt-6 w-full rounded-lg py-2 bg-pink-600 hover:bg-pink-500 transition disabled:bg-zinc-800 disabled:text-zinc-400"
          >
            로그인
          </button>
        </div>
      </div>
    </form>
  );
}
