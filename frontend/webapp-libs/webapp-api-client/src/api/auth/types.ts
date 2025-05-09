/**
 * Authentication related type definitions
 */

/**
 * User interface representing the authenticated user
 */
export interface User {
  id: string | number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  tenant_id?: string; // ID of the user's current tenant
  isStaff?: boolean; // For Django admin access
  isSuperuser?: boolean;
  lastLogin?: string;
  dateJoined?: string;
}

/**
 * Authentication tokens
 */
export interface AuthTokens {
  access: string;
  refresh: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  username: string;
  password: string;
  tenant_id?: string; // Optional tenant ID for multi-tenant authentication
}

/**
 * Registration credentials
 */
export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  tenant_id?: string; // Optional tenant ID for multi-tenant registration
  firstName?: string;
  lastName?: string;
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  email: string;
  tenant_id?: string; // Optional tenant ID for multi-tenant password reset
}

/**
 * Password reset confirmation
 */
export interface PasswordResetConfirmation {
  token: string;
  uid: string;
  newPassword: string;
  tenant_id?: string; // Optional tenant ID for multi-tenant password reset
}

/**
 * Password change
 */
export interface PasswordChange {
  oldPassword: string;
  newPassword: string;
  tenant_id?: string; // Optional tenant ID for multi-tenant password change
}

/**
 * Login response
 */
export interface LoginResponse {
  access: string;
  refresh: string;
  user?: User;
}

/**
 * Authentication context state
 */
export interface AuthState {
  isLoading: boolean;
  isLoggedIn: boolean;
  isInitialized: boolean;
  tokens: AuthTokens | null;
  currentUser: User | null;
  error: string | null;
}
