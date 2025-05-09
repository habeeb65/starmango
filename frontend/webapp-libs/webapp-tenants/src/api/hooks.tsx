import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@sb/webapp-api-client';
import { tenantService } from './service';
import { 
  Tenant, 
  TenantInput, 
  TenantUser, 
  TenantUserInviteInput, 
  TenantUserUpdateInput,
  UserRole,
} from './types';

// Tenant context interface
interface TenantContextType {
  tenants: Tenant[];
  isLoading: boolean;
  error: string | null;
  currentTenant: Tenant | null;
  currentTenantUsers: TenantUser[];
  currentTenantUsersLoading: boolean;
  createTenant: (data: TenantInput) => Promise<Tenant>;
  updateTenant: (id: string | number, data: Partial<TenantInput>) => Promise<Tenant>;
  deleteTenant: (id: string | number) => Promise<void>;
  switchTenant: (id: string | number) => Promise<void>;
  inviteUser: (data: TenantUserInviteInput) => Promise<TenantUser>;
  updateTenantUser: (data: TenantUserUpdateInput) => Promise<TenantUser>;
  removeTenantUser: (userId: string | number) => Promise<void>;
  loadTenantUsers: (tenantId: string | number) => Promise<TenantUser[]>;
}

// Create tenant context
const TenantContext = createContext<TenantContextType>({
  tenants: [],
  isLoading: false,
  error: null,
  currentTenant: null,
  currentTenantUsers: [],
  currentTenantUsersLoading: false,
  createTenant: async () => ({ id: '', tenant_id: '', name: '' }),
  updateTenant: async () => ({ id: '', tenant_id: '', name: '' }),
  deleteTenant: async () => {},
  switchTenant: async () => {},
  inviteUser: async () => ({ id: '', user_id: '', username: '', email: '', role: UserRole.MEMBER }),
  updateTenantUser: async () => ({ id: '', user_id: '', username: '', email: '', role: UserRole.MEMBER }),
  removeTenantUser: async () => {},
  loadTenantUsers: async () => [],
});

// Tenant provider props
interface TenantProviderProps {
  children: ReactNode;
}

/**
 * TenantProvider component
 * Provides tenant management functionality to the app
 */
