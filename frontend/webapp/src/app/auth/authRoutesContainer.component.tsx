import React, { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Box, Center, Container, Flex, Spinner, Text, VStack } from '@chakra-ui/react';
import { useAuth } from '@sb/webapp-api-client';
import { RoutesConfig } from '../config/routes';

/**
 * Container for authentication-related routes (login, signup, password reset)
 * Redirects to dashboard if user is already logged in
 */
export const AuthRoutesContainer = () => {
  const { isLoggedIn } = useAuth();

  // Redirect to dashboard if already logged in
  if (isLoggedIn) {
    return <Navigate to={RoutesConfig.dashboard} replace />;
  }

  return (
    <Box 
      minH="100vh" 
      bg="gray.50"
      py={{ base: 6, md: 12 }}
    >
      <Container maxW="md">
        <VStack spacing={8} align="stretch">
          <Box 
            bg="white" 
            p={{ base: 6, md: 8 }} 
            rounded="xl" 
            shadow="lg"
            borderWidth="1px"
            borderColor="gray.100"
          >
            <Flex 
              mb={6} 
              justify="center" 
              align="center" 
              direction="column"
            >
              <Text 
                fontSize="2xl" 
                fontWeight="bold" 
                color="primary.600"
                mb={1}
              >
                StarMango
              </Text>
              <Text 
                fontSize="sm" 
                color="gray.500" 
                textAlign="center"
              >
                Enterprise Multi-Tenant Platform
              </Text>
            </Flex>
            
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
          
          <Text 
            fontSize="xs" 
            color="gray.500" 
            textAlign="center"
          >
            © {new Date().getFullYear()} StarMango. All rights reserved.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};
