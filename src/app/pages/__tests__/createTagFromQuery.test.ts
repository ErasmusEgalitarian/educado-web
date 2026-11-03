import { describe, it, expect, vi, beforeEach } from 'vitest';
import { flushPromises, makeTag, mountNewCourseScreen, resetHomePageTestState } from '@/test-utils/homePage'
import { t } from '@/shared/i18n'
import type { Tag } from '@/features/courses/model/course.types'

//###########################################################################_
//MOCKS
vi.mock('@/shared/api/auth-session')
vi.mock('@/features/courses/api/courses.api')
vi.mock('@/features/courses/api/sections.api')
vi.mock('@/features/courses/api/activities.api')
vi.mock('@/features/courses/api/tags.api')
vi.mock('@/features/media/api/media.api')
vi.mock('@/features/media/services/upload-manager')
vi.mock('@/shared/ui/toast')

//###########################################################################_
// Error message
const LIMIT_MSG = t('courses.newCourse.errors.tagsLimit')

//###########################################################################_
// Auxiliar functions

// Tags generation
const tagsOf = (n: number): Tag[] =>
  Array.from({ length: n }, (_, i) => makeTag({ id: `sel-${i}`, name: `Tag ${i}`, slug: `tag-${i}` }))

// Draft with selected tags generation
const formDraftWith = (tags: Tag[]) => ({
  title: '', description: '', difficulty: 'beginner', category: '', imageMediaId: '',
  selectedTagIds: tags.map((tag) => tag.id),
})

// List rendered tag names
const chipTexts = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('.new-course-tag-chip')).map((el) =>
    (el.firstChild?.textContent ?? '').trim(),
  )

// Send input to the functions
async function typeAndEnter(container: HTMLElement, text: string) {
  const input = container.querySelector('#new-course-tags-query') as HTMLInputElement
  input.value = text
  input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
  await flushPromises()
  return input
}

//###########################################################################_
describe('Testes Unitários para createTagFromQuery()', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
    resetHomePageTestState()
  });

  // --- CAIXA-PRETA / CAIXA-BRANCA COMBINADAS ---

  it('CT1 (Caixa-preta = #1 / Caixa-branca = CT1): Deve criar e inserir uma nova tag com sucesso quando válida e abaixo do limite', async () => {
    // Cenário: selectedTags.length = 0, rawName = "Algebra", tag não existe

    const selectedTags = tagsOf(0); // Nenhuma tag selecionada
    
    const { container, mocks } = await mountNewCourseScreen({
        tags: selectedTags, // Tags disponíveis na API
        formDraft: formDraftWith(selectedTags) // Cria o draft com as tags selecionadas
    })
        
    mocks.tagsApi.createTag.mockResolvedValue(makeTag({
      id: 'new-1',
      name: 'Algebra',
      slug: 'algebra'
    }))
    
    const input = await typeAndEnter(container, 'Algebra')
    

  // Verificar se a API recebeu os dados corretos
  expect(mocks.tagsApi.createTag).toHaveBeenCalledWith({
    name: 'Algebra',
    description: null,
    isActive: true
  })

  // Verificar se a tag apareceu na interface
  expect(chipTexts(container)).toEqual(['Algebra'])

  // Verificar se o campo de input foi limpo
  expect(input.value).toBe('')
  });

  it('CT2 (Caixa-preta = #2 / Caixa-branca = CT2): Deve adicionar tag existente que ainda não está selecionada', async () => {
    // Cenário: selectedTags.length = 19, rawName = "Matemática", tag existe (False na seleção)

    const selectedTags = tagsOf(19); // 19 tags selecionadas
    const existingTag = makeTag({ id: 't1', name: 'Matemática', slug: 'matematica' }); // Tag existente na API, mas não selecionada

    const { container, mocks } = await mountNewCourseScreen({
        tags: [...selectedTags, existingTag], // Tags disponíveis na API
        formDraft: formDraftWith(selectedTags)
    })

    const input = await typeAndEnter(container, 'Matemática')

    // Função da API de criar tag não deve ser chamada
    expect(mocks.tagsApi.createTag).not.toHaveBeenCalled()

    // Verifica se todas as tags anteriores e a nova aparecem
    expect(chipTexts(container)).toEqual([...selectedTags.map(tag => tag.name), 'Matemática'])

    expect(input.value).toBe('')
  });

  it('CT3 (Caixa-branca = CT3): Deve ignorar se a tag já existe e já está selecionada (duplicada)', async () => {
    // Cenário: selectedTags.length = 19, rawName = "Matemática", tag existe e JÁ está selecionada

    const prevSelectedTags = tagsOf(18); // 18 tags selecionadas
    const existingTag = makeTag({ id: 't1', name: 'Matemática', slug: 'matematica' });

    const selectedTags = [...prevSelectedTags, existingTag]; // 18 tags + a existente

    const { container, mocks } = await mountNewCourseScreen({
        tags: selectedTags,
        formDraft: formDraftWith(selectedTags) 
    })

    const input = await typeAndEnter(container, 'Matemática')

    expect(mocks.tagsApi.createTag).not.toHaveBeenCalled()

    // Verifica se continuam existindo exatamente 19 tags
    expect(chipTexts(container)).toHaveLength(19);
    
    // verifica se as tags selecionadas permanecem as mesmas (19)
    expect(chipTexts(container)).toEqual(selectedTags.map(tag => tag.name));

    expect(input.value).toBe('')
  });

// Obs: No home pages é feito: `const query = tagsQueryInput.value.trim() if (!query) return` 
// de forma que a função retorna antes de entrar no createTagFromQuery(), então esse teste nem chega na função
  it('CT4 (Caixa-preta = #3 / Caixa-branca = CT4): Deve retornar sem criar nada se o nome da tag for inválido (vazio)', async () => {
    // Cenário: rawName = "" ou apenas espaços "   "
    
    const selectedTags = tagsOf(10); 

    const { container, mocks } = await mountNewCourseScreen({
        tags: selectedTags,
        formDraft: formDraftWith(selectedTags) 
    })

    await typeAndEnter(container, '\n\t ')

    expect(mocks.tagsApi.createTag).not.toHaveBeenCalled()
    expect(chipTexts(container)).toHaveLength(10);
    expect(chipTexts(container)).toEqual(selectedTags.map(tag => tag.name));
  });

  it('CT5 (Caixa-preta = #7 / Caixa-branca = CT5): Deve disparar erro de limite de tags quando a quantidade for >= 20', async () => {
    // Cenário: selectedTags.length = 20, rawName = "Música"
    
    const selectedTags = tagsOf(20); 

    const { container, mocks } = await mountNewCourseScreen({
        tags: selectedTags,
        formDraft: formDraftWith(selectedTags) 
    })

    const input = await typeAndEnter(container, 'Música')

    expect(mocks.tagsApi.createTag).not.toHaveBeenCalled()

    // Mensagem de erro de limite de tags
    expect(mocks.toast).toHaveBeenCalledWith(LIMIT_MSG, 'error');

    expect(chipTexts(container)).toHaveLength(20);
    expect(chipTexts(container)).toEqual(selectedTags.map(tag => tag.name));
    expect(input.value).toBe('')
  });

});
