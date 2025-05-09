import React from 'react';
import { QueryClient } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from 'react-error-boundary';

import { App } from './app.component';
import { ErrorFallback } from './errorFallback.component';
import { theme } from './theme';
import { createQueryClient } from './config/reactQuery';
import { ApiProvider } from './providers/apiProvider';
import { ApolloProvider } from './providers/apollo';

/**
 * Initialize the application with all necessary providers
 */
export const initApp = () => {
  const queryClient = createQueryClient();
  
  return {
    App: () => (
      <React.StrictMode>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <HelmetProvider>
            <ChakraProvider theme={theme}>
              <ApiProvider>
                <ApolloProvider>
                  <Router>
                    <App />
                  </Router>
                </ApolloProvider>
              </ApiProvider>
            </ChakraProvider>
          </HelmetProvider>
        </ErrorBoundary>
      </React.StrictMode>
    ),
    queryClient,
  };
};
