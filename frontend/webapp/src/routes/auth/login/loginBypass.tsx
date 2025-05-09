import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Spinner, Center, Text, VStack } from '@chakra-ui/react';

/**
 * Direct Dashboard Bypass Component
 * This component automatically sets authentication data and redirects to the dashboard
 */
export const LoginBypass = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Create fake auth data
    const setupAuthAndRedirect = () => {
      try {
        // Create tenant and user data
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
        
        // Set all required localStorage items for auth
        localStorage.setItem('starmango_access_token', 'direct-access-token');
        localStorage.setItem('starmango_refresh_token', 'direct-refresh-token');
        localStorage.setItem('starmango_current_user', JSON.stringify(fakeUser));
        localStorage.setItem('starmango_current_tenant', '1');
        
        console.log('Auth data set successfully');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } catch (error) {
        console.error('Error setting up auth data:', error);
      }
    };

    // Run the setup function
    setupAuthAndRedirect();
  }, [navigate]);

  return (
    <Center height="100vh">
      <VStack spacing={4}>
        <Spinner 
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="green.500"
          size="xl"
        />
        <Box textAlign="center" p={5}>
          <Text fontSize="xl" fontWeight="bold">
            Accessing Dashboard...
          </Text>
          <Text color="gray.600" mt={2}>
            Setting up authentication and redirecting...
          </Text>
        </Box>
      </VStack>
    </Center>
  );
};

export default LoginBypass;
