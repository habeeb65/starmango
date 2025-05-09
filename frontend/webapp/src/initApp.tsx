import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ApolloProvider } from '@apollo/client';

import { AuthProvider } from '@sb/webapp-api-client';
import { TenantProvider } from '@sb/webapp-tenants';
import { theme } from '@sb/webapp-core';
import { NotificationsProvider, NotificationsManager } from '@sb/webapp-notifications';

import { queryClient } from './services/reactQuery';
import { apolloClient } from './services/apollo';
import { ApiProvider } from './shared/providers/api';
import App from './app.component';

/**
 * Initialize the application with all necessary providers
 * This sets up the connection between the React frontend and the Django backend
 */
export const initApp = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            {/* Authentication provider that connects to Django authentication endpoints */}
            <AuthProvider>
              {/* Multi-tenant provider for tenant isolation */}
              <TenantProvider>
                {/* API provider for REST API communication */}
                <ApiProvider>
                  {/* Apollo provider for GraphQL communication */}
                  <ApolloProvider client={apolloClient}>
                    {/* Notifications provider for displaying feedback from API calls */}
                    <NotificationsProvider>
                      <App />
                      <NotificationsManager />
                      {process.env.NODE_ENV !== 'production' && (
                        <ReactQueryDevtools initialIsOpen={false} />
                      )}
                    </NotificationsProvider>
                  </ApolloProvider>
                </ApiProvider>
              </TenantProvider>
            </AuthProvider>
          </QueryClientProvider>
        </ChakraProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};
