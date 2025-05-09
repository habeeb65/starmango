import { apiClient } from '@sb/webapp-api-client';
import { handleApiError, extractResponseData } from '@sb/webapp-api-client';
import {
  Tenant,
  TenantInput,
  TenantUser,
  TenantUserInviteInput,
  TenantUserUpdateInput,
  TenantListResponse,
  TenantUsersListResponse,
} from './types';

/**
 * Tenant service for handling all tenant-related operations
 */
export const tenantService = {
  /**
   * Get a list of all tenants accessible to the current user
   * @returns List of tenants
   */
  getTenants: async (): Promise<Tenant[]> => {
    try {
      const response = await apiClient.get<TenantListResponse>('/api/tenants/');
      return response.data.results;
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  },

  /**
   * Get a specific tenant by ID
   * @param id Tenant ID
   * @returns Tenant details
   */
  getTenant: async (id: string | number): Promise<Tenant> => {
    try {
      const response = await apiClient.get<Tenant>(`/api/tenants/${id}/`);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  },

  /**
   * Create a new tenant
   * @param data Tenant creation data
   * @returns Created tenant
   */
  createTenant: async (data: TenantInput): Promise<Tenant> => {
    try {
      const response = await apiClient.post<Tenant>('/api/tenants/', data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  },

  /**
   * Update an existing tenant
   * @param id Tenant ID
   * @param data Tenant update data
   * @returns Updated tenant
   */
  updateTenant: async (id: string | number, data: Partial<TenantInput>): Promise<Tenant> => {
    try {
      const response = await apiClient.patch<Tenant>(`/api/tenants/${id}/`, data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  },

  /**
   * Delete a tenant
   * @param id Tenant ID
   */
  deleteTenant: async (id: string | number): Promise<void> => {
    try {
      await apiClient.delete(`/api/tenants/${id}/`);
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  },

  /**
   * Get users for a specific tenant
   * @param tenantId Tenant ID
   * @returns List of tenant users
   */
  getTenantUsers: async (tenantId: string | number): Promise<TenantUser[]> => {
    try {
      const response = await apiClient.get<TenantUsersListResponse>(
        `/api/tenants/${tenantId}/users/`
      );
      return response.data.results;
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  },

  /**
   * Invite a user to a tenant
   * @param data Tenant user invite data
   * @returns Created tenant user
   */
  inviteUser: async (data: TenantUserInviteInput): Promise<TenantUser> => {
    try {
      const response = await apiClient.post<TenantUser>(
        `/api/tenants/${data.tenant_id}/invite/`,
        {
          email: data.email,
          role: data.role,
        }
      );
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  },

  /**
   * Update a tenant user
   * @param data Tenant user update data
   * @returns Updated tenant user
   */
  updateTenantUser: async (data: TenantUserUpdateInput): Promise<TenantUser> => {
    try {
      const response = await apiClient.patch<TenantUser>(
        `/api/tenants/${data.tenant_id}/users/${data.id}/`,
        {
          role: data.role,
          is_active: data.isActive,
        }
      );
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  },

  /**
   * Remove a user from a tenant
   * @param tenantId Tenant ID
   * @param userId User ID
   */
  removeTenantUser: async (tenantId: string | number, userId: string | number): Promise<void> => {
    try {
      await apiClient.delete(`/api/tenants/${tenantId}/users/${userId}/`);
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  },

  /**
   * Switch to a different tenant
   * @param tenantId Tenant ID to switch to
   * @returns Success status
   */
  switchTenant: async (tenantId: string | number): Promise<boolean> => {
    try {
      await apiClient.post(`/api/tenants/${tenantId}/switch/`);
      return true;
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  },

  /**
   * Get the current active tenant for the user
   * @returns Current tenant
   */
  getCurrentTenant: async (): Promise<Tenant | null> => {
    try {
      const response = await apiClient.get<Tenant>('/api/tenants/current/');
      return response.data;
    } catch (error) {
      console.error('Error fetching current tenant:', error);
      return null;
    }
  },
};

export default tenantService;
