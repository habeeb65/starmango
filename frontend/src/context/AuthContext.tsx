import React, { createContext, useContext, useState, useEffect } from "react";
import { useTenant } from "@/context/TenantContext";
import djangoAuth, { UserData } from "@/utils/djangoAuth";
import api from "@/services/api";

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, tenantId?: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    tenantId?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { refreshTenants } = useTenant();

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        setIsLoading(true);

        // Check if user is already authenticated
        if (djangoAuth.isAuthenticated()) {
          const userData = djangoAuth.getUserData();
          setUser(userData);
          
          // Get tenant data if user is authenticated
          if (userData?.tenantId) {
            refreshTenants();
          }
          
          // Verify token is still valid with backend
          const isValid = await djangoAuth.verifyToken();
          if (!isValid) {
            // Token is invalid, logout user
            setUser(null);
            djangoAuth.logout();
          }
        }
      } catch (error) {
        console.error("Auth error:", error);
        djangoAuth.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [refreshTenants]);

  const login = async (email: string, password: string, tenantId?: string) => {
    try {
      setIsLoading(true);

      // Call Django login endpoint
      const response = await api.post('/auth/login/', {
        email,
        password,
        tenantId
      });

      const { token, user } = response.data;
      
      // Store auth data
      djangoAuth.setAuthData(token, user);
      setUser(user);
      
      // Refresh tenants after login
      refreshTenants();

    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    tenantId?: string,
  ) => {
    try {
      setIsLoading(true);

      // Call Django register endpoint
      const response = await api.post('/auth/register/', {
        email,
        password,
        firstName,
        lastName,
        tenantId
      });

      const { token, user } = response.data;
      
      // Login after successful registration
      djangoAuth.setAuthData(token, user);
      setUser(user);
      
      // Refresh tenants after signup
      refreshTenants();
      
    } catch (error: any) {
      console.error("Signup error:", error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call Django logout endpoint
      await api.post('/auth/logout/');
      
      // Clear local auth data
      djangoAuth.logout();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
