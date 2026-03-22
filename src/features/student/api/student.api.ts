import { api } from '@/shared/api/http'

// --- Types ---

export interface StudentUser {
  id: string
  firstName: string
  lastName: string
}

export interface StudentProfile {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  dateOfBirth: string | null
  avatarMediaId: string | null
  deviceId: string | null
  createdAt: string
}

export interface CatalogCourse {
  id: string
  title: string
  shortDescription: string
  imageMediaId: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  category: string
  rating: number | null
  tags: string[]
  enrollmentCount: number
  reusableTags: { id: string; name: string; slug: string }[]
}

export interface CatalogCourseDetail extends CatalogCourse {
  description: string
  passingThreshold: number
  sections: { id: string; title: string; order: number; duration: number | null; thumbnailMediaId: string | null }[]
}

export interface Enrollment {
  id: string
  courseId: string
  status: 'ACTIVE' | 'COMPLETED' | 'DROPPED'
  enrolledAt: string
  completedAt: string | null
  progressPercent: number
  completedSections: number
  totalSections: number
  course: {
    id: string
    title: string
    shortDescription: string
    imageMediaId: string
    difficulty: string
    estimatedTime: string
    category: string
    rating: number | null
  } | null
}

export interface EnrollmentDetail {
  enrollment: { id: string; status: string; enrolledAt: string; completedAt: string | null }
  course: { id: string; title: string; description: string; imageMediaId: string; difficulty: string; estimatedTime: string; passingThreshold: number }
  progressPercent: number
  completedSections: number
  totalSections: number
  sections: {
    id: string
    title: string
    order: number
    duration: number | null
    videoMediaId: string | null
    thumbnailMediaId: string | null
    status: 'completed' | 'in_progress' | 'locked'
    score: number | null
    totalQuestions: number | null
  }[]
}

export interface GamificationSummary {
  totalPoints: number
  currentLevel: number
  levelName: string
  xpProgress: number
  xpNeeded: number
  currentStreak: number
  longestStreak: number
  coursesCompleted: number
  sectionsCompleted: number
  recentBadges: { id: string; key: string; name: string; description: string; iconUrl: string | null; earnedAt: string }[]
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  firstName: string
  lastName: string
  avatarMediaId: string | null
  points: number
}

export interface LeaderboardResult {
  month: string
  entries: LeaderboardEntry[]
  userRank: LeaderboardEntry | null
  total: number
}

export interface CourseReviewItem {
  id: string
  rating: number
  tags: string[]
  comment: string | null
  createdAt: string
  user: { id: string; firstName: string; lastName: string; avatarMediaId: string | null } | null
}

export interface CertificateItem {
  id: string
  courseId: string
  courseName: string
  userName: string
  completedAt: string
  totalSections: number
  hasPdf: boolean
  verificationCode: string | null
  course: { id: string; title: string; imageMediaId: string } | null
}

// --- Auth ---

