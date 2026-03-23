import { subscribeLanguage, t } from '@/shared/i18n'
import { renderPublicFooter } from '../components/PublicFooter'
import { scrollArrow, bindScrollArrows } from '../components/ScrollArrow'
import { api } from '@/shared/api/http'
import { toast } from '@/shared/ui/toast'

export function renderInstitutionsPage(container: HTMLElement) {
  const render = () => {
    container.innerHTML = `
      <div class="about-page">
        <!-- Hero -->
        <section class="about-hero">
          <div class="about-hero-inner">
            <h1>${t('institutions.hero.title')}</h1>
            <p>${t('institutions.hero.subtitle')}</p>
            <div class="landing-hero-actions" style="justify-content:center">
              <a href="#inst-form-section" class="landing-hero-cta">${t('institutions.hero.cta')}</a>
            </div>
            ${scrollArrow()}
          </div>
        </section>

        <!-- Why Participate -->
        <section class="inst-why">
          <div class="inst-why-inner">
            <h2>${t('institutions.why.title')}</h2>
            <div class="inst-why-grid">
              <div class="inst-why-card">
                <div class="inst-why-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h3>${t('institutions.why.benefit1.title')}</h3>
                <p>${t('institutions.why.benefit1.description')}</p>
              </div>
              <div class="inst-why-card">
                <div class="inst-why-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </div>
                <h3>${t('institutions.why.benefit2.title')}</h3>
                <p>${t('institutions.why.benefit2.description')}</p>
              </div>
              <div class="inst-why-card">
                <div class="inst-why-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <h3>${t('institutions.why.benefit3.title')}</h3>
                <p>${t('institutions.why.benefit3.description')}</p>
              </div>
              <div class="inst-why-card">
                <div class="inst-why-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
                  </svg>
                </div>
                <h3>${t('institutions.why.benefit4.title')}</h3>
                <p>${t('institutions.why.benefit4.description')}</p>
              </div>
            </div>
            ${scrollArrow(true)}
          </div>
        </section>

        <!-- How to participate -->
        <section class="inst-how">
          <div class="inst-how-inner">
            <h2>${t('institutions.how.title')}</h2>
            <div class="landing-steps">
              <div class="landing-step">
                <div class="landing-step-number">1</div>
                <h3>${t('institutions.how.step1.title')}</h3>
                <p>${t('institutions.how.step1.description')}</p>
              </div>
              <div class="landing-step-connector" aria-hidden="true"></div>
              <div class="landing-step">
                <div class="landing-step-number">2</div>
                <h3>${t('institutions.how.step2.title')}</h3>
                <p>${t('institutions.how.step2.description')}</p>
              </div>
              <div class="landing-step-connector" aria-hidden="true"></div>
              <div class="landing-step">
                <div class="landing-step-number">3</div>
                <h3>${t('institutions.how.step3.title')}</h3>
                <p>${t('institutions.how.step3.description')}</p>
              </div>
            </div>
            ${scrollArrow()}
          </div>
        </section>

        <!-- Roles -->
        <section class="inst-roles">
          <div class="inst-roles-inner">
            <h2>${t('institutions.roles.title')}</h2>
            <p class="inst-roles-subtitle">${t('institutions.roles.subtitle')}</p>
            <div class="inst-roles-grid">
              <div class="inst-role-card">
                <div class="inst-role-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                </div>
                <h3>${t('institutions.roles.role1.title')}</h3>
                <p>${t('institutions.roles.role1.description')}</p>
              </div>
              <div class="inst-role-card">
                <div class="inst-role-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <h3>${t('institutions.roles.role2.title')}</h3>
                <p>${t('institutions.roles.role2.description')}</p>
              </div>
              <div class="inst-role-card">
                <div class="inst-role-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </div>
                <h3>${t('institutions.roles.role3.title')}</h3>
                <p>${t('institutions.roles.role3.description')}</p>
              </div>
              <div class="inst-role-card">
                <div class="inst-role-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </div>
                <h3>${t('institutions.roles.role4.title')}</h3>
                <p>${t('institutions.roles.role4.description')}</p>
              </div>
            </div>
            ${scrollArrow()}
          </div>
        </section>

        <!-- Form -->
        <section id="inst-form-section" class="inst-form-section">
          <div class="inst-form-section-inner">
            <h2>${t('institutions.cta.title')}</h2>
            <p class="inst-form-subtitle">${t('institutions.cta.description')}</p>
            <form id="inst-form" class="inst-form" novalidate>
              <div class="inst-form-grid">
                <label class="inst-form-field">
                  <span>${t('institutions.form.institutionName')} <strong>*</strong></span>
                  <input id="inst-name" type="text" placeholder="${t('institutions.form.institutionNamePlaceholder')}" required>
                </label>
                <label class="inst-form-field">
                  <span>${t('institutions.form.type')} <strong>*</strong></span>
                  <select id="inst-type" required>
                    <option value="university">${t('institutions.form.typeUniversity')}</option>
                    <option value="cooperative">${t('institutions.form.typeCooperative')}</option>
                    <option value="ngo">${t('institutions.form.typeNgo')}</option>
                    <option value="company">${t('institutions.form.typeCompany')}</option>
                    <option value="other">${t('institutions.form.typeOther')}</option>
                  </select>
                </label>
                <label class="inst-form-field">
                  <span>${t('institutions.form.contactName')} <strong>*</strong></span>
                  <input id="inst-contact" type="text" placeholder="${t('institutions.form.contactNamePlaceholder')}" required>
                </label>
                <label class="inst-form-field">
                  <span>${t('institutions.form.email')} <strong>*</strong></span>
                  <input id="inst-email" type="email" placeholder="${t('institutions.form.emailPlaceholder')}" required>
                </label>
              </div>
              <label class="inst-form-field inst-form-full">
                <span>${t('institutions.form.message')}</span>
                <textarea id="inst-message" rows="4" placeholder="${t('institutions.form.messagePlaceholder')}"></textarea>
              </label>
              <button id="inst-submit" type="submit" class="inst-form-submit">${t('institutions.form.submit')}</button>
            </form>
          </div>
        </section>

        ${renderPublicFooter()}
      </div>
    `

    bindFormEvents()
  }

  const bindFormEvents = () => {
    const form = container.querySelector('#inst-form') as HTMLFormElement | null
    const submitBtn = container.querySelector('#inst-submit') as HTMLButtonElement | null

    form?.addEventListener('submit', async (e) => {
      e.preventDefault()
      if (!submitBtn) return

      const nameInput = container.querySelector('#inst-name') as HTMLInputElement
      const typeInput = container.querySelector('#inst-type') as HTMLSelectElement
      const contactInput = container.querySelector('#inst-contact') as HTMLInputElement
      const emailInput = container.querySelector('#inst-email') as HTMLInputElement
      const messageInput = container.querySelector('#inst-message') as HTMLTextAreaElement

      if (!nameInput.value.trim() || !contactInput.value.trim() || !emailInput.value.trim()) return

      submitBtn.disabled = true
      submitBtn.textContent = t('institutions.form.sending')

      try {
        await api.post('/institutions/request', {
          institutionName: nameInput.value.trim(),
          type: typeInput.value,
          contactName: contactInput.value.trim(),
          email: emailInput.value.trim(),
          message: messageInput.value.trim(),
        })
        toast(t('institutions.form.success'), 'success')
        form.reset()
      } catch {
        toast(t('institutions.form.error'), 'error')
      } finally {
        submitBtn.disabled = false
        submitBtn.textContent = t('institutions.form.submit')
      }
    })
  }

  render()
  bindScrollArrows(container)
  subscribeLanguage(() => { render(); bindScrollArrows(container) })
}
