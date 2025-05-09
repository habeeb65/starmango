import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
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
    if (error.response.status === 401 && !originalRequest._retry) {
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

// Auth API
export const authApi = {
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
};

// Vendor API
export const vendorApi = {
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
};

// Customer API
export const customerApi = {
  getCustomers: async () => {
    const response = await api.get('/customer-summary/');
    return response.data;
  },
  getCustomerInvoices: async (customerId: number) => {
    const response = await api.get(`/customer/${customerId}/invoices/`);
    return response.data;
  },
};

// Invoice API
export const invoiceApi = {
  createInvoice: async (data: any) => {
    const response = await api.post('/create-invoice/', data);
    return response.data;
  },
  getInvoicePDF: async (invoiceId: number) => {
    const response = await api.get(`/invoice/${invoiceId}/pdf/`, { responseType: 'blob' });
    return response.data;
  },
};

// Inventory API
export const inventoryApi = {
  getInventory: async () => {
    const response = await api.get('/inventory-management/');
    return response.data;
  },
};

// Payment API
export const paymentApi = {
  vendorBulkPayment: async (data: any) => {
    const response = await api.post('/vendor-bulk-payment/', data);
    return response.data;
  },
  customerBulkPayment: async (data: any) => {
    const response = await api.post('/customer-bulk-payment/', data);
    return response.data;
  },
};

export default api; 