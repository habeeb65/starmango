import axios from 'axios';
import authService from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Set up axios instance with authentication
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const adminService = {
  // Dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard/stats/');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Products CRUD
  getProducts: async (params = {}) => {
    try {
      const response = await api.get('/products/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getProduct: async (id) => {
    try {
      const response = await api.get(`/products/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post('/products/', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}/`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}/`);
      return true;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },

  // Vendors CRUD
  getVendors: async (params = {}) => {
    try {
      const response = await api.get('/vendors/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching vendors:', error);
      throw error;
    }
  },

  getVendor: async (id) => {
    try {
      const response = await api.get(`/vendors/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching vendor ${id}:`, error);
      throw error;
    }
  },

  createVendor: async (vendorData) => {
    try {
      const response = await api.post('/vendors/', vendorData);
      return response.data;
    } catch (error) {
      console.error('Error creating vendor:', error);
      throw error;
    }
  },

  updateVendor: async (id, vendorData) => {
    try {
      const response = await api.put(`/vendors/${id}/`, vendorData);
      return response.data;
    } catch (error) {
      console.error(`Error updating vendor ${id}:`, error);
      throw error;
    }
  },

  deleteVendor: async (id) => {
    try {
      await api.delete(`/vendors/${id}/`);
      return true;
    } catch (error) {
      console.error(`Error deleting vendor ${id}:`, error);
      throw error;
    }
  },

  // Customers CRUD
  getCustomers: async (params = {}) => {
    try {
      const response = await api.get('/customers/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  // Sales Invoices
  getSalesInvoices: async (params = {}) => {
    try {
      const response = await api.get('/sales-invoices/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching sales invoices:', error);
      throw error;
    }
  },

  // Purchase Invoices
  getPurchaseInvoices: async (params = {}) => {
    try {
      const response = await api.get('/purchase-invoices/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching purchase invoices:', error);
      throw error;
    }
  },

  // Expenses
  getExpenses: async (params = {}) => {
    try {
      const response = await api.get('/expenses/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  },

  // Reports
  generateSalesReport: async (params = {}) => {
    try {
      const response = await api.get('/reports/sales/', { params });
      return response.data;
    } catch (error) {
      console.error('Error generating sales report:', error);
      throw error;
    }
  },

  generateInventoryReport: async (params = {}) => {
    try {
      const response = await api.get('/reports/inventory/', { params });
      return response.data;
    } catch (error) {
      console.error('Error generating inventory report:', error);
      throw error;
    }
  }
};

export default adminService; 