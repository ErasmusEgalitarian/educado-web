import { subscribeLanguage, t } from '@/shared/i18n'

export function AuthHero(container: HTMLElement) {
  let currentIndex = 0
  let intervalId: number | undefined

  const slides = [
    {
      titleKey: 'auth.hero.slide1.title',
      descriptionKey: 'auth.hero.slide1.description',
      image: '/images/onboarding-slide.jpg',
    },
    {
      titleKey: 'auth.hero.slide2.title',
      descriptionKey: 'auth.hero.slide2.description',
      image: '/images/onboarding-slide.jpg',
    },
    {
      titleKey: 'auth.hero.slide3.title',
      descriptionKey: 'auth.hero.slide3.description',
      image: '/images/onboarding-slide.jpg',
    },
  ]

  const render = () => {
    container.innerHTML = `
      <div class="auth-hero">
        <div class="auth-hero-carousel">
          ${slides
            .map(
              (slide, index) => `
                <article class="auth-hero-slide ${index === currentIndex ? 'active' : ''}" style="background-image: url('${slide.image}')">
                  <div class="auth-hero-overlay"></div>
                  <div class="auth-hero-content">
                    <h1>${t(slide.titleKey)}</h1>
                    <p>${t(slide.descriptionKey)}</p>
                  </div>
                </article>
              `
            )
            .join('')}
        </div>
        <div class="hero-dots" role="tablist" aria-label="${t('auth.hero.onboardingLabel')}">
          ${slides
            .map(
              (_, index) =>
                `<button type="button" class="hero-dot ${index === currentIndex ? 'active' : ''}" data-index="${index}" aria-label="${t('auth.hero.slideAria', { index: index + 1 })}"></button>`
            )
            .join('')}
        </div>
      </div>
    `

    const slideEls = Array.from(container.querySelectorAll('.auth-hero-slide')) as HTMLElement[]
    const dotEls = Array.from(container.querySelectorAll('.hero-dot')) as HTMLButtonElement[]
    const carouselEl = container.querySelector('.auth-hero-carousel') as HTMLElement | null

    const goToSlide = (index: number) => {
      currentIndex = index
      slideEls.forEach((slide, slideIndex) => {
        slide.classList.toggle('active', slideIndex === index)
      })
      dotEls.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === index)
      })
    }

    const goToNext = () => {
      const nextIndex = (currentIndex + 1) % slides.length
      goToSlide(nextIndex)
    }

    const goToPrev = () => {
      const prevIndex = (currentIndex - 1 + slides.length) % slides.length
      goToSlide(prevIndex)
    }

    dotEls.forEach((dot) => {
      dot.addEventListener('click', () => {
        const index = Number(dot.dataset.index)
        goToSlide(index)
      })
    })

    carouselEl?.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      if (target.closest('.hero-dot')) return

      const rect = carouselEl.getBoundingClientRect()
      const clickX = event.clientX - rect.left
      const edgeZone = rect.width * 0.3

      if (clickX <= edgeZone) {
        goToPrev()
        return
      }

      if (clickX >= rect.width - edgeZone) {
        goToNext()
      }
    })

    if (intervalId) window.clearInterval(intervalId)
    intervalId = window.setInterval(() => {
      goToNext()
    }, 5000)
  }

  render()
  subscribeLanguage(() => render())
}
