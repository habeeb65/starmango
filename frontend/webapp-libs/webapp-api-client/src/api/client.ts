import axios from 'axios';

/**
 * Create and export the base API client instance
 * Used for making requests to the backend API
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for cookie-based auth
});

/**
 * Set the JWT authentication token for the API client
 */
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

/**
 * Set the current tenant for the API client
 * This ensures tenant isolation in all API requests
 */
export const setCurrentTenant = (tenantId: string | null) => {
  if (tenantId) {
    apiClient.defaults.headers.common['X-Tenant-ID'] = tenantId;
  } else {
    delete apiClient.defaults.headers.common['X-Tenant-ID'];
  }
};

export default apiClient;
