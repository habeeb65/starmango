import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy load route components for better performance
const Landing = lazy(() => import('./routes/landing'));
const Dashboard = lazy(() => import('./routes/dashboard'));
const Login = lazy(() => import('./routes/auth/login'));
const Signup = lazy(() => import('./routes/auth/signup'));
const PasswordReset = lazy(() => import('./routes/auth/passwordReset'));
const ApiTest = lazy(() => import('./routes/api-test'));

// Define route paths as constants for reuse
export const RoutePaths = {
  // Public routes
  landing: '/',
  apiTest: '/api-test', // New API test route for integration testing
  
  // Auth routes
  login: '/auth/login',
  signup: '/auth/signup',
  passwordReset: '/auth/password-reset',
  
  // Protected routes
  dashboard: '/dashboard',
  inventory: '/dashboard/inventory',
  vendors: '/dashboard/vendors',
  customers: '/dashboard/customers',
  tenants: '/dashboard/tenants',
  accounts: '/dashboard/accounts',
};

/**
 * Public routes accessible to all users
 */
export const publicRoutes: RouteObject[] = [
  {
    path: RoutePaths.landing,
    element: <Landing />,
  },
  {
    path: RoutePaths.apiTest,
    element: <ApiTest />,
  },
];

/**
 * Authentication routes
 * These routes are accessible only to users who are NOT logged in
 */
export const authRoutes: RouteObject[] = [
  {
    path: RoutePaths.login,
    element: <Login />,
  },
  {
    path: RoutePaths.signup,
    element: <Signup />,
  },
  {
    path: RoutePaths.passwordReset,
    element: <PasswordReset />,
  },
];

/**
 * Protected routes for authenticated users only
 * These routes are accessible only to logged in users
 */
export const protectedRoutes: RouteObject[] = [
  {
    path: RoutePaths.dashboard,
    element: <Dashboard />,
  },
  {
    path: RoutePaths.inventory,
    element: <Dashboard />,
  },
  {
    path: RoutePaths.vendors,
    element: <Dashboard />,
  },
  {
    path: RoutePaths.customers,
    element: <Dashboard />,
  },
  {
    path: RoutePaths.tenants,
    element: <Dashboard />,
  },
  {
    path: RoutePaths.accounts,
    element: <Dashboard />,
  },
];

// Combine all routes
export const routes: RouteObject[] = [
  ...publicRoutes,
  ...authRoutes,
  ...protectedRoutes,
];