export const TenantProvider = ({ children }: TenantProviderProps) => {
  const queryClient = useQueryClient();
  const { currentUser, isLoggedIn, setCurrentTenantId, getCurrentTenantId } = useAuth();
  
  // Query to load the list of available tenants
  const { 
    data: tenants = [], 
    isLoading: isTenantsLoading, 
    error: tenantsError,
    refetch: refetchTenants,
  } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      return tenantService.getTenants();
    },
    enabled: isLoggedIn,
  });
  
  // Query to get the current tenant details
  const currentTenantId = getCurrentTenantId();
  
  const { 
    data: currentTenant,
    isLoading: isCurrentTenantLoading,
    error: currentTenantError,
  } = useQuery({
    queryKey: ['currentTenant', currentTenantId],
    queryFn: async () => {
      if (!currentTenantId) return null;
      return tenantService.getTenant(currentTenantId);
    },
    enabled: !!currentTenantId && isLoggedIn,
  });
  
  // Query to get users for the current tenant
  const { 
    data: currentTenantUsers = [],
    isLoading: currentTenantUsersLoading,
    refetch: refetchTenantUsers,
  } = useQuery({
    queryKey: ['tenantUsers', currentTenantId],
    queryFn: async () => {
      if (!currentTenantId) return [];
      return tenantService.getTenantUsers(currentTenantId);
    },
    enabled: !!currentTenantId && isLoggedIn,
  });
  
  // Create tenant mutation
  const createTenantMutation = useMutation({
    mutationFn: async (data: TenantInput) => {
      return tenantService.createTenant(data);
    },
    onSuccess: () => {
      refetchTenants();
    },
  });
  
  // Update tenant mutation
  const updateTenantMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: Partial<TenantInput> }) => {
      return tenantService.updateTenant(id, data);
    },
    onSuccess: () => {
      refetchTenants();
      if (currentTenantId) {
        queryClient.invalidateQueries({ queryKey: ['currentTenant', currentTenantId] });
      }
    },
  });
  
  // Delete tenant mutation
  const deleteTenantMutation = useMutation({
    mutationFn: async (id: string | number) => {
      return tenantService.deleteTenant(id);
    },
    onSuccess: () => {
      refetchTenants();
      if (currentTenantId) {
        queryClient.invalidateQueries({ queryKey: ['currentTenant', currentTenantId] });
      }
    },
  });
  
  // Switch tenant mutation
  const switchTenantMutation = useMutation({
    mutationFn: async (id: string | number) => {
      return tenantService.switchTenant(id);
    },
    onSuccess: (_, id) => {
      const tenantId = id.toString();
      setCurrentTenantId(tenantId);
      queryClient.invalidateQueries({ queryKey: ['currentTenant', tenantId] });
      queryClient.invalidateQueries({ queryKey: ['tenantUsers', tenantId] });
      
      // Invalidate all tenant-dependent data
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
  
  // Invite user mutation
  const inviteUserMutation = useMutation({
    mutationFn: async (data: TenantUserInviteInput) => {
      return tenantService.inviteUser(data);
    },
    onSuccess: () => {
      if (currentTenantId) {
        queryClient.invalidateQueries({ queryKey: ['tenantUsers', currentTenantId] });
      }
    },
  });
  
  // Update tenant user mutation
  const updateTenantUserMutation = useMutation({
    mutationFn: async (data: TenantUserUpdateInput) => {
      return tenantService.updateTenantUser(data);
    },
    onSuccess: () => {
      if (currentTenantId) {
        queryClient.invalidateQueries({ queryKey: ['tenantUsers', currentTenantId] });
      }
    },
  });
  
  // Remove tenant user mutation
  const removeTenantUserMutation = useMutation({
    mutationFn: async ({ tenantId, userId }: { tenantId: string | number; userId: string | number }) => {
      return tenantService.removeTenantUser(tenantId, userId);
    },
    onSuccess: () => {
      if (currentTenantId) {
        queryClient.invalidateQueries({ queryKey: ['tenantUsers', currentTenantId] });
      }
    },
  });
  
  // Handler functions that connect to mutations
  const createTenant = useCallback(async (data: TenantInput) => {
    return createTenantMutation.mutateAsync(data);
  }, [createTenantMutation]);
  
  const updateTenant = useCallback(async (id: string | number, data: Partial<TenantInput>) => {
    return updateTenantMutation.mutateAsync({ id, data });
  }, [updateTenantMutation]);
  
  const deleteTenant = useCallback(async (id: string | number) => {
    await deleteTenantMutation.mutateAsync(id);
  }, [deleteTenantMutation]);
  
  const switchTenant = useCallback(async (id: string | number) => {
    await switchTenantMutation.mutateAsync(id);
  }, [switchTenantMutation]);
  
  const inviteUser = useCallback(async (data: TenantUserInviteInput) => {
    return inviteUserMutation.mutateAsync(data);
  }, [inviteUserMutation]);
  
  const updateTenantUser = useCallback(async (data: TenantUserUpdateInput) => {
    return updateTenantUserMutation.mutateAsync(data);
  }, [updateTenantUserMutation]);
  
  const removeTenantUser = useCallback(async (userId: string | number) => {
    if (!currentTenantId) {
      throw new Error('No current tenant selected');
    }
    await removeTenantUserMutation.mutateAsync({ tenantId: currentTenantId, userId });
  }, [currentTenantId, removeTenantUserMutation]);
  
  const loadTenantUsers = useCallback(async (tenantId: string | number) => {
    const users = await tenantService.getTenantUsers(tenantId);
    return users;
  }, []);
  
  // Effect to auto-select the first tenant if none is selected
  useEffect(() => {
    const autoSelectTenant = async () => {
      if (isLoggedIn && tenants.length > 0 && !currentTenantId) {
        try {
          await switchTenant(tenants[0].id);
        } catch (error) {
          console.error('Failed to auto-select tenant:', error);
        }
      }
    };
    
    autoSelectTenant();
  }, [isLoggedIn, tenants, currentTenantId, switchTenant]);
  
  // Calculate loading state
  const isLoading = isTenantsLoading || isCurrentTenantLoading || 
    createTenantMutation.isPending || updateTenantMutation.isPending || 
    deleteTenantMutation.isPending || switchTenantMutation.isPending;
  
  // Calculate error state
  const error = tenantsError ? 
    (tenantsError instanceof Error ? tenantsError.message : 'Failed to load tenants') : 
    currentTenantError ? 
      (currentTenantError instanceof Error ? currentTenantError.message : 'Failed to load current tenant') : 
      null;
  
  return (
    <TenantContext.Provider
      value={{
        tenants,
        isLoading,
        error,
        currentTenant,
        currentTenantUsers,
        currentTenantUsersLoading,
        createTenant,
        updateTenant,
        deleteTenant,
        switchTenant,
        inviteUser,
        updateTenantUser,
        removeTenantUser,
        loadTenantUsers,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

/**
 * Hook to use tenant context
 * @returns Tenant context
 */
export const useTenant = () => {
  const context = useContext(TenantContext);
  
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  
  return context;
};

/**
 * Hook to fetch and use a list of all available tenants
 * @returns Query result for the tenants list
 */
export const useTenantList = () => {
  const { isLoggedIn } = useAuth();
  
  return useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      return tenantService.getTenants();
    },
    enabled: isLoggedIn,
  });
};

/**
 * Hook to fetch and use tenant users
 * @param tenantId The tenant ID to fetch users for
 * @returns Query result for tenant users
 */
export const useTenantUsers = (tenantId?: string | number) => {
  const { currentTenant } = useTenant();
  const effectiveTenantId = tenantId || currentTenant?.id;
  
  return useQuery({
    queryKey: ['tenantUsers', effectiveTenantId],
    queryFn: async () => {
      if (!effectiveTenantId) return [];
      return tenantService.getTenantUsers(effectiveTenantId);
    },
    enabled: !!effectiveTenantId,
  });
};
