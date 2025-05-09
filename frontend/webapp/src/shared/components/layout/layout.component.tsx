import React, { ReactNode } from 'react';
import {
  Box,
  Drawer,
  DrawerContent,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useAuth } from '@sb/webapp-api-client';
import { Header } from '../header';
import { Sidebar } from '../sidebar';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Main application layout component
 * Manages sidebar, header, and main content area
 */
export const Layout = ({ children }: LayoutProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoggedIn } = useAuth();
  
  // Background color for the main content area
  const bgColor = useColorModeValue('gray.50', 'gray.800');

  return (
    <Box minH="100vh" bg={bgColor}>
      <Header onMobileNavToggle={onOpen} />
      
      {isLoggedIn && (
        <>
          <Sidebar
            onClose={onClose}
            display={{ base: 'none', md: 'block' }}
          />
          <Drawer
            isOpen={isOpen}
            placement="left"
            onClose={onClose}
            returnFocusOnClose={false}
            onOverlayClick={onClose}
            size="full"
          >
            <DrawerContent>
              <Sidebar onClose={onClose} />
            </DrawerContent>
          </Drawer>
        </>
      )}
      
      <Box 
        ml={{ base: 0, md: isLoggedIn ? 60 : 0 }}
        transition=".3s ease"
      >
        <Box 
          as="main"
          p={4}
          minH="calc(100vh - 4rem)"
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
