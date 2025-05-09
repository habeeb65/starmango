import React from 'react';
import {
  Box,
  CloseButton,
  Flex,
  Icon,
  Text,
  BoxProps,
  Divider,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useTenant } from '@sb/webapp-tenants';

// Navigation item interface
interface NavItemProps extends BoxProps {
  icon: React.ReactElement;
  path: string;
  children: React.ReactNode;
}

// Sidebar props
interface SidebarProps extends BoxProps {
  onClose: () => void;
}

// Navigation items data
const NAV_ITEMS = [
  {
    name: 'Dashboard',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20px">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    path: '/dashboard',
  },
  {
    name: 'Projects',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20px">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    path: '/projects',
  },
  {
    name: 'Tasks',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20px">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    path: '/tasks',
  },
  {
    name: 'Calendar',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20px">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    path: '/calendar',
  },
  {
    name: 'Reports',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20px">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    path: '/reports',
  },
  {
    name: 'Team',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20px">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    path: '/team',
  },
];

// Settings and profile nav items
const BOTTOM_NAV_ITEMS = [
  {
    name: 'Settings',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20px">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    path: '/settings',
  },
  {
    name: 'Profile',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20px">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    path: '/profile',
  },
];

/**
 * Individual navigation item component
 */
const NavItem = ({ icon, children, path, ...rest }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === path;
  
  return (
    <Box
      as={RouterLink}
      to={path}
      style={{ textDecoration: 'none' }}
      _focus={{ outline: 'none' }}
    >
      <Flex
        align="center"
        p="3"
        mx="3"
        borderRadius="md"
        role="group"
        cursor="pointer"
        bg={isActive ? 'primary.50' : 'transparent'}
        color={isActive ? 'primary.700' : 'gray.600'}
        fontWeight={isActive ? 'semibold' : 'medium'}
        _hover={{
          bg: 'primary.50',
          color: 'primary.700',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="3"
            boxSize="5"
            color={isActive ? 'primary.500' : 'gray.500'}
            _groupHover={{
              color: 'primary.500',
            }}
            as={() => icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

/**
 * Sidebar component
 */
export const Sidebar = ({ onClose, ...rest }: SidebarProps) => {
  const { currentTenant } = useTenant();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box
      borderRight="1px"
      borderColor={borderColor}
      bg={bgColor}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" justifyContent="space-between" px="6">
        <Flex alignItems="center">
          {currentTenant?.logo && (
            <Box mr="2" h="8" w="8">
              <img 
                src={currentTenant.logo} 
                alt={currentTenant.name} 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </Box>
          )}
          <Text fontSize="lg" fontWeight="bold" color="gray.800">
            {currentTenant?.name || 'Organization'}
          </Text>
        </Flex>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      
      <Box h="calc(100vh - 5rem)" overflowY="auto" py="2">
        <VStack spacing="1" align="stretch">
          {/* Main navigation items */}
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.name} icon={item.icon} path={item.path}>
              {item.name}
            </NavItem>
          ))}
          
          <Divider my="2" />
          
          {/* Bottom navigation items */}
          {BOTTOM_NAV_ITEMS.map((item) => (
            <NavItem key={item.name} icon={item.icon} path={item.path}>
              {item.name}
            </NavItem>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};
