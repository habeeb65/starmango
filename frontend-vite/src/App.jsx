import React, { useState, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Layout components
import PublicLayout from './components/Layout/PublicLayout';
import AdminLayout from './components/Layout/AdminLayout';

// Public pages
import HomePage from './pages/Public/HomePage';
import AboutPage from './pages/Public/AboutPage';
import ContactPage from './pages/Public/ContactPage';
import ProductsPage from './pages/Public/ProductsPage';
import LoginPage from './pages/Auth/LoginPage';

// Admin pages
import Dashboard from './pages/Admin/Dashboard';
import InventoryPage from './pages/Admin/InventoryPage';
import SalesPage from './pages/Admin/SalesPage';
import PurchasesPage from './pages/Admin/PurchasesPage';

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);

  // Login handler
  const handleLogin = (credentials) => {
    console.log('Login with:', credentials);
    // In production, you would call your Django API here
    setIsAuthenticated(true);
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
  };
  
  // Dark mode toggle handler
  const handleToggleTheme = () => {
    setDarkMode(!darkMode);
  };
  
  // Create theme based on dark mode state
  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#4CAF50', // Green for mango theme
        light: darkMode ? '#3a8c3e' : '#E8F5E9',
      },
      secondary: {
        main: '#FFC107', // Amber/Yellow
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: [
        'Poppins',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
  }), [darkMode]);
  
  // Required auth route wrapper
  const RequireAuth = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route 
              path="login" 
              element={
                isAuthenticated ? 
                <Navigate to="/admin" /> : 
                <LoginPage onLogin={handleLogin} />
              } 
            />
          </Route>
          
          {/* Admin routes (protected) */}
          <Route 
            path="/admin" 
            element={
              <RequireAuth>
                <AdminLayout 
                  onLogout={handleLogout} 
                  onToggleTheme={handleToggleTheme}
                  darkMode={darkMode}
                />
              </RequireAuth>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="sales" element={<SalesPage />} />
            <Route path="purchases" element={<PurchasesPage />} />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App; 