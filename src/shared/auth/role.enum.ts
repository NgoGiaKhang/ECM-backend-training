/**
 * System-wide User Roles configuration.
 * Hardcoded string values ensure consistency across DB storage, JWT Claims, and Frontend guards.
 */
export const ROLES = {
  SUPER_ADMIN: "super_admin", // Full system control, infrastructure configuration
  ADMIN: "admin", // Tenant/Organization management, system operations
  MANAGER: "manager", // Business-level operations, content moderation
  MODERATOR: "moderator",
  USER: "user", // Standard registered customer/end-user
} as const;

/**
 * Type representation inferred directly from the ROLES object values.
 * Equivalent to: 'super_admin' | 'admin' | 'manager' | 'user' | 'guest'
 */
export type RoleType = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_POWER: Record<RoleType, number> = {
  [ROLES.SUPER_ADMIN]: 100,
  [ROLES.ADMIN]: 80,
  [ROLES.MANAGER]: 50,
  [ROLES.MODERATOR]: 30,
  [ROLES.USER]: 10,
};
/**
 * Helper to check if a user has sufficient hierarchical privilege.
 */
export const hasPrivilege = (
  userRole: RoleType,
  requiredRole: RoleType,
): boolean => {
  return ROLE_POWER[userRole] >= ROLE_POWER[requiredRole];
};
