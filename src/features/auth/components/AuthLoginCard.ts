import { authApi } from '@/features/auth/api/auth.api'
import { ApiError } from '@/shared/api/http'
import { subscribeLanguage, t } from '@/shared/i18n'
import { toast } from '@/shared/ui/toast'
import { PasswordResetFlow } from './PasswordResetFlow'
import '../styles/password-reset.css'

type UserRole = 'USER' | 'ADMIN'

interface AuthLoginCardOptions {
  onBack: () => void
  onOpenRegister: () => void
  onLoginSuccess: (role: UserRole) => void
  showPendingApprovalModal?: boolean
  showEmailVerificationModal?: boolean
  verificationUserId?: string | null
  verificationEmail?: string | null
  autoLoginEmail?: string | null
  autoLoginPassword?: string | null
  onPendingApprovalModalClose?: () => void
  onEmailVerificationModalClose?: () => void
  onEmailVerified?: () => void
}

export function AuthLoginCard(container: HTMLElement, options: AuthLoginCardOptions) {
  let isSubmitting = false
  let isWaitingApprovalModalOpen = Boolean(options.showPendingApprovalModal)
  let isEmailVerificationModalOpen = Boolean(options.showEmailVerificationModal)
  let isVerifyingCode = false
  let isResendingCode = false
  let verificationCode = ''
  let verificationUserId = options.verificationUserId?.trim() ?? ''
  let verificationEmail = options.verificationEmail?.trim() ?? ''
  let autoLoginEmail = options.autoLoginEmail?.trim() ?? ''
  let autoLoginPassword = options.autoLoginPassword ?? ''

  const resolvePendingEmailData = (error: ApiError) => {
    const payload =
      error.payload && typeof error.payload === 'object'
        ? (error.payload as Record<string, unknown>)
        : {}

    const userIdFromPayload =
      typeof payload.userId === 'string' ? payload.userId.trim() : ''
    const emailFromPayload =
      typeof payload.email === 'string' ? payload.email.trim() : ''

    return {
      userId: userIdFromPayload || verificationUserId,
      email: emailFromPayload || verificationEmail,
    }
  }

  const escapeHtml = (raw: string) =>
    raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')

  const escapeAttr = (raw: string) => escapeHtml(raw)

  const verificationErrorMessage = (error: unknown) => {
    if (!(error instanceof ApiError)) {
      return t('auth.profile.errors.generic')
    }

    if (error.code === 'VERIFICATION_NOT_ALLOWED_FOR_STATUS') {
      return t('auth.profile.verification.errors.notAllowed')
    }

    if (error.code === 'CODE_EXPIRED') {
      return t('auth.profile.verification.errors.expired')
    }

    if (error.code === 'VERIFICATION_LOCKED') {
      return t('auth.profile.verification.errors.locked')
    }

    if (error.code === 'RATE_LIMITED') {
      return t('auth.profile.verification.errors.rateLimited')
    }

    if (error.code === 'VALIDATION_ERROR') {
      return t('auth.profile.verification.errors.invalidCode')
    }

    return t('auth.profile.verification.errors.generic')
  }

  const syncVerificationInput = (raw: string) => {
    verificationCode = raw.replace(/\D/g, '').slice(0, 6)
  }

  const renderVerificationDigits = () => {
    const digits = verificationCode.padEnd(6, ' ').split('')
    const activeIndex = Math.min(verificationCode.length, 5)

    return digits
      .map((digit, index) => {
        const display = digit.trim() ? digit : '&nbsp;'
        const isActive = verificationCode.length < 6 && index === activeIndex
        return `
          <div class="auth-verification-digit ${isActive ? 'is-active' : ''}">
            ${digit.trim()
              ? `<b>${display}</b>`
              : isActive
                ? '<span class="auth-verification-caret" aria-hidden="true"></span>'
                : `<b>${display}</b>`}
          </div>
        `
      })
      .join('')
  }

  const openEmailVerificationFlow = async (userId: string, email: string) => {
    verificationUserId = userId
    verificationEmail = email
    autoLoginEmail = email
    verificationCode = ''
    isWaitingApprovalModalOpen = false

    try {
      await authApi.sendEmailVerificationCode(userId)
      toast(t('auth.profile.verification.feedback.codeSent'), 'success')
    } catch (error) {
      toast(verificationErrorMessage(error), 'error')
    }

    isEmailVerificationModalOpen = true
    render()
  }

  const render = () => {
    container.innerHTML = `
      <section class="login-start" aria-labelledby="login-title">
        <button id="login-back" class="register-back" type="button" aria-label="${t('auth.login.back')}">
          <span class="register-back-icon" aria-hidden="true">&#x2039;</span>
          <span>${t('auth.login.back')}</span>
        </button>

        <form id="login-form" class="register-form" novalidate>
          <h2 id="login-title" class="register-title">${t('auth.login.title')}</h2>

          <div class="register-fields">
            <label class="register-field" data-field="email">
              <span class="register-label">${t('auth.login.email')} <strong>*</strong></span>
              <input id="login-email" name="email" type="email" placeholder="${t('auth.login.emailPlaceholder')}" autocomplete="email" required>
              <small id="login-email-hint" class="register-field-hint" aria-live="polite"></small>
            </label>

            <label class="register-field" data-field="password">
              <span class="register-label">${t('auth.login.password')} <strong>*</strong></span>
              <div class="register-password-wrap">
                <input id="login-password" name="password" type="password" placeholder="${t('auth.login.passwordPlaceholder')}" autocomplete="current-password" required>
                <button class="register-eye" type="button" data-toggle-password="login-password" aria-label="${t('auth.login.showPassword')}">
                  <img class="register-eye-icon" src="/icons/visibility.png" alt="" aria-hidden="true">
                </button>
              </div>
              <small id="login-password-hint" class="register-field-hint" aria-live="polite"></small>
            </label>
          </div>

          <div class="login-forgot-password">${t('auth.login.forgotPassword')}</div>

          <div class="register-actions">
            <button id="login-submit" class="btn-primary register-submit" type="submit" disabled>${t('auth.login.submit')}</button>
            <p class="login-link register-login-link">
              ${t('auth.login.noAccount')} <a id="login-register-link" href="#">${t('auth.login.registerNow')}</a>
            </p>
          </div>
        </form>

        ${isWaitingApprovalModalOpen ? `
          <div class="auth-modal-overlay">
            <div class="auth-modal-card auth-modal-card-waiting">
              <div class="auth-modal-header">
                <h3>${t('auth.login.waiting.title')}</h3>
                <span class="auth-modal-icon" aria-hidden="true">🕒</span>
              </div>
              <div class="auth-modal-content-block">
                <p>${t('auth.login.waiting.description')}</p>
              </div>
              <div class="auth-modal-actions auth-modal-actions-end">
                <button id="login-waiting-close" class="auth-modal-close-btn" type="button">${t('auth.login.waiting.close')}</button>
              </div>
            </div>
          </div>
        ` : ''}

        ${isEmailVerificationModalOpen ? `
          <div class="auth-modal-overlay">
            <div class="auth-verification-modal">
              <div class="auth-verification-header">
                <div class="auth-verification-title">${t('auth.profile.verification.title')}</div>
                <button
                  id="login-verification-close"
                  class="auth-verification-close"
                  type="button"
                  aria-label="${t('auth.profile.verification.close')}"
                >✕</button>
              </div>

              <div class="auth-verification-description">
                <span>${t('auth.profile.verification.descriptionPrefix')}</span>
                <b>${escapeHtml(verificationEmail || 'seu e-mail')}</b>
                <span>${t('auth.profile.verification.descriptionSuffix')}</span>
              </div>

              <input
                id="login-verification-code"
                type="text"
                inputmode="numeric"
                autocomplete="one-time-code"
                maxlength="6"
                value="${escapeAttr(verificationCode)}"
                class="auth-verification-code-input"
              />

              <div class="auth-verification-digits" id="login-verification-digits">
                ${renderVerificationDigits()}
              </div>

              <div class="auth-verification-actions">
                <button
                  id="login-verification-confirm"
                  class="auth-verification-submit"
                  type="button"
                  ${isVerifyingCode || isResendingCode || verificationCode.length !== 6 ? 'disabled' : ''}
                >
                  ${isVerifyingCode
                    ? t('auth.profile.verification.confirming')
                    : t('auth.profile.verification.continue')}
                </button>
                <button
                  id="login-verification-resend"
                  class="auth-verification-resend"
                  type="button"
                  ${isResendingCode ? 'disabled' : ''}
                >
                  ${isResendingCode
                    ? t('auth.profile.verification.resending')
                    : t('auth.profile.verification.resend')}
                </button>
              </div>
            </div>
          </div>
        ` : ''}
      </section>
    `

    bindEvents()
  }

  const bindEvents = () => {
    const backButton = container.querySelector('#login-back')
    const formElement = container.querySelector('#login-form') as HTMLFormElement | null
    const submitButton = container.querySelector('#login-submit') as HTMLButtonElement | null
    const registerLink = container.querySelector('#login-register-link')
    const emailInput = container.querySelector('#login-email') as HTMLInputElement | null
    const passwordInput = container.querySelector('#login-password') as HTMLInputElement | null
    const emailField = container.querySelector('[data-field="email"]') as HTMLElement | null
    const passwordField = container.querySelector('[data-field="password"]') as HTMLElement | null
    const emailHint = container.querySelector('#login-email-hint') as HTMLElement | null
    const passwordHint = container.querySelector('#login-password-hint') as HTMLElement | null
    const waitingCloseButton = container.querySelector('#login-waiting-close')
    const verificationCloseButton = container.querySelector('#login-verification-close')
    const verificationInput = container.querySelector(
      '#login-verification-code'
    ) as HTMLInputElement | null
    const verificationDigits = container.querySelector(
      '#login-verification-digits'
    ) as HTMLDivElement | null
    const verificationConfirmButton = container.querySelector(
      '#login-verification-confirm'
    ) as HTMLButtonElement | null
    const verificationResendButton = container.querySelector(
      '#login-verification-resend'
    ) as HTMLButtonElement | null

    let emailTouched = false
    let passwordTouched = false
    let formErrorCode: string | null = null

    const isValidEmail = (value: string) => /.+@.+\..+/.test(value)

    const setFieldInvalid = (fieldElement: HTMLElement | null, inputElement: HTMLInputElement | null, isInvalid: boolean) => {
      fieldElement?.classList.toggle('is-invalid', isInvalid)
      inputElement?.setAttribute('aria-invalid', isInvalid ? 'true' : 'false')
    }

    const setHint = (hintElement: HTMLElement | null, message: string) => {
      if (!hintElement) return
      hintElement.textContent = message
      hintElement.classList.toggle('is-visible', Boolean(message))
    }

    const updatePasswordToggleIcon = (toggleButton: HTMLButtonElement, inputElement: HTMLInputElement) => {
      const iconElement = toggleButton.querySelector('img') as HTMLImageElement | null
      if (!iconElement) return
      iconElement.src = inputElement.type === 'password' ? '/icons/visibility.png' : '/icons/visibility_off.png'
    }

    const resolveGenericLoginError = () => {
      switch (formErrorCode) {
        case 'INVALID_CREDENTIALS':
          return t('auth.login.errors.invalidCredentials')
        case 'REJECTED':
          return t('auth.login.errors.accountRejected')
        default:
          return ''
      }
    }

    const updateSubmitState = () => {
      const emailValue = emailInput?.value.trim() ?? ''
      const passwordValue = passwordInput?.value ?? ''
      const emailValid = emailValue.length > 0 && isValidEmail(emailValue)
      const passwordValid = passwordValue.length > 0
      const genericError = resolveGenericLoginError()

      setFieldInvalid(emailField, emailInput, (emailTouched && !emailValid) || formErrorCode === 'INVALID_CREDENTIALS')
      setFieldInvalid(passwordField, passwordInput, (passwordTouched && !passwordValid) || formErrorCode === 'INVALID_CREDENTIALS')

      if (formErrorCode === 'INVALID_CREDENTIALS') {
        setHint(emailHint, t('auth.login.errors.invalidCredentials'))
        setHint(passwordHint, '')
      } else {
        setHint(emailHint, emailTouched && !emailValid ? (emailValue ? t('auth.login.errors.invalidEmail') : t('auth.login.errors.requiredField')) : '')
        setHint(passwordHint, passwordTouched && !passwordValid ? t('auth.login.errors.requiredField') : genericError)
      }

      if (!submitButton) return
      submitButton.disabled = !emailValid || !passwordValid || isSubmitting
    }

    backButton?.addEventListener('click', () => options.onBack())

    registerLink?.addEventListener('click', (event) => {
      event.preventDefault()
      options.onOpenRegister()
    })

    // Forgot password
    const forgotPasswordDiv = container.querySelector('.login-forgot-password')
    forgotPasswordDiv?.addEventListener('click', async () => {
      const email = emailInput?.value.trim() ?? ''
      if (!email) {
        toast(t('auth.login.errors.requiredField'), 'error')
        return
      }
      toast(t('passwordReset.feedback.sendingCode'), 'loading')
      try {
        await authApi.requestPasswordReset(email)
        toast(t('passwordReset.feedback.codeSent'), 'success')
        const pwResetContainer = document.createElement('div')
        document.body.appendChild(pwResetContainer)
        PasswordResetFlow(pwResetContainer, {
          context: 'login',
          email,
          onClose: () => { pwResetContainer.remove() },
          onSuccess: () => { window.location.reload() },
        })
      } catch {
        toast(t('passwordReset.feedback.resendError'), 'error')
      }
    })

    waitingCloseButton?.addEventListener('click', () => {
      isWaitingApprovalModalOpen = false
      options.onPendingApprovalModalClose?.()
      render()
    })

    verificationCloseButton?.addEventListener('click', () => {
      isEmailVerificationModalOpen = false
      options.onEmailVerificationModalClose?.()
      render()
    })

    if (verificationInput) {
      window.setTimeout(() => verificationInput.focus(), 0)
    }

    verificationInput?.addEventListener('input', () => {
      syncVerificationInput(verificationInput.value)
      verificationInput.value = verificationCode

      if (verificationConfirmButton) {
        verificationConfirmButton.disabled =
          isVerifyingCode || isResendingCode || verificationCode.length !== 6
      }

      if (verificationDigits) {
        verificationDigits.innerHTML = renderVerificationDigits()
      }
    })

    verificationDigits?.addEventListener('click', () => {
      verificationInput?.focus()
    })

    verificationConfirmButton?.addEventListener('click', async () => {
      if (isVerifyingCode || verificationCode.length !== 6) return
      if (!verificationUserId) {
        toast(t('auth.profile.errors.generic'), 'error')
        return
      }

      isVerifyingCode = true
      verificationConfirmButton.disabled = true

      try {
        const response = await authApi.confirmEmailVerificationCode(
          verificationUserId,
          verificationCode
        )

        if (response.status === 'APPROVED') {
          if (autoLoginEmail && autoLoginPassword) {
            const loginResponse = await authApi.login({
              email: autoLoginEmail,
              password: autoLoginPassword,
            })

            if (loginResponse.user.status === 'APPROVED') {
              toast(t('auth.profile.verification.feedback.approved'), 'success')
              options.onEmailVerified?.()
              options.onLoginSuccess(loginResponse.user.role)
              return
            }
          }

          isEmailVerificationModalOpen = false
          isWaitingApprovalModalOpen = false
          verificationCode = ''
          toast(t('auth.profile.verification.feedback.approved'), 'success')
          options.onEmailVerified?.()
          render()
        }
      } catch (error) {
        toast(verificationErrorMessage(error), 'error')
      } finally {
        isVerifyingCode = false
        render()
      }
    })

    verificationResendButton?.addEventListener('click', async () => {
      if (isResendingCode) return
      if (!verificationUserId) {
        toast(t('auth.profile.errors.generic'), 'error')
        return
      }

      isResendingCode = true
      verificationResendButton.disabled = true

      try {
        await authApi.sendEmailVerificationCode(verificationUserId)
        verificationCode = ''
        toast(t('auth.profile.verification.feedback.resent'), 'success')
      } catch (error) {
        toast(verificationErrorMessage(error), 'error')
      } finally {
        isResendingCode = false
        render()
      }
    })

    emailInput?.addEventListener('input', () => {
      formErrorCode = null
      if (!emailTouched && emailInput.value.length > 0) emailTouched = true
      updateSubmitState()
    })

    passwordInput?.addEventListener('input', () => {
      formErrorCode = null
      if (!passwordTouched && passwordInput.value.length > 0) passwordTouched = true
      updateSubmitState()
    })

    emailInput?.addEventListener('blur', () => {
      emailTouched = true
      updateSubmitState()
    })

    passwordInput?.addEventListener('blur', () => {
      passwordTouched = true
      updateSubmitState()
    })

    container.querySelectorAll<HTMLButtonElement>('[data-toggle-password]').forEach((toggleButton) => {
      toggleButton.addEventListener('click', () => {
        const targetInputId = toggleButton.dataset.togglePassword
        if (!targetInputId) return

        const passwordFieldElement = container.querySelector(`#${targetInputId}`) as HTMLInputElement | null
        if (!passwordFieldElement) return

        const shouldShowPassword = passwordFieldElement.type === 'password'
        passwordFieldElement.type = shouldShowPassword ? 'text' : 'password'
        toggleButton.setAttribute('aria-label', shouldShowPassword ? t('auth.login.hidePassword') : t('auth.login.showPassword'))
        updatePasswordToggleIcon(toggleButton, passwordFieldElement)
      })

      const targetInputId = toggleButton.dataset.togglePassword
      if (!targetInputId) return
      const passwordFieldElement = container.querySelector(`#${targetInputId}`) as HTMLInputElement | null
      if (!passwordFieldElement) return
      updatePasswordToggleIcon(toggleButton, passwordFieldElement)
    })

    formElement?.addEventListener('submit', async (event) => {
      event.preventDefault()
      if (!emailInput || !passwordInput || !submitButton) return

      emailTouched = true
      passwordTouched = true
      updateSubmitState()
      if (submitButton.disabled) return

      isSubmitting = true
      updateSubmitState()
      toast(t('auth.login.feedback.submitting'), 'loading')
      autoLoginEmail = emailInput.value.trim()
      autoLoginPassword = passwordInput.value

      try {
        const response = await authApi.login({
          email: autoLoginEmail,
          password: autoLoginPassword,
        })

        if (response.user.status === 'APPROVED') {
          toast(t('auth.login.feedback.success'), 'success')
          options.onLoginSuccess(response.user.role)
          return
        }

        if (response.user.status === 'PENDING_EMAIL_VERIFICATION') {
          await openEmailVerificationFlow(response.user.id, response.user.email)
          return
        }

        if (response.user.status === 'PENDING_REVIEW' || response.user.status === 'DRAFT_PROFILE') {
          isEmailVerificationModalOpen = false
          isWaitingApprovalModalOpen = true
          options.onPendingApprovalModalClose?.()
          render()
          return
        }

        formErrorCode = 'REJECTED'
        toast(t('auth.login.errors.accountRejected'), 'error')
      } catch (error) {
        if (error instanceof ApiError) {
          if (error.code === 'INVALID_CREDENTIALS' || error.code === 'UNAUTHORIZED') {
            formErrorCode = 'INVALID_CREDENTIALS'
          } else if (error.code === 'REGISTRATION_PENDING_EMAIL_VERIFICATION') {
            const pendingData = resolvePendingEmailData(error)
            if (!pendingData.userId) {
              toast(t('auth.profile.errors.generic'), 'error')
            } else {
              await openEmailVerificationFlow(pendingData.userId, pendingData.email)
            }
            return
          } else if (error.code === 'ACCOUNT_NOT_APPROVED' || error.code === 'ACCOUNT_PENDING_APPROVAL' || error.code === 'REGISTRATION_PENDING_REVIEW') {
            isWaitingApprovalModalOpen = true
            options.onPendingApprovalModalClose?.()
            render()
            return
          } else if (error.code === 'REGISTRATION_REJECTED') {
            formErrorCode = 'REJECTED'
            toast(t('auth.login.errors.accountRejected'), 'error')
          } else {
            toast(t('auth.login.errors.generic'), 'error')
          }
        } else {
          toast(t('auth.login.errors.generic'), 'error')
        }
      } finally {
        isSubmitting = false
        updateSubmitState()
      }
    })

    updateSubmitState()
  }

  render()
  subscribeLanguage(() => render())
}
