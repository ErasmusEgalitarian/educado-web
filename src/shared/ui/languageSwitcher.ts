import { getLanguage, setLanguage, subscribeLanguage, t, type Language } from '@/shared/i18n'

export function mountLanguageSwitcher(container: HTMLElement) {
  const render = () => {
    const currentLanguage = getLanguage()

    container.innerHTML = `
      <label class="language-switcher" for="language-select">
        <span class="language-switcher-label">${t('common.language')}</span>
        <select id="language-select" class="language-switcher-select" aria-label="${t('common.language')}">
          <option value="pt-BR" ${currentLanguage === 'pt-BR' ? 'selected' : ''}>${t('common.portuguese')}</option>
          <option value="en-US" ${currentLanguage === 'en-US' ? 'selected' : ''}>${t('common.english')}</option>
        </select>
      </label>
    `
  }

  // Subscribe to language changes but keep it local
  // (not stored - language switcher updates itself when language changes)
  subscribeLanguage(() => render())
  
  container.addEventListener('change', (event) => {
    const selectElement = event.target as HTMLSelectElement
    if (selectElement.id !== 'language-select') return

    const selectedLanguage = selectElement.value as Language
    if (selectedLanguage === 'pt-BR' || selectedLanguage === 'en-US') {
      setLanguage(selectedLanguage)
    }
  })

  render()
}
