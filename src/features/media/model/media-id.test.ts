import { describe, expect, it } from 'vitest'
import { isValidMediaIdFormat } from './media-id'

describe('isValidMediaIdFormat', () => {
  it('aceita um identificador MongoDB de 24 caracteres hexadecimais', () => {
    expect(isValidMediaIdFormat('507f1f77bcf86cd799439011')).toBe(true)
  })

  it('aceita um UUID quando o formato MongoDB não corresponde', () => {
    expect(isValidMediaIdFormat('123e4567-e89b-12d3-a456-426614174000')).toBe(true)
  })

  it('rejeita um valor que não corresponde a nenhum formato aceito', () => {
    expect(isValidMediaIdFormat('media-invalida')).toBe(false)
  })
})
