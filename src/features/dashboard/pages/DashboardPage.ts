import { t } from '@/shared/i18n'
import '@/features/dashboard/styles/dashboard.css'

function escapeHtml(value: string) {
  const div = document.createElement('div')
  div.textContent = value
  return div.innerHTML
}

/* ── SVG Icons ── */
const icons = {
  people: `<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 14C16.21 14 18 12.21 18 10C18 7.79 16.21 6 14 6C11.79 6 10 7.79 10 10C10 12.21 11.79 14 14 14ZM14 16C11.33 16 6 17.34 6 20V22H22V20C22 17.34 16.67 16 14 16Z" fill="#7B3FBF"/>
  </svg>`,
  star: `<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 4L16.82 10.74L24 11.64L18.82 16.26L20.18 23.36L14 19.87L7.82 23.36L9.18 16.26L4 11.64L11.18 10.74L14 4Z" fill="#D4820A"/>
  </svg>`,
  check: `<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 8L11 19L6 14" stroke="#5A8A0E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  clock: `<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="10" stroke="#246670" stroke-width="2"/>
    <path d="M14 8V14L18 16" stroke="#246670" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  arrowUp: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 12V4M8 4L4 8M8 4L12 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  arrowDown: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 4V12M8 12L4 8M8 12L12 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  dash: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 8H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  download: `<svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 2V12M9 12L5 8M9 12L13 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M2 14H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  starFilled: `<svg viewBox="0 0 16 16" fill="#FDC700" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1L9.79 5.64L14.8 6.08L10.98 9.36L12.18 14.28L8 11.71L3.82 14.28L5.02 9.36L1.2 6.08L6.21 5.64L8 1Z"/>
  </svg>`,
  starEmpty: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1L9.79 5.64L14.8 6.08L10.98 9.36L12.18 14.28L8 11.71L3.82 14.28L5.02 9.36L1.2 6.08L6.21 5.64L8 1Z" stroke="#C1CFD7" stroke-width="1"/>
  </svg>`,
}

/* ── Mock Data ── */
interface MetricData {
  value: string
  label: string
  caption: string
  trend: 'up' | 'down' | 'neutral'
  trendValue: string
  iconHtml: string
  iconClass: string
}

interface BarChartItem {
  label: string
  value: number
}

interface CommentData {
  initials: string
  name: string
  course: string
  date: string
  rating: number
  text: string
}

function getMockMetrics(): MetricData[] {
  return [
    {
      value: '25',
      label: t('dashboard.activeStudents'),
      caption: t('dashboard.ofSubscribed').replace('{{count}}', '30'),
      trend: 'up',
      trendValue: '+12%',
      iconHtml: icons.people,
      iconClass: 'purple',
    },
    {
      value: '4.6',
      label: t('dashboard.averageRating'),
      caption: t('dashboard.ofRatings').replace('{{count}}', '3850'),
      trend: 'up',
      trendValue: '+0.3',
      iconHtml: icons.star,
      iconClass: 'yellow',
    },
    {
      value: '65%',
      label: t('dashboard.completionRate'),
      caption: '',
      trend: 'down',
      trendValue: '-5%',
      iconHtml: icons.check,
      iconClass: 'green',
    },
    {
      value: '28',
      label: t('dashboard.averageTime'),
      caption: '',
      trend: 'neutral',
      trendValue: '0%',
      iconHtml: icons.clock,
      iconClass: 'teal',
    },
  ]
}

function getMockRatingsDistribution(): BarChartItem[] {
  return [
    { label: '1\u2605', value: 50 },
    { label: '2\u2605', value: 100 },
    { label: '3\u2605', value: 300 },
    { label: '4\u2605', value: 1100 },
    { label: '5\u2605', value: 2300 },
  ]
}

