import { t } from '@/shared/i18n'

export type MediaTabType = 'courses' | 'media-bank' | 'dashboard'
export type AppTabType = MediaTabType | 'admin'

interface MediaTabConfig {
  id: AppTabType
  label: string
  active: boolean
}

interface HeaderTabsOptions {
  coursesPath?: string
  mediaBankPath?: string
  dashboardPath?: string
  adminPath?: string
}

export class MediaTabs {
  private container: HTMLElement
  private activeTab: AppTabType = 'media-bank'
  private onTabChange: ((tab: AppTabType) => void) | null = null
  private includeAdminTab = false

  constructor(container: HTMLElement) {
    this.container = container
  }

  setOnTabChange(callback: (tab: AppTabType) => void) {
    this.onTabChange = callback
  }

  setActiveTab(tab: AppTabType) {
    this.activeTab = tab
    this.render()
  }

  setIncludeAdminTab(value: boolean) {
    this.includeAdminTab = value
  }

  render() {
    const tabs: MediaTabConfig[] = [
      { id: 'courses', label: t('courses.home.mediaBank.headerTabs.courses'), active: this.activeTab === 'courses' },
      { id: 'media-bank', label: t('courses.home.mediaBank.headerTabs.mediaBank'), active: this.activeTab === 'media-bank' },
      { id: 'dashboard', label: t('courses.home.mediaBank.headerTabs.dashboard'), active: this.activeTab === 'dashboard' },
    ]

    if (this.includeAdminTab) {
      tabs.push({ id: 'admin', label: t('courses.home.mediaBank.headerTabs.admin'), active: this.activeTab === 'admin' })
    }

    this.container.innerHTML = `
      <div class="tabs-component">
        ${tabs.map((tab) => `
          <div class="component-${tab.id === 'courses' ? '2' : '3'}-small${tab.active ? ' active' : ''}">
            <div class="tab-wrapper">
              <div class="tab" data-tab-id="${tab.id}">${tab.label}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `

    this.setupEventListeners()
  }

  private setupEventListeners() {
    const tabElements = this.container.querySelectorAll('.tab')
    tabElements.forEach((tabEl) => {
      tabEl.addEventListener('click', () => {
        const tabId = tabEl.getAttribute('data-tab-id') as MediaTabType
        if (tabId && this.onTabChange) {
          this.onTabChange(tabId)
        }
      })
    })
  }

  /**
   * Static method to render tabs in the header with navigation
   */
  static renderInHeader(activeTab: AppTabType, options: HeaderTabsOptions = {}) {
    const headerTabsContainer = document.querySelector('#header-tabs-container') as HTMLElement
    if (!headerTabsContainer) return

    const coursesPath = options.coursesPath ?? '/home'
    const mediaBankPath = options.mediaBankPath ?? '/media-bank'
    const dashboardPath = options.dashboardPath ?? '/dashboard'
    const adminPath = options.adminPath

    const tabs = new MediaTabs(headerTabsContainer)
    tabs.setIncludeAdminTab(Boolean(adminPath))
    tabs.setActiveTab(activeTab)
    tabs.setOnTabChange((tab) => {
      if (tab === 'courses') {
        window.location.href = coursesPath
      } else if (tab === 'media-bank') {
        window.location.href = mediaBankPath
      } else if (tab === 'dashboard') {
        window.location.href = dashboardPath
      } else if (tab === 'admin' && adminPath) {
        window.location.href = adminPath
      }
    })
    tabs.render()
  }
}
