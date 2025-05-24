// Utility functions for handling Django REST Framework authentication
import api from '../services/api';

const AUTH_TOKEN_KEY = 'erp_token';
const USER_DATA_KEY = 'erp_user';

export interface UserData {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  tenantId?: string;
  permissions?: string[];
}

export const djangoAuth = {
  // Store authentication token and user data
  setAuthData: (token: string, userData: UserData) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  },

  // Get the current authentication token
  getToken: (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  // Get the current user data
  getUserData: (): UserData | null => {
    const userData = localStorage.getItem(USER_DATA_KEY);
    if (userData) {
      try {
        return JSON.parse(userData) as UserData;
      } catch (e) {
        console.error('Error parsing user data from localStorage', e);
        return null;
      }
    }
    return null;
  },

  // Check if the user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },

  // Logout user
  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  },

  // Verify token validity with backend
  verifyToken: async (): Promise<boolean> => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return false;

    try {
      await api.post('/auth/verify-token/', { token });
      return true;
    } catch (error) {
      // If token verification fails, clear auth data
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
      return false;
    }
  },

  // Get user profile from the backend
  getUserProfile: async (): Promise<UserData | null> => {
    try {
      const response = await api.get('/auth/profile/');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile', error);
      return null;
    }
  }
};

export default djangoAuth;
