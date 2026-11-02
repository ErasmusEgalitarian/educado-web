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
});