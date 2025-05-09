import { QueryClient } from '@tanstack/react-query';

/**
 * Create a React Query client with default settings
 */
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  });
};
