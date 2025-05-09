import { apiClient } from './api';

export const invoiceApi = {
  getInvoices: async () => {
    const response = await apiClient.get('/invoices/');
    return response.data;
  },
  createInvoice: async (data: any) => {
    const response = await apiClient.post('/create-invoice/', data);
    return response.data;
  },
  getInvoicePDF: async (invoiceId: number) => {
    const response = await apiClient.get(`/invoice/${invoiceId}/pdf/`, { responseType: 'blob' });
    return response.data;
  },
  deleteInvoice: async (invoiceId: number) => {
    const response = await apiClient.delete(`/invoice/${invoiceId}/`);
    return response.data;
  },
  updateInvoice: async (invoiceId: number, data: any) => {
    const response = await apiClient.put(`/invoice/${invoiceId}/`, data);
    return response.data;
  },
}; 