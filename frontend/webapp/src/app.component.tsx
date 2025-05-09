import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Spinner, Center, useColorModeValue } from '@chakra-ui/react';
import { routes } from './routes';

/**
 * App component that defines the application routes
 * Implements multi-tenant isolation throughout the application
 */
const App = () => {
  // Fallback component for lazy-loaded routes
  const LoadingFallback = () => (
    <Center minH="100vh" bg={useColorModeValue('white', 'gray.800')}>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor={useColorModeValue('gray.200', 'gray.700')}
        color="primary.500"
        size="xl"
        label="Loading application..."
      />
    </Center>
  );
  
  return (
    <Box minH="100vh">
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Define all application routes */}
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
          
          {/* Catch-all route - redirect to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Box>
  );
};

export default App;
