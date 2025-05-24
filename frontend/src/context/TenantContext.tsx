import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/services/api';
import { tenantService } from '@/services/api';

interface Tenant {
  id: string;
  name: string;
  domain?: string;
  settings?: Record<string, any>;
  createdAt?: string;
  isActive?: boolean;
}

interface TenantContextType {
  currentTenant: Tenant | null;
  availableTenants: Tenant[];
  isLoading: boolean;
  error: string | null;
  switchTenant: (tenantId: string) => Promise<void>;
  refreshTenants: () => Promise<void>;
  createTenant: (tenantData: { name: string; email: string; password: string; domain?: string; settings?: Record<string, any> }) => Promise<Tenant>;
}

const defaultTenantContext: TenantContextType = {
  currentTenant: null,
  availableTenants: [],
  isLoading: false,
  error: null,
  switchTenant: async () => {},
  refreshTenants: async () => {},
  createTenant: async () => { throw new Error('Not implemented'); }
};

const TenantContext = createContext<TenantContextType>(defaultTenantContext);

export const useTenant = () => useContext(TenantContext);

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load the current tenant from localStorage on initial render
  useEffect(() => {
    const storedTenant = localStorage.getItem('current_tenant');
    if (storedTenant) {
      try {
        setCurrentTenant(JSON.parse(storedTenant));
      } catch (err) {
        console.error('Error parsing stored tenant data', err);
      }
    }
    
    // Fetch available tenants on initial load
    refreshTenants();
  }, []);

  const refreshTenants = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/tenants/');
      setAvailableTenants(response.data);
      
      // If no current tenant is set and we have tenants available, select the first one
      if (!currentTenant && response.data.length > 0) {
        setCurrentTenant(response.data[0]);
        localStorage.setItem('current_tenant', JSON.stringify(response.data[0]));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load tenants');
      console.error('Error fetching tenants', err);
    } finally {
      setIsLoading(false);
    }
  };

  const switchTenant = async (tenantId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Find the tenant in available tenants
      const tenant = availableTenants.find(t => t.id === tenantId);
      
      if (!tenant) {
        throw new Error('Tenant not found');
      }

      // Store the selected tenant
      setCurrentTenant(tenant);
      localStorage.setItem('current_tenant', JSON.stringify(tenant));

      // Notify the backend about the tenant switch
      await api.post('/auth/switch-tenant/', { tenantId });
      
      // No return value needed (void)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to switch tenant');
      console.error('Error switching tenant', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createTenant = async (tenantData: { name: string; email: string; password: string; domain?: string; settings?: Record<string, any> }): Promise<Tenant> => {
    setIsLoading(true);
    setError(null);

    try {
      // Create a new tenant via the public API endpoint directly using the correct URL
      const response = await api.post('/tenants/create-tenant/', tenantData);
      const newTenant = response.data.tenant;
      
      // Update the available tenants list
      setAvailableTenants(prev => [...prev, newTenant]);
      
      // Switch to the new tenant
      await switchTenant(newTenant.id);
      
      return newTenant;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create tenant');
      console.error('Error creating tenant', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentTenant,
    availableTenants,
    isLoading,
    error,
    switchTenant,
    refreshTenants,
    createTenant
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};

export default TenantContext;
