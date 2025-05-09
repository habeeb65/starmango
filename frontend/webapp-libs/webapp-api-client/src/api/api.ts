import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '../constants';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await api.post('/auth/refresh/', { refresh: refreshToken });
        const { access } = response.data;
        localStorage.setItem('token', access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (error) {
        // Handle refresh token failure
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

// Create API client object
export const apiClient = {
  // Export the axios instance for direct use
  request: api.request.bind(api),
  get: api.get.bind(api),
  post: api.post.bind(api),
  put: api.put.bind(api),
  delete: api.delete.bind(api),
  patch: api.patch.bind(api),
  interceptors: api.interceptors,

  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      const response = await api.post('/auth/login/', { email, password });
      return response.data;
    },
    register: async (data: { email: string; password: string; tenantName: string }) => {
      const response = await api.post('/auth/register/', data);
      return response.data;
    },
    refreshToken: async (refresh: string) => {
      const response = await api.post('/auth/refresh/', { refresh });
      return response.data;
    },
  },

  // Vendor endpoints
  vendor: {
    getVendors: async () => {
      const response = await api.get('/vendor-summary/');
      return response.data;
    },
    getVendorInvoices: async (vendorId: number) => {
      const response = await api.get(`/vendor/${vendorId}/invoices/`);
      return response.data;
    },
    addVendor: async (data: { name: string; contact_number: string; area: string }) => {
      const response = await api.post('/add-vendor/', data);
      return response.data;
    },
    getOutstandingInvoices: async () => {
      const response = await api.get('/vendor-outstanding-invoices/');
      return response.data;
    },
  },

  // Customer endpoints
  customer: {
    getCustomers: async () => {
      const response = await api.get('/customer-summary/');
      return response.data;
    },
    getCustomerInvoices: async (customerId: number) => {
      const response = await api.get(`/customer/${customerId}/invoices/`);
      return response.data;
    },
    addCustomer: async (data: { name: string; contact_number: string; area: string }) => {
      const response = await api.post('/add-customer/', data);
      return response.data;
    },
    getOutstandingInvoices: async () => {
      const response = await api.get('/customer-outstanding-invoices/');
      return response.data;
    },
  },

  // Invoice endpoints
  invoice: {
    getInvoices: async () => {
      const response = await api.get('/invoices/');
      return response.data;
    },
    createInvoice: async (data: any) => {
      const response = await api.post('/create-invoice/', data);
      return response.data;
    },
    getInvoicePDF: async (invoiceId: number) => {
      const response = await api.get(`/invoice/${invoiceId}/pdf/`, { responseType: 'blob' });
      return response.data;
    },
    deleteInvoice: async (invoiceId: number) => {
      const response = await api.delete(`/invoice/${invoiceId}/`);
      return response.data;
    },
    updateInvoice: async (invoiceId: number, data: any) => {
      const response = await api.put(`/invoice/${invoiceId}/`, data);
      return response.data;
    },
  },

  // Inventory endpoints
  inventory: {
    getInventory: async () => {
      const response = await api.get('/inventory-management/');
      return response.data;
    },
    addProduct: async (data: any) => {
      const response = await api.post('/inventory/add/', data);
      return response.data;
    },
    updateProduct: async (productId: number, data: any) => {
      const response = await api.put(`/inventory/${productId}/`, data);
      return response.data;
    },
    deleteProduct: async (productId: number) => {
      const response = await api.delete(`/inventory/${productId}/`);
      return response.data;
    },
  },

  // Payment endpoints
  payment: {
    vendorBulkPayment: async (data: any) => {
      const response = await api.post('/vendor-bulk-payment/', data);
      return response.data;
    },
    customerBulkPayment: async (data: any) => {
      const response = await api.post('/customer-bulk-payment/', data);
      return response.data;
    },
    getVendorPayments: async (vendorId: number) => {
      const response = await api.get(`/vendor/${vendorId}/payments/`);
      return response.data;
    },
    getCustomerPayments: async (customerId: number) => {
      const response = await api.get(`/customer/${customerId}/payments/`);
      return response.data;
    },
  },
};

// Export the axios instance as default for backward compatibility
export default api; 