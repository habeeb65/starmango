import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    // Handle Axios errors
    return {
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };
  }

  if (error instanceof Error) {
    // Handle standard errors
    return {
      message: error.message || 'An error occurred',
    };
  }

  // Handle unknown errors
  return {
    message: 'An unknown error occurred',
  };
};

export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ApiError).message === 'string'
  );
}; 