import { subscribeLanguage, t } from '@/shared/i18n'
import { renderPublicFooter } from '../components/PublicFooter'
import { scrollArrow, bindScrollArrows } from '../components/ScrollArrow'

export function renderAboutPage(container: HTMLElement) {
  const render = () => {
    container.innerHTML = `
      <div class="about-page">
        <!-- Hero -->
        <section class="about-hero">
          <div class="about-hero-inner">
            <h1>${t('about.hero.title')}</h1>
            <p>${t('about.hero.subtitle')}</p>
            ${scrollArrow()}
          </div>
        </section>

        <!-- Mission & Vision side by side -->
        <section class="about-mission-vision">
          <div class="about-mission-vision-inner">
            <div class="about-mv-card about-mv-mission">
              <div class="about-mv-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
                </svg>
              </div>
              <h2>${t('about.mission.title')}</h2>
              <p>${t('about.mission.description')}</p>
            </div>
            <div class="about-mv-card about-mv-vision">
              <div class="about-mv-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <h2>${t('about.vision.title')}</h2>
              <p>${t('about.vision.description')}</p>
            </div>
            ${scrollArrow(true)}
          </div>
        </section>

        <!-- Values -->
        <section class="about-values">
          <div class="about-values-inner">
            <h2>${t('about.values.title')}</h2>
            <div class="about-values-grid">
              <div class="about-value-card">
                <div class="about-value-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <h3>${t('about.values.value1.title')}</h3>
                <p>${t('about.values.value1.description')}</p>
              </div>
              <div class="about-value-card">
                <div class="about-value-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </div>
                <h3>${t('about.values.value2.title')}</h3>
                <p>${t('about.values.value2.description')}</p>
              </div>
              <div class="about-value-card">
                <div class="about-value-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h3>${t('about.values.value3.title')}</h3>
                <p>${t('about.values.value3.description')}</p>
              </div>
            </div>
            ${scrollArrow()}
          </div>
        </section>

        <!-- Partners -->
        <section class="about-partners">
          <div class="about-partners-inner">
            <h2>${t('about.partners.title')}</h2>
            <p class="about-partners-subtitle">${t('about.partners.subtitle')}</p>
            <div class="about-partners-grid">
              <div class="about-partner-card">
                <img src="/images/unb_logo.jpeg" alt="UnB" class="about-partner-logo-img">
                <h3>${t('about.partners.unb.name')}</h3>
                <span class="about-partner-country">${t('about.partners.unb.country')}</span>
                <p>${t('about.partners.unb.role')}</p>
              </div>
              <div class="about-partner-card">
                <img src="/images/aalborg_logo.png" alt="AAU" class="about-partner-logo-img">
                <h3>${t('about.partners.aalborg.name')}</h3>
                <span class="about-partner-country">${t('about.partners.aalborg.country')}</span>
                <p>${t('about.partners.aalborg.role')}</p>
              </div>
              <div class="about-partner-card">
                <img src="/images/saxion_logo.png" alt="Saxion" class="about-partner-logo-img">
                <h3>${t('about.partners.saxion.name')}</h3>
                <span class="about-partner-country">${t('about.partners.saxion.country')}</span>
                <p>${t('about.partners.saxion.role')}</p>
              </div>
              <div class="about-partner-card">
                <img src="/images/minho_logo.jpeg" alt="UMinho" class="about-partner-logo-img">
                <h3>${t('about.partners.minho.name')}</h3>
                <span class="about-partner-country">${t('about.partners.minho.country')}</span>
                <p>${t('about.partners.minho.role')}</p>
              </div>
            </div>
            <div class="about-partners-extra">
              <div class="about-partner-extra-card">
                <h3>${t('about.partners.egalitarian.name')}</h3>
                <p>${t('about.partners.egalitarian.role')}</p>
              </div>
              <div class="about-partner-extra-card">
                <h3>${t('about.partners.cooperatives.name')}</h3>
                <p>${t('about.partners.cooperatives.role')}</p>
              </div>
            </div>
            ${scrollArrow()}
          </div>
        </section>

        <!-- SDGs -->
        <section class="about-sdgs">
          <div class="about-sdgs-inner">
            <h2>${t('about.sdgs.title')}</h2>
            <p class="about-sdgs-description">${t('about.sdgs.description')}</p>
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

        <!-- How We Work -->
        <section class="about-how-we-work">
          <div class="about-how-we-work-inner">
            <h2>${t('about.howWeWork.title')}</h2>
            <p class="about-how-we-work-description">${t('about.howWeWork.description')}</p>
            <div class="about-how-we-work-grid">
              <div class="about-how-we-work-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>${t('about.howWeWork.item1')}</span>
              </div>
              <div class="about-how-we-work-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <span>${t('about.howWeWork.item2')}</span>
              </div>
              <div class="about-how-we-work-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
                <span>${t('about.howWeWork.item3')}</span>
              </div>
              <div class="about-how-we-work-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span>${t('about.howWeWork.item4')}</span>
              </div>
            </div>
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
