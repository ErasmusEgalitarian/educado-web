import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { flushPromises, mountNewCourseScreen, resetHomePageTestState } from '@/test-utils/homePage'
import { getLanguage, setLanguage } from '@/shared/i18n'

const initialLanguage = getLanguage()

//____________________________________________________________________________
//MOCKS
vi.mock('@/shared/api/auth-session')
vi.mock('@/features/courses/api/courses.api')
vi.mock('@/features/courses/api/sections.api')
vi.mock('@/features/courses/api/activities.api')
vi.mock('@/features/courses/api/tags.api')
vi.mock('@/features/media/api/media.api')
vi.mock('@/features/media/services/upload-manager')
vi.mock('@/shared/ui/toast')

//____________________________________________________________________________
describe('Course Prior Recommendations', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
    resetHomePageTestState();
    setLanguage('en-US')
  });

  afterAll(() => {
    setLanguage(initialLanguage)
  })

  // CICLO 1: checkbox com default = false e adição de uma recomendação opcional
  it('Defaults the required checkbox to unchecked', async () => {
    const { container } = await mountNewCourseScreen({
      courses: [],
      formDraft: { priorRecommendations: [] },
    });

    const mandatoryCheckbox = container.querySelector<HTMLInputElement>('#new-course-prior-recommendation-mandatory');
    expect(mandatoryCheckbox).not.toBeNull();
    expect(mandatoryCheckbox?.checked).toBe(false);
  });

  // RN 2: Allows a recommendation to be optional.
  it('Adds a valid optional recommendation', async () => {
    const validCourseId = '123e4567-e89b-12d3-a456-426614174000';
    const availableCourses = [{ id: validCourseId, title: 'Curso de Lógica' }];

    const { container } = await mountNewCourseScreen({
      courses: availableCourses,
      formDraft: { priorRecommendations: [] }
    });

    const priorRecommendationInput = container.querySelector('#new-course-prior-recommendations') as HTMLInputElement;
    const mandatoryCheckbox = container.querySelector('#new-course-prior-recommendation-mandatory') as HTMLInputElement;
    const addButton = container.querySelector('#new-course-add-prior-recommendation') as HTMLButtonElement;

    expect(priorRecommendationInput).not.toBeNull();
    expect(mandatoryCheckbox).not.toBeNull();
    expect(addButton).not.toBeNull();
    
    priorRecommendationInput.value = validCourseId;
    priorRecommendationInput.dispatchEvent(new Event('input', { bubbles: true }));

    mandatoryCheckbox.checked = false;
    mandatoryCheckbox.dispatchEvent(new Event('change', { bubbles: true }));

    addButton.click();
    await flushPromises();

    const listItems = container.querySelectorAll('.new-course-prior-recommendation-item');
    expect(listItems.length).toBe(1);
    expect(listItems[0].textContent).toContain('Curso de Lógica');
    expect(listItems[0].textContent).toContain(`(${validCourseId.slice(0, 7)}...)`);
    expect(listItems[0].textContent).not.toContain(validCourseId);
    expect(mandatoryCheckbox.checked).toBe(false);
  });

  // CICLO 2: preservar a escolha de recomendação obrigatória.
  it('Adds a valid mandatory prior recommendation and checks the saved draft', async () => {
    const validCourseId = '123e4567-e89b-12d3-a456-426614174000';
    const validCourseName = 'Curso Base de Algoritmos';
    const { container } = await mountNewCourseScreen({
      courses: [{ id: validCourseId, title: validCourseName }],
      formDraft: { priorRecommendations: [] },
    });

    const priorRecommendationInput = container.querySelector<HTMLInputElement>('#new-course-prior-recommendations')!;
    const mandatoryCheckbox = container.querySelector<HTMLInputElement>('#new-course-prior-recommendation-mandatory')!;
    const addButton = container.querySelector<HTMLButtonElement>('#new-course-add-prior-recommendation')!;

    priorRecommendationInput.value = validCourseId;
    mandatoryCheckbox.checked = true;
    addButton.click();
    await flushPromises();

    const recommendationItem = container.querySelector('.new-course-prior-recommendation-item');
    expect(recommendationItem?.textContent).toContain(validCourseName);
    expect(recommendationItem?.textContent).toContain(`(${validCourseId.slice(0, 7)}...)`);
    expect(recommendationItem?.textContent).not.toContain(validCourseId);
    expect(recommendationItem?.textContent).toContain('Required');
    expect(JSON.parse(sessionStorage.getItem('educado.courses.formDraft') ?? '{}').priorRecommendations)
      .toEqual([{ courseId: validCourseId, mandatory: true }]);
  });

  // CICLO 3: rejeitar um ID que não segue o formato esperado.
  it('Marks the field invalid and shows an error for an invalid ID format', async () => {
    const { container } = await mountNewCourseScreen({
      courses: [],
      formDraft: { priorRecommendations: [] }
    });

    const priorRecommendationInput = container.querySelector('#new-course-prior-recommendations') as HTMLInputElement;
    const addButton = container.querySelector('#new-course-add-prior-recommendation') as HTMLButtonElement;
    expect(priorRecommendationInput).not.toBeNull();

    const invalidCourseId = 'abc123';
    
    priorRecommendationInput.value = invalidCourseId;
    priorRecommendationInput.dispatchEvent(new Event('input', { bubbles: true }));
    priorRecommendationInput.dispatchEvent(new Event('blur', { bubbles: true }));

    addButton.click();
    await flushPromises();

    // O campo deve conter a classe de erro de validação
    expect(priorRecommendationInput.classList.contains('is-invalid')).toBe(true);

    const fieldError = container.querySelector('.new-course-field-error');
    expect(fieldError).not.toBeNull();
  });

  it('Clears the invalid state when the recommendation ID is corrected', async () => {
    const validCourseId = '123e4567-e89b-12d3-a456-426614174000'
    const { container } = await mountNewCourseScreen({
      courses: [{ id: validCourseId, title: 'Example course' }],
    })
    const recommendationInput = container.querySelector<HTMLInputElement>('#new-course-prior-recommendations')!
    const addButton = container.querySelector<HTMLButtonElement>('#new-course-add-prior-recommendation')!

    recommendationInput.value = 'invalid-id'
    addButton.click()
    expect(recommendationInput.classList.contains('is-invalid')).toBe(true)
    expect(container.querySelector('.new-course-field-error')).not.toBeNull()

    recommendationInput.value = validCourseId
    recommendationInput.dispatchEvent(new Event('input', { bubbles: true }))

    expect(recommendationInput.classList.contains('is-invalid')).toBe(false)
    expect(container.querySelector('.new-course-field-error')).toBeNull()
  })

  // CICLO 4: rejeitar um ID bem formado que não identifica curso disponível.
  it('Shows an error when the course ID does not exist', async () => {
    const { container } = await mountNewCourseScreen({
      courses: [],
      formDraft: { priorRecommendations: [] }
    });

    const priorRecommendationInput = container.querySelector<HTMLInputElement>('#new-course-prior-recommendations')!;
    const addButton = container.querySelector<HTMLButtonElement>('#new-course-add-prior-recommendation')!;
    const nonExistentCourseId = '999e4567-e89b-12d3-a456-426614174000';

    priorRecommendationInput.value = nonExistentCourseId;
    addButton.click();
    await flushPromises();

    expect(container.querySelectorAll('.new-course-prior-recommendation-item')).toHaveLength(0);
    expect(container.querySelector('.new-course-field-error')?.textContent).toContain('Course not found');
  });

  // CICLO 5: impedir a inclusão do mesmo curso mais de uma vez.
  it('Rejects a duplicate prior recommendation', async () => {
    const courseId = '123e4567-e89b-12d3-a456-426614174000'
    const { container } = await mountNewCourseScreen({
      courses: [{ id: courseId, title: 'Example course' }],
    })
    const recommendationInput = container.querySelector<HTMLInputElement>('#new-course-prior-recommendations')!
    const addButton = container.querySelector<HTMLButtonElement>('#new-course-add-prior-recommendation')!

    recommendationInput.value = courseId
    addButton.click()
    recommendationInput.value = courseId
    addButton.click()

    expect(container.querySelectorAll('.new-course-prior-recommendation-item')).toHaveLength(1)
    expect(container.querySelector('.new-course-field-error')?.textContent)
      .toContain('This course has already been added as a prior recommendation')
  })

  // CICLO 6: renderizar recomendação salva quando o curso não está carregado.
  it('Uses a fallback title when the recommended course is unavailable', async () => {
    const courseId = '123e4567-e89b-12d3-a456-426614174000'
    const { container } = await mountNewCourseScreen({
      courses: [],
      formDraft: { priorRecommendations: [{ courseId, mandatory: false }] },
    })

    const recommendationItem = container.querySelector('.new-course-prior-recommendation-item')
    expect(recommendationItem?.textContent).toContain('Course')
    expect(recommendationItem?.textContent).toContain(`(${courseId.slice(0, 7)}...)`)
  })

  // CICLO 7: remover uma recomendação selecionada e persistir a remoção.
  it('Removes a prior recommendation and persists the change', async () => {
    const courseId = '123e4567-e89b-12d3-a456-426614174000'
    const { container } = await mountNewCourseScreen({
      courses: [{ id: courseId, title: 'Example course' }],
      formDraft: { priorRecommendations: [{ courseId, mandatory: false }] },
    })

    const recommendationItem = container.querySelector('.new-course-prior-recommendation-item')
    recommendationItem?.querySelector<HTMLButtonElement>('.new-course-prior-recommendation-remove')?.click()

    expect(container.querySelectorAll('.new-course-prior-recommendation-item')).toHaveLength(0)
    expect(JSON.parse(sessionStorage.getItem('educado.courses.formDraft') ?? '{}').priorRecommendations).toEqual([])
  })
});