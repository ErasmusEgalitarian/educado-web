import { subscribeLanguage, t } from '@/shared/i18n'
import { renderPublicFooter } from '../components/PublicFooter'
import { scrollArrow, bindScrollArrows } from '../components/ScrollArrow'

export function renderContactPage(container: HTMLElement) {
  const render = () => {
    container.innerHTML = `
      <div class="about-page">
        <!-- Hero -->
        <section class="about-hero" style="padding:56px 24px 40px">
          <div class="about-hero-inner">
            <h1>${t('contact.hero.title')}</h1>
            <p>${t('contact.hero.subtitle')}</p>
            ${scrollArrow()}
          </div>
        </section>

        <!-- Contact channels -->
        <section class="del-section del-section-light">
          <div class="del-inner">
            <h2>${t('contact.channels.title')}</h2>
            <div class="del-data-grid">
              <div class="contact-channel-card">
                <div class="contact-channel-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <h3>${t('contact.channels.email.title')}</h3>
                <p>${t('contact.channels.email.description')}</p>
                <a href="mailto:lgabrielantunes@gmail.com" class="del-link">lgabrielantunes@gmail.com</a>
              </div>
              <div class="contact-channel-card">
                <div class="contact-channel-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                </div>
                <h3>${t('contact.channels.github.title')}</h3>
                <p>${t('contact.channels.github.description')}</p>
                <a href="https://github.com/ErasmusEgalitarian" class="del-link" target="_blank" rel="noopener">github.com/ErasmusEgalitarian</a>
              </div>
            </div>
            ${scrollArrow()}
          </div>
        </section>

        <!-- Account Deletion (Google Play compliance) -->
        <section id="delete-account" class="del-section del-section-white">
          <div class="del-inner">
            <h2>${t('deleteAccount.steps.title')}</h2>
            <p class="del-compliance-note">${t('deleteAccount.intro')}</p>
            <ol class="del-steps">
              <li>${t('deleteAccount.steps.step1')}</li>
              <li>${t('deleteAccount.steps.step2')}</li>
              <li>${t('deleteAccount.steps.step3')}</li>
              <li>${t('deleteAccount.steps.step4')}</li>
            </ol>
            <div class="del-alt">
              <p>${t('deleteAccount.steps.alt')} <a href="mailto:${t('deleteAccount.steps.altEmail')}" class="del-link">${t('deleteAccount.steps.altEmail')}</a> ${t('deleteAccount.steps.altNote')}</p>
            </div>
            ${scrollArrow()}
          </div>
        </section>

        <!-- Data deletion details -->
        <section class="del-section del-section-light">
          <div class="del-inner">
            <h2>${t('deleteAccount.data.title')}</h2>
            <div class="del-data-grid">
              <div class="del-data-card del-data-deleted">
                <h3>${t('deleteAccount.data.deletedTitle')}</h3>
                <ul>
                  <li>${t('deleteAccount.data.deleted1')}</li>
                  <li>${t('deleteAccount.data.deleted2')}</li>
                  <li>${t('deleteAccount.data.deleted3')}</li>
                  <li>${t('deleteAccount.data.deleted4')}</li>
                  <li>${t('deleteAccount.data.deleted5')}</li>
                  <li>${t('deleteAccount.data.deleted6')}</li>
                </ul>
              </div>
              <div class="del-data-card del-data-retained">
                <h3>${t('deleteAccount.data.retainedTitle')}</h3>
                <ul>
                  <li>${t('deleteAccount.data.retained1')}</li>
                  <li>${t('deleteAccount.data.retained2')}</li>
                </ul>
              </div>
            </div>
            <div class="del-retention">
              <h3>${t('deleteAccount.data.retentionTitle')}</h3>
              <p>${t('deleteAccount.data.retentionText')}</p>
            </div>
          </div>
        </section>

        ${renderPublicFooter()}
      </div>
    `
    bindScrollArrows(container)
  }

  render()
  subscribeLanguage(() => render())
}
