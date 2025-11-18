import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";

export interface UseFormProps<T> {
  initialValue: T;
  validate: (values: T) => Record<keyof T, string>;
}

function useForms<T>({ initialValue, validate }: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValue);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(
    {} as Record<keyof T, boolean>
  );
  const [errors, setErrors] = useState<Record<keyof T, string>>(
    {} as Record<keyof T, string>
  );

  const handleChange = (name: keyof T, text: string) => {
    setValues((prev) => ({ ...(prev as any), [name]: text } as T));
  };

  const handleBlur = (name: keyof T) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const getInputProps = (name: keyof T) => {
    const value = (values[name] ?? "") as string;

    const onChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      handleChange(name, e.target.value);
    };

    const onBlur = () => handleBlur(name);

    return { value, onChange, onBlur, name: String(name) };
  };

  useEffect(() => {
    setErrors(validate(values));
  }, []);

  useEffect(() => {
    setErrors(validate(values));
  }, [values, validate]);

  return { values, errors, touched, getInputProps };
}

export default useForms;
