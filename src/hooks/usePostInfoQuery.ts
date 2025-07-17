import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/services/api';

export const usePostInfoQuery = (id: string | number) => {
  return useQuery({
    queryKey: ['postInfo', id],
    queryFn: async () => {
      const res = await apiGet('/api/blog/post', { params: { id } });
      return res.post;
    },
    enabled: !!id,
    staleTime: 1000 * 60, // 1분
  });
}; 