import { QueryClient } from '@tanstack/react-query';

/**
 * Configure React Query client for API communication
 * This handles caching and data fetching for the application
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default stale time of 5 minutes
      staleTime: 5 * 60 * 1000,
      // Default cache time of 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed queries 3 times before showing error
      retry: 3,
      // Show errors in development mode
      useErrorBoundary: process.env.NODE_ENV === 'development',
      // Refetch data when window regains focus
      refetchOnWindowFocus: true,
      // Handle errors consistently
      onError: (error) => {
        console.error('Query error:', error);
      },
    },
    mutations: {
      // Handle errors consistently
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});
