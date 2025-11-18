import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type SignupValues = {
  email: string;
  password: string;
  confirm: string;
  nickname: string;
};

type Step = 1 | 2 | 3;

const emailSchema = z.object({
  email: z.string().email("이메일 형식이 올바르지 않습니다."),
});

const pwSchema = z
  .object({
    password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
    confirm: z.string().min(8, "비밀번호 확인도 8자 이상 입력해주세요."),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "비밀번호가 일치하지 않습니다.",
  });

const nicknameSchema = z.object({
  nickname: z
    .string()
    .min(1, "닉네임을 입력해주세요.")
    .max(20, "닉네임은 20자 이하로 입력해주세요."),
});

export default function SignupPage() {
  const nav = useNavigate();

  const [step, setStep] = useState<Step>(1);
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);

  const resolver = useMemo(() => {
    if (step === 1) return zodResolver(emailSchema);
    if (step === 2) return zodResolver(pwSchema);
    return zodResolver(nicknameSchema);
  }, [step]);

  const {
    register,
    trigger,
    getValues,
    watch,
    getFieldState,
    clearErrors,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<SignupValues>({
    resolver,
    mode: "onChange",
    defaultValues: { email: "", password: "", confirm: "", nickname: "" },
  });

  useEffect(() => {
    clearErrors();
  }, [step, clearErrors]);

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

  const canNext =
    step === 1 ? step1Ready : step === 2 ? step2Ready : step3Ready;

  const fieldsByStep: Record<Step, (keyof SignupValues)[]> = {
    1: ["email"],
    2: ["password", "confirm"],
    3: ["nickname"],
  };

  // ✅ 회원가입 로직
  const onNext = async () => {
    const ok = await trigger(fieldsByStep[step]);
    if (!ok) return;

    if (step < 3) {
      setStep((s) => (s + 1) as Step);
    } else {
      const payload = {
        name: getValues("nickname"),
        email: getValues("email"),
        password: getValues("password"),
      };

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/v1/auth/signup`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        const data = await res.json();

        if (data.status) {
          // ✅ 닉네임을 localStorage에 저장
          localStorage.setItem("user_name", getValues("nickname"));
          alert("회원가입 성공! 로그인 페이지로 이동합니다.");
          nav("/login");
        } else {
          alert("회원가입 실패: " + data.message);
        }
      } catch (err) {
        alert("서버와 연결할 수 없습니다. 다시 시도해주세요.");
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-start justify-center">
      <div className="w-full max-w-sm mx-auto mt-16 px-4">
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() =>
              step === 1 ? nav(-1) : setStep((s) => (s - 1) as Step)
            }
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
                onClick={() =>
                  (window.location.href = `${import.meta.env.VITE_API_BASE_URL}/v1/auth/google/login`)
                }
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
                className={`w-full bg-transparent border rounded-lg px-3 py-2 outline-none ${
                  errors.email && touchedFields.email
                    ? "border-red-500"
                    : "border-zinc-600 focus:border-zinc-300"
                }`}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-3 text-sm text-zinc-300">
                ✉️ {getValues("email")}
              </div>

              <div className="relative">
                <input
                  {...register("password")}
                  type={showPw ? "text" : "password"}
                  placeholder="비밀번호"
                  autoComplete="new-password"
                  className={`w-full bg-transparent border rounded-lg px-3 py-2 pr-10 outline-none ${
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
                <p className="mt-2 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}

              <div className="relative mt-4">
                <input
                  {...register("confirm")}
                  type={showCf ? "text" : "password"}
                  placeholder="비밀번호를 다시 입력해주세요!"
                  autoComplete="new-password"
                  className={`w-full bg-transparent border rounded-lg px-3 py-2 pr-10 outline-none ${
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
                <p className="mt-2 text-sm text-red-500">
                  {errors.confirm.message}
                </p>
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
                className={`w-full bg-transparent border rounded-lg px-3 py-2 outline-none ${
                  errors.nickname && touchedFields.nickname
                    ? "border-red-500"
                    : "border-zinc-600 focus:border-zinc-300"
                }`}
              />
              {errors.nickname && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.nickname.message}
                </p>
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
