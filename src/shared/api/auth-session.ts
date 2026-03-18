const ACCESS_TOKEN_STORAGE_KEY = 'educado.accessToken'
const CURRENT_USER_STORAGE_KEY = 'educado.currentUser'

export interface AuthSessionUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'USER' | 'ADMIN'
  avatarMediaId?: string | null
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
}

export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token)
}

export function getCurrentUser(): AuthSessionUser | null {
  const serializedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY)
  if (!serializedUser) return null

  try {
    return JSON.parse(serializedUser) as AuthSessionUser
  } catch {
    return null
  }
}

export function setCurrentUser(user: AuthSessionUser) {
  localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user))
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
  localStorage.removeItem(CURRENT_USER_STORAGE_KEY)
}