function getMockLikedCategories(): BarChartItem[] {
  return [
    { label: t('dashboard.interestingLessons'), value: 2800 },
    { label: t('dashboard.didacticTeachers'), value: 2400 },
    { label: t('dashboard.informativeContent'), value: 2000 },
    { label: t('dashboard.didacticMaterial'), value: 1700 },
    { label: t('dashboard.dynamicLessons'), value: 1400 },
  ]
}

function getMockComments(): CommentData[] {
  return [
    {
      initials: 'AA',
      name: 'Ana Almeida',
      course: 'Desenvolvimento Web Moderno',
      date: '15/03/26',
      rating: 4,
      text: 'O curso aborda os temas de forma clara e objetiva. As aulas práticas são muito úteis para fixar o conteúdo.',
    },
    {
      initials: 'BC',
      name: 'Bruno Costa',
      course: 'Fundamentos de UX Design',
      date: '12/03/26',
      rating: 4,
      text: 'Material muito bem organizado. Os exemplos práticos ajudam bastante a entender os conceitos apresentados.',
    },
    {
      initials: 'CM',
      name: 'Carla Mendes',
      course: 'Introdução à Análise de Dados',
      date: '10/03/26',
      rating: 4,
      text: 'Excelente didática! O professor explica de maneira simples e acessível. Recomendo para iniciantes.',
    },
    {
      initials: 'DR',
      name: 'Daniel Rodrigues',
      course: 'Marketing Digital Avançado',
      date: '08/03/26',
      rating: 4,
      text: 'Conteúdo atualizado e relevante para o mercado. As estratégias apresentadas são aplicáveis no dia a dia.',
    },
  ]
}

/* ── Render Helpers ── */

function renderStars(rating: number): string {
  let html = ''
  for (let i = 1; i <= 5; i++) {
    html += i <= rating ? icons.starFilled : icons.starEmpty
  }
  return html
}

function renderTrendIcon(trend: 'up' | 'down' | 'neutral'): string {
  if (trend === 'up') return icons.arrowUp
  if (trend === 'down') return icons.arrowDown
  return icons.dash
}

function renderMetricCards(metrics: MetricData[]): string {
  return metrics.map((m) => `
    <div class="metric-card">
      <div class="metric-card-header">
        <div class="metric-card-icon ${m.iconClass}">${m.iconHtml}</div>
        <div class="metric-card-trend ${m.trend}">
          ${renderTrendIcon(m.trend)}
          <span>${escapeHtml(m.trendValue)}</span>
        </div>
      </div>
      <div class="metric-card-body">
        <div class="metric-card-value">${escapeHtml(m.value)}</div>
        <div class="metric-card-label">${escapeHtml(m.label)}</div>
        ${m.caption ? `<div class="metric-card-caption">${escapeHtml(m.caption)}</div>` : ''}
      </div>
    </div>
  `).join('')
}

function renderVerticalBarChart(data: BarChartItem[]): string {
  const maxValue = Math.max(...data.map((d) => d.value))
  return `
    <div class="vbar-chart">
      ${data.map((d) => {
        const heightPercent = maxValue > 0 ? (d.value / maxValue) * 100 : 0
        return `
          <div class="vbar-column">
            <div class="vbar-value">${d.value}</div>
            <div class="vbar-bar" style="height: ${heightPercent}%"></div>
            <div class="vbar-label">${escapeHtml(d.label)}</div>
          </div>
        `
      }).join('')}
    </div>
  `
}

function renderHorizontalBarChart(data: BarChartItem[]): string {
  const maxValue = Math.max(...data.map((d) => d.value))
  return `
    <div class="hbar-chart">
      ${data.map((d) => {
        const widthPercent = maxValue > 0 ? (d.value / maxValue) * 100 : 0
        return `
          <div class="hbar-row">
            <div class="hbar-row-header">
              <span class="hbar-row-label">${escapeHtml(d.label)}</span>
              <span class="hbar-row-value">${d.value}</span>
            </div>
            <div class="hbar-track">
              <div class="hbar-fill" style="width: ${widthPercent}%"></div>
            </div>
          </div>
        `
      }).join('')}
    </div>
  `
}

