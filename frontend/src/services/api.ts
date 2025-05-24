import axios from "axios";
import mockApiService from "./mockApiService";

// Determine if we should use mock API
const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true' || import.meta.env.VITE_API_URL === 'MOCK';

// Create an axios instance with default config for Django backend
const api = axios.create({
  baseURL: useMockApi ? 'MOCK_API' : (import.meta.env.VITE_API_URL || "http://localhost:8000/api"),
  headers: {
    "Content-Type": "application/json",
  },
  // Longer timeout for development
  timeout: 10000, // 10 seconds
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("erp_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired, etc)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("erp_user");
      localStorage.removeItem("erp_token");
      window.location.href = "/login";
    }
    
    // Log all API errors in development
    if (import.meta.env.DEV) {
      console.error('API Error:', error.message, error.config?.url);
    }
    
    return Promise.reject(error);
  },
);

// Create a wrapper for the API that falls back to mock API when backend is unavailable
const apiWithFallback = {
  get: async (url: string, config?: any) => {
    if (useMockApi) {
      // Use mock API
      if (url === '/tenants/') {
        return mockApiService.tenants.getAll();
      } else if (url === '/auth/profile/') {
        return mockApiService.auth.profile();
      } else if (url === '/health-check/') {
        return mockApiService.healthCheck();
      }
      // Default mock response
      return { data: { message: 'Mock API endpoint not implemented' } };
    }
    
    try {
      return await api.get(url, config);
    } catch (error: any) {
      if (error.message.includes('Network Error') && import.meta.env.DEV) {
        console.warn('Network error, falling back to mock API for:', url);
        // Fall back to mock API
        if (url === '/tenants/') {
          return mockApiService.tenants.getAll();
        } else if (url === '/auth/profile/') {
          return mockApiService.auth.profile();
        } else if (url === '/health-check/') {
          return mockApiService.healthCheck();
        }
      }
      throw error;
    }
  },
  post: async (url: string, data?: any, config?: any) => {
    if (useMockApi) {
      // Use mock API
      if (url === '/tenants/') {
        return mockApiService.tenants.create(data);
      } else if (url === '/auth/login/') {
        return mockApiService.auth.login(data.email, data.password);
      } else if (url === '/auth/register/') {
        return mockApiService.auth.register(data);
      }
      // Default mock response
      return { data: { id: 'mock-id', ...data, message: 'Created with mock API' } };
    }
    
    try {
      return await api.post(url, data, config);
    } catch (error: any) {
      if (error.message.includes('Network Error') && import.meta.env.DEV) {
        console.warn('Network error, falling back to mock API for:', url);
        // Fall back to mock API
        if (url === '/tenants/') {
          return mockApiService.tenants.create(data);
        } else if (url === '/auth/login/') {
          return mockApiService.auth.login(data.email, data.password);
        } else if (url === '/auth/register/') {
          return mockApiService.auth.register(data);
        }
      }
      throw error;
    }
  },
  put: async (url: string, data?: any, config?: any) => {
    if (useMockApi) {
      // Extract ID from URL for mock API
      const idMatch = url.match(/\/([^\/]+)\/?$/);
      const id = idMatch ? idMatch[1] : 'unknown';
      
      if (url.includes('/tenants/')) {
        return mockApiService.tenants.update(id, data);
      }
      // Default mock response
      return { data: { id, ...data, message: 'Updated with mock API' } };
    }
    
    return api.put(url, data, config);
  },
  delete: (url: string, config?: any) => api.delete(url, config),
  patch: (url: string, data?: any, config?: any) => api.patch(url, data, config),
};

export default apiWithFallback;

// Auth service
export const authService = {
  login: async (email: string, password: string, tenantId?: string) => {
    const response = await apiWithFallback.post("/auth/login/", {
      email,
      password,
      tenantId,
    });
    return response.data;
  },
  register: async (userData: any) => {
    const response = await apiWithFallback.post("/auth/register/", userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("erp_user");
    localStorage.removeItem("erp_token");
    localStorage.removeItem("erp_current_tenant");
  },
};

// Tenant service
export const tenantService = {
  getTenants: async () => {
    const response = await apiWithFallback.get("/tenants/");
    return response.data;
  },
  createTenant: async (tenantData: any) => {
    const response = await apiWithFallback.post('/tenants/create-tenant/', tenantData);
    return response.data;
  },
  updateTenant: async (id: string, tenantData: any) => {
    const response = await apiWithFallback.put(`/tenants/${id}/`, tenantData);
    return response.data;
  },
};

// Product service
export const productService = {
  getProducts: async (tenantId: string) => {
    const response = await api.get(`/products/?tenant=${tenantId}`);
    return response.data;
  },
  createProduct: async (productData: any) => {
    const response = await api.post("/products/", productData);
    return response.data;
  },
  updateProduct: async (id: string, productData: any) => {
    const response = await api.put(`/products/${id}/`, productData);
    return response.data;
  },
  deleteProduct: async (id: string) => {
    const response = await api.delete(`/products/${id}/`);
    return response.data;
  },
};

// Purchase service
export const purchaseService = {
  getPurchases: async (tenantId: string) => {
    const response = await api.get(`/purchases/?tenant=${tenantId}`);
    return response.data;
  },
  createPurchase: async (purchaseData: any) => {
    const response = await api.post("/purchases/", purchaseData);
    return response.data;
  },
  updatePurchase: async (id: string, purchaseData: any) => {
    const response = await api.put(`/purchases/${id}/`, purchaseData);
    return response.data;
  },
};

// Sale service
export const saleService = {
  getSales: async (tenantId: string) => {
    const response = await api.get(`/sales/?tenant=${tenantId}`);
    return response.data;
  },
  createSale: async (saleData: any) => {
    const response = await api.post("/sales/", saleData);
    return response.data;
  },
  updateSale: async (id: string, saleData: any) => {
    const response = await api.put(`/sales/${id}/`, saleData);
    return response.data;
  },
};

// Vendor service
export const vendorService = {
  getVendors: async (tenantId: string) => {
    const response = await api.get(`/vendors/?tenant=${tenantId}`);
    return response.data;
  },
  createVendor: async (vendorData: any) => {
    const response = await api.post("/vendors/", vendorData);
    return response.data;
  },
  updateVendor: async (id: string, vendorData: any) => {
    const response = await api.put(`/vendors/${id}/`, vendorData);
    return response.data;
  },
};

// Customer service
export const customerService = {
  getCustomers: async (tenantId: string) => {
    const response = await api.get(`/customers/?tenant=${tenantId}`);
    return response.data;
  },
  createCustomer: async (customerData: any) => {
    const response = await api.post("/customers/", customerData);
    return response.data;
  },
  updateCustomer: async (id: string, customerData: any) => {
    const response = await api.put(`/customers/${id}/`, customerData);
    return response.data;
  },
};

// Analytics service
export const analyticsService = {
  getFinancialSummary: async (tenantId: string) => {
    const response = await api.get(
      `/analytics/financial-summary/?tenant=${tenantId}`,
    );
    return response.data;
  },
  getInventoryAnalytics: async (tenantId: string) => {
    const response = await api.get(`/analytics/inventory/?tenant=${tenantId}`);
    return response.data;
  },
};
