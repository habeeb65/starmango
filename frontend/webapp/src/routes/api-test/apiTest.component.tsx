import React from 'react';
import { Box, Container, Heading, Text, Divider } from '@chakra-ui/react';
import { TestApiConnection } from '../../testApiConnection';

/**
 * API Test page wrapper with explanatory text
 */
export const ApiTestPage = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <Box textAlign="center" mb={8}>
        <Heading as="h1" size="xl" mb={3}>
          API Integration Test
        </Heading>
        <Text fontSize="lg" color="gray.600">
          Verify your Django backend connection and multi-tenant isolation
        </Text>
      </Box>
      
      <Divider mb={8} />
      
      <Box maxW="800px" mx="auto">
        <Text mb={6}>
          This page helps you verify that your React frontend is properly connected to your Django backend.
          It tests the basic API connection, authentication endpoints, and tenant endpoints to ensure
          everything is working correctly.
        </Text>
        
        <TestApiConnection />
      </Box>
    </Container>
  );
};
