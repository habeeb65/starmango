export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  autoClose?: boolean;
  autoCloseTimeout?: number;
  createdAt: Date;
}

export interface NotificationsContextValue {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const DEFAULT_AUTO_CLOSE_TIMEOUT = 5000; // 5 seconds
