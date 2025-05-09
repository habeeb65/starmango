import React from 'react';
import {
  Box,
  CloseButton,
  Stack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { CheckCircleIcon, InfoIcon, WarningTwoIcon } from '@chakra-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from './useNotifications';
import { NotificationType } from './notification.types';

/**
 * Component for displaying a single notification
 */
const NotificationItem = ({ id, type, title, message, onClose }: {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  onClose: (id: string) => void;
}) => {
  const getIcon = () => {
    switch (type) {
      case NotificationType.SUCCESS:
        return CheckCircleIcon;
      case NotificationType.INFO:
        return InfoIcon;
      case NotificationType.WARNING:
      case NotificationType.ERROR:
        return WarningTwoIcon;
      default:
        return InfoIcon;
    }
  };
  
  const getStatusColor = () => {
    switch (type) {
      case NotificationType.SUCCESS:
        return 'success';
      case NotificationType.INFO:
        return 'info';
      case NotificationType.WARNING:
        return 'warning';
      case NotificationType.ERROR:
        return 'error';
      default:
        return 'info';
    }
  };
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', duration: 0.5 }}
      style={{ width: '100%' }}
    >
      <Alert
        status={getStatusColor()}
        variant="left-accent"
        rounded="md"
        boxShadow="md"
        mb={4}
      >
        <AlertIcon as={getIcon()} />
        <Box flex="1">
          <AlertTitle fontSize="md" fontWeight="semibold">{title}</AlertTitle>
          {message && <AlertDescription mt={1} fontSize="sm">{message}</AlertDescription>}
        </Box>
        <CloseButton 
          size="sm" 
          onClick={() => onClose(id)} 
          position="absolute" 
          right={2} 
          top={2} 
        />
      </Alert>
    </motion.div>
  );
};

/**
 * Component that manages and displays all notifications
 * Handles notification display, positioning, and animations
 */
export const NotificationsManager = () => {
  const { notifications, removeNotification } = useNotifications();
  
  if (notifications.length === 0) {
    return null;
  }
  
  return (
    <Box
      position="fixed"
      top={4}
      right={4}
      maxWidth="400px"
      width="calc(100% - 32px)"
      zIndex={9999}
      pointerEvents="none"
    >
      <AnimatePresence>
        <Stack spacing={0} pointerEvents="auto">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id} // React key for list rendering
              id={notification.id}
              type={notification.type}
              title={notification.title}
              message={notification.message}
              onClose={removeNotification}
            />
          ))}
        </Stack>
      </AnimatePresence>
    </Box>
  );
};
