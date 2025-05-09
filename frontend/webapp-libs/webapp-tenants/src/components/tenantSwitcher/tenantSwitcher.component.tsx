import React, { useState } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
  useColorModeValue,
  Box,
  Flex,
  MenuDivider,
  Icon,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  useDisclosure,
  Tooltip,
} from '@chakra-ui/react';
import { useTenant } from '../../api/hooks';
import { useAuth } from '@sb/webapp-api-client';
import { TenantInput } from '../../api/types';

interface TenantSwitcherProps {
  showOnLandingOnly?: boolean;
  variant?: 'default' | 'minimal';
}

/**
 * TenantSwitcher component
 * Allows users to switch between tenants and create new ones
 */
export const TenantSwitcher = ({ showOnLandingOnly = false, variant = 'default' }: TenantSwitcherProps) => {
  const { tenants, currentTenant, switchTenant, createTenant, isLoading } = useTenant();
  const { currentUser } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // State for new tenant form
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantError, setNewTenantError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  // Get current path to check if we're on the landing page
  const isLandingPage = window.location.pathname === '/' || window.location.pathname === '/landing';
  
  // Don't show on dashboard if showOnLandingOnly is true
  if (showOnLandingOnly && !isLandingPage) {
    return null;
  }
  
  // Chakra UI colors
  const menuBg = useColorModeValue('white', 'gray.800');
  const menuBorder = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const activeBg = useColorModeValue('gray.200', 'gray.600');
  
  // Handler for creating a new tenant
  const handleCreateTenant = async () => {
    if (!newTenantName.trim()) {
      setNewTenantError('Organization name is required');
      return;
    }
    
    setIsCreating(true);
    setNewTenantError('');
    
    try {
      const newTenant: TenantInput = {
        name: newTenantName.trim(),
        tenant_id: `tenant-${Date.now().toString(36)}`, // Generate a unique tenant identifier
      };
      
      const createdTenant = await createTenant(newTenant);
      
      // Automatically switch to the new tenant
      await switchTenant(createdTenant.id);
      
      // Reset form and close modal
      setNewTenantName('');
      onClose();
    } catch (error) {
      setNewTenantError(error instanceof Error ? error.message : 'Failed to create organization');
    } finally {
      setIsCreating(false);
    }
  };
  
  // Handler for switching tenants
  const handleSwitchTenant = async (tenantId: string | number) => {
    try {
      await switchTenant(tenantId);
    } catch (error) {
      console.error('Failed to switch tenant:', error);
    }
  };
  
  // Simplified version for the minimal variant
  if (variant === 'minimal') {
    return (
      <Box>
        <Menu>
          <Tooltip label="Switch Organization" placement="bottom">
            <MenuButton 
              as={Button} 
              variant="ghost" 
              size="sm" 
              isLoading={isLoading}
            >
              <Flex alignItems="center">
                <Text fontWeight="medium" isTruncated maxW="150px">
                  {currentTenant?.name || 'Select Organization'}
                </Text>
                <Icon 
                  as={() => (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )} 
                  ml={1} 
                />
              </Flex>
            </MenuButton>
          </Tooltip>
          <MenuList bg={menuBg} borderColor={menuBorder} shadow="lg">
            {tenants.map(tenant => (
              <MenuItem
                key={tenant.id}
                onClick={() => handleSwitchTenant(tenant.id)}
                bg={tenant.id === currentTenant?.id ? activeBg : 'transparent'}
                _hover={{ bg: hoverBg }}
              >
                <Text fontWeight={tenant.id === currentTenant?.id ? 'bold' : 'normal'}>
                  {tenant.name}
                </Text>
              </MenuItem>
            ))}
            <MenuDivider />
            <MenuItem onClick={onOpen} _hover={{ bg: hoverBg }}>
              <Text color="primary.500">+ Add new organization</Text>
            </MenuItem>
          </MenuList>
        </Menu>
        
        {/* Create Tenant Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Organization</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isInvalid={!!newTenantError}>
                <FormLabel>Organization Name</FormLabel>
                <Input
                  value={newTenantName}
                  onChange={(e) => setNewTenantName(e.target.value)}
                  placeholder="Enter organization name"
                />
                {newTenantError && <FormErrorMessage>{newTenantError}</FormErrorMessage>}
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="primary" 
                onClick={handleCreateTenant}
                isLoading={isCreating}
              >
                Create
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    );
  }

  // Default full variant with more details
  return (
    <Box>
      <Menu>
        <MenuButton
          as={Button}
          variant="outline"
          isLoading={isLoading}
          aria-label="Switch organization"
        >
          <Flex alignItems="center">
            <Box textAlign="left" mr={2}>
              <Text fontWeight="medium" isTruncated maxW="200px">
                {currentTenant?.name || 'Select Organization'}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {currentUser?.email}
              </Text>
            </Box>
            <Icon 
              as={() => (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )} 
            />
          </Flex>
        </MenuButton>
        <MenuList bg={menuBg} borderColor={menuBorder} shadow="lg" minW="240px">
          <Box px={4} py={2}>
            <Text fontWeight="medium" fontSize="sm" color="gray.500">
              Your Organizations
            </Text>
          </Box>
          
          {tenants.map(tenant => (
            <MenuItem
              key={tenant.id}
              onClick={() => handleSwitchTenant(tenant.id)}
              bg={tenant.id === currentTenant?.id ? activeBg : 'transparent'}
              _hover={{ bg: hoverBg }}
            >
              <Flex alignItems="center" justifyContent="space-between" width="100%">
                <Text fontWeight={tenant.id === currentTenant?.id ? 'bold' : 'normal'}>
                  {tenant.name}
                </Text>
                {tenant.id === currentTenant?.id && (
                  <Badge size="sm" colorScheme="primary" ml={2}>
                    Current
                  </Badge>
                )}
              </Flex>
            </MenuItem>
          ))}
          
          <MenuDivider />
          
          <MenuItem onClick={onOpen} _hover={{ bg: hoverBg }}>
            <Flex alignItems="center">
              <Icon 
                as={() => (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )} 
                mr={2}
                color="primary.500"
              />
              <Text color="primary.500">Create New Organization</Text>
            </Flex>
          </MenuItem>
        </MenuList>
      </Menu>
      
      {/* Create Tenant Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Organization</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              Create a new organization to manage separate projects, teams, and resources.
            </Text>
            <FormControl isInvalid={!!newTenantError}>
              <FormLabel>Organization Name</FormLabel>
              <Input
                value={newTenantName}
                onChange={(e) => setNewTenantName(e.target.value)}
                placeholder="Enter organization name"
              />
              {newTenantError && <FormErrorMessage>{newTenantError}</FormErrorMessage>}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="primary" 
              onClick={handleCreateTenant}
              isLoading={isCreating}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
