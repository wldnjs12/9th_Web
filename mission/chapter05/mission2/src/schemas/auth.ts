import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .email("올바른 이메일 형식을 입력해주세요.");

export const passwordSchema = z
  .string()
  .min(6, "비밀번호는 6자 이상이어야 합니다.")
  .max(50, "비밀번호는 50자 이하로 입력해주세요.");

export const nicknameSchema = z
  .string()
  .trim()
  .min(1, "닉네임을 입력해주세요.")
  .max(20, "닉네임은 20자 이하로 입력해주세요.");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export type LoginValues = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirm: z.string(),
  nickname: nicknameSchema,
}).refine((v) => v.password === v.confirm, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["confirm"],
});
export type SignupValues = z.infer<typeof signupSchema>;

export const signupStep1Schema = z.object({ email: emailSchema });
export const signupStep2Schema = z
  .object({
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirm"],
  });
export const signupStep3Schema = z.object({ nickname: nicknameSchema });

export type SignupStep1 = z.infer<typeof signupStep1Schema>;
export type SignupStep2 = z.infer<typeof signupStep2Schema>;
export type SignupStep3 = z.infer<typeof signupStep3Schema>;
export type SignupStep = 1 | 2 | 3;

