import { apiClient } from './api';

export const vendorApi = {
  getVendors: async () => {
    const response = await apiClient.get('/vendor-summary/');
    return response.data;
  },
  getVendorInvoices: async (vendorId: number) => {
    const response = await apiClient.get(`/vendor/${vendorId}/invoices/`);
    return response.data;
  },
  addVendor: async (data: { name: string; contact_number: string; area: string }) => {
    const response = await apiClient.post('/add-vendor/', data);
    return response.data;
  },
  getOutstandingInvoices: async () => {
    const response = await apiClient.get('/vendor-outstanding-invoices/');
    return response.data;
  },
}; 