function renderComments(comments: CommentData[]): string {
  if (comments.length === 0) {
    return `<div class="dashboard-no-data">${escapeHtml(t('dashboard.noComments'))}</div>`
  }

  return comments.map((c) => `
    <div class="comment-card">
      <div class="comment-avatar">${escapeHtml(c.initials)}</div>
      <div class="comment-body">
        <div class="comment-top-row">
          <span class="comment-name">${escapeHtml(c.name)}</span>
          <span class="comment-date">${escapeHtml(c.date)}</span>
        </div>
        <div class="comment-course">${escapeHtml(c.course)}</div>
        <div class="comment-stars">${renderStars(c.rating)}</div>
        <div class="comment-text">${escapeHtml(c.text)}</div>
      </div>
    </div>
  `).join('')
}

/* ── Main Render ── */

export function renderDashboardPage(container: HTMLElement) {
  const metrics = getMockMetrics()
  const ratingsData = getMockRatingsDistribution()
  const likedData = getMockLikedCategories()
  const comments = getMockComments()

  container.innerHTML = `
    <div class="dashboard-page">
      <div class="dashboard-content">

        <div class="dashboard-header">
          <div class="dashboard-header-left">
            <h1 class="dashboard-title">${escapeHtml(t('dashboard.title'))}</h1>
            <p class="dashboard-subtitle">${escapeHtml(t('dashboard.subtitle'))}</p>
          </div>
        </div>

        <div class="dashboard-filters">
          <select class="dashboard-filter-select" id="dashboard-period-filter">
            <option value="3">${escapeHtml(t('dashboard.lastMonths').replace('{{count}}', '3'))}</option>
            <option value="6">${escapeHtml(t('dashboard.lastMonths').replace('{{count}}', '6'))}</option>
            <option value="12">${escapeHtml(t('dashboard.lastMonths').replace('{{count}}', '12'))}</option>
          </select>
          <select class="dashboard-filter-select" id="dashboard-course-filter">
            <option value="all">${escapeHtml(t('dashboard.allCourses'))}</option>
          </select>
          <button class="dashboard-export-btn" id="dashboard-export-btn">
            ${icons.download}
            <span>${escapeHtml(t('dashboard.export'))}</span>
          </button>
        </div>

        <div class="dashboard-metrics">
          ${renderMetricCards(metrics)}
        </div>

        <div class="dashboard-charts">
          <div class="chart-card">
            <h2 class="chart-card-title">${escapeHtml(t('dashboard.ratingsDistribution'))}</h2>
            ${renderVerticalBarChart(ratingsData)}
          </div>
          <div class="chart-card">
            <h2 class="chart-card-title">${escapeHtml(t('dashboard.whatStudentsLiked'))}</h2>
            ${renderHorizontalBarChart(likedData)}
          </div>
        </div>

        <div class="dashboard-comments-card">
          <div class="dashboard-comments-header">
            <h2 class="dashboard-comments-title">${escapeHtml(t('dashboard.recentComments'))}</h2>
            <select class="dashboard-comments-filter" id="dashboard-stars-filter">
              <option value="all">${escapeHtml(t('dashboard.allStars'))}</option>
              <option value="5">${escapeHtml(t('dashboard.stars').replace('{{count}}', '5'))}</option>
              <option value="4">${escapeHtml(t('dashboard.stars').replace('{{count}}', '4'))}</option>
              <option value="3">${escapeHtml(t('dashboard.stars').replace('{{count}}', '3'))}</option>
              <option value="2">${escapeHtml(t('dashboard.stars').replace('{{count}}', '2'))}</option>
              <option value="1">${escapeHtml(t('dashboard.stars').replace('{{count}}', '1'))}</option>
            </select>
          </div>
          <div class="dashboard-comments-list">
            ${renderComments(comments)}
          </div>
        </div>

      </div>
    </div>
  `
}
