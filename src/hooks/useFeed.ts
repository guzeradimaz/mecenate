import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchFeed } from '../api/posts';

export const FEED_QUERY_KEY = ['feed'] as const;

export const useFeed = () => {
  return useInfiniteQuery({
    queryKey: FEED_QUERY_KEY,
    queryFn: ({ pageParam }) => fetchFeed(pageParam as string | null),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
    staleTime: 30_000,
    retry: 2,
  });
};
