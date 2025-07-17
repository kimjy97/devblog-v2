import { useQuery } from '@tanstack/react-query';
import { apiGet, apiPost } from '@/services/api';

interface BoardPostsQueryParams {
  board?: string | null;
  search?: string | null;
}

export const useBoardPostsQuery = ({ board, search }: BoardPostsQueryParams) => {
  return useQuery({
    queryKey: ['boardPosts', { board, search }],
    queryFn: async () => {
      if (search) {
        // 검색 API
        const res = await apiGet(`/api/blog/postList/search?q=${search}`);
        return res.data;
      } 
        // 게시판별 목록 API
        const res = await apiPost('/api/blog/postList', { board: board === 'all' ? '' : board });
        return res.data;
      
    },
    staleTime: 1000 * 60, // 1분
    enabled: true,
  });
}; 