import { subscribeLanguage, t } from '@/shared/i18n'
import { authApi } from '@/features/auth/api/auth.api'
import { ApiError } from '@/shared/api/http'
import { toast } from '@/shared/ui/toast'

type AuthCardView = 'landing' | 'register'

interface AuthCardOptions {
  onRegistrationCompleted?: (
    userId: string,
    email: string,
    password: string
  ) => void
  onOpenLogin?: () => void
}

export function AuthCard(container: HTMLElement, options?: AuthCardOptions) {
  let currentView: AuthCardView = 'landing'

  const render = () => {
    container.innerHTML = `
      <div class="auth-card">
        ${currentView === 'landing' ? renderLandingView() : renderRegisterView()}
      </div>
    `

    if (currentView === 'landing') {
      bindLandingEvents()
      return
    }

    bindRegisterEvents()
  }

  const renderLandingView = () => `
    <div class="auth-card-content">
      <div class="auth-icon" aria-hidden="true">
        <img src="/images/logo_black240.png" alt="" class="auth-icon-image">
      </div>
      <div class="auth-card-text">
        <h2>${t('auth.landing.title')}</h2>
        <p>
          ${t('auth.landing.description')}
        </p>
      </div>
      <div class="auth-card-actions">
        <button id="register-btn" class="btn-primary">${t('auth.landing.register')}</button>
        <p class="login-link">
          ${t('auth.landing.alreadyHaveAccount')} <a id="login-btn" href="#">${t('auth.landing.login')}</a>
        </p>
      </div>
    </div>
  `

  const renderRegisterView = () => `
    <section class="register-start" aria-labelledby="register-title">
      <button id="register-back" class="register-back" type="button" aria-label="${t('auth.register.back')}">
        <span class="register-back-icon" aria-hidden="true">&#x2039;</span>
        <span>${t('auth.register.back')}</span>
      </button>

      <form id="register-form" class="register-form" novalidate>
        <h2 id="register-title" class="register-title">${t('auth.register.title')}</h2>

        <div class="register-fields">
          <div class="register-grid-two">
            <label class="register-field" data-field="firstName">
              <span class="register-label">${t('auth.register.firstName')} <strong>*</strong></span>
              <input id="register-first-name" name="firstName" type="text" placeholder="${t('auth.register.firstNamePlaceholder')}" autocomplete="given-name" required>
            </label>
            <label class="register-field" data-field="lastName">
              <span class="register-label">${t('auth.register.lastName')} <strong>*</strong></span>
              <input id="register-last-name" name="lastName" type="text" placeholder="${t('auth.register.lastNamePlaceholder')}" autocomplete="family-name" required>
            </label>
          </div>

          <label class="register-field" data-field="email">
            <span class="register-label">${t('auth.register.email')} <strong>*</strong></span>
            <input id="register-email" name="email" type="email" placeholder="${t('auth.register.emailPlaceholder')}" autocomplete="email" required>
            <small id="register-email-hint" class="register-field-hint" aria-live="polite"></small>
          </label>

          <label class="register-field" data-field="password">
            <span class="register-label">${t('auth.register.password')} <strong>*</strong></span>
            <div class="register-password-wrap">
              <input id="register-password" name="password" type="password" placeholder="${t('auth.register.passwordPlaceholder')}" autocomplete="new-password" minlength="8" required>
              <button class="register-eye" type="button" data-toggle-password="register-password" aria-label="${t('auth.register.showPassword')}">
                <img class="register-eye-icon" src="/icons/visibility.png" alt="" aria-hidden="true">
              </button>
            </div>
            <small id="register-password-hint" class="register-password-hint">${t('auth.register.passwordHintLine1')}<br>${t('auth.register.passwordHintLine2')}</small>
          </label>

          <label class="register-field" data-field="confirmPassword">
            <span class="register-label">${t('auth.register.confirmPassword')} <strong>*</strong></span>
            <div class="register-password-wrap">
              <input id="register-confirm-password" name="confirmPassword" type="password" placeholder="${t('auth.register.confirmPasswordPlaceholder')}" autocomplete="new-password" minlength="8" required>
              <button class="register-eye" type="button" data-toggle-password="register-confirm-password" aria-label="${t('auth.register.showConfirmPassword')}">
                <img class="register-eye-icon" src="/icons/visibility.png" alt="" aria-hidden="true">
              </button>
            </div>
            <small id="register-confirm-password-hint" class="register-field-hint" aria-live="polite"></small>
          </label>
        </div>

        <div class="register-actions">
          <button id="register-submit" class="btn-primary register-submit" type="submit" disabled>${t('auth.register.submit')}</button>
          <p class="login-link register-login-link">
            ${t('auth.register.alreadyHaveAccount')} <a id="register-login-link" href="#">${t('auth.register.loginNow')}</a>
          </p>
        </div>
      </form>
    </section>
  `

  const bindLandingEvents = () => {
    const registerButton = container.querySelector('#register-btn')
    const loginButton = container.querySelector('#login-btn')

    registerButton?.addEventListener('click', () => {
      currentView = 'register'
      render()
      container.scrollTo({ top: 0, behavior: 'auto' })
    })

    loginButton?.addEventListener('click', (event) => {
      event.preventDefault()
      options?.onOpenLogin?.()
    })
  }

  const bindRegisterEvents = () => {
    const backButton = container.querySelector('#register-back')
    const formElement = container.querySelector('#register-form') as HTMLFormElement | null
    const loginLink = container.querySelector('#register-login-link')
    const submitButton = container.querySelector('#register-submit') as HTMLButtonElement | null
    const firstNameInput = container.querySelector('#register-first-name') as HTMLInputElement | null
    const lastNameInput = container.querySelector('#register-last-name') as HTMLInputElement | null
    const emailInput = container.querySelector('#register-email') as HTMLInputElement | null
    const passwordInput = container.querySelector('#register-password') as HTMLInputElement | null
    const confirmPasswordInput = container.querySelector('#register-confirm-password') as HTMLInputElement | null
    const firstNameField = container.querySelector('[data-field="firstName"]') as HTMLElement | null
    const lastNameField = container.querySelector('[data-field="lastName"]') as HTMLElement | null
    const emailField = container.querySelector('[data-field="email"]') as HTMLElement | null
    const passwordField = container.querySelector('[data-field="password"]') as HTMLElement | null
    const confirmPasswordField = container.querySelector('[data-field="confirmPassword"]') as HTMLElement | null
    const emailHint = container.querySelector('#register-email-hint') as HTMLElement | null
    const passwordHint = container.querySelector('#register-password-hint') as HTMLElement | null
    const confirmPasswordHint = container.querySelector('#register-confirm-password-hint') as HTMLElement | null

    const touched: Record<'firstName' | 'lastName' | 'email' | 'password' | 'confirmPassword', boolean> = {
      firstName: false,
      lastName: false,
      email: false,
      password: false,
      confirmPassword: false,
    }

    const serverErrors: Partial<Record<'firstName' | 'lastName' | 'email' | 'password' | 'confirmPassword', string>> = {}

    type RegisterFieldKey = keyof typeof touched

    const hasLetter = (value: string) => /[a-zA-Z]/.test(value)
    const isValidEmail = (value: string) => /.+@.+\..+/.test(value)

    const setFieldInvalid = (fieldElement: HTMLElement | null, inputElement: HTMLInputElement | null, isInvalid: boolean) => {
      fieldElement?.classList.toggle('is-invalid', isInvalid)
      if (!inputElement) return
      inputElement.setAttribute('aria-invalid', isInvalid ? 'true' : 'false')
    }

    const setHint = (hintElement: HTMLElement | null, message: string) => {
      if (!hintElement) return
      hintElement.textContent = message
      hintElement.classList.toggle('is-visible', Boolean(message))
    }

    const clearServerError = (field: RegisterFieldKey) => {
      if (!serverErrors[field]) return
      delete serverErrors[field]
    }

    const errorLabelFromCode = (code: string): string => {
      switch (code) {
        case 'EMAIL_INVALID':
          return t('auth.register.errors.invalidEmail')
        case 'EMAIL_ALREADY_EXISTS':
          return t('auth.register.errors.emailAlreadyExists')
        case 'PASSWORD_POLICY':
          return t('auth.register.errors.passwordPolicy')
        case 'PASSWORD_MISMATCH':
          return t('auth.register.errors.passwordMismatch')
        default:
          return t('auth.register.errors.requiredField')
      }
    }

    const updatePasswordToggleIcon = (toggleButton: HTMLButtonElement, inputElement: HTMLInputElement) => {
      const iconElement = toggleButton.querySelector('img') as HTMLImageElement | null
      if (!iconElement) return

      const isHidden = inputElement.type === 'password'
      iconElement.src = isHidden ? '/icons/visibility.png' : '/icons/visibility_off.png'
    }

    const updateSubmitState = () => {
      const firstNameValid = Boolean(firstNameInput?.value.trim())
      const lastNameValid = Boolean(lastNameInput?.value.trim())
      const emailFilled = Boolean(emailInput?.value.trim())
      const emailValid = emailFilled && isValidEmail(emailInput?.value ?? '')
      const passwordValue = passwordInput?.value ?? ''
      const confirmPasswordValue = confirmPasswordInput?.value ?? ''
      const passwordFilled = Boolean(passwordValue)
      const confirmPasswordFilled = Boolean(confirmPasswordValue)
      const passwordValid = passwordFilled && passwordValue.length >= 8 && hasLetter(passwordValue)
      const confirmPasswordValid = confirmPasswordFilled && passwordValue === confirmPasswordValue

      const firstNameError = serverErrors.firstName ?? ''
      const lastNameError = serverErrors.lastName ?? ''
      const emailError = serverErrors.email ?? ''
      const passwordError = serverErrors.password ?? ''
      const confirmPasswordError = serverErrors.confirmPassword ?? ''

      setFieldInvalid(firstNameField, firstNameInput, (touched.firstName && !firstNameValid) || Boolean(firstNameError))
      setFieldInvalid(lastNameField, lastNameInput, (touched.lastName && !lastNameValid) || Boolean(lastNameError))
      setFieldInvalid(emailField, emailInput, (touched.email && !emailValid) || Boolean(emailError))
      setFieldInvalid(passwordField, passwordInput, (touched.password && !passwordValid) || Boolean(passwordError))
      setFieldInvalid(confirmPasswordField, confirmPasswordInput, (touched.confirmPassword && !confirmPasswordValid) || Boolean(confirmPasswordError))

      setHint(emailHint, emailError || (touched.email && !emailValid ? t('auth.register.errors.invalidEmail') : ''))
      setHint(confirmPasswordHint, confirmPasswordError || (touched.confirmPassword && !confirmPasswordValid ? t('auth.register.errors.passwordMismatch') : ''))
      passwordHint?.classList.toggle('is-invalid-text', Boolean(passwordError) || (touched.password && !passwordValid))

      if (passwordError) {
        passwordHint!.textContent = passwordError
      } else {
        passwordHint!.innerHTML = `${t('auth.register.passwordHintLine1')}<br>${t('auth.register.passwordHintLine2')}`
      }

      const isFormValid = Boolean(
        firstNameValid &&
          lastNameValid &&
          emailValid &&
          passwordValid &&
          confirmPasswordValid
      )

      if (!submitButton) return
      submitButton.disabled = !isFormValid
    }

    backButton?.addEventListener('click', () => {
      currentView = 'landing'
      render()
      container.scrollTo({ top: 0, behavior: 'auto' })
    })

    loginLink?.addEventListener('click', (event) => {
      event.preventDefault()
      options?.onOpenLogin?.()
    })

    const fieldInputs: Array<{ key: RegisterFieldKey; input: HTMLInputElement | null }> = [
      { key: 'firstName', input: firstNameInput },
      { key: 'lastName', input: lastNameInput },
      { key: 'email', input: emailInput },
      { key: 'password', input: passwordInput },
      { key: 'confirmPassword', input: confirmPasswordInput },
    ]

    fieldInputs.forEach(({ key, input: inputElement }) => {
      inputElement?.addEventListener('input', () => {
        clearServerError(key)

        if (!touched[key] && (inputElement.value.length > 0 || key === 'confirmPassword')) {
          touched[key] = true
        }
        updateSubmitState()
      })

      inputElement?.addEventListener('blur', () => {
        touched[key] = true
        updateSubmitState()
      })
    })

    container.querySelectorAll<HTMLButtonElement>('[data-toggle-password]').forEach((toggleButton) => {
      toggleButton.addEventListener('click', () => {
        const targetInputId = toggleButton.dataset.togglePassword
        if (!targetInputId) return

        const passwordField = container.querySelector(`#${targetInputId}`) as HTMLInputElement | null
        if (!passwordField) return

        const shouldShowPassword = passwordField.type === 'password'
        passwordField.type = shouldShowPassword ? 'text' : 'password'

        const isConfirmField = targetInputId === 'register-confirm-password'
        const hideLabel = isConfirmField ? t('auth.register.hideConfirmPassword') : t('auth.register.hidePassword')
        const showLabel = isConfirmField ? t('auth.register.showConfirmPassword') : t('auth.register.showPassword')

        toggleButton.setAttribute('aria-label', shouldShowPassword ? hideLabel : showLabel)
        updatePasswordToggleIcon(toggleButton, passwordField)
      })

      const targetInputId = toggleButton.dataset.togglePassword
      if (!targetInputId) return

      const passwordField = container.querySelector(`#${targetInputId}`) as HTMLInputElement | null
      if (!passwordField) return

      updatePasswordToggleIcon(toggleButton, passwordField)
    })

    formElement?.addEventListener('submit', (event) => {
      event.preventDefault()

      if (submitButton?.disabled) {
        touched.firstName = true
        touched.lastName = true
        touched.email = true
        touched.password = true
        touched.confirmPassword = true
        updateSubmitState()
        return
      }

      const payload = {
        firstName: firstNameInput?.value.trim() ?? '',
        lastName: lastNameInput?.value.trim() ?? '',
        email: emailInput?.value.trim() ?? '',
        password: passwordInput?.value ?? '',
        confirmPassword: confirmPasswordInput?.value ?? '',
      }

      submitButton!.disabled = true
      toast(t('auth.register.feedback.submitting'), 'loading')

      authApi
        .register(payload)
        .then((response) => {
          toast(t('auth.register.feedback.success'), 'success')

          if (options?.onRegistrationCompleted) {
            options.onRegistrationCompleted(
              response.userId,
              payload.email,
              payload.password
            )
            return
          }

          currentView = 'landing'
          render()
          container.scrollTo({ top: 0, behavior: 'auto' })
        })
        .catch((error: unknown) => {
          if (!(error instanceof ApiError)) {
            toast(t('auth.register.errors.generic'), 'error')
            updateSubmitState()
            return
          }

          if (error.code === 'EMAIL_ALREADY_EXISTS') {
            touched.email = true
            serverErrors.email = t('auth.register.errors.emailAlreadyExists')
            updateSubmitState()
            return
          }

          if (error.code === 'RATE_LIMITED') {
            toast(t('auth.register.errors.rateLimited'), 'error')
            updateSubmitState()
            return
          }

          if (error.code === 'VALIDATION_ERROR' && error.fieldErrors) {
            const fieldMappings: Array<{ apiField: string; key: RegisterFieldKey }> = [
              { apiField: 'firstName', key: 'firstName' },
              { apiField: 'lastName', key: 'lastName' },
              { apiField: 'email', key: 'email' },
              { apiField: 'password', key: 'password' },
              { apiField: 'confirmPassword', key: 'confirmPassword' },
            ]

            fieldMappings.forEach(({ apiField, key }) => {
              const errorCode = error.fieldErrors?.[apiField]
              if (!errorCode) return
              touched[key] = true
              serverErrors[key] = errorLabelFromCode(errorCode)
            })

            updateSubmitState()
            return
          }

          toast(t('auth.register.errors.generic'), 'error')
          updateSubmitState()
        })
    })

    updateSubmitState()
  }

  render()
  subscribeLanguage(() => render())
}
