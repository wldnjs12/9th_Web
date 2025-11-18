import { ZodError } from "zod";
import {
  signupStep1Schema,
  signupStep2Schema,
  signupStep3Schema,
  type SignupStep,
  type SignupValues,
} from "../schemas/auth";

export function makeSignupValidator(step: SignupStep) {
  return (values: SignupValues): Record<keyof SignupValues, string> => {
    const errors: Record<keyof SignupValues, string> = {
      email: "",
      password: "",
      confirm: "",
      nickname: "",
    };

    let result:
      | ReturnType<typeof signupStep1Schema.safeParse>
      | ReturnType<typeof signupStep2Schema.safeParse>
      | ReturnType<typeof signupStep3Schema.safeParse>
      | undefined;

    if (step === 1) result = signupStep1Schema.safeParse({ email: values.email });
    if (step === 2)
      result = signupStep2Schema.safeParse({
        password: values.password,
        confirm: values.confirm,
      });
    if (step === 3)
      result = signupStep3Schema.safeParse({ nickname: values.nickname });

    if (result && !result.success) {
      const zodError = result.error;
      zodError.issues.forEach((err) => {
        const field = err.path[0] as keyof SignupValues;
        errors[field] = err.message;
      });
    }

    return errors;
  };
}
