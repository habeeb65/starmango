import { v4 as uuidv4 } from 'uuid';

// Mock data for testing without a backend
const mockData = {
  tenants: [
    { 
      id: '1', 
      name: 'Demo Tenant', 
      domain: 'demo.example.com',
      isActive: true,
      createdAt: new Date().toISOString() 
    }
  ],
  users: [
    {
      id: '1',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      tenantId: '1'
    }
  ],
  products: [],
  inventory: [],
  customers: [],
  vendors: []
};

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock API service that simulates backend responses for development and testing
 */
export const mockApiService = {
  // Determine if we should use mock API
  shouldUseMock: () => {
    // Check if API URL is set to MOCK or if environment flag is set
    const useMock = import.meta.env.VITE_API_URL === 'MOCK' || 
                    import.meta.env.VITE_USE_MOCK_API === 'true';
    return useMock;
  },

  // Tenant endpoints
  tenants: {
    getAll: async () => {
      await delay(300);
      return { data: mockData.tenants };
    },
    create: async (data: { name: string; domain?: string; }) => {
      await delay(500);
      const newTenant = {
        id: uuidv4(),
        name: data.name,
        domain: data.domain || `${data.name.toLowerCase().replace(/\\s+/g, '-')}.example.com`,
        isActive: true,
        createdAt: new Date().toISOString()
      };
      mockData.tenants.push(newTenant);
      return { data: newTenant };
    },
    update: async (id: string, data: any) => {
      await delay(500);
      const tenantIndex = mockData.tenants.findIndex(t => t.id === id);
      if (tenantIndex === -1) {
        throw new Error('Tenant not found');
      }
      mockData.tenants[tenantIndex] = {
        ...mockData.tenants[tenantIndex],
        ...data
      };
      return { data: mockData.tenants[tenantIndex] };
    }
  },

  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      await delay(800);
      const user = mockData.users.find(u => u.email === email);
      if (!user || password !== 'password') {
        throw new Error('Invalid credentials');
      }
      return { 
        data: { 
          token: 'mock-jwt-token',
          user 
        } 
      };
    },
    register: async (userData: any) => {
      await delay(1000);
      const newUser = {
        id: uuidv4(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'user',
        tenantId: userData.tenantId || '1'
      };
      mockData.users.push(newUser);
      return { 
        data: { 
          token: 'mock-jwt-token',
          user: newUser
        } 
      };
    },
    profile: async () => {
      await delay(300);
      return { data: mockData.users[0] };
    }
  },

  // API health check
  healthCheck: async () => {
    await delay(200);
    return { 
      data: { 
        status: 'ok', 
        version: '1.0.0',
        mode: 'mock',
        timestamp: new Date().toISOString()
      } 
    };
  }
};

export default mockApiService;
