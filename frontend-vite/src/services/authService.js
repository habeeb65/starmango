import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Set up axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, log out user
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const authService = {
  // Register a new user
  register: async (userData) => {
    // Django typically expects these field names
    const response = await api.post('/auth/register/', {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      first_name: userData.name ? userData.name.split(' ')[0] : '',
      last_name: userData.name ? userData.name.split(' ').slice(1).join(' ') : ''
    });
    return response.data;
  },

  // Login user
  login: async (username, password) => {
    try {
      console.log('Attempting login with:', { username });
      
      const response = await api.post('/auth/login/', {
        username,
        password
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        // Django might return user data differently, adjust as needed
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } else {
          // If user data is at the top level with token
          const userData = { ...response.data };
          delete userData.token;
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } else {
        console.error('No token received in login response');
        throw new Error('Authentication failed - no token received');
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout user
  logout: () => {
    // Try to call the logout endpoint, but proceed with local logout regardless
    try {
      api.post('/auth/logout/').catch(err => console.log('Logout API error:', err));
    } catch (e) {
      console.log('Error during logout:', e);
    }
    
    // Always clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user from local storage
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error('Error getting current user:', e);
      return null;
    }
  },

  // Check if user is logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get user token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile/', userData);
    
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } else {
      // If user data is directly returned
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/auth/change-password/', {
      current_password: currentPassword,
      new_password: newPassword
    });
    return response.data;
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    const response = await api.post('/auth/reset-password-request/', { email });
    return response.data;
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password/', {
      token,
      new_password: newPassword
    });
    return response.data;
  }
};

export default authService; 