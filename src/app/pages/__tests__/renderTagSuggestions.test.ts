import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, makeTag, mountNewCourseScreen, resetHomePageTestState } from '@/test-utils/homePage'

vi.mock('@/shared/api/auth-session')
vi.mock('@/features/courses/api/courses.api')
vi.mock('@/features/courses/api/sections.api')
vi.mock('@/features/courses/api/activities.api')
vi.mock('@/features/courses/api/tags.api')
vi.mock('@/features/media/api/media.api')
vi.mock('@/features/media/services/upload-manager')
vi.mock('@/shared/ui/toast')

/**
 * Testes caixa-preta de renderTagSuggestions (HomePage.ts), alcancada pela tela
 * "Novo curso": campo #new-course-tags-query, lista #new-course-tags-suggestions.
 */

type Screen = Awaited<ReturnType<typeof mountNewCourseScreen>>

const query = (c: HTMLElement) => c.querySelector<HTMLInputElement>('#new-course-tags-query')!
const list = (c: HTMLElement) => c.querySelector<HTMLElement>('#new-course-tags-suggestions')!
const buttons = (c: HTMLElement) => Array.from(list(c).querySelectorAll<HTMLButtonElement>('.new-course-tag-suggestion'))
const names = (c: HTMLElement) => buttons(c).map((b) => b.textContent)
const chips = (c: HTMLElement) => Array.from(c.querySelectorAll('.new-course-tag-chip'))

