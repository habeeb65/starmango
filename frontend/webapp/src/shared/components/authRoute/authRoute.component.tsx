import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@sb/webapp-api-client';
import { Box, Container, Flex, useColorModeValue } from '@chakra-ui/react';

interface AuthRouteProps {
  children: ReactNode;
}

/**
 * Auth route component
 * Redirects authenticated users to dashboard, allows unauthenticated users to access auth pages
 */
export const AuthRoute = ({ children }: AuthRouteProps) => {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();
  
  // Background styles
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const boxBg = useColorModeValue('white', 'gray.800');
  const boxShadow = useColorModeValue('lg', 'dark-lg');
  
  // If loading, show nothing (will be handled by suspense)
  if (isLoading) {
    return null;
  }
  
  // If user is already logged in, redirect to dashboard
  if (isLoggedIn) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }
  
  // Otherwise, render auth form in a centered layout
  return (
    <Box bg={bgColor} minH="100vh">
      <Flex
        w="full"
        h="100vh"
        align="center"
        justify="center"
        px={4}
      >
        <Box
          bg={boxBg}
          rounded="lg"
          boxShadow={boxShadow}
          p={8}
          maxW="md"
          w="full"
        >
          {children}
        </Box>
      </Flex>
    </Box>
  );
};
