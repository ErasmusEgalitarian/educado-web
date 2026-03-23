import { subscribeLanguage, t } from '@/shared/i18n'
import { routes } from '@/app/routes'
import { renderPublicFooter } from '../components/PublicFooter'
import { scrollArrow, bindScrollArrows } from '../components/ScrollArrow'

export function renderLandingPage(container: HTMLElement) {
  const render = () => {
    container.innerHTML = `
      <div class="landing-page">
        <!-- Hero -->
        <section class="landing-hero">
          <div class="landing-hero-inner">
            <div class="landing-hero-content">
              <span class="landing-hero-badge">${t('landing.hero.badge')}</span>
              <h1>${t('landing.hero.title')}</h1>
              <p>${t('landing.hero.subtitle')}</p>
              <div class="landing-hero-actions">
                <a href="${routes.auth}" class="landing-hero-cta">${t('landing.hero.cta')}</a>
                <a href="${routes.about}" class="landing-hero-secondary">${t('landing.hero.learnMore')}</a>
              </div>
            </div>
            <div class="landing-hero-mockups" aria-hidden="true">
              <img src="/images/mockup-welcome.png" alt="" class="landing-hero-mockup landing-hero-mockup-back">
              <img src="/images/mockup-explore.png" alt="" class="landing-hero-mockup landing-hero-mockup-front">
            </div>
            ${scrollArrow()}
          </div>
        </section>

        <!-- Partners — International Highlight (second section) -->
        <section class="landing-partners">
          <div class="landing-partners-inner">
            <div class="landing-partners-header">
              <div class="landing-partners-flags" aria-hidden="true">
                <span>&#x1F1E7;&#x1F1F7;</span>
                <span>&#x1F1E9;&#x1F1F0;</span>
                <span>&#x1F1F3;&#x1F1F1;</span>
                <span>&#x1F1F5;&#x1F1F9;</span>
              </div>
              <h2>${t('landing.partners.title')}</h2>
              <p class="landing-partners-subtitle">${t('landing.partners.subtitle')}</p>
            </div>
            <div class="landing-partners-grid">
              <div class="landing-partner-card">
                <img src="/images/unb_logo.jpeg" alt="UnB" class="landing-partner-logo-img">
                <div class="landing-partner-info">
                  <strong>${t('landing.partners.unb.name')}</strong>
                  <span class="landing-partner-country">&#x1F1E7;&#x1F1F7; ${t('landing.partners.unb.country')}</span>
                </div>
              </div>
              <div class="landing-partner-card">
                <img src="/images/aalborg_logo.png" alt="AAU" class="landing-partner-logo-img">
                <div class="landing-partner-info">
                  <strong>${t('landing.partners.aalborg.name')}</strong>
                  <span class="landing-partner-country">&#x1F1E9;&#x1F1F0; ${t('landing.partners.aalborg.country')}</span>
                </div>
              </div>
              <div class="landing-partner-card">
                <img src="/images/saxion_logo.png" alt="Saxion" class="landing-partner-logo-img">
                <div class="landing-partner-info">
                  <strong>${t('landing.partners.saxion.name')}</strong>
                  <span class="landing-partner-country">&#x1F1F3;&#x1F1F1; ${t('landing.partners.saxion.country')}</span>
                </div>
              </div>
              <div class="landing-partner-card">
                <img src="/images/minho_logo.jpeg" alt="UMinho" class="landing-partner-logo-img">
                <div class="landing-partner-info">
                  <strong>${t('landing.partners.minho.name')}</strong>
                  <span class="landing-partner-country">&#x1F1F5;&#x1F1F9; ${t('landing.partners.minho.country')}</span>
                </div>
              </div>
            </div>
            ${scrollArrow(true)}
          </div>
        </section>

        <!-- Features (4 cards) -->
        <section class="landing-features">
          <div class="landing-features-inner">
            <h2>${t('landing.features.title')}</h2>
            <div class="landing-features-grid">
              <div class="landing-feature-card">
                <div class="landing-feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
                  </svg>
                </div>
                <h3>${t('landing.features.feature1.title')}</h3>
                <p>${t('landing.features.feature1.description')}</p>
              </div>
              <div class="landing-feature-card">
                <div class="landing-feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <h3>${t('landing.features.feature2.title')}</h3>
                <p>${t('landing.features.feature2.description')}</p>
              </div>
              <div class="landing-feature-card">
                <div class="landing-feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
                  </svg>
                </div>
                <h3>${t('landing.features.feature3.title')}</h3>
                <p>${t('landing.features.feature3.description')}</p>
              </div>
              <div class="landing-feature-card">
                <div class="landing-feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                </div>
                <h3>${t('landing.features.feature4.title')}</h3>
                <p>${t('landing.features.feature4.description')}</p>
              </div>
            </div>
            ${scrollArrow()}
          </div>
        </section>

        <!-- Audience: Students + Creators -->
        <section class="landing-audience">
          <div class="landing-audience-inner">
            <h2>${t('landing.audience.title')}</h2>
            <div class="landing-audience-grid">
              <div class="landing-audience-card landing-audience-students">
                <div class="landing-audience-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <h3>${t('landing.audience.students.title')}</h3>
                <p>${t('landing.audience.students.description')}</p>
                <ul class="landing-audience-list">
                  <li>${t('landing.audience.students.item1')}</li>
                  <li>${t('landing.audience.students.item2')}</li>
                  <li>${t('landing.audience.students.item3')}</li>
                </ul>
              </div>
              <div class="landing-audience-card landing-audience-creators">
                <div class="landing-audience-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                </div>
                <h3>${t('landing.audience.creators.title')}</h3>
                <p>${t('landing.audience.creators.description')}</p>
                <ul class="landing-audience-list">
                  <li>${t('landing.audience.creators.item1')}</li>
                  <li>${t('landing.audience.creators.item2')}</li>
                  <li>${t('landing.audience.creators.item3')}</li>
                </ul>
              </div>
            </div>
            ${scrollArrow()}
          </div>
        </section>

        <!-- How it works -->
        <section class="landing-how-it-works">
          <div class="landing-how-it-works-inner">
            <h2>${t('landing.howItWorks.title')}</h2>
            <div class="landing-steps">
              <div class="landing-step">
                <div class="landing-step-number">1</div>
                <h3>${t('landing.howItWorks.step1.title')}</h3>
                <p>${t('landing.howItWorks.step1.description')}</p>
              </div>
              <div class="landing-step-connector" aria-hidden="true"></div>
              <div class="landing-step">
                <div class="landing-step-number">2</div>
                <h3>${t('landing.howItWorks.step2.title')}</h3>
                <p>${t('landing.howItWorks.step2.description')}</p>
              </div>
              <div class="landing-step-connector" aria-hidden="true"></div>
              <div class="landing-step">
                <div class="landing-step-number">3</div>
                <h3>${t('landing.howItWorks.step3.title')}</h3>
                <p>${t('landing.howItWorks.step3.description')}</p>
              </div>
            </div>
            ${scrollArrow()}
          </div>
        </section>

        <!-- SDGs -->
        <section class="landing-sdgs">
          <div class="landing-sdgs-inner">
            <h2>${t('landing.sdgs.title')}</h2>
            <div class="landing-sdgs-grid">
              <div class="landing-sdg-card landing-sdg-8">
                <div class="landing-sdg-number">${t('landing.sdgs.sdg8.number')}</div>
                <div class="landing-sdg-label">ODS ${t('landing.sdgs.sdg8.number')}</div>
                <h3>${t('landing.sdgs.sdg8.title')}</h3>
                <p>${t('landing.sdgs.sdg8.description')}</p>
              </div>
              <div class="landing-sdg-card landing-sdg-10">
                <div class="landing-sdg-number">${t('landing.sdgs.sdg10.number')}</div>
                <div class="landing-sdg-label">ODS ${t('landing.sdgs.sdg10.number')}</div>
                <h3>${t('landing.sdgs.sdg10.title')}</h3>
                <p>${t('landing.sdgs.sdg10.description')}</p>
              </div>
              <div class="landing-sdg-card landing-sdg-12">
                <div class="landing-sdg-number">${t('landing.sdgs.sdg12.number')}</div>
                <div class="landing-sdg-label">ODS ${t('landing.sdgs.sdg12.number')}</div>
                <h3>${t('landing.sdgs.sdg12.title')}</h3>
                <p>${t('landing.sdgs.sdg12.description')}</p>
              </div>
              <div class="landing-sdg-card landing-sdg-13">
                <div class="landing-sdg-number">${t('landing.sdgs.sdg13.number')}</div>
                <div class="landing-sdg-label">ODS ${t('landing.sdgs.sdg13.number')}</div>
                <h3>${t('landing.sdgs.sdg13.title')}</h3>
                <p>${t('landing.sdgs.sdg13.description')}</p>
              </div>
            </div>
            ${scrollArrow()}
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
