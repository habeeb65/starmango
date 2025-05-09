import React from 'react';
import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { FallbackProps } from 'react-error-boundary';

/**
 * Error fallback component displayed when an unhandled error occurs
 */
export const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6} align="center" textAlign="center">
        <Box
          bg="red.50"
          p={6}
          borderRadius="md"
          borderWidth="1px"
          borderColor="red.200"
          width="100%"
        >
          <Heading as="h1" size="xl" mb={4} color="red.600">
            Something went wrong
          </Heading>
          
          <Text mb={4} color="gray.700">
            We apologize for the inconvenience. An unexpected error has occurred.
          </Text>
          
          <Box 
            p={4} 
            bg="gray.800" 
            color="white" 
            borderRadius="md" 
            fontFamily="mono" 
            fontSize="sm" 
            my={4}
            textAlign="left"
            overflowX="auto"
          >
            <Text>{error.message}</Text>
            {error.stack && (
              <Text mt={2} fontSize="xs" color="gray.400">
                {error.stack.split('\n').slice(0, 3).join('\n')}
              </Text>
            )}
          </Box>
          
          <Button 
            colorScheme="red" 
            onClick={resetErrorBoundary}
            mt={4}
          >
            Try again
          </Button>
        </Box>
        
        <Text color="gray.500" fontSize="sm">
          If the problem persists, please contact support.
        </Text>
      </VStack>
    </Container>
  );
};
