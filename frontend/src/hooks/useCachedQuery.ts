import { useEffect, useState, useCallback } from 'react';
import { AxiosResponse } from 'axios';
import { ApiResponse } from '../api/client';

interface QueryOptions {
  enabled?: boolean;
}

type QueryFunction<T> = () => Promise<AxiosResponse<ApiResponse<T>>>;

export function useCachedQuery<T>(
  key: string,
  queryFn: QueryFunction<T> | null,
  options: QueryOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!queryFn || options.enabled === false) {
      setData(null);
      return;
    }

    setLoading(true);
    try {
      const response = await queryFn();
      // Ensure we're setting just the inner data property
      const responseData = response.data.data as T;
      setData(responseData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [queryFn, options.enabled]);

  useEffect(() => {
    fetchData();
  }, [key, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}
