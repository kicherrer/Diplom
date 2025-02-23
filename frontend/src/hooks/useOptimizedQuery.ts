import { useState, useEffect, useRef } from 'react';
import { debounce } from 'lodash';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheItem<any>>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useOptimizedQuery<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options = { enabled: true, cacheTime: CACHE_DURATION }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useRef(
    debounce(async () => {
      try {
        setLoading(true);
        const cachedData = cache.get(key);
        
        if (cachedData && Date.now() - cachedData.timestamp < options.cacheTime) {
          setData(cachedData.data);
          return;
        }

        const result = await fetchFn();
        cache.set(key, { data: result, timestamp: Date.now() });
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }, 300)
  ).current;

  useEffect(() => {
    if (options.enabled) {
      fetchData();
    }
    return () => {
      fetchData.cancel();
    };
  }, [key, options.enabled]);

  return { data, loading, error, refetch: fetchData };
}
