import { describe, expect, it } from 'vitest'
import {
  buildCreateCoursePayload,
  normalizeNewCourseForm,
  validateNewCourseForm,
} from './newCourseForm'
import type { NewCourseFormInput, NormalizedNewCourseForm } from './newCourse.types'

const validForm = (overrides: Partial<NormalizedNewCourseForm> = {}): NormalizedNewCourseForm => ({
  title: 'Curso de testes',
  description: 'Descrição válida para o curso.',
  difficulty: 'beginner',
  category: 'Tecnologia',
  imageMediaId: '507f1f77bcf86cd799439011',
  tagIds: ['tag-1'],
  ...overrides,
})

describe('normalizeNewCourseForm', () => {
  it('remove espaços externos dos textos e copia os identificadores de tags', () => {
    const tagIds = ['tag-1', 'tag-2']
    const input: NewCourseFormInput = {
      title: '  Curso de testes  ',
      description: '  Uma descrição suficientemente longa.  ',
      difficulty: 'advanced',
      category: '  Tecnologia  ',
      imageMediaId: '  507f1f77bcf86cd799439011  ',
      tagIds,
    }

    const normalized = normalizeNewCourseForm(input)

    expect(normalized).toEqual({
      title: 'Curso de testes',
      description: 'Uma descrição suficientemente longa.',
      difficulty: 'advanced',
      category: 'Tecnologia',
      imageMediaId: '507f1f77bcf86cd799439011',
      tagIds,
    })
    expect(normalized.tagIds).not.toBe(tagIds)
  })
})

describe('validateNewCourseForm', () => {
  it('aceita os menores comprimentos válidos para título e descrição', () => {
    const result = validateNewCourseForm(validForm({
      title: 'xxx',
      description: 'x'.repeat(20),
    }))

    expect(result).toEqual({ isValid: true, errors: [] })
  })

  it('aceita uma descrição exatamente no limite máximo', () => {
    const result = validateNewCourseForm(validForm({
      description: 'x'.repeat(400),
    }))

    expect(result.isValid).toBe(true)
  })

  it('identifica todos os campos obrigatórios ausentes', () => {
    const result = validateNewCourseForm(validForm({
      title: '',
      description: '',
      category: '',
      imageMediaId: '',
    }))

    expect(result).toEqual({
      isValid: false,
      errors: [
        { field: 'title', code: 'TITLE_REQUIRED' },
        { field: 'description', code: 'DESCRIPTION_REQUIRED' },
        { field: 'category', code: 'CATEGORY_REQUIRED' },
        { field: 'imageMediaId', code: 'IMAGE_REQUIRED' },
      ],
    })
  })

  it('rejeita título e descrição imediatamente abaixo dos limites mínimos', () => {
    const result = validateNewCourseForm(validForm({
      title: 'xx',
      description: 'x'.repeat(19),
    }))

    expect(result.errors).toEqual([
      { field: 'title', code: 'TITLE_TOO_SHORT' },
      { field: 'description', code: 'DESCRIPTION_TOO_SHORT' },
    ])
  })

  it('rejeita descrição imediatamente acima do limite máximo', () => {
    const result = validateNewCourseForm(validForm({
      description: 'x'.repeat(401),
    }))

    expect(result.errors).toEqual([
      { field: 'description', code: 'DESCRIPTION_TOO_LONG' },
    ])
  })

  it('rejeita formato de mídia inválido', () => {
    const result = validateNewCourseForm(validForm({ imageMediaId: 'id-invalido' }))

    expect(result.errors).toEqual([
      { field: 'imageMediaId', code: 'IMAGE_INVALID_FORMAT' },
    ])
  })

  it('aceita UUID como identificador de mídia', () => {
    const result = validateNewCourseForm(validForm({
      imageMediaId: '123e4567-e89b-12d3-a456-426614174000',
    }))

    expect(result.isValid).toBe(true)
  })
})

describe('buildCreateCoursePayload', () => {
  it('constrói o payload com os padrões do fluxo de criação', () => {
    const input = validForm()

    expect(buildCreateCoursePayload(input)).toEqual({
      title: input.title,
      description: input.description,
      shortDescription: input.description,
      imageMediaId: input.imageMediaId,
      difficulty: input.difficulty,
      estimatedTime: '8 horas',
      passingThreshold: 70,
      category: input.category,
      tags: [],
      tagIds: input.tagIds,
      rating: null,
    })
  })

  it('limita a descrição curta e preserva a descrição completa', () => {
    const description = 'x'.repeat(121)
    const payload = buildCreateCoursePayload(validForm({ description }))

    expect(payload.description).toHaveLength(121)
    expect(payload.shortDescription).toHaveLength(120)
  })

  it('aplica os valores existentes fornecidos pelo fluxo de edição', () => {
    const payload = buildCreateCoursePayload(validForm(), {
      estimatedTime: '12 horas',
      passingThreshold: 85,
      rating: 4.5,
    })

    expect(payload).toMatchObject({
      estimatedTime: '12 horas',
      passingThreshold: 85,
      rating: 4.5,
    })
  })

  it('mantém os padrões quando os valores opcionais estão vazios', () => {
    const payload = buildCreateCoursePayload(validForm(), {
      estimatedTime: '',
      rating: null,
    })

    expect(payload).toMatchObject({
      estimatedTime: '8 horas',
      passingThreshold: 70,
      rating: null,
    })
  })
})
