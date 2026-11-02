import type { Tag } from '@/features/courses/model/course.types'

export function filterTagSuggestions(tags: Tag[], selectedIds: string[], query: string, limit = 8): Tag[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return []

  return tags
    .filter((tag) => tag.isActive)
    .filter((tag) => !selectedIds.includes(tag.id))
    .filter((tag) => tag.name.toLowerCase().includes(normalized) || tag.slug.toLowerCase().includes(normalized))
    .slice(0, limit)
}

export function canAddTag(selected: readonly Tag[], max = 20): boolean {
  return selected.length < max
}
