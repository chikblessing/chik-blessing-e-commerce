import type { CustomUser } from '@/types/User'
import type { AccessArgs } from 'payload'

/**
 * Check if user is an admin (includes both admin and super_admin roles)
 */
export const isAdmin = ({ req: { user } }: AccessArgs): boolean => {
  const customUser = user as CustomUser | undefined
  return !!customUser && (customUser.role === 'admin' || customUser.role === 'super_admin')
}

/**
 * Check if user is a super admin (highest privilege level)
 */
export const isSuperAdmin = ({ req: { user } }: AccessArgs): boolean => {
  const customUser = user as CustomUser | undefined
  return !!customUser && customUser.role === 'super_admin'
}

/**
 * Check if user is an admin or the owner of the resource
 */
export const isAdminOrSelf = ({ req: { user }, id }: AccessArgs & { id?: string }): boolean => {
  const customUser = user as CustomUser | undefined
  if (!customUser) return false

  // Admins and super admins have access
  if (customUser.role === 'admin' || customUser.role === 'super_admin') return true

  // Users can access their own resources
  return customUser.id === id
}
