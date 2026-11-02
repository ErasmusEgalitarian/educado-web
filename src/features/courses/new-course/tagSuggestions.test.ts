import { describe, expect, it } from 'vitest'
import type { Tag } from '@/features/courses/model/course.types'
import { filterTagSuggestions } from './tagSuggestions'

const makeTag = (id: string, name: string, slug = name.toLowerCase(), isActive = true): Tag => ({
  id,
  name,
  slug,
  description: null,
  isActive,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
})

describe('filterTagSuggestions', () => {
  const tags = [makeTag('1', 'Python'), makeTag('2', 'Java'), makeTag('3', 'JavaScript', 'js-lang')]

  it('devolve apenas tags ativas', () => {
    const list = [makeTag('1', 'Java'), makeTag('2', 'JavaScript', 'javascript', false)]
    expect(filterTagSuggestions(list, [], 'java').map((t) => t.id)).toEqual(['1'])
  })

  it('exclui tags ja selecionadas', () => {
    expect(filterTagSuggestions(tags, ['2'], 'java').map((t) => t.id)).toEqual(['3'])
  })

  it('casa por nome', () => {
    expect(filterTagSuggestions(tags, [], 'pyth').map((t) => t.id)).toEqual(['1'])
  })

  it('casa por slug', () => {
    expect(filterTagSuggestions(tags, [], 'js-lang').map((t) => t.id)).toEqual(['3'])
  })

  it('ignora maiusculas e minusculas na query', () => {
    expect(filterTagSuggestions(tags, [], 'PYTHON').map((t) => t.id)).toEqual(['1'])
  })

  it('ignora espacos nas pontas da query', () => {
    expect(filterTagSuggestions(tags, [], '  python  ').map((t) => t.id)).toEqual(['1'])
  })

  it('devolve lista vazia para query vazia', () => {
    expect(filterTagSuggestions(tags, [], '')).toEqual([])
  })

  it('devolve lista vazia para query so com espacos', () => {
    expect(filterTagSuggestions(tags, [], '   ')).toEqual([])
  })

  it('devolve lista vazia quando nada casa', () => {
    expect(filterTagSuggestions(tags, [], 'rust')).toEqual([])
  })

  it('corta em 8 resultados por padrao', () => {
    const many = Array.from({ length: 12 }, (_, i) => makeTag(String(i), `Tag ${i}`))
    expect(filterTagSuggestions(many, [], 'tag')).toHaveLength(8)
  })

  it('respeita o limit informado', () => {
    const many = Array.from({ length: 12 }, (_, i) => makeTag(String(i), `Tag ${i}`))
    expect(filterTagSuggestions(many, [], 'tag', 3)).toHaveLength(3)
  })

  it('preserva a ordem original', () => {
    const list = [makeTag('b', 'Beta app'), makeTag('a', 'Alfa app'), makeTag('c', 'Gama app')]
    expect(filterTagSuggestions(list, [], 'app').map((t) => t.id)).toEqual(['b', 'a', 'c'])
  })
})
