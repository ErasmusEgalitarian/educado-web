import { clearAccessToken, getAccessToken } from '@/shared/api/auth-session'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5001'

export interface ApiErrorBody {
  code?: string
  message?: string
  fieldErrors?: Record<string, string>
}

export class ApiError extends Error {
  status: number
  code?: string
  fieldErrors?: Record<string, string>
  payload?: unknown

  constructor(status: number, payload?: unknown) {
    const errorPayload = (payload && typeof payload === 'object' ? payload : {}) as ApiErrorBody
    super(errorPayload.message ?? `Request failed with status ${status}`)

    this.name = 'ApiError'
    this.status = status
    this.code = errorPayload.code
    this.fieldErrors = errorPayload.fieldErrors
    this.payload = payload
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  auth?: boolean
}

async function tryParseJson(response: Response): Promise<unknown> {
  const rawBody = await response.text()
  if (!rawBody) return undefined

  try {
    return JSON.parse(rawBody) as unknown
  } catch {
    return { message: rawBody }
  }
}

async function request<T>(path: string, options: RequestOptions): Promise<T> {
  const headers = new Headers(options.headers ?? {})
  const isFormDataBody = options.body instanceof FormData

  if (!isFormDataBody && options.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.auth) {
    const token = getAccessToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    body:
      options.body === undefined
        ? undefined
        : isFormDataBody
          ? (options.body as FormData)
          : JSON.stringify(options.body),
  })

  if (!res.ok) {
    const errorPayload = await tryParseJson(res)
    if (res.status === 401) clearAccessToken()
    throw new ApiError(res.status, errorPayload)
  }

  if (res.status === 204) return undefined as T
  return (await tryParseJson(res)) as T
}

export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) => request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  del: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) => request<T>(path, { ...options, method: 'DELETE' }),
}
