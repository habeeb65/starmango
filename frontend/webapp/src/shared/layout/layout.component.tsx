import React, { ReactNode } from 'react';
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { useAuth } from '@sb/webapp-api-client';
import { useTenant } from '@sb/webapp-tenants';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Main application layout for authenticated pages
 * Implements the multi-tenant isolation approach
 */
export const Layout = ({ children }: LayoutProps) => {
  const { currentUser } = useAuth();
  const { currentTenant } = useTenant();
  
  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Sidebar width - can be customized
  const sidebarWidth = '250px';
  
  return (
    <Flex h="100vh" flexDirection="column">
      {/* Header */}
      <Header 
        sidebarWidth={sidebarWidth} 
        userName={currentUser?.username || ''}
        tenantName={currentTenant?.name || 'No Organization Selected'}
      />
      
      {/* Content area with sidebar */}
      <Flex flex="1" overflowY="hidden">
        <Sidebar width={sidebarWidth} />
        
        {/* Main content */}
        <Box
          flex="1"
          overflowY="auto"
          bg={bgColor}
          p={4}
          ml={`${sidebarWidth}`}
          borderLeft="1px solid"
          borderColor={borderColor}
        >
          {/* Display current tenant identifier for transparency - important for multi-tenant isolation */}
          {currentTenant && (
            <Box 
              mb={4} 
              p={2} 
              bg={useColorModeValue('primary.50', 'primary.900')} 
              color={useColorModeValue('primary.700', 'primary.200')}
              borderRadius="md"
              fontSize="sm"
              fontWeight="medium"
            >
              Current Organization: {currentTenant.name} (ID: {currentTenant.tenant_id})
            </Box>
          )}
          
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};
