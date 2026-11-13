import { describe, expect, it } from 'vitest'
import { buildFormDraft } from './formDraft'

describe('buildFormDraft', () => {
  it('aplica "beginner" quando a dificuldade e uma string vazia', () => {
    const fields = {
      title: 'Teste Defeito',
      description: 'Testando string vazia',
      difficulty: '',
      category: 'Categoria',
      imageMediaId: 'img-1',
    }

    const draft = buildFormDraft(fields, [])

    expect(draft.difficulty).toBe('beginner')
  })

  it('monta o rascunho com os parametros fornecidos', () => {
    const fields = {
      title: 'Curso de TDD',
      description: 'Aprendendo a extrair funcoes',
      difficulty: 'advanced',
      category: 'Programacao',
      imageMediaId: 'img-999',
    }
    const selectedTags = [{ id: 'tag-1' }, { id: 'tag-2' }]

    const result = buildFormDraft(fields, selectedTags)

    expect(result).toEqual({
      title: 'Curso de TDD',
      description: 'Aprendendo a extrair funcoes',
      difficulty: 'advanced',
      category: 'Programacao',
      imageMediaId: 'img-999',
      selectedTagIds: ['tag-1', 'tag-2'],
    })
  })

  it('preenche com strings vazias os campos ausentes', () => {
    const result = buildFormDraft({}, [])

    expect(result).toEqual({
      title: '',
      description: '',
      difficulty: 'beginner',
      category: '',
      imageMediaId: '',
      selectedTagIds: [],
    })
  })
})
