import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Spinner, Text, VStack, Center } from '@chakra-ui/react';

/**
 * Force Login Component
 * This directly sets auth tokens and redirects to dashboard
 */
export const ForceLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Set up authentication
    try {
      console.log('Setting up authentication...');
      
      // Create user data
      const fakeUser = {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        tenant: {
          id: '1',
          name: 'Default Organization',
          slug: 'default-organization'
        }
      };
      
      // Set all auth tokens
      localStorage.setItem('starmango_access_token', 'direct-access-token');
      localStorage.setItem('starmango_refresh_token', 'direct-refresh-token');
      localStorage.setItem('starmango_current_user', JSON.stringify(fakeUser));
      localStorage.setItem('starmango_current_tenant', '1');
      
      console.log('Auth data set successfully, redirecting...');
      
      // Force reload to apply auth changes then redirect
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Auth setup failed:', error);
    }
  }, [navigate]);

  return (
    <Center height="100vh">
      <VStack spacing={4}>
        <Spinner 
          thickness="4px"
          speed="0.65s"
          color="green.500"
          size="xl"
        />
        <Box textAlign="center">
          <Text fontSize="xl" fontWeight="bold">
            Auto-Login In Progress...
          </Text>
          <Text mt={2}>
            Setting up authentication and redirecting to dashboard...
          </Text>
        </Box>
      </VStack>
    </Center>
  );
};

export default ForceLogin;
