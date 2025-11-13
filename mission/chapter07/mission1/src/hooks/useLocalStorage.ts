import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      setValue(initial);
    } finally {
      setReady(true); // ✅ localStorage 읽기 완료 후 true
    }
  }, [key, initial]);

  const save = useCallback(
    (val: T) => {
      localStorage.setItem(key, JSON.stringify(val));
      setValue(val);
    },
    [key]
  );

  const remove = useCallback(() => {
    localStorage.removeItem(key);
    setValue(initial);
  }, [key, initial]);

  return { value, save, remove, ready };
}
