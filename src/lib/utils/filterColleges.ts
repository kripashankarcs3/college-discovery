import type { College, CollegeFilters } from '@/types/college'

export function filterColleges(colleges: College[], filters: CollegeFilters): College[] {
  let filtered = [...colleges]

  // Keyword search
  if (filters.query.trim()) {
    const query = filters.query.toLowerCase()
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.shortName.toLowerCase().includes(query) ||
        c.location.city.toLowerCase().includes(query) ||
        c.location.state.toLowerCase().includes(query) ||
        c.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  }

  // Type filter
  if (filters.type) {
    filtered = filtered.filter((c) => c.type === filters.type)
  }

  // Exam filter
  if (filters.exam) {
    filtered = filtered.filter((c) => c.exams.includes(filters.exam as any))
  }

  // State filter
  if (filters.state) {
    filtered = filtered.filter((c) => c.location.state === filters.state)
  }

  // NIRF range
  const [nirfMin, nirfMax] = filters.nirf
  filtered = filtered.filter((c) => c.nirf >= nirfMin && c.nirf <= nirfMax)

  // Fees range (convert lakhs to INR for comparison)
  const [feesMinLPA, feesMaxLPA] = filters.fees
  const feesMin = feesMinLPA * 100000
  const feesMax = feesMaxLPA * 100000
  filtered = filtered.filter((c) => c.fees.min >= feesMin && c.fees.max <= feesMax)

  // Sort
  filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case 'nirf':
        return a.nirf - b.nirf
      case 'rating':
        return b.rating - a.rating
      case 'fees':
        return a.fees.min - b.fees.min
      case 'placement':
        return b.placements.avgPackage - a.placements.avgPackage
      default:
        return 0
    }
  })

  return filtered
}
