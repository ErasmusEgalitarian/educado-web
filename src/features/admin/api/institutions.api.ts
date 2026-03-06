import { api } from '@/shared/api/http'

export interface Institution {
  id: string
  name: string
  domain: string
  secondaryDomain: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface InstitutionPayload {
  name: string
  domain: string
  secondaryDomain?: string
  isActive?: boolean
}

export interface InstitutionUpdatePayload {
  name?: string
  domain?: string
  secondaryDomain?: string
  isActive?: boolean
}

export const institutionsApi = {
  list: () => api.get<Institution[]>('/institutions', { auth: true }),
  getById: (institutionId: string) => api.get<Institution>(`/institutions/${institutionId}`, { auth: true }),
  create: (payload: InstitutionPayload) => api.post<Institution>('/institutions', payload, { auth: true }),
  update: (institutionId: string, payload: InstitutionUpdatePayload) =>
    api.put<Institution>(`/institutions/${institutionId}`, payload, { auth: true }),
  remove: (institutionId: string) => api.del<void>(`/institutions/${institutionId}`, { auth: true }),
}
