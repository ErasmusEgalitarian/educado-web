import { t } from '@/shared/i18n'

export function renderPublicFooter(): string {
  return `
    <footer class="public-footer">
      <div class="public-footer-content">
        <div class="public-footer-brand">
          <img src="/images/logo_black240.png" alt="EDUCADO" class="public-footer-logo">
          <span class="public-footer-name">EDUCADO</span>
        </div>
        <div>
          <p class="public-footer-copy">${t('landing.footer.copyright')}</p>
          <p class="public-footer-initiative">${t('landing.footer.initiative')}</p>
        </div>
      </div>
    </footer>
  `
}