export const studentApi = {
  register: (data: { firstName: string; lastName: string; email?: string; phone?: string; dateOfBirth?: string; deviceId?: string }) =>
    api.post<{ accessToken: string; user: StudentUser }>('/student/auth/register', data),

  deviceLogin: (deviceId: string) =>
    api.post<{ accessToken: string; user: StudentUser }>('/student/auth/device-login', { deviceId }),

  // Profile
  getProfile: () =>
    api.get<StudentProfile>('/student/profile', { auth: true }),

  updateProfile: (data: { firstName?: string; lastName?: string; email?: string; phone?: string; dateOfBirth?: string }) =>
    api.put<StudentProfile>('/student/profile', data, { auth: true }),

  deleteAccount: () =>
    api.del<void>('/student/account', { auth: true }),

  // Catalog (public)
  listCourses: (params?: { q?: string; category?: string; difficulty?: string; page?: number; limit?: number }) => {
    const qs = new URLSearchParams()
    if (params?.q) qs.set('q', params.q)
    if (params?.category) qs.set('category', params.category)
    if (params?.difficulty) qs.set('difficulty', params.difficulty)
    if (params?.page) qs.set('page', String(params.page))
    if (params?.limit) qs.set('limit', String(params.limit))
    const query = qs.toString()
    return api.get<{ items: CatalogCourse[]; page: number; limit: number; total: number }>(`/catalog/courses${query ? `?${query}` : ''}`)
  },

  getCourseDetail: (id: string) =>
    api.get<CatalogCourseDetail>(`/catalog/courses/${id}`),

  getCategories: () =>
    api.get<{ categories: string[] }>('/catalog/categories'),

  // Enrollments
  enroll: (courseId: string) =>
    api.post<{ id: string; courseId: string; status: string; enrolledAt: string }>('/student/enrollments', { courseId }, { auth: true }),

  listEnrollments: () =>
    api.get<{ enrollments: Enrollment[] }>('/student/enrollments', { auth: true }),

  getEnrollmentDetail: (courseId: string) =>
    api.get<EnrollmentDetail>(`/student/enrollments/${courseId}`, { auth: true }),

  dropEnrollment: (courseId: string) =>
    api.del<{ status: string }>(`/student/enrollments/${courseId}`, { auth: true }),

  // Progress
  saveSectionProgress: (courseId: string, sectionId: string, score: number, totalQuestions: number) =>
    api.post<{ sectionId: string; completed: boolean; score: number }>(`/student/progress/courses/${courseId}/sections/${sectionId}`, { score, totalQuestions }, { auth: true }),

  completeCourse: (courseId: string) =>
    api.put<{ courseId: string; completedAt: string; progressPercent: number }>(`/student/progress/courses/${courseId}/complete`, {}, { auth: true }),

  // Activities
  submitAnswer: (activityId: string, answer: unknown) =>
    api.post<{ activityId: string; correct: boolean; correctAnswer: unknown; attempts: number }>(`/student/activities/${activityId}/answer`, { answer }, { auth: true }),

  // Gamification
  getGamificationSummary: () =>
    api.get<GamificationSummary>('/student/gamification/summary', { auth: true }),

  getBadges: () =>
    api.get<{ badges: GamificationSummary['recentBadges'] }>('/student/gamification/badges', { auth: true }),

  getPointsHistory: (page = 1, limit = 20) =>
    api.get<{ items: { id: string; action: string; points: number; courseId: string | null; earnedAt: string }[]; total: number }>(`/student/gamification/points-history?page=${page}&limit=${limit}`, { auth: true }),

  // Leaderboard
  getGlobalLeaderboard: (month?: string) => {
    const qs = month ? `?month=${month}` : ''
    return api.get<LeaderboardResult>(`/leaderboard/global${qs}`, { auth: true })
  },

  getCourseLeaderboard: (courseId: string, month?: string) => {
    const qs = month ? `?month=${month}` : ''
    return api.get<LeaderboardResult>(`/leaderboard/courses/${courseId}${qs}`, { auth: true })
  },

  // Reviews
  submitReview: (data: { courseId: string; rating: number; tags: string[]; comment: string | null }) =>
    api.post<{ id: string; rating: number }>('/student/reviews', data, { auth: true }),

  getCourseReviews: (courseId: string, page = 1) =>
    api.get<{ items: CourseReviewItem[]; total: number; summary: { averageRating: number; totalReviews: number; distribution: Record<number, number> } }>(`/catalog/courses/${courseId}/reviews?page=${page}`, { auth: true }),

  // Certificates
  listCertificates: () =>
    api.get<{ certificates: CertificateItem[] }>('/student/certificates', { auth: true }),

  getCertificatePdfUrl: (id: string) =>
    `/student/certificates/${id}/pdf`,

  verifyCertificate: (code: string) =>
    api.get<{ id: string; userName: string; courseName: string; completedAt: string; verified: boolean }>(`/certificates/verify/${code}`),
}
