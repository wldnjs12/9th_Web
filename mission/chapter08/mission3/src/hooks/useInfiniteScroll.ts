import { useEffect, useRef } from "react";

type Opt = {
  enabled?: boolean;
  onReachBottom: () => void;
  rootMargin?: string; // 언제 불러올지 여백
  onIntersect?: () => void; // ✅ 추가
};

export default function useInfiniteScroll({
  enabled = true,
  onReachBottom,
  rootMargin = "400px",
}: Opt) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) onReachBottom();
      },
      { root: null, rootMargin }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [enabled, onReachBottom, rootMargin]);

  return ref;
}
