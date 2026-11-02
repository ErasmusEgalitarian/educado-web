import { describe, expect, it } from 'vitest'
import { ApiError } from '@/shared/api/http'
import { classifyMediaReferenceError } from './media-reference-error'

describe('classifyMediaReferenceError', () => {
  it.each([
    'VALIDATION_ERROR',
    'INVALID_MEDIA_ID',
    'MEDIA_NOT_FOUND',
    'MEDIA_INACTIVE',
    'FORBIDDEN',
  ])('reconhece o código %s retornado pela API', (code) => {
    const error = new ApiError(400, { code })

    expect(classifyMediaReferenceError(error)).toBe(code)
  })

  it('ignora códigos da API que não se referem à mídia', () => {
    const error = new ApiError(500, { code: 'INTERNAL_ERROR' })

    expect(classifyMediaReferenceError(error)).toBeNull()
  })

  it('ignora erros da API sem código', () => {
    const error = new ApiError(500)

    expect(classifyMediaReferenceError(error)).toBeNull()
  })

  it('ignora erros que não vieram da API', () => {
    expect(classifyMediaReferenceError(new Error('MEDIA_NOT_FOUND'))).toBeNull()
  })
})
