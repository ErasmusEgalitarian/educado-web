import { ApiError } from '@/shared/api/http'

export type MediaReferenceErrorCode =
  | 'VALIDATION_ERROR'
  | 'INVALID_MEDIA_ID'
  | 'MEDIA_NOT_FOUND'
  | 'MEDIA_INACTIVE'
  | 'FORBIDDEN'

const MEDIA_REFERENCE_ERROR_CODES: readonly MediaReferenceErrorCode[] = [
  'VALIDATION_ERROR',
  'INVALID_MEDIA_ID',
  'MEDIA_NOT_FOUND',
  'MEDIA_INACTIVE',
  'FORBIDDEN',
]

export function classifyMediaReferenceError(error: unknown): MediaReferenceErrorCode | null {
  if (!(error instanceof ApiError)) return null

  const code = error.code ?? ''
  return MEDIA_REFERENCE_ERROR_CODES.find((knownCode) => knownCode === code) ?? null
}
