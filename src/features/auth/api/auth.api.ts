import { api } from '@/shared/api/http'
import { setAccessToken } from '@/shared/api/auth-session'

export type RegistrationStatus = 'DRAFT_PROFILE' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED'

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
  }
}

export interface UpsertCandidateProfileInput {
  motivations: string
  academicBackground: string
  professionalExperience: string
}

export interface UpsertCandidateProfileResponse {
  registrationStatus: RegistrationStatus
}

export interface RegistrationStatusResponse {
  status: RegistrationStatus
  reason?: string
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

export const authApi = {
  register: (payload: CreateRegistrationInput) =>
    api.post<CreateRegistrationResponse>('/auth/registrations', payload),

  login: async (payload: LoginInput) => {
    const response = await api.post<LoginResponse>('/auth/login', payload)
    setAccessToken(response.accessToken)
    return response
  },

  upsertProfileByUserId: (userId: string, payload: UpsertCandidateProfileInput) =>
    api.put<UpsertCandidateProfileResponse>(`/auth/registrations/${userId}/profile`, payload),

  upsertMyProfile: (payload: UpsertCandidateProfileInput) =>
    api.put<UpsertCandidateProfileResponse>('/auth/registrations/me/profile', payload, { auth: true }),

  getMyStatus: () =>
    api.get<RegistrationStatusResponse>('/auth/registrations/me/status', { auth: true }),

  listAdminRegistrations: (status: RegistrationStatus = 'PENDING_REVIEW') =>
    api.get<AdminRegistrationSummary[]>(`/admin/registrations?status=${status}`, { auth: true }),

  approveRegistration: (userId: string) =>
    api.post<{ registrationStatus: RegistrationStatus }>(`/admin/registrations/${userId}/approve`, undefined, { auth: true }),

  rejectRegistration: (userId: string, payload: RejectRegistrationInput) =>
    api.post<{ registrationStatus: RegistrationStatus }>(`/admin/registrations/${userId}/reject`, payload, { auth: true }),
}
