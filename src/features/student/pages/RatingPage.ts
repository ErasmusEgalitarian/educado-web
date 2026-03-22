import { t } from '@/shared/i18n'
import { renderMobileLayout } from '../components/MobileLayout'
import { studentApi } from '../api/student.api'
import { toast } from '@/shared/ui/toast'
import { routes } from '@/app/routes'

export async function renderRatingPage(container: HTMLElement) {
  const params = new URLSearchParams(window.location.search)
  const courseId = params.get('courseId') ?? ''

  let selectedRating = 0
  let selectedTags: string[] = []
  let comment = ''

  const starLabels = [
    '', // 0
    t('student.rating.star1'),
    t('student.rating.star2'),
    t('student.rating.star3'),
    t('student.rating.star4'),
    t('student.rating.star5'),
  ]

  const tagOptions = [
    { key: 'interestingLessons', label: t('student.rating.tags.interestingLessons') },
    { key: 'didacticProfessionals', label: t('student.rating.tags.didacticProfessionals') },
    { key: 'dynamicLessons', label: t('student.rating.tags.dynamicLessons') },
    { key: 'informativeContent', label: t('student.rating.tags.informativeContent') },
    { key: 'goodMaterial', label: t('student.rating.tags.goodMaterial') },
  ]

  const starSvg = `<svg viewBox="0 0 24 24" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`

  const render = () => {
    const starsHtml = Array.from({ length: 5 }, (_, i) => {
      const starNum = i + 1
      return `<div class="mobile-star${starNum <= selectedRating ? ' filled' : ''}" data-star="${starNum}">${starSvg}</div>`
    }).join('')

    const ratingLabel = selectedRating > 0 ? `<div style="text-align: center; font-family: 'Inter', sans-serif; font-size: 8px; color: #628397; margin-top: 4px;">${starLabels[selectedRating]}</div>` : ''

    const tagsHtml = tagOptions.map(tag => `
      <button class="mobile-selectable-tag${selectedTags.includes(tag.label) ? ' selected' : ''}" data-tag="${tag.label}">${tag.label}</button>
    `).join('')

    const contentHtml = `
      <div style="padding: 24px;">
        <h1 style="font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 22px; color: #141b1f; text-align: center; margin: 24px 0;">${t('student.rating.title')}</h1>

        <div style="text-align: center; margin-bottom: 8px;">
          <div style="font-family: 'Inter', sans-serif; font-size: 13px; color: #28363e; margin-bottom: 4px;">${t('student.rating.howDoYouRate')}</div>
          <div style="font-family: 'Inter', sans-serif; font-size: 10px; color: #628397; margin-bottom: 12px;">${t('student.rating.chooseStars')}</div>
          <div class="mobile-stars" style="justify-content: center;">${starsHtml}</div>
          ${ratingLabel}
        </div>

        <div class="mobile-divider" style="margin: 16px 0;"></div>

        <div style="margin-bottom: 16px;">
          <div style="font-family: 'Inter', sans-serif; font-size: 13px; color: #28363e; text-align: center; margin-bottom: 12px;">${t('student.rating.whatDidYouLike')}</div>
          <div class="mobile-selectable-tags" style="justify-content: center;">${tagsHtml}</div>
        </div>

        <div class="mobile-divider" style="margin: 16px 0;"></div>

        <div style="text-align: center; margin-bottom: 12px;">
          <div style="font-family: 'Inter', sans-serif; font-size: 13px; color: #28363e;">${t('student.rating.leaveComment')}</div>
        </div>
        <textarea class="mobile-textarea" id="rating-comment" placeholder="${t('student.rating.commentPlaceholder')}">${comment}</textarea>

        <button class="mobile-btn mobile-btn-primary" id="submit-rating-btn" style="margin-top: 24px;">${t('student.rating.submit')}</button>
      </div>
    `

    renderMobileLayout(container, 'my-courses', contentHtml)
    bindEvents()
  }

  const bindEvents = () => {
    container.querySelectorAll('.mobile-star').forEach(star => {
      star.addEventListener('click', () => {
        selectedRating = Number((star as HTMLElement).dataset.star)
        render()
      })
    })

    container.querySelectorAll('.mobile-selectable-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        const label = (tag as HTMLElement).dataset.tag ?? ''
        if (selectedTags.includes(label)) {
          selectedTags = selectedTags.filter(t => t !== label)
        } else if (selectedTags.length < 5) {
          selectedTags.push(label)
        }
        render()
      })
    })

    container.querySelector('#rating-comment')?.addEventListener('input', (e) => {
      comment = (e.target as HTMLTextAreaElement).value
    })

    container.querySelector('#submit-rating-btn')?.addEventListener('click', async () => {
      if (selectedRating === 0) {
        toast(t('student.rating.chooseStars'), 'error')
        return
      }

      try {
        await studentApi.submitReview({
          courseId,
          rating: selectedRating,
          tags: selectedTags,
          comment: comment || null,
        })
        toast(t('student.rating.submit'), 'success')
        window.location.assign(routes.studentMyCourses)
      } catch {
        toast('Error', 'error')
      }
    })
  }

  render()
}
