import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { flushPromises, homePageMocks,  mountNewCourseScreen, resetHomePageTestState } from '@/test-utils/homePage'
import { getLanguage, setLanguage } from '@/shared/i18n'
import type { Course } from '@/features/courses/model/course.types'


const initialLanguage = getLanguage()

function makeCourse(id: string, title: string): Course {
  return {
    id,
    ownerId: 'owner-1',
    title,
    shortDescription: title,
    description: title,
    imageMediaId: 'image-1',
    difficulty: 'beginner',
    estimatedTime: '8 hours',
    passingThreshold: 70,
    category: 'Tests',
    tags: [],
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  }
}

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

  // CICLO 8: permitir cinco recomendações e bloquear a sexta.
  it('Prevents adding more than five prior recommendations', async () => {
    const availableCourses = [
      { id: '123e4567-e89b-12d3-a456-426614174001', title: 'Curso 1' },
      { id: '123e4567-e89b-12d3-a456-426614174002', title: 'Curso 2' },
      { id: '123e4567-e89b-12d3-a456-426614174003', title: 'Curso 3' },
      { id: '123e4567-e89b-12d3-a456-426614174004', title: 'Curso 4' },
      { id: '123e4567-e89b-12d3-a456-426614174005', title: 'Curso 5' },
      { id: '123e4567-e89b-12d3-a456-426614174006', title: 'Curso 6' },
    ];
    const { container, mocks } = await mountNewCourseScreen({
      courses: availableCourses,
      formDraft: { priorRecommendations: [] },
    });

    const priorRecommendationInput = container.querySelector<HTMLInputElement>('#new-course-prior-recommendations')!;
    const addButton = container.querySelector<HTMLButtonElement>('#new-course-add-prior-recommendation')!;

    for (let i = 1; i <= 5; i++) {
      priorRecommendationInput.value = `123e4567-e89b-12d3-a456-42661417400${i}`;
      addButton.click();
      await flushPromises();
    }

    expect(container.querySelectorAll('.new-course-prior-recommendation-item')).toHaveLength(5);

    priorRecommendationInput.value = '123e4567-e89b-12d3-a456-426614174006';
    addButton.click();
    await flushPromises();

    expect(container.querySelectorAll('.new-course-prior-recommendation-item')).toHaveLength(5);
    expect(mocks.toast).toHaveBeenCalledWith(
      'Maximum of 5 prior recommendations reached',
      'error',
    );
  });

  // CICLO 9: incluir recomendações selecionadas no payload de criação.
  it('Sends prior recommendations in the course creation payload', async () => {
    const validCourseId = '123e4567-e89b-12d3-a456-426614174000'
    const { container, mocks } = await mountNewCourseScreen({
      courses: [{ id: validCourseId, title: 'Curso de exemplo' }]
    })
    const createdCourse: Course = {
      id: 'course-created',
      ownerId: 'owner-1',
      title: 'Curso de teste',
      shortDescription: 'Descrição válida para teste',
      description: 'Descrição válida para o curso de teste',
      imageMediaId: validCourseId,
      difficulty: 'beginner',
      estimatedTime: '8 horas',
      passingThreshold: 70,
      category: 'Testes',
      tags: [],
      isActive: false,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      priorRecommendations: [{ courseId: validCourseId, mandatory: true }],
    }
    mocks.coursesApi.createCourse.mockResolvedValue(createdCourse)
    mocks.coursesApi.deactivateCourse.mockResolvedValue(createdCourse)

    const priorRecommendationInput = container.querySelector('#new-course-prior-recommendations') as HTMLInputElement
    priorRecommendationInput.value = validCourseId
    container.querySelector<HTMLInputElement>('#new-course-prior-recommendation-mandatory')!.checked = true
    container.querySelector<HTMLButtonElement>('#new-course-add-prior-recommendation')?.click()

    ;(container.querySelector('#new-course-title') as HTMLInputElement).value = 'Curso de teste'
    ;(container.querySelector('#new-course-description') as HTMLTextAreaElement).value = 'Descrição válida para o curso de teste'
    ;(container.querySelector('#new-course-category') as HTMLInputElement).value = 'Testes'
    ;(container.querySelector('#new-course-image') as HTMLInputElement).value = validCourseId
    container.querySelector<HTMLButtonElement>('#new-course-save-draft')?.click()
    await flushPromises()

    expect(mocks.coursesApi.createCourse).toHaveBeenCalledWith(
      expect.objectContaining({
        priorRecommendations: [{ courseId: validCourseId, mandatory: true }],
      }),
    )
  })

});