function type(c: HTMLElement, text: string) {
  const input = query(c)
  input.value = text
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

function expectListHidden(c: HTMLElement) {
  expect(list(c).hidden).toBe(true)
  expect(buttons(c)).toHaveLength(0)
}

const jsTags = (n: number) =>
  Array.from({ length: n }, (_, i) => makeTag({ id: `js-${i + 1}`, name: `Lib${i + 1}JS`, slug: `lib-${i + 1}-js` }))

describe('renderTagSuggestions (caixa-preta)', () => {
  afterEach(resetHomePageTestState)

  it('CT01 [CP] C2 campo vazio nao mostra sugestoes', async () => {
    const { container } = await mountNewCourseScreen({ tags: [makeTag({ id: 'r', name: 'React', slug: 'react' })] })
    query(container).dispatchEvent(new Event('focus'))
    expectListHidden(container)
  })

  it('CT02 [CP] C3 apenas espacos nao mostra sugestoes', async () => {
    const { container } = await mountNewCourseScreen({ tags: [makeTag({ id: 'r', name: 'React', slug: 'react' })] })
    type(container, '   ')
    expectListHidden(container)
  })

  it('CT03 [CP] C1,C4,C7,C9,C11,C13,C18 texto no nome mostra a tag', async () => {
    const { container } = await mountNewCourseScreen({ tags: [makeTag({ id: 'r', name: 'React', slug: 'react' })] })
    type(container, 'Rea')
    expect(list(container).hidden).toBe(false)
    expect(names(container)).toEqual(['React'])
  })

  it('CT04 [CP] C5 texto so no apelido interno mostra a tag', async () => {
    const { container } = await mountNewCourseScreen({ tags: [makeTag({ id: 'ml', name: 'Machine Learning', slug: 'ml' })] })
    type(container, 'ml')
    expect(list(container).hidden).toBe(false)
    expect(names(container)).toEqual(['Machine Learning'])
  })

  it('CT05 [CP] C8 maiusculas diferentes mostram a tag', async () => {
    const { container } = await mountNewCourseScreen({ tags: [makeTag({ id: 'r', name: 'React', slug: 'react' })] })
    type(container, 'REACT')
    expect(list(container).hidden).toBe(false)
    expect(names(container)).toEqual(['React'])
  })

  it('CT06 [CP] C6 texto sem correspondencia nao mostra sugestoes', async () => {
    const { container } = await mountNewCourseScreen({ tags: [makeTag({ id: 'r', name: 'React', slug: 'react' })] })
    type(container, 'xyz')
    expectListHidden(container)
  })

  it('CT07 [CP] C10 tag desativada nao e sugerida', async () => {
    const { container } = await mountNewCourseScreen({ tags: [makeTag({ id: 'v', name: 'Vue', slug: 'vue', isActive: false })] })
    type(container, 'vue')
    expectListHidden(container)
  })

  it('CT08 [CP] C12 tag ja no curso nao e sugerida de novo', async () => {
    const react = makeTag({ id: 'r', name: 'React', slug: 'react' })
    const { container } = await mountNewCourseScreen({ tags: [react], formDraft: { selectedTagIds: ['r'] } })
    expect(chips(container)).toHaveLength(1)
    type(container, 'react')
    expectListHidden(container)
  })

  it('CT09 [CP] C1 um caractere mostra so a tag que combina', async () => {
    const { container } = await mountNewCourseScreen({
      tags: [makeTag({ id: 'r', name: 'React', slug: 'react' }), makeTag({ id: 'v', name: 'Vue', slug: 'vue' })],
    })
    type(container, 'r')
    expect(list(container).hidden).toBe(false)
    expect(names(container)).toEqual(['React'])
  })

  it('CT10 [CP] C13 oito tags que combinam: todas aparecem', async () => {
    const tags = jsTags(8)
    const { container } = await mountNewCourseScreen({ tags })
    type(container, 'js')
    expect(list(container).hidden).toBe(false)
    expect(names(container)).toEqual(tags.map((t) => t.name))
  })

  it('CT11 [CP] C14 nove tags que combinam: so as 8 primeiras', async () => {
    const tags = jsTags(9)
    const { container } = await mountNewCourseScreen({ tags })
    type(container, 'js')
    expect(list(container).hidden).toBe(false)
    expect(names(container)).toEqual(tags.slice(0, 8).map((t) => t.name))
  })

  async function clickReact(): Promise<Screen> {
    const screen = await mountNewCourseScreen({ tags: [makeTag({ id: 'r', name: 'React', slug: 'react' })] })
    type(screen.container, 'Rea')
    buttons(screen.container)[0].click()
    return screen
  }

  it('CT12 [CP] C15 clicar na sugestao adiciona a tag ao curso', async () => {
    const { container } = await clickReact()
    const found = chips(container)
    expect(found).toHaveLength(1)
    expect(found[0].textContent).toContain('React')
    expect(query(container).value).toBe('')
    expectListHidden(container)
    expect(document.activeElement).toBe(query(container))
  })

  it('CT13 [CP] C15 com 19 tags no curso, clicar adiciona a 20a', async () => {
    const selected = jsTags(19)
    const extra = makeTag({ id: 'extra', name: 'Extra', slug: 'extra' })
    const { container, mocks } = await mountNewCourseScreen({
      tags: [...selected, extra],
      formDraft: { selectedTagIds: selected.map((t) => t.id) },
    })
    expect(chips(container)).toHaveLength(19)
    type(container, 'extra')
    buttons(container)[0].click()
    expect(chips(container)).toHaveLength(20)
    expect(query(container).value).toBe('')
    expectListHidden(container)
    expect(document.activeElement).toBe(query(container))
    expect(mocks.toast).not.toHaveBeenCalled()
  })

  it('CT14 [CP] C16 com 20 tags no curso, clicar mostra aviso e nao adiciona', async () => {
    const selected = jsTags(20)
    const extra = makeTag({ id: 'extra', name: 'Extra', slug: 'extra' })
    const { container, mocks } = await mountNewCourseScreen({
      tags: [...selected, extra],
      formDraft: { selectedTagIds: selected.map((t) => t.id) },
    })
    expect(chips(container)).toHaveLength(20)
    type(container, 'extra')
    buttons(container)[0].click()
    expect(mocks.toast).toHaveBeenCalledTimes(1)
    expect(mocks.toast).toHaveBeenCalledWith(expect.stringMatching(/20 tags/), 'error')
    expect(chips(container)).toHaveLength(20)
  })

  it('CT15 [CP] C17 nome com simbolos aparece exatamente como escrito', async () => {
    const { container } = await mountNewCourseScreen({ tags: [makeTag({ id: 'cc', name: '<b>C&C</b>', slug: 'c&c' })] })
    type(container, 'c&c')
    expect(list(container).hidden).toBe(false)
    expect(names(container)).toEqual(['<b>C&C</b>'])
    expect(list(container).querySelector('b')).toBeNull()
  })

  it('CT16 [CP] C19 sem tags cadastradas nao mostra sugestoes', async () => {
    const { container } = await mountNewCourseScreen({ tags: [] })
    await flushPromises()
    type(container, 'rea')
    expectListHidden(container)
  })
})
