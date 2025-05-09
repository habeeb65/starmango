import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@sb/webapp-api-client';
import { useTenant } from '@sb/webapp-tenants';
import { Box, Flex, Spinner, Text, Alert, AlertIcon, Button, Center } from '@chakra-ui/react';
import { Layout } from '../../layout';

interface PrivateRouteProps {
  children: ReactNode;
}

/**
 * Private route component
 * Ensures user is authenticated and has selected a tenant
 * Redirects unauthenticated users to login
 * Implements proper multi-tenant isolation
 */
export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isLoggedIn, isLoading: authLoading, currentUser, getCurrentTenantId } = useAuth();
  const { currentTenant, isLoading: tenantLoading, tenants } = useTenant();
  const location = useLocation();
  const [tenantChecked, setTenantChecked] = useState(false);
  
  // Check if a tenant is selected
  useEffect(() => {
    const tenantId = getCurrentTenantId();
    setTenantChecked(true);
  }, [getCurrentTenantId]);
  
  // If auth is still loading, show a loading spinner
  if (authLoading || tenantLoading || !tenantChecked) {
    return (
      <Center h="100vh">
        <Flex direction="column" align="center">
          <Spinner size="xl" color="primary.500" mb={4} />
          <Text>Loading your account...</Text>
        </Flex>
      </Center>
    );
  }
  
  // If user is not logged in, redirect to login page
  if (!isLoggedIn) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  
  // If user is logged in but no tenant is selected and tenants exist,
  // redirect to landing page where they can select a tenant
  const tenantId = getCurrentTenantId();
  if (!tenantId && tenants.length > 0) {
    return (
      <Box p={8}>
        <Alert 
          status="warning" 
          variant="solid" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          textAlign="center" 
          borderRadius="md" 
          p={8}
        >
          <AlertIcon boxSize={10} mr={0} mb={4} />
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            No Organization Selected
          </Text>
          <Text mb={4}>
            Please select an organization to continue. Organization selection has been moved to the landing page.
          </Text>
          <Button 
            colorScheme="primary" 
            as={Navigate}
            to="/" 
            replace
            state={{ from: location }}
          >
            Go to Landing Page
          </Button>
        </Alert>
      </Box>
    );
  }
  
  // If user is logged in and tenant is selected, render the children
  // wrapped in the main layout
  return <Layout>{children}</Layout>;
};
