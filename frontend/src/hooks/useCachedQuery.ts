import { useQuery, QueryFunction } from 'react-query';
import { AxiosResponse } from 'axios';
import { ApiResponse } from '../types/shared';

export function useCachedQuery<T>(
  key: string,
  queryFn: () => Promise<AxiosResponse<ApiResponse<T>>>
) {
  const { data: response, ...rest } = useQuery<AxiosResponse<ApiResponse<T>>>(key, queryFn);
  return {
    data: response?.data?.data,
    ...rest
  };
}
