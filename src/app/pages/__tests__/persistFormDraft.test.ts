import { afterEach, describe, expect, it, vi } from 'vitest'
import { makeTag, mountNewCourseScreen, resetHomePageTestState } from '@/test-utils/homePage'

vi.mock('@/shared/api/auth-session')
vi.mock('@/features/courses/api/courses.api')
vi.mock('@/features/courses/api/sections.api')
vi.mock('@/features/courses/api/activities.api')
vi.mock('@/features/courses/api/tags.api')
vi.mock('@/features/media/api/media.api')
vi.mock('@/features/media/services/upload-manager')
vi.mock('@/shared/ui/toast')

const FORM_DRAFT_KEY = 'educado.courses.formDraft'

type FormDraft = {
  title: string
  description: string
  difficulty: string
  category: string
  imageMediaId: string
  selectedTagIds: string[]
}

function readDraft(): FormDraft {
  const raw = sessionStorage.getItem(FORM_DRAFT_KEY)
  if (!raw) throw new Error('persistFormDraft nao gravou nada no sessionStorage')
  return JSON.parse(raw) as FormDraft
}

function field<T extends HTMLElement>(container: HTMLElement, id: string): T {
  const el = container.querySelector<T>(`#${id}`)
  if (!el) throw new Error(`campo #${id} nao encontrado na tela`)
  return el
}

/** Escreve no campo e dispara o evento que chama persistFormDraft. */
function fill(
  container: HTMLElement,
  id: string,
  value: string,
  eventName: 'input' | 'change' = 'input',
) {
  const el = field<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(container, id)
  el.value = value
  el.dispatchEvent(new Event(eventName, { bubbles: true }))
}

function makeTags(count: number) {
  return Array.from({ length: count }, (_, i) =>
    makeTag({ id: `tag-${i + 1}`, name: `Tag ${i + 1}`, slug: `tag-${i + 1}` }),
  )
}

const VALID_MEDIA_ID = '507f1f77bcf86cd799439011'

describe('persistFormDraft (caixa-preta)', () => {
  afterEach(() => {
    resetHomePageTestState()
  })

  it('CT01 [CP] C1,C4,C7,C11,C13,C16,C20 - tudo preenchido, sem rascunho previo', async () => {
    const { container } = await mountNewCourseScreen()
    expect(sessionStorage.getItem(FORM_DRAFT_KEY)).toBeNull()

    fill(container, 'new-course-title', 'Curso de Matematica')
    fill(container, 'new-course-description', 'Descricao com mais de vinte caracteres')
    fill(container, 'new-course-difficulty', 'beginner', 'change')
    fill(container, 'new-course-category', 'Matematica')
    fill(container, 'new-course-image', VALID_MEDIA_ID)

    expect(readDraft()).toEqual({
      title: 'Curso de Matematica',
      description: 'Descricao com mais de vinte caracteres',
      difficulty: 'beginner',
      category: 'Matematica',
      imageMediaId: VALID_MEDIA_ID,
      selectedTagIds: [],
    })
  })

  it('CT02 [CP] C2,C5,C7,C12,C14,C16,C20 - formulario vazio', async () => {
    const { container } = await mountNewCourseScreen()

    fill(container, 'new-course-title', '')

    expect(readDraft()).toEqual({
      title: '',
      description: '',
      difficulty: 'beginner',
      category: '',
      imageMediaId: '',
      selectedTagIds: [],
    })
  })

  it('CT03 [CP] C8 - dificuldade intermediate', async () => {
    const { container } = await mountNewCourseScreen()

    fill(container, 'new-course-difficulty', 'intermediate', 'change')

    expect(readDraft().difficulty).toBe('intermediate')
  })

  it('CT04 [CP] C9 - dificuldade advanced', async () => {
    const { container } = await mountNewCourseScreen()

    fill(container, 'new-course-difficulty', 'advanced', 'change')

    expect(readDraft().difficulty).toBe('advanced')
  })

  it('CT05 [CP] C17,C21 - uma tag selecionada, rascunho previo existente', async () => {
    const { container } = await mountNewCourseScreen({
      tags: makeTags(1),
      formDraft: { title: 'antigo', selectedTagIds: ['tag-1'] },
    })

    fill(container, 'new-course-title', 'novo')

    const draft = readDraft()
    expect(draft.selectedTagIds).toEqual(['tag-1'])
    expect(draft.title).toBe('novo')
  })

  it('CT06 [CP] C18,C21 - tres tags selecionadas', async () => {
    const { container } = await mountNewCourseScreen({
      tags: makeTags(3),
      formDraft: { selectedTagIds: ['tag-1', 'tag-2', 'tag-3'] },
    })

    fill(container, 'new-course-title', 'Curso')

    expect(readDraft().selectedTagIds).toEqual(['tag-1', 'tag-2', 'tag-3'])
  })

  it('CT07 [CP] C1,C21 - rascunho previo e sobrescrito', async () => {
    const { container } = await mountNewCourseScreen({ formDraft: { title: 'A' } })
    expect(readDraft().title).toBe('A')

    fill(container, 'new-course-title', 'B')

    expect(readDraft().title).toBe('B')
  })

  it('CT08 [CP] C3 - titulo so com espacos nao sofre trim', async () => {
    const { container } = await mountNewCourseScreen()

    fill(container, 'new-course-title', '   ')

    expect(readDraft().title).toBe('   ')
  })

  it('CT09 [CP] C6 - descricao com 401 caracteres e gravada inteira', async () => {
    const { container } = await mountNewCourseScreen()
    const longText = 'x'.repeat(401)

    fill(container, 'new-course-description', longText)

    expect(readDraft().description).toHaveLength(401)
  })

  it('CT11 [CP] C15 - imagem com formato invalido e gravada crua', async () => {
    const { container } = await mountNewCourseScreen()

    fill(container, 'new-course-image', 'abc')

    expect(readDraft().imageMediaId).toBe('abc')
  })

  it('CT12 [CP] C19 - 21 tags sao gravadas (o limite de 20 mora nos chamadores)', async () => {
    const tags = makeTags(21)
    const { container } = await mountNewCourseScreen({
      tags,
      formDraft: { selectedTagIds: tags.map((tag) => tag.id) },
    })

    fill(container, 'new-course-title', 'Curso')

    expect(readDraft().selectedTagIds).toHaveLength(21)
  })

  it('CT13 [CP] C18 limite - exatamente 20 tags', async () => {
    const tags = makeTags(20)
    const { container } = await mountNewCourseScreen({
      tags,
      formDraft: { selectedTagIds: tags.map((tag) => tag.id) },
    })

    fill(container, 'new-course-title', 'Curso')

    expect(readDraft().selectedTagIds).toHaveLength(20)
  })
})

