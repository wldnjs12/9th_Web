import { useEffect, useRef, useState } from "react";

export function useThrottle<T>(value: T, interval: number = 1000) {
  const [throttledValue, setThrottledValue] = useState(value);

  const lastExecuted = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const now = Date.now();
    const remaining = interval - (now - lastExecuted.current);

    if (remaining <= 0) {
      setThrottledValue(value);
      lastExecuted.current = now;
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setThrottledValue(value);
        lastExecuted.current = Date.now();
      }, remaining);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, interval]);

  return throttledValue;
}
