import { useQuery } from '@tanstack/react-query';
import { apiGet, apiPost } from '@/services/api';

interface BoardPostsQueryParams {
  board?: string | null;
  search?: string | null;
  page?: number;
  limit?: number;
}

export const useBoardPostsQuery = ({ board, search, page = 1, limit = 10 }: BoardPostsQueryParams) => {
  return useQuery({
    queryKey: ['boardPosts', { board, search, page, limit }],
    queryFn: async () => {
      if (search) {
        const res = await apiGet(`/api/blog/postList/search?q=${search}`);
        return res.data;
      }
      const res = await apiPost('/api/blog/postList', { board: board === 'all' ? '' : board, page, limit });
      return res.data;

    },
    staleTime: 1000 * 60,
    enabled: true,
  });
}; 