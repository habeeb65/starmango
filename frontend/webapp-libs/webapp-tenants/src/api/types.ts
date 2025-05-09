/**
 * Tenant-related type definitions
 */

/**
 * User role within a tenant
 */
export enum UserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

/**
 * Tenant user interface
 */
export interface TenantUser {
  id: string | number;
  user_id: string | number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  avatar?: string;
  isActive?: boolean;
  dateJoined?: string;
  lastLogin?: string;
}

/**
 * Tenant interface
 */
export interface Tenant {
  id: string | number;
  tenant_id: string; // The unique identifier used in API requests
  name: string;
  domain?: string;
  isActive?: boolean;
  users?: TenantUser[];
  createdAt?: string;
  updatedAt?: string;
  plan?: string;
  ownerEmail?: string;
}

/**
 * Tenant creation/update input
 */
export interface TenantInput {
  name: string;
  tenant_id?: string;
  domain?: string;
}

/**
 * Tenant user invitation input
 */
export interface TenantUserInviteInput {
  email: string;
  role: UserRole;
  tenant_id: string | number;
}

/**
 * Tenant user update input
 */
export interface TenantUserUpdateInput {
  id: string | number;
  tenant_id: string | number;
  role?: UserRole;
  isActive?: boolean;
}

/**
 * Tenant list response
 */
export interface TenantListResponse {
  results: Tenant[];
  count: number;
  next: string | null;
  previous: string | null;
}

/**
 * Tenant users list response
 */
export interface TenantUsersListResponse {
  results: TenantUser[];
  count: number;
  next: string | null;
  previous: string | null;
}
