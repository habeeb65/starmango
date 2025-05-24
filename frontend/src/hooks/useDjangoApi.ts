import { useState } from 'react';
import api from '../services/api';

// A custom hook for handling API requests to the Django backend
export function useDjangoApi<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Generic GET request
  const fetchData = async (endpoint: string, params: Record<string, string> = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams ? `${endpoint}?${queryParams}` : endpoint;
      const response = await api.get(url);
      setData(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Generic POST request
  const postData = async (endpoint: string, payload: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post(endpoint, payload);
      setData(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Generic PUT request
  const updateData = async (endpoint: string, payload: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.put(endpoint, payload);
      setData(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Generic DELETE request
  const deleteData = async (endpoint: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.delete(endpoint);
      setData(null);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    fetchData,
    postData,
    updateData,
    deleteData
  };
}

export default useDjangoApi;
