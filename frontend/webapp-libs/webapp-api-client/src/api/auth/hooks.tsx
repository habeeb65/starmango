import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from './index';
import { 
  LoginCredentials, 
  RegisterCredentials, 
  PasswordResetRequest, 
  PasswordResetConfirmation,
  PasswordChange,
  AuthState,
  User,
} from './types';

// Create auth context
const AuthContext = createContext<AuthState & {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  logout: () => Promise<void>;
  requestPasswordReset: (data: PasswordResetRequest) => Promise<void>;
  confirmPasswordReset: (data: PasswordResetConfirmation) => Promise<void>;
  changePassword: (data: PasswordChange) => Promise<void>;
  refreshToken: () => Promise<void>;
  getToken: () => Promise<string | null>;
  getCurrentTenantId: () => string | null;
  setCurrentTenantId: (tenantId: string | null) => void;
  directLogin: () => Promise<void>;
}>({
  isLoading: true,
  isLoggedIn: false,
  isInitialized: false,
  tokens: null,
  currentUser: null,
  error: null,
  login: async () => {},
  register: async () => ({ id: '', username: '', email: '' }),
  logout: async () => {},
  requestPasswordReset: async () => {},
  confirmPasswordReset: async () => {},
  changePassword: async () => {},
  refreshToken: async () => {},
  getToken: async () => null,
  getCurrentTenantId: () => null,
  setCurrentTenantId: () => {},
  directLogin: async () => {},
});

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider component
 * Provides authentication state and methods to the app
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [tokens, setTokens] = useState<{ access: string; refresh: string } | null>(null);
  const queryClient = useQueryClient();
  
  // Initialize auth service
  useEffect(() => {
    const initAuth = async () => {
      authService.init();
      setIsInitialized(true);
    };
    
    initAuth();
  }, []);
  
  // Fetch current user data
  const { 
    data: currentUser,
    isLoading: isUserLoading,
    error: userError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      return authService.getCurrentUser();
    },
    enabled: isInitialized && authService.isAuthenticated(),
  });
  
  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      return authService.login(credentials);
    },
    onSuccess: () => {
      refetchUser();
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
  
  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      return authService.register(credentials);
    },
  });
  
  // Direct Login mutation to bypass tenant registration issues
  const directLoginMutation = useMutation({
    mutationFn: async () => {
      return authService.directLogin();
    },
    onSuccess: () => {
      refetchUser();
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
  
  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return authService.logout();
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
  
  // Request password reset mutation
  const requestPasswordResetMutation = useMutation({
    mutationFn: async (data: PasswordResetRequest) => {
      return authService.requestPasswordReset(data);
    },
  });
  
  // Confirm password reset mutation
  const confirmPasswordResetMutation = useMutation({
    mutationFn: async (data: PasswordResetConfirmation) => {
      return authService.confirmPasswordReset(data);
    },
  });
  
  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: PasswordChange) => {
      return authService.changePassword(data);
    },
  });
  
  // Refresh token mutation
  const refreshTokenMutation = useMutation({
    mutationFn: async () => {
      return authService.refreshToken();
    },
    onSuccess: (data) => {
      setTokens(data);
    },
  });
  
  // Login handler
  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await loginMutation.mutateAsync(credentials);
    setTokens({
      access: response.access,
      refresh: response.refresh,
    });
  }, [loginMutation]);
  
  // Direct login handler - bypasses tenant registration issues
  const directLogin = useCallback(async () => {
    const response = await directLoginMutation.mutateAsync();
    setTokens({
      access: response.access,
      refresh: response.refresh,
    });
  }, [directLoginMutation]);
  
  // Register handler
  const register = useCallback(async (credentials: RegisterCredentials) => {
    return registerMutation.mutateAsync(credentials);
  }, [registerMutation]);
  
  // Logout handler
  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
    setTokens(null);
  }, [logoutMutation]);
  
  // Request password reset handler
  const requestPasswordReset = useCallback(async (data: PasswordResetRequest) => {
    await requestPasswordResetMutation.mutateAsync(data);
  }, [requestPasswordResetMutation]);
  
  // Confirm password reset handler
  const confirmPasswordReset = useCallback(async (data: PasswordResetConfirmation) => {
    await confirmPasswordResetMutation.mutateAsync(data);
  }, [confirmPasswordResetMutation]);
  
  // Change password handler
  const changePassword = useCallback(async (data: PasswordChange) => {
    await changePasswordMutation.mutateAsync(data);
  }, [changePasswordMutation]);
  
  // Refresh token handler
  const refreshToken = useCallback(async () => {
    await refreshTokenMutation.mutateAsync();
  }, [refreshTokenMutation]);
  
  // Get token handler
  const getToken = useCallback(async () => {
    return authService.getToken();
  }, []);
  
  // Get current tenant ID
  const getCurrentTenantId = useCallback(() => {
    return authService.getCurrentTenantId();
  }, []);
  
  // Set current tenant ID
  const setCurrentTenantId = useCallback((tenantId: string | null) => {
    authService.setCurrentTenantId(tenantId);
    // Refresh user data after tenant change
    refetchUser();
    // Invalidate tenant-dependent queries
    queryClient.invalidateQueries({ queryKey: ['tenants'] });
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  }, [queryClient, refetchUser]);
  
  // Calculate loading state
  const isLoading = isUserLoading || loginMutation.isPending || logoutMutation.isPending;
  
  // Calculate error state
  const error = userError ? 
    (userError instanceof Error ? userError.message : 'Failed to load user') : 
    null;
  
  // Calculate logged in state
  const isLoggedIn = !!currentUser;
  
  // Provide auth context
  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isLoggedIn,
        isInitialized,
        tokens,
        currentUser,
        error,
        login,
        register,
        logout,
        requestPasswordReset,
        confirmPasswordReset,
        changePassword,
        refreshToken,
        getToken,
        getCurrentTenantId,
        setCurrentTenantId,
        directLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use authentication context
 * @returns Auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
