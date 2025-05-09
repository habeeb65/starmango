import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Box, Center, Spinner, useToast } from '@chakra-ui/react';
import { useAuth } from '@sb/webapp-api-client';

// Create a context for the API client
interface ApiContextType {
  client: typeof axios;
  isLoading: boolean;
}

const ApiContext = createContext<ApiContextType>({
  client: axios,
  isLoading: false,
});

// API Provider props
interface ApiProviderProps {
  children: ReactNode;
}

/**
 * API Provider component to handle API communication
 * Sets up axios with authentication headers and interceptors
 */
export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const toast = useToast();
  
  // Create a new axios instance with default configuration
  const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    withCredentials: true, // Important for cookie-based auth
  });

  // Get auth methods from the auth client
  const { getToken, logout, refreshToken, isInitialized } = useAuth();

  // Set up request interceptor to add auth token to all requests
  useEffect(() => {
    const requestInterceptor = apiClient.interceptors.request.use(
      async (config) => {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Set up response interceptor to handle token refresh and errors
    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // If error is 401 (Unauthorized) and we haven't already tried to refresh
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          originalRequest.url !== '/api/auth/refresh/' // Prevent refresh loop
        ) {
          originalRequest._retry = true;

          try {
            // Attempt to refresh the token
            await refreshToken();
            
            // Get the new token and retry the original request
            const newToken = await getToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return apiClient(originalRequest);
            }
          } catch (refreshError) {
            // If refresh fails, log out the user
            toast({
              title: 'Session expired',
              description: 'Please log in again.',
              status: 'warning',
              duration: 5000,
              isClosable: true,
              position: 'top-right',
            });
            
            await logout();
            return Promise.reject(refreshError);
          }
        }

        // Handle other API errors
        if (error.response) {
          // Server responded with an error status code
          if (error.response.status === 500) {
            toast({
              title: 'Server Error',
              description: 'An unexpected error occurred. Please try again later.',
              status: 'error',
              duration: 5000,
              isClosable: true,
              position: 'top-right',
            });
          } else if (error.response.status === 403) {
            toast({
              title: 'Access Denied',
              description: 'You do not have permission to perform this action.',
              status: 'error',
              duration: 5000,
              isClosable: true,
              position: 'top-right',
            });
          }
        } else if (error.request) {
          // Request was made but no response received (network error)
          toast({
            title: 'Network Error',
            description: 'Please check your internet connection and try again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        }

        return Promise.reject(error);
      }
    );

    // Show loading indicator while initializing
    if (isInitialized) {
      setIsLoading(false);
    }

    // Clean up interceptors when component unmounts
    return () => {
      apiClient.interceptors.request.eject(requestInterceptor);
      apiClient.interceptors.response.eject(responseInterceptor);
    };
  }, [getToken, logout, refreshToken, toast, isInitialized, apiClient]);

  // Show loading indicator while auth is initializing
  if (isLoading) {
    return (
      <Center h="100vh">
        <Box textAlign="center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="primary.500"
            size="xl"
          />
          <Box mt={4}>Initializing application...</Box>
        </Box>
      </Center>
    );
  }

  return (
    <ApiContext.Provider value={{ client: apiClient, isLoading }}>
      {children}
    </ApiContext.Provider>
  );
};

/**
 * Hook to use the API client
 */
export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
