import React from 'react';
import { 
  Box, 
  Flex, 
  IconButton, 
  HStack, 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  MenuDivider, 
  Button, 
  Avatar, 
  Text, 
  useColorModeValue, 
  useDisclosure 
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@sb/webapp-api-client';
import { NotificationBell } from '@sb/webapp-notifications';
import { TenantSwitcher } from '@sb/webapp-tenants';

// Header component props
interface HeaderProps {
  onMobileNavToggle?: () => void;
}

/**
 * Header component for the application
 * Shows navigation, user menu, notifications, and tenant switcher
 */
export const Header: React.FC<HeaderProps> = ({ onMobileNavToggle }) => {
  const { isLoggedIn, logout, currentUser } = useAuth();
  const navigate = useNavigate();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Handle navigation to login or signup
  const handleAuthNavigation = (path: string) => {
    navigate(path);
  };

  // Handle logout action
  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex="sticky"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      shadow="sm"
      h="4rem"
    >
      <Flex
        h="100%"
        px={{ base: 4, md: 6 }}
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Left side: Logo and mobile menu button */}
        <Flex alignItems="center">
          {isLoggedIn && (
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              onClick={onMobileNavToggle}
              variant="ghost"
              aria-label="Toggle navigation menu"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24px">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              }
              mr={2}
            />
          )}
          
          {/* Logo */}
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="primary.600"
            cursor="pointer"
            onClick={() => navigate('/')}
          >
            StarMango
          </Text>
        </Flex>

        {/* Right side: Actions and user menu */}
        <HStack spacing={4}>
          {isLoggedIn ? (
            <>
              {/* Tenant switcher */}
              <Box display={{ base: 'none', md: 'block' }}>
                <TenantSwitcher />
              </Box>

              {/* Notifications */}
              <NotificationBell />

              {/* User menu */}
              <Menu>
                <MenuButton 
                  as={Button} 
                  variant="ghost" 
                  rounded="full" 
                  p={1}
                >
                  <Avatar 
                    size="sm" 
                    name={currentUser?.username || 'User'} 
                    src={currentUser?.avatar || undefined}
                  />
                </MenuButton>
                <MenuList zIndex="popover">
                  <Text px={4} py={2} fontWeight="medium">
                    {currentUser?.email}
                  </Text>
                  <MenuDivider />
                  <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
                  <MenuItem onClick={() => navigate('/settings')}>Settings</MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                onClick={() => handleAuthNavigation('/auth/login')}
              >
                Log in
              </Button>
              <Button 
                colorScheme="primary" 
                onClick={() => handleAuthNavigation('/auth/signup')}
              >
                Sign up
              </Button>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};
