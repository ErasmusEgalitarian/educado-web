import { authApi } from '@/features/auth/api/auth.api'
import { t } from '@/shared/i18n'
import { toast } from '@/shared/ui/toast'

type PasswordResetContext = 'login' | 'profile'
type Step = 'code' | 'newPassword' | 'success'

interface PasswordResetFlowOptions {
  context: PasswordResetContext
  email: string
  onClose: () => void
  onSuccess?: () => void
}

export function PasswordResetFlow(container: HTMLElement, options: PasswordResetFlowOptions) {
  // state
  let step: Step = 'code'
  let codeValue = ''  // for profile: single input; for login: 4 individual digits
  const codeDigits = ['', '', '', '']  // for login context
  let newPassword = ''
  let confirmPassword = ''
  let showNewPassword = false
  let showConfirmPassword = false
  let isSubmitting = false

  // closeSvg icon
  const closeSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  const eyeSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#4e6879" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="#4e6879" stroke-width="2"/></svg>`
  const eyeOffSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="#4e6879" stroke-width="2"/><line x1="1" y1="1" x2="23" y2="23" stroke="#4e6879" stroke-width="2"/></svg>`

  const escapeHtml = (raw: string) => raw.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

  const isPasswordValid = (pwd: string) => /^(?=.*[A-Za-z]).{8,}$/.test(pwd)

  function render() {
    if (step === 'code') renderCodeStep()
    else if (step === 'newPassword') renderNewPasswordStep()
    else renderSuccessStep()
  }

  function renderCodeStep() {
    const isLogin = options.context === 'login'
    const codeComplete = isLogin ? codeDigits.every(d => d !== '') : codeValue.trim().length === 4

    container.innerHTML = `
      <div class="pw-reset-overlay" id="pw-reset-overlay">
        <div class="pw-reset-modal ${isLogin ? 'pw-reset-modal--narrow' : ''}">
          <div class="pw-reset-modal-header">
            <h3>${t('passwordReset.title')}</h3>
            <button type="button" class="pw-reset-close" id="pw-reset-close">${closeSvg}</button>
          </div>
          <p class="pw-reset-description">
            ${isLogin
              ? `${t('passwordReset.codeSentMessage')} <strong>${escapeHtml(options.email)}</strong> ${t('passwordReset.codeSentMessageSuffix')}`
              : t('passwordReset.codeSentProfileMessage')
            }
          </p>
          ${isLogin ? `
            <div class="pw-reset-digits">
              <input type="text" maxlength="1" class="pw-reset-digit" data-digit="0" value="${escapeHtml(codeDigits[0])}" inputmode="numeric" autocomplete="off">
              <input type="text" maxlength="1" class="pw-reset-digit" data-digit="1" value="${escapeHtml(codeDigits[1])}" inputmode="numeric" autocomplete="off">
              <input type="text" maxlength="1" class="pw-reset-digit" data-digit="2" value="${escapeHtml(codeDigits[2])}" inputmode="numeric" autocomplete="off">
              <input type="text" maxlength="1" class="pw-reset-digit" data-digit="3" value="${escapeHtml(codeDigits[3])}" inputmode="numeric" autocomplete="off">
            </div>
          ` : `
            <div class="pw-reset-code-single">
              <input type="text" maxlength="4" class="pw-reset-code-input" id="pw-reset-code" value="${escapeHtml(codeValue)}" placeholder="XXXX" inputmode="numeric" autocomplete="off">
            </div>
          `}
          ${isLogin ? `
            <div class="pw-reset-actions-center">
              <button type="button" class="pw-reset-btn-primary ${codeComplete ? '' : 'is-disabled'}" id="pw-reset-continue" ${codeComplete ? '' : 'disabled'}>${t('passwordReset.continue')}</button>
              <p class="pw-reset-resend">
                ${t('passwordReset.codeNotReceived')} <button type="button" class="pw-reset-resend-link" id="pw-reset-resend">${t('passwordReset.resendCode')}</button>
              </p>
            </div>
          ` : `
            <p class="pw-reset-resend-center">
              ${t('passwordReset.codeNotReceived')} <button type="button" class="pw-reset-resend-link" id="pw-reset-resend">${t('passwordReset.resendCode')}</button>
            </p>
            <div class="pw-reset-actions-between">
              <button type="button" class="pw-reset-cancel-link" id="pw-reset-cancel">${t('passwordReset.cancel')}</button>
              <button type="button" class="pw-reset-btn-primary ${codeComplete ? '' : 'is-disabled'}" id="pw-reset-continue" ${codeComplete ? '' : 'disabled'}>${t('passwordReset.continue')}</button>
            </div>
          `}
        </div>
      </div>
    `
    bindCodeEvents()
  }

  function renderNewPasswordStep() {
    const canSubmit = isPasswordValid(newPassword) && newPassword === confirmPassword && !isSubmitting

    container.innerHTML = `
      <div class="pw-reset-overlay" id="pw-reset-overlay">
        <div class="pw-reset-modal pw-reset-modal--wide">
          <div class="pw-reset-modal-header">
            <h3>${t('passwordReset.titleAlt')}</h3>
            <button type="button" class="pw-reset-close" id="pw-reset-close">${closeSvg}</button>
          </div>
          <div class="pw-reset-form">
            <div class="pw-reset-field">
              <label>${t('passwordReset.newPassword')} <span class="pw-reset-required">*</span></label>
              <div class="pw-reset-input-wrap">
                <input type="${showNewPassword ? 'text' : 'password'}" id="pw-reset-new-pwd" value="${escapeHtml(newPassword)}" placeholder="********">
                <button type="button" class="pw-reset-eye" id="pw-reset-toggle-new">${showNewPassword ? eyeOffSvg : eyeSvg}</button>
              </div>
              <div class="pw-reset-hints">
                <span>${t('passwordReset.passwordHint1')}</span>
                <span>${t('passwordReset.passwordHint2')}</span>
              </div>
            </div>
            <div class="pw-reset-field">
              <label>${t('passwordReset.confirmNewPassword')} <span class="pw-reset-required">*</span></label>
              <div class="pw-reset-input-wrap">
                <input type="${showConfirmPassword ? 'text' : 'password'}" id="pw-reset-confirm-pwd" value="${escapeHtml(confirmPassword)}" placeholder="******">
                <button type="button" class="pw-reset-eye" id="pw-reset-toggle-confirm">${showConfirmPassword ? eyeOffSvg : eyeSvg}</button>
              </div>
            </div>
          </div>
          <div class="pw-reset-actions-between">
            <button type="button" class="pw-reset-cancel-link" id="pw-reset-cancel">${t('passwordReset.cancel')}</button>
            <button type="button" class="pw-reset-btn-primary ${canSubmit ? '' : 'is-disabled'}" id="pw-reset-submit" ${canSubmit ? '' : 'disabled'}>${t('passwordReset.resetButton')}</button>
          </div>
        </div>
      </div>
    `
    bindNewPasswordEvents()
  }

  function renderSuccessStep() {
    container.innerHTML = `
      <div class="pw-reset-overlay" id="pw-reset-overlay">
        <div class="pw-reset-modal">
          <div class="pw-reset-modal-header">
            <h3>${t('passwordReset.successTitle')}</h3>
            <button type="button" class="pw-reset-close" id="pw-reset-close">${closeSvg}</button>
          </div>
          <p class="pw-reset-description">${t('passwordReset.successMessage')}</p>
          <div class="pw-reset-actions-end">
            <button type="button" class="pw-reset-btn-primary" id="pw-reset-go-login">${t('passwordReset.goToLogin')}</button>
          </div>
        </div>
      </div>
    `
    bindSuccessEvents()
  }

  // Events for code step
  function bindCodeEvents() {
    // Close
    container.querySelector('#pw-reset-close')?.addEventListener('click', close)
    container.querySelector('#pw-reset-overlay')?.addEventListener('click', (e) => { if (e.target === e.currentTarget) close() })
    container.querySelector('#pw-reset-cancel')?.addEventListener('click', close)

    // Digit inputs (login context)
    if (options.context === 'login') {
      const digitInputs = container.querySelectorAll<HTMLInputElement>('.pw-reset-digit')
      digitInputs.forEach((input) => {
        input.addEventListener('input', () => {
          const idx = Number(input.dataset.digit)
          codeDigits[idx] = input.value.replace(/\D/g, '').slice(0, 1)
          input.value = codeDigits[idx]
          // Auto-focus next
          if (codeDigits[idx] && idx < 3) {
            (container.querySelector(`[data-digit="${idx + 1}"]`) as HTMLInputElement)?.focus()
          }
          updateContinueButton()
        })
        input.addEventListener('keydown', (e: KeyboardEvent) => {
          const idx = Number(input.dataset.digit)
          if (e.key === 'Backspace' && !input.value && idx > 0) {
            (container.querySelector(`[data-digit="${idx - 1}"]`) as HTMLInputElement)?.focus()
          }
        })
      })
      // Auto-focus first digit
      ;(container.querySelector('[data-digit="0"]') as HTMLInputElement)?.focus()
    } else {
      // Single code input (profile context)
      const codeInput = container.querySelector('#pw-reset-code') as HTMLInputElement
      codeInput?.addEventListener('input', () => {
        codeValue = codeInput.value.replace(/\D/g, '').slice(0, 4)
        codeInput.value = codeValue
        updateContinueButton()
      })
      codeInput?.focus()
    }

    // Continue
    container.querySelector('#pw-reset-continue')?.addEventListener('click', async () => {
      if (isSubmitting) return
      isSubmitting = true
      const code = options.context === 'login' ? codeDigits.join('') : codeValue
      toast(t('passwordReset.feedback.verifyingCode'), 'loading')
      try {
        await authApi.verifyPasswordResetCode(options.email, code)
        toast(t('passwordReset.feedback.codeSent'), 'success')
        step = 'newPassword'
        isSubmitting = false
        render()
      } catch {
        toast(t('passwordReset.feedback.invalidCode'), 'error')
        isSubmitting = false
      }
    })

    // Resend
    container.querySelector('#pw-reset-resend')?.addEventListener('click', async () => {
      toast(t('passwordReset.feedback.sendingCode'), 'loading')
      try {
        if (options.context === 'login') {
          await authApi.requestPasswordReset(options.email)
        } else {
          await authApi.requestMyPasswordResetCode()
        }
        toast(t('passwordReset.feedback.resendSuccess'), 'success')
      } catch {
        toast(t('passwordReset.feedback.resendError'), 'error')
      }
    })
  }

  function updateContinueButton() {
    const btn = container.querySelector('#pw-reset-continue') as HTMLButtonElement
    if (!btn) return
    const isLogin = options.context === 'login'
    const complete = isLogin ? codeDigits.every(d => d !== '') : codeValue.trim().length === 4
    btn.disabled = !complete
    btn.classList.toggle('is-disabled', !complete)
  }

  // Events for new password step
  function bindNewPasswordEvents() {
    container.querySelector('#pw-reset-close')?.addEventListener('click', close)
    container.querySelector('#pw-reset-overlay')?.addEventListener('click', (e) => { if (e.target === e.currentTarget) close() })
    container.querySelector('#pw-reset-cancel')?.addEventListener('click', close)

    const newPwdInput = container.querySelector('#pw-reset-new-pwd') as HTMLInputElement
    const confirmPwdInput = container.querySelector('#pw-reset-confirm-pwd') as HTMLInputElement

    newPwdInput?.addEventListener('input', () => { newPassword = newPwdInput.value; updateSubmitButton() })
    confirmPwdInput?.addEventListener('input', () => { confirmPassword = confirmPwdInput.value; updateSubmitButton() })

    container.querySelector('#pw-reset-toggle-new')?.addEventListener('click', () => { showNewPassword = !showNewPassword; render() })
    container.querySelector('#pw-reset-toggle-confirm')?.addEventListener('click', () => { showConfirmPassword = !showConfirmPassword; render() })

    // Submit
    container.querySelector('#pw-reset-submit')?.addEventListener('click', async () => {
      if (isSubmitting) return
      if (!isPasswordValid(newPassword)) { toast(t('passwordReset.feedback.passwordPolicy'), 'error'); return }
      if (newPassword !== confirmPassword) { toast(t('passwordReset.feedback.passwordMismatch'), 'error'); return }

      isSubmitting = true
      toast(t('passwordReset.feedback.resetting'), 'loading')
      const code = options.context === 'login' ? codeDigits.join('') : codeValue
      try {
        await authApi.resetPassword({ email: options.email, code, newPassword, confirmPassword })
        toast(t('passwordReset.feedback.resetSuccess'), 'success')
        if (options.context === 'login') {
          step = 'success'
          isSubmitting = false
          render()
        } else {
          isSubmitting = false
          options.onSuccess?.()
          close()
        }
      } catch {
        toast(t('passwordReset.feedback.resetError'), 'error')
        isSubmitting = false
      }
    })

    newPwdInput?.focus()
  }

  function updateSubmitButton() {
    const btn = container.querySelector('#pw-reset-submit') as HTMLButtonElement
    if (!btn) return
    const canSubmit = isPasswordValid(newPassword) && newPassword === confirmPassword
    btn.disabled = !canSubmit
    btn.classList.toggle('is-disabled', !canSubmit)
  }

  function bindSuccessEvents() {
    container.querySelector('#pw-reset-close')?.addEventListener('click', close)
    container.querySelector('#pw-reset-overlay')?.addEventListener('click', (e) => { if (e.target === e.currentTarget) close() })
    container.querySelector('#pw-reset-go-login')?.addEventListener('click', () => {
      close()
      options.onSuccess?.()
    })
  }

  function close() {
    container.innerHTML = ''
    options.onClose()
  }

  render()
}
