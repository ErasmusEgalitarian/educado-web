import { t } from '@/shared/i18n'

export type MediaTabType = 'courses' | 'media-bank'

interface MediaTabConfig {
  id: MediaTabType
  label: string
  active: boolean
}

export class MediaTabs {
  private container: HTMLElement
  private activeTab: MediaTabType = 'media-bank'
  private onTabChange: ((tab: MediaTabType) => void) | null = null

  constructor(container: HTMLElement) {
    this.container = container
  }

  setOnTabChange(callback: (tab: MediaTabType) => void) {
    this.onTabChange = callback
  }

  setActiveTab(tab: MediaTabType) {
    this.activeTab = tab
    this.render()
  }

  render() {
    const tabs: MediaTabConfig[] = [
      { id: 'courses', label: t('courses.home.mediaBank.headerTabs.courses'), active: this.activeTab === 'courses' },
      { id: 'media-bank', label: t('courses.home.mediaBank.headerTabs.mediaBank'), active: this.activeTab === 'media-bank' },
    ]

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
  static renderInHeader(activeTab: MediaTabType, coursesPath: string = '/home') {
    const headerTabsContainer = document.querySelector('#header-tabs-container') as HTMLElement
    if (!headerTabsContainer) return

    const tabs = new MediaTabs(headerTabsContainer)
    tabs.setActiveTab(activeTab)
    tabs.setOnTabChange((tab) => {
      if (tab === 'courses') {
        window.location.href = coursesPath
      } else if (tab === 'media-bank') {
        window.location.href = '/media-bank'
      }
    })
    tabs.render()
  }
}
