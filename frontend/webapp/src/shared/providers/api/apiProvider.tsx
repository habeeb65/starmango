import React, { ReactNode, useEffect } from 'react';
import { apiClient, setAuthToken, useAuth } from '@sb/webapp-api-client';
import { useTenant } from '@sb/webapp-tenants';
import { API_URL, addTenantContext } from '../../../config/api';

interface ApiProviderProps {
  children: ReactNode;
}

/**
 * API Provider component
 * 
 * Configures the API client for communication with Django backend
 * Implements proper multi-tenant isolation by:
 * 1. Adding tenant context to all API requests
 * 2. Refreshing tokens when needed
 * 3. Handling authentication errors
 */
export const ApiProvider = ({ children }: ApiProviderProps) => {
  const { getToken, getCurrentTenantId, isLoggedIn, logout } = useAuth();
  const { currentTenant } = useTenant();
  
  // Set up request interceptor for adding auth token and tenant context
  useEffect(() => {
    const requestInterceptor = apiClient.interceptors.request.use(
      async (config) => {
        // Get the current auth token
        const token = await getToken();
        
        // Get the current tenant ID
        const tenantId = getCurrentTenantId();
        
        // Set the auth token for the request
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add tenant context to the request for proper data isolation
        if (tenantId) {
          config.headers['X-Tenant-ID'] = tenantId;
          
          // Also add tenant ID as query parameter for Django backend filtering
          if (config.url && !config.url.includes('tenant_id=')) {
            config.url = addTenantContext(config.url, tenantId);
          }
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    
    // Set up response interceptor for handling auth errors
    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If the error is 401 Unauthorized and not a token refresh request
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url?.includes('token/refresh') &&
          isLoggedIn
        ) {
          // Mark the request as retried
          originalRequest._retry = true;
          
          try {
            // Try to get a new token
            const newToken = await getToken();
            
            // If successful, retry the original request
            if (newToken) {
              setAuthToken(newToken);
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return apiClient.request(originalRequest);
            }
          } catch (refreshError) {
            // If token refresh fails, log the user out
            console.error('Token refresh failed:', refreshError);
            logout();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
    
    // Clean up interceptors on unmount
    return () => {
      apiClient.interceptors.request.eject(requestInterceptor);
      apiClient.interceptors.response.eject(responseInterceptor);
    };
  }, [getToken, getCurrentTenantId, logout, isLoggedIn]);
  
  // Display tenant ID in dev tools for debugging in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && currentTenant) {
      console.info(
        `%c Current Tenant: ${currentTenant.name} (${currentTenant.tenant_id})`,
        'background: #3182ce; color: white; padding: 2px 4px; border-radius: 2px;'
      );
    }
  }, [currentTenant]);
  
  return <>{children}</>;
};
