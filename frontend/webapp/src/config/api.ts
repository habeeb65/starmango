/**
 * API configuration for communicating with the Django backend
 */

// API base URL from environment variables
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// GraphQL endpoint URL
export const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:8000/graphql';

// Authentication settings
export const AUTH_ENABLED = import.meta.env.VITE_AUTH_ENABLED !== 'false';
export const AUTH_TOKEN_REFRESH_INTERVAL = 
  parseInt(import.meta.env.VITE_AUTH_TOKEN_REFRESH_INTERVAL || '600000', 10);

// Multi-tenancy settings
export const MULTI_TENANT_ENABLED = import.meta.env.VITE_MULTI_TENANT_ENABLED !== 'false';

// Feature flags
export const FEATURE_NOTIFICATIONS_ENABLED = 
  import.meta.env.VITE_FEATURE_NOTIFICATIONS_ENABLED !== 'false';

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/auth/login/',
    REGISTER: '/api/auth/register/',
    LOGOUT: '/api/auth/logout/',
    TOKEN_REFRESH: '/api/auth/token/refresh/',
    PASSWORD_RESET: '/api/auth/password-reset/',
    PASSWORD_RESET_CONFIRM: '/api/auth/password-reset/confirm/',
    PASSWORD_CHANGE: '/api/auth/password-change/',
    ME: '/api/users/me/',
  },
  
  // Tenant endpoints
  TENANTS: {
    LIST: '/api/tenants/',
    DETAIL: (id: string | number) => `/api/tenants/${id}/`,
    USERS: (id: string | number) => `/api/tenants/${id}/users/`,
    INVITE: (id: string | number) => `/api/tenants/${id}/invite/`,
    SWITCH: (id: string | number) => `/api/tenants/${id}/switch/`,
    CURRENT: '/api/tenants/current/',
  },
  
  // Dashboard endpoints
  DASHBOARD: {
    SUMMARY: '/api/dashboard/summary/',
    VENDOR_SUMMARY: '/api/dashboard/vendor-summary/',
    CUSTOMER_SUMMARY: '/api/dashboard/customer-summary/',
    INVENTORY_SUMMARY: '/api/dashboard/inventory-summary/',
  },
  
  // Vendor endpoints
  VENDORS: {
    LIST: '/api/vendors/',
    DETAIL: (id: string | number) => `/api/vendors/${id}/`,
  },
  
  // Customer endpoints
  CUSTOMERS: {
    LIST: '/api/customers/',
    DETAIL: (id: string | number) => `/api/customers/${id}/`,
  },
  
  // Inventory endpoints
  INVENTORY: {
    LIST: '/api/inventory/',
    DETAIL: (id: string | number) => `/api/inventory/${id}/`,
  },
};

/**
 * Helper to construct a full API URL
 * @param endpoint API endpoint
 * @returns Full API URL
 */
export const getApiUrl = (endpoint: string): string => {
  return `${API_URL}${endpoint}`;
};

/**
 * Helper to add tenant context to API endpoints
 * @param url API URL
 * @param tenantId Tenant ID
 * @returns URL with tenant query parameter
 */
export const addTenantContext = (url: string, tenantId?: string | null): string => {
  if (!tenantId || !MULTI_TENANT_ENABLED) {
    return url;
  }
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}tenant_id=${tenantId}`;
};
