import { api } from '@/shared/api/http'
import { setAccessToken, setCurrentUser } from '@/shared/api/auth-session'

export type RegistrationStatus =
  | 'DRAFT_PROFILE'
  | 'PENDING_REVIEW'
  | 'PENDING_EMAIL_VERIFICATION'
  | 'APPROVED'
  | 'REJECTED'

export interface CreateRegistrationInput {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export interface CreateRegistrationResponse {
  userId: string
  registrationStatus: RegistrationStatus
}

export interface LoginInput {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    role: 'USER' | 'ADMIN'
    status: RegistrationStatus
    avatarMediaId?: string | null
  }
}

export interface UpsertCandidateProfileInput {
  motivations: string
  academicBackground: string
  professionalExperience: string
}

export interface UpsertCandidateProfileResponse {
  registrationStatus: RegistrationStatus
  nextAction?: 'CONFIRM_EMAIL_CODE'
}

export interface RegistrationStatusResponse {
  status: RegistrationStatus
  reason?: string
}

export interface EmailVerificationSendResponse {
  status: RegistrationStatus
  nextAction: 'CONFIRM_EMAIL_CODE'
}

export interface EmailVerificationConfirmResponse {
  status: RegistrationStatus
}

export interface AdminRegistrationSummary {
  userId: string
  firstName: string
  lastName: string
  email: string
  status: RegistrationStatus
  motivations?: string
  academicBackground?: string
  professionalExperience?: string
  submittedAt?: string
}

export interface RejectRegistrationInput {
  reason: string
  notes?: string
}

export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  motivations: string | null
  academicBackground: string | null
  professionalExperience: string | null
  avatarMediaId: string | null
}

export interface UpdateProfileInput {
  firstName?: string
  lastName?: string
  email?: string
  motivations?: string
  academicBackground?: string
  professionalExperience?: string
}

export const authApi = {
  register: (payload: CreateRegistrationInput) =>
    api.post<CreateRegistrationResponse>('/auth/registrations', payload),

  login: async (payload: LoginInput) => {
    const response = await api.post<LoginResponse>('/auth/login', payload)
    setAccessToken(response.accessToken)
    setCurrentUser(response.user)
    return response
  },

  upsertProfileByUserId: (userId: string, payload: UpsertCandidateProfileInput) =>
    api.put<UpsertCandidateProfileResponse>(`/auth/registrations/${userId}/profile`, payload),

  upsertMyProfile: (payload: UpsertCandidateProfileInput) =>
    api.put<UpsertCandidateProfileResponse>('/auth/registrations/me/profile', payload, { auth: true }),

  sendEmailVerificationCode: (userId: string) =>
    api.post<EmailVerificationSendResponse>('/account/email-verification/send', { userId }),

  confirmEmailVerificationCode: (userId: string, code: string) =>
    api.post<EmailVerificationConfirmResponse>('/account/email-verification/confirm', { userId, code }),

  getMyStatus: () =>
    api.get<RegistrationStatusResponse>('/auth/registrations/me/status', { auth: true }),

  listAdminRegistrations: (status: RegistrationStatus = 'PENDING_REVIEW') =>
    api.get<AdminRegistrationSummary[]>(`/admin/registrations?status=${status}`, { auth: true }),

  approveRegistration: (userId: string) =>
    api.post<{ registrationStatus: RegistrationStatus }>(`/admin/registrations/${userId}/approve`, undefined, { auth: true }),

  rejectRegistration: (userId: string, payload: RejectRegistrationInput) =>
    api.post<{ registrationStatus: RegistrationStatus }>(`/admin/registrations/${userId}/reject`, payload, { auth: true }),

  getMyProfile: () =>
    api.get<UserProfile>('/me/profile', { auth: true }),

  updateMyProfile: (payload: UpdateProfileInput) =>
    api.put<UserProfile>('/me/profile', payload, { auth: true }),

  deleteMyAccount: () =>
    api.del<void>('/me/account', { auth: true }),

  updateMyAvatar: (mediaId: string) =>
    api.put<{ avatarMediaId: string }>('/me/avatar', { mediaId }, { auth: true }),

  removeMyAvatar: () =>
    api.del<void>('/me/avatar', { auth: true }),

  requestPasswordReset: (email: string) =>
    api.post<{ sent: boolean }>('/auth/password-reset/request', { email }),

  verifyPasswordResetCode: (email: string, code: string) =>
    api.post<{ verified: boolean }>('/auth/password-reset/verify', { email, code }),

  resetPassword: (payload: { email: string; code: string; newPassword: string; confirmPassword: string }) =>
    api.post<{ reset: boolean }>('/auth/password-reset/reset', payload),

  requestMyPasswordResetCode: () =>
    api.post<{ sent: boolean }>('/me/password/request-code', undefined, { auth: true }),
}
