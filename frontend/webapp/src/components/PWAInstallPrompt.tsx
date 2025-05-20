import React, { useState, useEffect } from 'react';
import { Box, Button, Text, useToast, VStack, Icon } from '@chakra-ui/react';
import { FaDownload } from 'react-icons/fa';

const PWAInstallPrompt: React.FC = () => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 76+ from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setInstallPrompt(e);
      // Show the install button
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) {
      return;
    }

    // Show the install prompt
    installPrompt.prompt();

    // Wait for the user to respond to the prompt
    installPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        toast({
          title: 'App installed successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Installation declined',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      }
      // Clear the saved prompt since it can't be used again
      setInstallPrompt(null);
      setShowPrompt(false);
    });
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <Box 
      position="fixed" 
      bottom="20px" 
      right="20px" 
      bg="white" 
      boxShadow="lg" 
      borderRadius="md" 
      p={4} 
      zIndex={999}
      maxWidth="300px"
    >
      <VStack spacing={3} align="stretch">
        <Text fontWeight="bold">Install StarMango App</Text>
        <Text fontSize="sm">
          Install this app on your device for quick and easy access when you're on the go.
        </Text>
        <Button 
          colorScheme="green" 
          leftIcon={<Icon as={FaDownload} />} 
          onClick={handleInstallClick}
        >
          Install Now
        </Button>
      </VStack>
    </Box>
  );
};

export default PWAInstallPrompt;