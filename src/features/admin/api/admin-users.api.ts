import { api } from '@/shared/api/http'

export type AdminUserRole = 'USER' | 'ADMIN'
export type AdminUserStatus = 'DRAFT_PROFILE' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED'

export interface AdminUserListItem {
  id: string
  role: AdminUserRole
  firstName: string
  lastName: string
  email: string
  status: AdminUserStatus
  registrationSubmittedAt: string | null
  registrationApprovedAt: string | null
}

export interface AdminUserDetails {
  id: string
  name: string
  email: string
  status: string
  motivations: string | null
  academicBackground: string | null
  professionalExperience: string | null
}

export interface AdminUserRoleResponse {
  id: string
  role: AdminUserRole
}

export interface AdminUserDeleteResponse {
  deleted: true
}

export interface AdminRegistrationTransitionResponse {
  registrationStatus: AdminUserStatus
}

export interface AdminRegistrationRejectPayload {
  reason: string
  notes?: string
}

export const adminUsersApi = {
  listUsers: () => api.get<AdminUserListItem[]>('/admin/users', { auth: true }),
  getUserById: (userId: string) => api.get<AdminUserDetails>(`/admin/users/${userId}`, { auth: true }),
  toggleUserRole: (userId: string) => api.patch<AdminUserRoleResponse>(`/admin/users/${userId}/role`, undefined, { auth: true }),
  deleteUser: (userId: string) => api.del<AdminUserDeleteResponse>(`/admin/users/${userId}`, { auth: true }),
  approveRegistration: (userId: string) =>
    api.post<AdminRegistrationTransitionResponse>(`/admin/registrations/${userId}/approve`, undefined, { auth: true }),
  rejectRegistration: (userId: string, payload: AdminRegistrationRejectPayload) =>
    api.post<AdminRegistrationTransitionResponse>(`/admin/registrations/${userId}/reject`, payload, { auth: true }),
}