//CAIXAS BRANCAS

describe('persistFormDraft (caixa-branca)', () => {
  afterEach(() => {
    resetHomePageTestState()
  })

  it('CT14 [CB] D1,D2,D3,D4,D5 = F - valores dos campos sao usados, sem fallback', async () => {
    const { container } = await mountNewCourseScreen()

    fill(container, 'new-course-title', 'Titulo X')
    fill(container, 'new-course-description', 'Descricao X')
    fill(container, 'new-course-difficulty', 'advanced', 'change')
    fill(container, 'new-course-category', 'Categoria X')
    fill(container, 'new-course-image', VALID_MEDIA_ID)

    const draft = readDraft()
    expect(draft.title).toBe('Titulo X')
    expect(draft.description).toBe('Descricao X')
    expect(draft.difficulty).toBe('advanced') // se usasse o fallback, seria 'beginner'
    expect(draft.category).toBe('Categoria X')
    expect(draft.imageMediaId).toBe(VALID_MEDIA_ID)
  })

  it('CT15 [CB] D1,D2,D4,D5 = F - campo existente e vazio nao e nulo, fallback nao e usado', async () => {
    const { container } = await mountNewCourseScreen({
      formDraft: {
        title: 'a',
        description: 'b',
        category: 'c',
        imageMediaId: VALID_MEDIA_ID,
      },
    })

    fill(container, 'new-course-title', '')
    fill(container, 'new-course-description', '')
    fill(container, 'new-course-category', '')
    fill(container, 'new-course-image', '')

    expect(readDraft()).toMatchObject({
      title: '',
      description: '',
      category: '',
      imageMediaId: '',
    })
  })

  // ATENCAO: este teste foi movido para a caixa-branca, mapeado como decisao D3
  it('CT10 [CB] D3 - dificuldade fora das opcoes nao vira valor invalido', async () => {
    const { container } = await mountNewCourseScreen()

    fill(container, 'new-course-difficulty', 'expert', 'change')

    expect(['beginner', 'intermediate', 'advanced']).toContain(readDraft().difficulty)
  })

  it.todo('CT16 [CB] D1,D2,D3,D4,D5 = V - elemento ausente do DOM (inalcancavel pela tela)')
})