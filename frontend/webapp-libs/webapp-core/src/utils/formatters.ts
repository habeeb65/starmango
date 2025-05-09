/**
 * Date formatting utilities
 */

/**
 * Format a date to a localized string
 * @param date Date to format
 * @param options Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string | number | null | undefined,
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }
): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'object' ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
};

/**
 * Format a date to a relative time string (e.g., "2 days ago")
 * @param date Date to format
 * @returns Relative time string
 */
export const formatRelativeTime = (date: Date | string | number | null | undefined): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'object' ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  // Less than a minute
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  // Less than an hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  
  // Less than a day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  
  // Less than a week
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  
  // Less than a month
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  
  // Less than a year
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  
  // More than a year
  const years = Math.floor(diffInSeconds / 31536000);
  return `${years} year${years > 1 ? 's' : ''} ago`;
};

/**
 * Currency formatting utilities
 */

/**
 * Format a number as a currency string
 * @param amount Amount to format
 * @param currency Currency code (default: USD)
 * @param locale Locale (default: en-US)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number | null | undefined,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  if (amount === null || amount === undefined) {
    return '';
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a number with commas
 * @param value Number to format
 * @param options Intl.NumberFormatOptions
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number | null | undefined,
  options: Intl.NumberFormatOptions = {}
): string => {
  if (value === null || value === undefined) {
    return '';
  }
  
  return new Intl.NumberFormat('en-US', options).format(value);
};

/**
 * Truncate text to a specified length and add ellipsis if needed
 * @param text Text to truncate
 * @param maxLength Maximum length
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Capitalize the first letter of a string
 * @param text Text to capitalize
 * @returns Capitalized text
 */
export const capitalizeFirstLetter = (text: string): string => {
  if (!text) return '';
  
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Format a file size in bytes to a human-readable string
 * @param bytes File size in bytes
 * @param decimals Number of decimal places
 * @returns Formatted file size
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
