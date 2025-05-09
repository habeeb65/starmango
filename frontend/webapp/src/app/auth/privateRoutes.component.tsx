import React, { Suspense } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Box, Center, Spinner } from '@chakra-ui/react';
import { useAuth } from '@sb/webapp-api-client';
import { RoutesConfig } from '../config/routes';

/**
 * Component to protect routes that require authentication
 * Redirects to login if user is not authenticated
 */
export const PrivateRoutes = () => {
  const { isLoggedIn, isInitialized } = useAuth();
  const location = useLocation();

  // Show loading indicator while auth state is being initialized
  if (!isInitialized) {
    return (
      <Center h="100vh">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="primary.500"
          size="xl"
        />
      </Center>
    );
  }

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    // Save the current location to redirect back after login
    return (
      <Navigate
        to={RoutesConfig.auth.login}
        replace
        state={{ from: location }}
      />
    );
  }

  // If logged in, render the child routes
  return (
    <Box>
      <Suspense
        fallback={
          <Center py={8}>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="primary.500"
              size="xl"
            />
          </Center>
        }
      >
        <Outlet />
      </Suspense>
    </Box>
  );
};
