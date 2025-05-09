import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '@sb/webapp-api-client';
import { Layout } from '../shared/components/layout';
import { AuthRoutesContainer } from './auth/authRoutesContainer.component';
import { PrivateRoutes } from './auth/privateRoutes.component';
import { RoutesConfig } from './config/routes';

/**
 * Main App component that defines the routing structure
 */
export const App = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Layout>
      <Routes>
        {/* Public routes */}
        <Route 
          path={RoutesConfig.home}
          element={
            isLoggedIn 
              ? <Navigate to={RoutesConfig.dashboard} /> 
              : <Navigate to={RoutesConfig.auth.login} />
          } 
        />
        
        {/* Auth routes - for non-authenticated users */}
        <Route path={RoutesConfig.auth.index} element={<AuthRoutesContainer />}>
          <Route 
            path={RoutesConfig.auth.login} 
            element={React.lazy(() => import('../routes/auth/login'))}
          />
          <Route 
            path={RoutesConfig.auth.signup} 
            element={React.lazy(() => import('../routes/auth/signup'))}
          />
          <Route 
            path={RoutesConfig.auth.passwordReset} 
            element={React.lazy(() => import('../routes/auth/passwordReset'))}
          />
        </Route>
        
        {/* Protected routes - require authentication */}
        <Route path={RoutesConfig.private.index} element={<PrivateRoutes />}>
          <Route 
            path={RoutesConfig.dashboard} 
            element={React.lazy(() => import('../routes/dashboard'))}
          />
          <Route 
            path="/profile" 
            element={<div>Profile Page (Coming Soon)</div>}
          />
          <Route 
            path="/settings" 
            element={<div>Settings Page (Coming Soon)</div>}
          />
        </Route>

        {/* 404 route - catch all unmatched routes */}
        <Route path="*" element={<Navigate to={RoutesConfig.home} replace />} />
      </Routes>
    </Layout>
  );
};
