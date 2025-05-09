import React from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Badge,
  Heading,
  Spacer,
  useColorMode,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@sb/webapp-api-client';

interface HeaderProps {
  sidebarWidth: string;
  userName: string;
  tenantName: string;
}

/**
 * Header component for authenticated pages
 * Displays user information, tenant context, and navigation controls
 */
export const Header = ({ sidebarWidth, userName, tenantName }: HeaderProps) => {
  const { isOpen, onToggle } = useDisclosure();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  
  // Chakra color mode values
  const headerBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  return (
    <Box
      borderBottom="1px"
      borderColor={borderColor}
      bg={headerBg}
      px={4}
      py={2}
      position="sticky"
      top={0}
      zIndex={100}
    >
      <Flex alignItems="center" justifyContent="space-between">
        {/* Logo and tenant info */}
        <Flex flex={{ base: 1 }} justify="flex-start" align="center" ml={sidebarWidth}>
          <Heading
            as={RouterLink}
            to="/dashboard"
            fontSize="xl"
            fontWeight="bold"
            color="primary.500"
            display={{ base: 'none', md: 'block' }}
          >
            StarMango
          </Heading>
          
          {/* Display current tenant name with badge - important for multi-tenant isolation */}
          <Badge 
            ml={4} 
            colorScheme="primary" 
            fontSize="md" 
            px={2}
            py={1}
            borderRadius="md"
          >
            {tenantName}
          </Badge>
        </Flex>
        
        <Spacer />
        
        {/* Right-side controls */}
        <Stack
          direction="row"
          spacing={3}
          align="center"
          justify="flex-end"
          flex={{ base: 1 }}
        >
          {/* Theme toggle */}
          <IconButton
            aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
            variant="ghost"
            onClick={toggleColorMode}
            icon={
              colorMode === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              )
            }
          />
          
          {/* Notifications icon */}
          <IconButton
            aria-label="Notifications"
            variant="ghost"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            }
          />
          
          {/* User menu */}
          <Menu>
            <MenuButton
              as={Button}
              rounded="full"
              variant="link"
              cursor="pointer"
              minW={0}
            >
              <Avatar size="sm" name={userName} src="https://bit.ly/broken-link" />
            </MenuButton>
            <MenuList>
              <MenuItem as={RouterLink} to="/dashboard/profile">
                Profile
              </MenuItem>
              <MenuItem as={RouterLink} to="/dashboard/settings">
                Settings
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>
                Sign Out
              </MenuItem>
            </MenuList>
          </Menu>
        </Stack>
      </Flex>
    </Box>
  );
};
