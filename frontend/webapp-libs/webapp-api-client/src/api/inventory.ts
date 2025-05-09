import { apiClient } from './api';

export const inventoryApi = {
  getInventory: async () => {
    const response = await apiClient.get('/inventory-management/');
    return response.data;
  },
  addProduct: async (data: any) => {
    const response = await apiClient.post('/inventory/add/', data);
    return response.data;
  },
  updateProduct: async (productId: number, data: any) => {
    const response = await apiClient.put(`/inventory/${productId}/`, data);
    return response.data;
  },
  deleteProduct: async (productId: number) => {
    const response = await apiClient.delete(`/inventory/${productId}/`);
    return response.data;
  },
}; 