import React, { useEffect, useState } from 'react';
import { Box, Button, VStack, Text, Heading, Code, Divider } from '@chakra-ui/react';
import { apiClient } from '@sb/webapp-api-client';
import { useNotifications } from '@sb/webapp-notifications';
import { API_URL } from './config/api';

/**
 * Component for testing API connection with Django backend
 * This is useful for debugging integration issues
 */
export const TestApiConnection = () => {
  const { showSuccess, showError, showInfo } = useNotifications();
  const [apiStatus, setApiStatus] = useState<{loading: boolean; data?: any; error?: string}>({
    loading: false,
  });
  const [authStatus, setAuthStatus] = useState<{loading: boolean; data?: any; error?: string}>({
    loading: false,
  });
  const [tenantStatus, setTenantStatus] = useState<{loading: boolean; data?: any; error?: string}>({
    loading: false,
  });

  // Test basic API connection
  const testApiConnection = async () => {
    setApiStatus({ loading: true });
    try {
      const response = await apiClient.get('/api/v1/health/');
      setApiStatus({ loading: false, data: response.data });
      showSuccess('API Connection Successful', 'Successfully connected to the Django backend');
    } catch (error: any) {
      setApiStatus({ loading: false, error: error.message });
      showError('API Connection Failed', error.message);
    }
  };

  // Test auth endpoints
  const testAuthEndpoints = async () => {
    setAuthStatus({ loading: true });
    try {
      const response = await apiClient.get('/auth/users/me/');
      setAuthStatus({ loading: false, data: response.data });
      showSuccess('Auth Endpoints Working', 'Successfully connected to authentication endpoints');
    } catch (error: any) {
      setAuthStatus({ loading: false, error: error.message });
      showInfo('Auth Endpoint Test', 'You need to be logged in to test this endpoint');
    }
  };

  // Test tenant endpoints
  const testTenantEndpoints = async () => {
    setTenantStatus({ loading: true });
    try {
      const response = await apiClient.get('/api/v1/tenants/');
      setTenantStatus({ loading: false, data: response.data });
      showSuccess('Tenant Endpoints Working', 'Successfully connected to tenant endpoints');
    } catch (error: any) {
      setTenantStatus({ loading: false, error: error.message });
      showInfo('Tenant Endpoint Test', 'You need to be logged in to test this endpoint');
    }
  };

  // Display configuration information on component mount
  useEffect(() => {
    showInfo('API Configuration', `API URL: ${API_URL}`);
  }, []);

  return (
    <Box p={6} bg="white" rounded="md" shadow="md" w="full" maxW="800px" mx="auto" my={8}>
      <Heading as="h1" mb={6} size="lg">API Integration Test</Heading>
      
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading as="h2" size="md" mb={4}>1. Basic API Connection</Heading>
          <Button 
            colorScheme="blue" 
            onClick={testApiConnection}
            isLoading={apiStatus.loading}
            loadingText="Testing..."
            mb={4}
          >
            Test API Connection
          </Button>
          
          {apiStatus.data && (
            <Box p={4} bg="gray.50" rounded="md">
              <Text fontWeight="bold">Success:</Text>
              <Code p={2} display="block" whiteSpace="pre-wrap">
                {JSON.stringify(apiStatus.data, null, 2)}
              </Code>
            </Box>
          )}
          
          {apiStatus.error && (
            <Box p={4} bg="red.50" color="red.700" rounded="md">
              <Text fontWeight="bold">Error:</Text>
              <Text>{apiStatus.error}</Text>
            </Box>
          )}
        </Box>
        
        <Divider />
        
        <Box>
          <Heading as="h2" size="md" mb={4}>2. Authentication Endpoints</Heading>
          <Button 
            colorScheme="green" 
            onClick={testAuthEndpoints}
            isLoading={authStatus.loading}
            loadingText="Testing..."
            mb={4}
          >
            Test Auth Endpoints
          </Button>
          
          {authStatus.data && (
            <Box p={4} bg="gray.50" rounded="md">
              <Text fontWeight="bold">Success:</Text>
              <Code p={2} display="block" whiteSpace="pre-wrap">
                {JSON.stringify(authStatus.data, null, 2)}
              </Code>
            </Box>
          )}
          
          {authStatus.error && (
            <Box p={4} bg="red.50" color="red.700" rounded="md">
              <Text fontWeight="bold">Error:</Text>
              <Text>{authStatus.error}</Text>
            </Box>
          )}
        </Box>
        
        <Divider />
        
        <Box>
          <Heading as="h2" size="md" mb={4}>3. Tenant Endpoints</Heading>
          <Button 
            colorScheme="purple" 
            onClick={testTenantEndpoints}
            isLoading={tenantStatus.loading}
            loadingText="Testing..."
            mb={4}
          >
            Test Tenant Endpoints
          </Button>
          
          {tenantStatus.data && (
            <Box p={4} bg="gray.50" rounded="md">
              <Text fontWeight="bold">Success:</Text>
              <Code p={2} display="block" whiteSpace="pre-wrap">
                {JSON.stringify(tenantStatus.data, null, 2)}
              </Code>
            </Box>
          )}
          
          {tenantStatus.error && (
            <Box p={4} bg="red.50" color="red.700" rounded="md">
              <Text fontWeight="bold">Error:</Text>
              <Text>{tenantStatus.error}</Text>
            </Box>
          )}
        </Box>
      </VStack>
    </Box>
  );
};
