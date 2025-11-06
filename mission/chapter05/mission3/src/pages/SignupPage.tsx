import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signupSchema, type SignupValues } from "../schemas/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";

type Step = 1 | 2 | 3;

export default function SignupPage() {
  const nav = useNavigate();
  const token = useLocalStorage<string | null>("auth_token", null);

  const [step, setStep] = useState<Step>(1);
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);

const {
    register,
    trigger,
    getValues,
    watch,
    getFieldState,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema), // 전체 스키마 고정
    mode: "onChange",
    defaultValues: { email: "", password: "", confirm: "", nickname: "" },
  });
  
  const email = watch("email");
  const password = watch("password");
  const confirm = watch("confirm");
  const nickname = watch("nickname");
  
  const step1Ready = !!email && !getFieldState("email").invalid;
  const step2Ready =
    !!password &&
    !!confirm &&
    !getFieldState("password").invalid &&
    !getFieldState("confirm").invalid;
  const step3Ready = !!nickname && !getFieldState("nickname").invalid;
  
  const canNext = step === 1 ? step1Ready : step === 2 ? step2Ready : step3Ready;
  
  const fieldsByStep: Record<Step, (keyof SignupValues)[]> = {
    1: ["email"],
    2: ["password", "confirm"],
    3: ["nickname"],
  };
  
  const onNext = async () => {
    const ok = await trigger(fieldsByStep[step], { shouldFocus: true });
    if (!ok) return;
    if (step < 3) setStep((s) => (s + 1) as Step);
    else {
      token.setValue("mock-signup-token");
      nav("/");
    }
  };
  

  return (
    <div className="min-h-screen bg-black text-white flex items-start justify-center">
      <div className="w-full max-w-sm mx-auto mt-16 px-4">
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => (step === 1 ? nav(-1) : setStep((s) => (s - 1) as Step))}
            className="rounded px-2 py-1 hover:bg-zinc-800"
          >
            &lt;
          </button>
          <h1 className="text-xl font-semibold">회원가입</h1>
        </div>

        <div className="rounded-xl border border-zinc-700/70 bg-zinc-900/40 p-4">
          {step === 1 && (
            <>
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
                type="email"
                placeholder="이메일"
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
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-3 text-sm text-zinc-300">✉️ {getValues("email")}</div>

              <div className="relative">
                <input
                  {...register("password")}
                  type={showPw ? "text" : "password"}
                  placeholder="비밀번호"
                  autoComplete="new-password"
                  className={`w-full bg-transparent border rounded-lg px-3 py-2 pr-10 outline-none
                  ${
                    errors.password && touchedFields.password
                      ? "border-red-500"
                      : "border-zinc-600 focus:border-zinc-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300 text-sm"
                >
                  {showPw ? "👁️" : "🙈"}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>
              )}

              <div className="relative mt-4">
                <input
                  {...register("confirm")}
                  type={showCf ? "text" : "password"}
                  placeholder="비밀번호를 다시 한 번 입력해주세요!"
                  autoComplete="new-password"
                  className={`w-full bg-transparent border rounded-lg px-3 py-2 pr-10 outline-none
                  ${
                    errors.confirm && touchedFields.confirm
                      ? "border-red-500"
                      : "border-zinc-600 focus:border-zinc-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCf((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300 text-sm"
                >
                  {showCf ? "👁️" : "🙈"}
                </button>
              </div>
              {errors.confirm && (
                <p className="mt-2 text-sm text-red-500">{errors.confirm.message}</p>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-zinc-800/70 grid place-items-center text-4xl">
                🧑
              </div>
              <input
                {...register("nickname")}
                type="text"
                placeholder="닉네임"
                maxLength={20}
                className={`w-full bg-transparent border rounded-lg px-3 py-2 outline-none
                ${
                  errors.nickname && touchedFields.nickname
                    ? "border-red-500"
                    : "border-zinc-600 focus:border-zinc-300"
                }`}
              />
              {errors.nickname && (
                <p className="mt-2 text-sm text-red-500">{errors.nickname.message}</p>
              )}
            </>
          )}

          <button
            type="button"
            onClick={onNext}
            disabled={!canNext || isSubmitting}
            className="mt-4 w-full rounded-lg py-2 bg-pink-600 hover:bg-pink-500 transition disabled:bg-zinc-800 disabled:text-zinc-400"
          >
            {step === 3 ? "회원가입 완료" : "다음"}
          </button>
        </div>
      </div>
    </div>
  );
}
