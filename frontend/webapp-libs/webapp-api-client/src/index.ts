// Export API client
export { apiClient } from './api/api';

// Export error handling utilities
export { handleApiError, isApiError, type ApiError } from './utils/error-handling';

// Export auth utilities
export {
  setAuthToken,
  getAuthToken,
  setRefreshToken,
  getRefreshToken,
  setUser,
  getUser,
  clearAuth,
  isAuthenticated,
  handleAuthResponse,
} from './utils/auth';

// Export constants
export {
  API_BASE_URL,
  API_ENDPOINTS,
  HTTP_STATUS,
  PAYMENT_MODES,
  INVOICE_STATUS,
} from './constants';

// Export types
export * from './types';

// Export auth modules
export * from './api/auth/types';
export * from './api/auth/hooks';
