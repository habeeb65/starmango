import { jwtDecode } from 'jwt-decode';
import apiClient, { setAuthToken, setCurrentTenant } from '../client';
import { handleApiError, extractResponseData } from '../helpers';
import {
  LoginCredentials,
  RegisterCredentials,
  PasswordResetRequest,
  PasswordResetConfirmation,
  PasswordChange,
  AuthTokens,
  User,
  LoginResponse,
} from './types';

// Local storage keys for tokens and user data
const ACCESS_TOKEN_KEY = 'starmango_access_token';
const REFRESH_TOKEN_KEY = 'starmango_refresh_token';
const CURRENT_USER_KEY = 'starmango_current_user';
const CURRENT_TENANT_KEY = 'starmango_current_tenant';

/**
 * Authentication service for handling all auth-related operations
 */
export const authService = {
  /**
   * Initialize the auth service
   * Sets up tokens from localStorage if available
   */
  init: () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const tenantId = localStorage.getItem(CURRENT_TENANT_KEY);
    
    if (accessToken) {
      setAuthToken(accessToken);
    }
    
    if (tenantId) {
      setCurrentTenant(tenantId);
    }
  },

  /**
   * Login the user
   * @param credentials User credentials
   * @returns Login response with tokens and user info
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      // Add tenant context to login request if provided
      const requestData = {
        ...credentials,
      };
      
      const response = await apiClient.post<LoginResponse>('/api/auth/login/', requestData);
      const { access, refresh, user } = response.data;
      
      // Store tokens in localStorage
      localStorage.setItem(ACCESS_TOKEN_KEY, access);
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
      
      // Set auth token for future requests
      setAuthToken(access);
      
      // Store tenant information
      if (credentials.tenant_id) {
        localStorage.setItem(CURRENT_TENANT_KEY, credentials.tenant_id);
        setCurrentTenant(credentials.tenant_id);
      } else if (user?.tenant_id) {
        localStorage.setItem(CURRENT_TENANT_KEY, user.tenant_id);
        setCurrentTenant(user.tenant_id);
      }
      
      // Store user data
      if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      }
      
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  },

  /**
   * Register a new user
   * @param credentials Registration details
   * @returns User data
   */
  register: async (credentials: RegisterCredentials): Promise<User> => {
    try {
      // Include organizationName in request if createNewOrganization is true
      const requestData: any = { ...credentials };
      
      // Make absolute URL for registration to make debugging easier
      const response = await apiClient.post<User>('/api/auth/register/', requestData);
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);  // Add detailed error logging
      if (error.request) {
        console.error('No response received, request was:', JSON.stringify(error.request));
      }
      const apiError = handleApiError(error);
      throw new Error(apiError.message || 'Registration failed. Please try again.');
    }
  },

  /**
   * Direct Login - bypasses tenant creation issues
   * Creates a default admin user and tenant if needed
   * @returns Login response with tokens and user info
   */
  directLogin: async (): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>('/api/auth/direct-login/', {});
      const { access, refresh, user } = extractResponseData<LoginResponse>(response);
      
      // Store tokens and user data
      localStorage.setItem(ACCESS_TOKEN_KEY, access);
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      
      // Set tenant if provided
      if (user.tenant?.id) {
        localStorage.setItem(CURRENT_TENANT_KEY, user.tenant.id.toString());
        setCurrentTenant(user.tenant.id.toString());
      }
      
      // Set auth token for subsequent requests
      setAuthToken(access);
      
      return { access, refresh, user };
    } catch (error) {
      console.error('Direct login error:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message || 'Direct login failed. Please try again.');
    }
  },

  /**
   * Logout the user
   * Clears tokens and user data from localStorage
   */
  logout: async (): Promise<void> => {
    try {
      // Optional: Call backend logout endpoint if it exists
      // await apiClient.post('/api/auth/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens and user data from localStorage
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(CURRENT_USER_KEY);
      localStorage.removeItem(CURRENT_TENANT_KEY);
      
      // Clear auth token from API client
      setAuthToken(null);
      setCurrentTenant(null);
    }
  },

  /**
   * Refresh the access token using the refresh token
   * @returns New tokens
   */
  refreshToken: async (): Promise<AuthTokens> => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await apiClient.post<AuthTokens>('/api/auth/token/refresh/', {
        refresh: refreshToken,
      });
      
      const { access, refresh } = response.data;
      
      // Update tokens in localStorage
      localStorage.setItem(ACCESS_TOKEN_KEY, access);
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
      
      // Update auth token for API client
      setAuthToken(access);
      
      return response.data;
    } catch (error) {
      // If refresh fails, clear tokens and user data
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(CURRENT_USER_KEY);
      
      // Clear auth token from API client
      setAuthToken(null);
      
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  },

  /**
   * Get the current user data
   * @returns User data or null if not logged in
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      // First check if we have user data in localStorage
      const storedUser = localStorage.getItem(CURRENT_USER_KEY);
      if (storedUser) {
        return JSON.parse(storedUser);
      }
      
      // If not, fetch from API
      const response = await apiClient.get<User>('/api/users/me/');
      const user = response.data;
      
      // Store user data
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },

  /**
   * Request a password reset
   * @param request Password reset request data
   */
  requestPasswordReset: async (request: PasswordResetRequest): Promise<void> => {
    try {
      await apiClient.post('/api/auth/password-reset/', request);
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  },

  /**
   * Confirm password reset
   * @param confirmation Password reset confirmation data
   */
  confirmPasswordReset: async (confirmation: PasswordResetConfirmation): Promise<void> => {
    try {
      await apiClient.post('/api/auth/password-reset/confirm/', confirmation);
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  },

  /**
   * Change user password
   * @param data Password change data
   */
  changePassword: async (data: PasswordChange): Promise<void> => {
    try {
      await apiClient.post('/api/auth/password-change/', data);
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  },

  /**
   * Get the current auth token
   * @returns Access token or null if not logged in
   */
  getToken: async (): Promise<string | null> => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    
    if (!accessToken) {
      return null;
    }
    
    // Check if token is expired
    try {
      const decoded: any = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;
      
      // If token is expired, try to refresh it
      if (decoded.exp < currentTime) {
        try {
          const { access } = await authService.refreshToken();
          return access;
        } catch (error) {
          return null;
        }
      }
      
      return accessToken;
    } catch (error) {
      return null;
    }
  },

  /**
   * Get the current tenant ID
   * @returns Tenant ID or null if not set
   */
  getCurrentTenantId: (): string | null => {
    return localStorage.getItem(CURRENT_TENANT_KEY);
  },

  /**
   * Set the current tenant ID
   * @param tenantId Tenant ID to set
   */
  setCurrentTenantId: (tenantId: string | null): void => {
    if (tenantId) {
      localStorage.setItem(CURRENT_TENANT_KEY, tenantId);
      setCurrentTenant(tenantId);
    } else {
      localStorage.removeItem(CURRENT_TENANT_KEY);
      setCurrentTenant(null);
    }
  },

  /**
   * Check if the user is authenticated
   * @returns True if authenticated, false otherwise
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
  },
};

export default authService;
