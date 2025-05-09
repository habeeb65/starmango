import { apiClient } from './api';

export const paymentApi = {
  vendorBulkPayment: async (data: any) => {
    const response = await apiClient.post('/vendor-bulk-payment/', data);
    return response.data;
  },
  customerBulkPayment: async (data: any) => {
    const response = await apiClient.post('/customer-bulk-payment/', data);
    return response.data;
  },
  getVendorPayments: async (vendorId: number) => {
    const response = await apiClient.get(`/vendor/${vendorId}/payments/`);
    return response.data;
  },
  getCustomerPayments: async (customerId: number) => {
    const response = await apiClient.get(`/customer/${customerId}/payments/`);
    return response.data;
  },
}; 