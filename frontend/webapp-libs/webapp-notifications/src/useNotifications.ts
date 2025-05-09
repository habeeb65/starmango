import { useContext } from 'react';
import { NotificationsContext } from './notificationsContext';
import { NotificationType } from './notification.types';

/**
 * Hook for working with notifications throughout the application
 * Provides methods for adding different types of notifications
 * Integrates with API responses from the Django backend
 */
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  
  const { addNotification, removeNotification, clearNotifications, notifications } = context;
  
  /**
   * Show a success notification
   */
  const showSuccess = (title: string, message?: string, options = {}) => {
    return addNotification({
      type: NotificationType.SUCCESS,
      title,
      message,
      ...options,
    });
  };
  
  /**
   * Show an error notification
   */
  const showError = (title: string, message?: string, options = {}) => {
    return addNotification({
      type: NotificationType.ERROR,
      title,
      message,
      autoClose: false, // Errors don't auto-close by default
      ...options,
    });
  };
  
  /**
   * Show an info notification
   */
  const showInfo = (title: string, message?: string, options = {}) => {
    return addNotification({
      type: NotificationType.INFO,
      title,
      message,
      ...options,
    });
  };
  
  /**
   * Show a warning notification
   */
  const showWarning = (title: string, message?: string, options = {}) => {
    return addNotification({
      type: NotificationType.WARNING,
      title,
      message,
      ...options,
    });
  };
  
  /**
   * Show an API error notification with details from Django backend
   */
  const showApiError = (errorData: any, fallbackTitle = 'An error occurred') => {
    let title = fallbackTitle;
    let message;
    
    // Handle different error formats from the Django backend
    if (errorData?.detail) {
      // DRF standard error format
      message = errorData.detail;
    } else if (errorData?.errors && Array.isArray(errorData.errors)) {
      // Nested validation errors
      message = errorData.errors.map((err: any) => err.message || String(err)).join('\n');
    } else if (errorData?.message) {
      // Custom message format
      message = errorData.message;
      if (errorData?.title) {
        title = errorData.title;
      }
    } else if (typeof errorData === 'string') {
      // Simple string error
      message = errorData;
    } else if (errorData && typeof errorData === 'object') {
      // Object with multiple field errors (common in Django forms)
      message = Object.entries(errorData)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join('\n');
    }
    
    return showError(title, message, { autoClose: false });
  };
  
  return {
    notifications,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showApiError,
    removeNotification,
    clearNotifications,
  };
};
