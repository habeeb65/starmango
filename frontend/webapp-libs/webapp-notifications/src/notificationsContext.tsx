import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Notification, NotificationsContextValue, DEFAULT_AUTO_CLOSE_TIMEOUT } from './notification.types';

export const NotificationsContext = createContext<NotificationsContextValue>({
  notifications: [],
  addNotification: () => '',
  removeNotification: () => {},
  clearNotifications: () => {},
});

interface NotificationsProviderProps {
  children: ReactNode;
}

/**
 * Provider component for the notifications system
 * Handles adding, removing, and clearing notifications
 * Integrates with API responses from Django backend
 */
export const NotificationsProvider = ({ children }: NotificationsProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id' | 'createdAt'>) => {
      const id = uuidv4();
      const newNotification: Notification = {
        ...notification,
        id,
        createdAt: new Date(),
        autoClose: notification.autoClose ?? true,
        autoCloseTimeout: notification.autoCloseTimeout ?? DEFAULT_AUTO_CLOSE_TIMEOUT,
      };

      setNotifications((prev) => [...prev, newNotification]);
      
      // Auto-close notification if specified
      if (newNotification.autoClose) {
        setTimeout(() => {
          removeNotification(id);
        }, newNotification.autoCloseTimeout);
      }

      return id;
    },
    [removeNotification]
  );

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const contextValue = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };

  return (
    <NotificationsContext.Provider value={contextValue}>
      {children}
    </NotificationsContext.Provider>
  );
};
