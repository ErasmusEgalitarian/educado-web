import { subscribeLanguage, t } from '@/shared/i18n'
import { routes } from '@/app/routes'
import { renderPublicFooter } from '../components/PublicFooter'
import { scrollArrow, bindScrollArrows } from '../components/ScrollArrow'

export function renderSolutionPage(container: HTMLElement) {
  const render = () => {
    container.innerHTML = `
      <div class="about-page">
        <!-- Hero -->
        <section class="about-hero">
          <div class="about-hero-inner">
            <h1>${t('solution.hero.title')}</h1>
            <p>${t('solution.hero.subtitle')}</p>
            ${scrollArrow()}
          </div>
        </section>

        <!-- Platforms: Mobile + Web -->
        <section class="sol-platforms">
          <div class="sol-platforms-inner">
            <h2>${t('solution.platforms.title')}</h2>
            <div class="sol-platforms-grid">
              <!-- Mobile -->
              <div class="sol-platform-card sol-platform-mobile">
                <div class="sol-platform-header">
                  <div class="sol-platform-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
                    </svg>
                  </div>
                  <h3>${t('solution.platforms.mobile.title')}</h3>
                </div>
                <p>${t('solution.platforms.mobile.description')}</p>
                <div class="sol-platform-mockup">
                  <img src="/images/mockup-welcome.png" alt="" class="sol-mockup-img">
                </div>
                <ul class="sol-platform-features">
                  <li>${t('solution.platforms.mobile.feature1')}</li>
                  <li>${t('solution.platforms.mobile.feature2')}</li>
                  <li>${t('solution.platforms.mobile.feature3')}</li>
                  <li>${t('solution.platforms.mobile.feature4')}</li>
                </ul>
              </div>
              <!-- Web -->
              <div class="sol-platform-card sol-platform-web">
                <div class="sol-platform-header">
                  <div class="sol-platform-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                  </div>
                  <h3>${t('solution.platforms.web.title')}</h3>
                </div>
                <p>${t('solution.platforms.web.description')}</p>
                <div class="sol-platform-mockup">
                  <img src="/images/web_home.png" alt="" class="sol-mockup-img sol-mockup-web">
                </div>
                <ul class="sol-platform-features">
                  <li>${t('solution.platforms.web.feature1')}</li>
                  <li>${t('solution.platforms.web.feature2')}</li>
                  <li>${t('solution.platforms.web.feature3')}</li>
                  <li>${t('solution.platforms.web.feature4')}</li>
                </ul>
              </div>
            </div>
            ${scrollArrow(true)}
          </div>
        </section>

        <!-- Key Features -->
        <section class="sol-features">
          <div class="sol-features-inner">
            <h2>${t('solution.features.title')}</h2>
            <div class="sol-features-grid">
              <div class="sol-feature-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <h3>${t('solution.features.feature1.title')}</h3>
                <p>${t('solution.features.feature1.description')}</p>
              </div>
              <div class="sol-feature-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                <h3>${t('solution.features.feature2.title')}</h3>
                <p>${t('solution.features.feature2.description')}</p>
              </div>
              <div class="sol-feature-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <h3>${t('solution.features.feature3.title')}</h3>
                <p>${t('solution.features.feature3.description')}</p>
              </div>
              <div class="sol-feature-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                <h3>${t('solution.features.feature4.title')}</h3>
                <p>${t('solution.features.feature4.description')}</p>
              </div>
              <div class="sol-feature-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
                <h3>${t('solution.features.feature5.title')}</h3>
                <p>${t('solution.features.feature5.description')}</p>
              </div>
              <div class="sol-feature-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <h3>${t('solution.features.feature6.title')}</h3>
                <p>${t('solution.features.feature6.description')}</p>
              </div>
            </div>
            ${scrollArrow()}
          </div>
        </section>

        <!-- The Idea -->
        <section class="sol-idea">
          <div class="sol-idea-inner">
            <h2>${t('solution.idea.title')}</h2>
            <p>${t('solution.idea.description')}</p>
          </div>
        </section>

        <!-- CTA -->
        <section class="landing-cta">
          <div class="landing-cta-inner">
            <h2>${t('landing.cta.title')}</h2>
            <p>${t('landing.cta.description')}</p>
            <a href="${routes.auth}" class="landing-cta-btn">${t('landing.cta.button')}</a>
          </div>
        </section>

        ${renderPublicFooter()}
      </div>
    `
  }

  render()
  bindScrollArrows(container)
  subscribeLanguage(() => { render(); bindScrollArrows(container) })
}
