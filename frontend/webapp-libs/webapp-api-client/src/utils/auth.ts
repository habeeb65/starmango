import { AuthResponse } from '../types';

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setUser = (user: AuthResponse['user']): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): AuthResponse['user'] | null => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

export const clearAuth = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const handleAuthResponse = (response: AuthResponse): void => {
  setAuthToken(response.access);
  setRefreshToken(response.refresh);
  setUser(response.user);
}; 