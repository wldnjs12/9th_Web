import { useEffect, useMemo, useRef, useState } from 'react';

interface CacheEntry<T> {
  data: T;
  lastFetched: number;
  gcTimer?: number;
}

const STALE_TIME = 5 * 60 * 1000; 
const GC_TIME = 10 * 60 * 1000;   
const MAX_RETRIES = 3;          
const INITIAL_RETRY_DELAY = 1000; 

export const useCustomFetch = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const storageKey = useMemo(() => url, [url]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    setIsError(false);

    const fetchData = async (retryCount = 0) => {
      const now = Date.now();
      const cached = localStorage.getItem(storageKey);

      if (cached) {
        try {
          const cachedData: CacheEntry<T> = JSON.parse(cached);

          if (now - cachedData.lastFetched < STALE_TIME) {
            console.log(`[Cache Hit] Using fresh data for ${url}`);
            setData(cachedData.data);
            setIsPending(false);
            return;
          }

          console.log(`[Cache Stale] Using stale data & refetching for ${url}`);
          setData(cachedData.data);
        } catch {
          localStorage.removeItem(storageKey);
        }
      }

      setIsPending(true);

      try {
        const response = await fetch(url, {
          signal: abortControllerRef.current?.signal,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const newData: T = await response.json();
        setData(newData);

        const cacheEntry: CacheEntry<T> = {
          data: newData,
          lastFetched: Date.now(),
        };
        localStorage.setItem(storageKey, JSON.stringify(cacheEntry));

        const timer = window.setTimeout(() => {
          localStorage.removeItem(storageKey);
          console.log(`[GC] Cache cleared for ${url}`);
        }, GC_TIME);
        cacheEntry.gcTimer = timer;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log(`[Abort] Request for ${url} cancelled`);
          return;
        }

        if (retryCount < MAX_RETRIES) {
          const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
          console.log(`[Retry ${retryCount + 1}/${MAX_RETRIES}] in ${delay}ms`);
          retryTimeoutRef.current = window.setTimeout(() => {
            fetchData(retryCount + 1);
          }, delay);
        } else {
          console.error(`[Fetch Failed] ${url}`);
          setIsError(true);
        }
      } finally {
        setIsPending(false);
      }
    };

    fetchData();

    // cleanup
    return () => {
      abortControllerRef.current?.abort();
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, [url, storageKey]);

  return { data, isPending, isError };
};
