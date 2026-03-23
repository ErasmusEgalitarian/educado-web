import { t } from '@/shared/i18n'
import { renderMobileLayout } from '../components/MobileLayout'
import { studentApi, LeaderboardResult } from '../api/student.api'
import { routes } from '@/app/routes'

export async function renderLeaderboardPage(container: HTMLElement) {
  let leaderboard: LeaderboardResult | null = null

  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const monthKey = currentMonth.split('-')[1] as keyof typeof monthNames
  const monthNames = {
    '01': t('student.leaderboard.months.01'),
    '02': t('student.leaderboard.months.02'),
    '03': t('student.leaderboard.months.03'),
    '04': t('student.leaderboard.months.04'),
    '05': t('student.leaderboard.months.05'),
    '06': t('student.leaderboard.months.06'),
    '07': t('student.leaderboard.months.07'),
    '08': t('student.leaderboard.months.08'),
    '09': t('student.leaderboard.months.09'),
    '10': t('student.leaderboard.months.10'),
    '11': t('student.leaderboard.months.11'),
    '12': t('student.leaderboard.months.12'),
  }

  const getInitials = (first: string, last: string) =>
    `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase()

  const render = () => {
    const entries = leaderboard?.entries ?? []
    const top3 = entries.slice(0, 3)
    const rest = entries.slice(3)
    const userRank = leaderboard?.userRank

    // Podium (1st in center, 2nd left, 3rd right)
    const first = top3[0]
    const second = top3[1]
    const third = top3[2]

    const podiumHtml = `
      <div class="mobile-podium">
        ${second ? `
          <div class="mobile-podium-item second" style="margin-right: 8px;">
            <div class="mobile-podium-pts">${second.points} ${t('student.leaderboard.pts')}</div>
            <div class="mobile-podium-avatar">${getInitials(second.firstName, second.lastName)}</div>
            <div class="mobile-podium-rank">2º</div>
            <div class="mobile-podium-name">${second.firstName} ${second.lastName}</div>
          </div>
        ` : ''}
        ${first ? `
          <div class="mobile-podium-item first">
            <div class="mobile-podium-pts">${first.points} ${t('student.leaderboard.pts')}</div>
            <div class="mobile-podium-avatar">${getInitials(first.firstName, first.lastName)}</div>
            <div class="mobile-podium-rank">1º</div>
            <div class="mobile-podium-name">${first.firstName} ${first.lastName}</div>
          </div>
        ` : ''}
        ${third ? `
          <div class="mobile-podium-item third" style="margin-left: 8px;">
            <div class="mobile-podium-pts">${third.points} ${t('student.leaderboard.pts')}</div>
            <div class="mobile-podium-avatar">${getInitials(third.firstName, third.lastName)}</div>
            <div class="mobile-podium-rank">3º</div>
            <div class="mobile-podium-name">${third.firstName} ${third.lastName}</div>
          </div>
        ` : ''}
      </div>
    `

    // List items (4th+)
    let listHtml = ''
    const showSkip = userRank && userRank.rank > 30

    for (let i = 0; i < Math.min(rest.length, 6); i++) {
      const entry = rest[i]
      const isCurrentUser = userRank?.userId === entry.userId
      listHtml += `
        <div class="mobile-leaderboard-item${isCurrentUser ? ' current-user' : ''}">
          <span class="mobile-leaderboard-rank">${entry.rank}</span>
          <div class="mobile-leaderboard-avatar">${getInitials(entry.firstName, entry.lastName)}</div>
          <span class="mobile-leaderboard-name">${entry.firstName} ${entry.lastName}</span>
          <span class="mobile-leaderboard-pts">${entry.points} ${t('student.leaderboard.pts')}</span>
        </div>
      `
    }

    // If user is ranked > 30, show skip + user
    if (showSkip && userRank) {
      listHtml += `<div class="mobile-leaderboard-skip">. . .</div>`
      listHtml += `
        <div class="mobile-leaderboard-item current-user">
          <span class="mobile-leaderboard-rank">${userRank.rank}</span>
          <div class="mobile-leaderboard-avatar">${getInitials(userRank.firstName, userRank.lastName)}</div>
          <span class="mobile-leaderboard-name">${userRank.firstName} ${userRank.lastName}</span>
          <span class="mobile-leaderboard-pts">${userRank.points} ${t('student.leaderboard.pts')}</span>
        </div>
      `
    }

    const contentHtml = `
      <div style="padding: 24px;">
        <div class="mobile-page-header" style="padding: 0 0 8px;">
          <button class="back-btn" id="back-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#28363e" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <span class="mobile-page-title">${t('student.leaderboard.title')}</span>
          <div style="width: 24px;"></div>
        </div>
        <div style="font-family: 'Inter', sans-serif; font-size: 13px; color: #628397; text-align: center; margin-bottom: 16px;">
          ${t('student.leaderboard.monthLabel')} ${monthNames[monthKey] ?? ''}
        </div>
        ${podiumHtml}
        <div style="margin-top: 16px;">
          ${listHtml}
        </div>
      </div>
    `

    renderMobileLayout(container, 'profile', contentHtml)
    bindEvents()
  }

  const bindEvents = () => {
    container.querySelector('#back-btn')?.addEventListener('click', () => {
      window.location.assign(routes.studentProfile)
    })
  }

  try {
    leaderboard = await studentApi.getGlobalLeaderboard(currentMonth)
  } catch {
    leaderboard = null
  }

  render()
}
