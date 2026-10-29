import { UserRole } from '@/types/database';

export const ROLES = {
  SUPER_ADMIN: 'super_admin' as const,
  EDITOR: 'editor' as const,
  MODERATOR: 'moderator' as const,
  MEMBER: 'member' as const,
};

export type RolePermissions = {
  canAccessAdmin: boolean;
  canManageUsers: boolean;
  canManageSettings: boolean;
  canViewAuditLogs: boolean;
  canManageNews: boolean;
  canManageAnnouncements: boolean;
  canManageGallery: boolean;
  canManageMeetings: boolean;
  canSendNotifications: boolean;
  canJoinRestrictedMeetings: boolean;
};

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  super_admin: {
    canAccessAdmin: true,
    canManageUsers: true,
    canManageSettings: true,
    canViewAuditLogs: true,
    canManageNews: true,
    canManageAnnouncements: true,
    canManageGallery: true,
    canManageMeetings: true,
    canSendNotifications: true,
    canJoinRestrictedMeetings: true,
  },
  editor: {
    canAccessAdmin: true,
    canManageUsers: false,
    canManageSettings: false,
    canViewAuditLogs: false,
    canManageNews: true,
    canManageAnnouncements: true,
    canManageGallery: true,
    canManageMeetings: true,
    canSendNotifications: true,
    canJoinRestrictedMeetings: true,
  },
  moderator: {
    canAccessAdmin: true,
    canManageUsers: false,
    canManageSettings: false,
    canViewAuditLogs: false,
    canManageNews: false,
    canManageAnnouncements: false,
    canManageGallery: false,
    canManageMeetings: true,
    canSendNotifications: false,
    canJoinRestrictedMeetings: true,
  },
  member: {
    canAccessAdmin: false,
    canManageUsers: false,
    canManageSettings: false,
    canViewAuditLogs: false,
    canManageNews: false,
    canManageAnnouncements: false,
    canManageGallery: false,
    canManageMeetings: false,
    canSendNotifications: false,
    canJoinRestrictedMeetings: false,
  },
};

export function hasPermission(
  role: UserRole | null | undefined,
  permission: keyof RolePermissions
): boolean {
  if (!role) return false;
  return !!ROLE_PERMISSIONS[role]?.[permission];
}

export function isStaffRole(role: UserRole | null | undefined): boolean {
  if (!role) return false;
  return role === 'super_admin' || role === 'editor' || role === 'moderator';
}
