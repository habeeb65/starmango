import { apiClient } from './api';

export const customerApi = {
  getCustomers: async () => {
    const response = await apiClient.get('/customer-summary/');
    return response.data;
  },
  getCustomerInvoices: async (customerId: number) => {
    const response = await apiClient.get(`/customer/${customerId}/invoices/`);
    return response.data;
  },
  addCustomer: async (data: { name: string; contact_number: string; area: string }) => {
    const response = await apiClient.post('/add-customer/', data);
    return response.data;
  },
  getOutstandingInvoices: async () => {
    const response = await apiClient.get('/customer-outstanding-invoices/');
    return response.data;
  },
}; 