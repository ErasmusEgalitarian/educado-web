export const scrollArrow = (light = false) => `
  <div class="section-scroll-arrow${light ? ' section-scroll-arrow-light' : ''}">
    <button type="button" class="section-scroll-arrow-btn" aria-label="Scroll to next section">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
    </button>
  </div>`

export function bindScrollArrows(container: HTMLElement) {
  container.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('.section-scroll-arrow-btn')
    if (!btn) return

    const section = btn.closest('section')
    if (!section) return

    const next = section.nextElementSibling as HTMLElement | null
    if (next) {
      next.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}
