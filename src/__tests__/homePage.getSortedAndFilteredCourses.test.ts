import { afterEach, describe, expect, it, vi } from 'vitest'
import { destroyHomePage, renderHomePage } from '@/app/pages/HomePage'
import type { Course } from '@/features/courses/model/course.types'
import { flushPromises, homePageMocks } from '@/test-utils/homePage'

vi.mock('@/shared/api/auth-session')
vi.mock('@/features/courses/api/courses.api')
vi.mock('@/features/courses/api/sections.api')
vi.mock('@/features/courses/api/activities.api')
vi.mock('@/features/courses/api/tags.api')
vi.mock('@/features/media/api/media.api')
vi.mock('@/features/media/services/upload-manager')
vi.mock('@/shared/ui/toast')

function makeCourse(overrides: Partial<Course> = {}): Course {
  return {
    id: 'course-1',
    ownerId: 'owner-1',
    title: 'Curso de Matemática',
    shortDescription: 'Aprenda os fundamentos da matemática',
    description: 'Descrição do curso',
    imageMediaId: '',
    difficulty: 'beginner',
    estimatedTime: '4 horas',
    passingThreshold: 70,
    category: 'Matemática',
    tags: [],
    rating: 4,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

async function mountCreatorHome(courses: Course[]) {
  homePageMocks.coursesApi.getMyCourses.mockResolvedValue(courses)

  const container = document.createElement('div')
  document.body.appendChild(container)
  renderHomePage(container, 'USER')
  await flushPromises()

  return container
}

function getRenderedCourseTitles(container: HTMLElement) {
  return Array.from(container.querySelectorAll('.creator-course-title-wrap h4'))
    .map((element) => element.textContent)
}

function setSearchQuery(container: HTMLElement, value: string) {
  const searchInput = container.querySelector<HTMLInputElement>('#creator-course-search')
  if (!searchInput) throw new Error('Campo de busca não encontrado')

  searchInput.value = value
  searchInput.dispatchEvent(new Event('input', { bubbles: true }))
}

function selectSort(container: HTMLElement, value: string) {
  const sortSelect = container.querySelector<HTMLSelectElement>('#creator-course-sort')
  if (!sortSelect) throw new Error('Seletor de ordenação não encontrado')

  sortSelect.value = value
  sortSelect.dispatchEvent(new Event('change', { bubbles: true }))
}

describe('getSortedAndFilteredCourses', () => {
  afterEach(() => {
    destroyHomePage()
    document.body.innerHTML = ''
    sessionStorage.clear()
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('ordena cursos populados por data mais recente por padrão', async () => {
    // MC/DC: sort = 'recent' (ramo default do switch) e ambos createdAt presentes.
    const container = await mountCreatorHome([
      makeCourse({ id: 'old', title: 'Curso antigo', createdAt: '2026-01-01T00:00:00.000Z' }),
      makeCourse({ id: 'new', title: 'Curso recente', createdAt: '2026-03-01T00:00:00.000Z' }),
    ])

    expect(getRenderedCourseTitles(container)).toEqual(['Curso recente', 'Curso antigo'])
  })

  it('ordena por data mais antiga quando essa opção é selecionada', async () => {
    // MC/DC: cobre independentemente o case 'oldest' do switch.
    const container = await mountCreatorHome([
      makeCourse({ title: 'Curso antigo', createdAt: '2026-01-01T00:00:00.000Z' }),
      makeCourse({ title: 'Curso recente', createdAt: '2026-03-01T00:00:00.000Z' }),
    ])

    selectSort(container, 'oldest')

    expect(getRenderedCourseTitles(container)).toEqual(['Curso antigo', 'Curso recente'])
  })

  it('ordena por nome em ordem crescente quando essa opção é selecionada', async () => {
    // MC/DC: cobre independentemente o case 'name' do switch.
    const container = await mountCreatorHome([
      makeCourse({ title: 'Zoologia' }),
      makeCourse({ title: 'Anatomia' }),
      makeCourse({ title: 'Biologia' }),
    ])

    selectSort(container, 'name')

    expect(getRenderedCourseTitles(container)).toEqual(['Anatomia', 'Biologia', 'Zoologia'])
  })

  it.each([
    ['título', 'matemática', ['Curso de Matemática']],
    ['categoria', 'programação', ['Introdução à Lógica']],
    ['descrição curta', 'fundamentos', ['Curso de Matemática']],
  ])('filtra por correspondência no campo de %s', async (_field, query, expectedTitles) => {
    // MC/DC: cada operando do OR (título, categoria e descrição) é verdadeiro
    // individualmente, enquanto os demais permanecem falsos.
    const container = await mountCreatorHome([
      makeCourse({
        title: 'Curso de Matemática',
        category: 'Matemática',
        shortDescription: 'Aprenda os fundamentos da matemática',
      }),
      makeCourse({
        id: 'logic',
        title: 'Introdução à Lógica',
        category: 'Programação',
        shortDescription: 'Raciocínio e algoritmos',
      }),
    ])

    setSearchQuery(container, query)

    expect(getRenderedCourseTitles(container)).toEqual(expectedTitles)
  })

  it('retorna todos os cursos quando a busca é uma string vazia', async () => {
    // MC/DC: query é falsa; a decisão if (query) não executa o filtro.
    const container = await mountCreatorHome([
      makeCourse({ title: 'Curso antigo', createdAt: '2026-01-01T00:00:00.000Z' }),
      makeCourse({ title: 'Curso recente', createdAt: '2026-03-01T00:00:00.000Z' }),
    ])

    setSearchQuery(container, '   ')

    expect(getRenderedCourseTitles(container)).toEqual(['Curso recente', 'Curso antigo'])
  })

  it('considera todos os operandos do filtro falsos quando não há correspondência', async () => {
    // MC/DC: título, categoria e descrição são falsos; o OR inteiro resulta falso.
    const container = await mountCreatorHome([
      makeCourse({
        title: 'Curso de Matemática',
        category: 'Matemática',
        shortDescription: 'Fundamentos da matemática',
      }),
    ])

    setSearchQuery(container, 'história')

    expect(container.querySelectorAll('.creator-course-title-wrap h4')).toHaveLength(0)
  })

  it('exibe estado sem resultados quando o filtro não corresponde a nenhum curso', async () => {
    // MC/DC: decisão de visibleCourses.length === 0 é verdadeira.
    const container = await mountCreatorHome([makeCourse()])

    setSearchQuery(container, 'curso inexistente')

    expect(container.querySelectorAll('.creator-course-title-wrap h4')).toHaveLength(0)
    expect(container.querySelector('.creator-empty-state')).not.toBeNull()
  })

  it('exibe estado vazio quando o array de cursos está vazio', async () => {
    // MC/DC: courses.length === 0 é verdadeiro, antes da decisão de resultados filtrados.
    const container = await mountCreatorHome([])

    expect(container.querySelectorAll('.creator-course-title-wrap h4')).toHaveLength(0)
    expect(container.querySelector('.creator-empty-container')).not.toBeNull()
  })

  it('usa timestamp zero quando um curso não possui createdAt na ordenação recente', async () => {
    // MC/DC: condição b.createdAt é falsa para o curso sem data e verdadeira para o outro.
    const container = await mountCreatorHome([
      makeCourse({ title: 'Sem data', createdAt: '' }),
      makeCourse({ title: 'Com data', createdAt: '2026-03-01T00:00:00.000Z' }),
    ])

    expect(getRenderedCourseTitles(container)).toEqual(['Com data', 'Sem data'])
  })

  it('usa timestamp zero quando um curso não possui createdAt na ordenação antiga', async () => {
    // MC/DC: condição a.createdAt é falsa para o curso sem data e verdadeira para o outro.
    const container = await mountCreatorHome([
      makeCourse({ title: 'Com data', createdAt: '2026-03-01T00:00:00.000Z' }),
      makeCourse({ title: 'Sem data', createdAt: '' }),
    ])

    selectSort(container, 'oldest')

    expect(getRenderedCourseTitles(container)).toEqual(['Sem data', 'Com data'])
  })

  it('usa o ramo default para um valor de ordenação desconhecido', async () => {
    // MC/DC: nenhum case explícito coincide; o ramo default aplica ordenação recente.
    const container = await mountCreatorHome([
      makeCourse({ title: 'Curso antigo', createdAt: '2026-01-01T00:00:00.000Z' }),
      makeCourse({ title: 'Curso recente', createdAt: '2026-03-01T00:00:00.000Z' }),
    ])

    selectSort(container, 'unknown')

    expect(getRenderedCourseTitles(container)).toEqual(['Curso recente', 'Curso antigo'])
  })
})
