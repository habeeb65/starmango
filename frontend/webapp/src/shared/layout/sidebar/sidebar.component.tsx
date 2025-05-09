import React from 'react';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  VStack,
  Icon,
  Link,
  useColorModeValue,
  Divider,
  Badge,
  Tooltip,
} from '@chakra-ui/react';
import { useTenant } from '@sb/webapp-tenants';
import { useAuth } from '@sb/webapp-api-client';

interface SidebarProps {
  width: string;
}

interface NavItemProps {
  to: string;
  icon: React.ReactElement;
  label: string;
  tenantRequired?: boolean;
  badge?: string;
}

/**
 * Sidebar navigation component for authenticated pages
 * Implements proper multi-tenant context
 */
export const Sidebar = ({ width }: SidebarProps) => {
  const { currentTenant } = useTenant();
  const { currentUser } = useAuth();
  const location = useLocation();
  
  // Chakra color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const activeColor = useColorModeValue('primary.50', 'gray.700');
  const activeBorderColor = useColorModeValue('primary.500', 'primary.400');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  
  // Check if a tenant is selected
  const hasTenant = !!currentTenant;
  
  // Navigation items with proper tenant-aware routing
  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
      tenantRequired: false,
    },
    {
      to: '/dashboard/inventory',
      label: 'Inventory',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      ),
      tenantRequired: true,
    },
    {
      to: '/dashboard/vendors',
      label: 'Vendors',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
        </svg>
      ),
      tenantRequired: true,
    },
    {
      to: '/dashboard/customers',
      label: 'Customers',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
      tenantRequired: true,
    },
  ];
  
  // Administrative navigation items
  const adminNavItems = [
    {
      to: '/dashboard/tenants',
      label: 'Organizations',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
      tenantRequired: false,
    },
    {
      to: '/dashboard/settings',
      label: 'Settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      tenantRequired: false,
    },
  ];
  
  // Helper component for individual navigation items
  const NavItem = ({ to, icon, label, tenantRequired, badge }: NavItemProps) => {
    const isActive = location.pathname === to;
    const isDisabled = tenantRequired && !hasTenant;
    
    return (
      <Tooltip 
        label={isDisabled ? "Select an organization first" : ""}
        isDisabled={!isDisabled}
        placement="right"
      >
        <Link
          as={RouterLink}
          to={isDisabled ? '#' : to}
          w="full"
          borderRadius="md"
          position="relative"
          py={3}
          px={4}
          display="flex"
          alignItems="center"
          textDecoration="none"
          bg={isActive ? activeColor : "transparent"}
          color={isActive ? "primary.600" : textColor}
          fontWeight={isActive ? "semibold" : "medium"}
          _hover={{
            bg: isDisabled ? "transparent" : hoverBg,
            color: isDisabled ? textColor : isActive ? "primary.600" : "gray.600",
          }}
          opacity={isDisabled ? 0.5 : 1}
          cursor={isDisabled ? "not-allowed" : "pointer"}
          pointerEvents={isDisabled ? "none" : "auto"}
          borderLeft="3px solid"
          borderLeftColor={isActive ? activeBorderColor : "transparent"}
        >
          <Flex align="center" width="100%">
            <Box mr={3} color={isActive ? "primary.500" : "inherit"}>
              {icon}
            </Box>
            <Text>{label}</Text>
            {badge && (
              <Badge ml="auto" colorScheme="primary" borderRadius="full">
                {badge}
              </Badge>
            )}
          </Flex>
        </Link>
      </Tooltip>
    );
  };
  
  return (
    <Box
      as="nav"
      w={width}
      h="calc(100vh - 60px)"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      position="fixed"
      top="60px"
      left="0"
      pt={4}
      overflowY="auto"
    >
      {/* Main navigation section */}
      <VStack spacing={1} align="stretch" px={3}>
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            tenantRequired={item.tenantRequired}
          />
        ))}
      </VStack>
      
      <Divider my={6} />
      
      {/* Admin section */}
      <Text px={6} mb={2} fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">
        Admin
      </Text>
      <VStack spacing={1} align="stretch" px={3}>
        {adminNavItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            tenantRequired={item.tenantRequired}
          />
        ))}
      </VStack>
      
      {/* Tenant context information at the bottom */}
      {currentTenant && (
        <Box mt="auto" p={4} borderTop="1px solid" borderColor={borderColor}>
          <Text fontSize="xs" color="gray.500" mb={1}>
            Current Organization
          </Text>
          <Text fontWeight="bold" color={textColor} noOfLines={1}>
            {currentTenant.name}
          </Text>
          <Text fontSize="xs" color="gray.500">
            ID: {currentTenant.tenant_id}
          </Text>
        </Box>
      )}
    </Box>
  );
};
