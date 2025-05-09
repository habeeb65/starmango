/**
 * Form validation utilities
 */

/**
 * Validate an email address
 * @param email Email to validate
 * @returns True if valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  
  // Basic email regex pattern
  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailPattern.test(email);
};

/**
 * Validate a password
 * @param password Password to validate
 * @param options Validation options
 * @returns Object containing validation result and error messages
 */
export const validatePassword = (
  password: string,
  options = {
    minLength: 8,
    requireNumber: true,
    requireLetter: true,
    requireSpecialChar: false,
  },
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
  if (password.length < options.minLength) {
    errors.push(`Password must be at least ${options.minLength} characters long`);
  }
  
  if (options.requireNumber && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (options.requireLetter && !/[a-zA-Z]/.test(password)) {
    errors.push('Password must contain at least one letter');
  }
  
  if (options.requireSpecialChar && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate a phone number
 * @param phone Phone number to validate
 * @returns True if valid, false otherwise
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  if (!phone) return false;
  
  // Basic phone regex pattern that allows various formats
  const phonePattern = /^(\+\d{1,3})?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  return phonePattern.test(phone);
};

/**
 * Validate a URL
 * @param url URL to validate
 * @returns True if valid, false otherwise
 */
export const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    // Use URL constructor for validation
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Check if a string is empty or just whitespace
 * @param value String to check
 * @returns True if empty or whitespace, false otherwise
 */
export const isEmptyString = (value: string | null | undefined): boolean => {
  if (value === null || value === undefined) {
    return true;
  }
  
  return value.trim() === '';
};

/**
 * Validate a username
 * @param username Username to validate
 * @param options Validation options
 * @returns Object containing validation result and error messages
 */
export const validateUsername = (
  username: string,
  options = {
    minLength: 3,
    maxLength: 20,
    allowSpecialChars: false,
  },
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!username) {
    errors.push('Username is required');
    return { isValid: false, errors };
  }
  
  if (username.length < options.minLength) {
    errors.push(`Username must be at least ${options.minLength} characters long`);
  }
  
  if (username.length > options.maxLength) {
    errors.push(`Username must be no more than ${options.maxLength} characters long`);
  }
  
  if (!options.allowSpecialChars && !/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, and underscores');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};
