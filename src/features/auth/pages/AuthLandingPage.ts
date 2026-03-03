import { AuthHero } from '../components/AuthHero'
import { AuthCard } from '../components/AuthCard'
import { AuthProfileStep } from '../components/AuthProfileStep'
import { AuthLoginCard } from '../components/AuthLoginCard'
import { routes } from '@/app/routes'

type AuthFlowStep = 'auth' | 'profile' | 'login'

export function renderAuthLanding(container: HTMLElement) {
  let currentStep: AuthFlowStep = 'auth'
  let pendingRegistrationUserId: string | null = null
  let shouldOpenRegisterAfterRender = false
  let showPendingApprovalOnLogin = false

  const redirectToHome = () => {
    window.location.assign(routes.home)
  }

  const openRegisterScreen = () => {
    currentStep = 'auth'
    shouldOpenRegisterAfterRender = true
    render()
  }

  const render = () => {
    if (currentStep === 'profile') {
      container.innerHTML = '<div id="auth-profile-step"></div>'
      const profileContainer = document.getElementById('auth-profile-step')
      if (!profileContainer) return

      AuthProfileStep(profileContainer, {
        registrationUserId: pendingRegistrationUserId,
        onBackToRegister: () => {
          openRegisterScreen()
        },
        onProfileSubmittedForReview: () => {
          currentStep = 'login'
          showPendingApprovalOnLogin = true
          render()
        },
      })
      return
    }

    if (currentStep === 'login') {
      container.innerHTML = `
        <div class="auth-page">
          <div class="auth-layout">
            <div id="auth-hero"></div>
            <div id="auth-login-card" class="auth-card"></div>
          </div>
        </div>
      `

      const heroContainer = document.getElementById('auth-hero')
      const loginContainer = document.getElementById('auth-login-card')
      if (!heroContainer || !loginContainer) return

      AuthHero(heroContainer)
      AuthLoginCard(loginContainer, {
        onBack: () => {
          currentStep = 'auth'
          render()
        },
        onOpenRegister: () => openRegisterScreen(),
        onLoginSuccess: () => redirectToHome(),
        showPendingApprovalModal: showPendingApprovalOnLogin,
        onPendingApprovalModalClose: () => {
          showPendingApprovalOnLogin = false
        },
      })

      return
    }

    container.innerHTML = `
      <div class="auth-page">
        <div class="auth-layout">
          <div id="auth-hero"></div>
          <div id="auth-card"></div>
        </div>
      </div>
    `

    const heroContainer = document.getElementById('auth-hero')
    const cardContainer = document.getElementById('auth-card')
    if (!heroContainer || !cardContainer) return

    AuthHero(heroContainer)
    AuthCard(cardContainer, {
      onOpenLogin: () => {
        currentStep = 'login'
        showPendingApprovalOnLogin = false
        render()
      },
      onRegistrationCompleted: (userId) => {
        pendingRegistrationUserId = userId
        currentStep = 'profile'
        render()
      },
    })

    if (shouldOpenRegisterAfterRender) {
      const registerButton = document.getElementById('register-btn') as HTMLButtonElement | null
      registerButton?.click()
      shouldOpenRegisterAfterRender = false
    }
  }

  render()
}
