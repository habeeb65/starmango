import { AxiosError, AxiosResponse } from 'axios';

/**
 * Standard API error structure
 */
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  errors?: Record<string, string[]>;
  fieldErrors?: Record<string, string>;
}

/**
 * Handle API error responses
 * Transforms AxiosError into a standardized ApiError format
 */
export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    const response = error.response;
    
    // Django REST framework error format
    if (response?.data) {
      const { data } = response;
      
      // Handle Django validation errors (typically has a 'detail' field or field-specific errors)
      if (data.detail) {
        return {
          message: data.detail,
          status: response.status,
          code: `ERR_${response.status}`,
        };
      }
      
      // Handle field-specific errors
      if (typeof data === 'object' && !Array.isArray(data)) {
        const fieldErrors: Record<string, string> = {};
        const errors: Record<string, string[]> = {};
        
        // Process each field's errors
        Object.entries(data).forEach(([field, errorMessages]) => {
          if (Array.isArray(errorMessages)) {
            errors[field] = errorMessages;
            fieldErrors[field] = errorMessages[0]; // Take the first error message for each field
          } else if (typeof errorMessages === 'string') {
            errors[field] = [errorMessages];
            fieldErrors[field] = errorMessages;
          }
        });
        
        return {
          message: 'Validation error',
          status: response.status,
          code: `ERR_VALIDATION_${response.status}`,
          errors,
          fieldErrors,
        };
      }
    }
    
    // Network error
    if (error.code === 'ECONNABORTED') {
      return {
        message: 'Request timeout. Please try again.',
        code: 'ERR_TIMEOUT',
      };
    }
    
    if (!navigator.onLine) {
      return {
        message: 'No internet connection.',
        code: 'ERR_NETWORK',
      };
    }
    
    // Generic error with status code
    if (response) {
      return {
        message: response.statusText || 'An error occurred',
        status: response.status,
        code: `ERR_${response.status}`,
      };
    }
  }
  
  // Fallback for non-Axios errors
  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  
  return {
    message: errorMessage,
    code: 'ERR_UNKNOWN',
  };
};

/**
 * Extract data from API response
 * @param response Axios response object
 * @returns Response data
 */
export const extractResponseData = <T>(response: AxiosResponse<T>): T => {
  return response.data;
};

/**
 * Format query parameters for API requests
 * @param params Object containing query parameters
 * @returns Formatted query string
 */
export const formatQueryParams = (params: Record<string, any>): string => {
  const urlParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(item => urlParams.append(`${key}[]`, String(item)));
      } else {
        urlParams.append(key, String(value));
      }
    }
  });
  
  return urlParams.toString();
};
