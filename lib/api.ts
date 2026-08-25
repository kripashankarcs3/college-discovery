import { colleges as rawColleges, collegeAliasMap, resolveCollegeSlug } from './collegeData'
import { College } from './types'

type GetCollegesFilters = {
  location?: string
  maxFees?: number
  forceError?: boolean
}

const DELAY = 400

const colleges: College[] = rawColleges

export async function getColleges(
  query?: string,
  filters?: GetCollegesFilters
): Promise<College[]> {
  return new Promise<College[]>((resolve, reject) => {
    setTimeout(() => {
      if (filters?.forceError || query === '__FAIL__') {
        return reject(new Error('Mock API error: failed to fetch colleges'))
      }

      let results = colleges.slice()

      if (query && query.trim().length > 0) {
        const q = query.toLowerCase()
        results = results.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.location.toLowerCase().includes(q) ||
            c.city?.toLowerCase().includes(q) ||
            c.state?.toLowerCase().includes(q) ||
            c.courses.some((course) => course.toLowerCase().includes(q)) ||
            c.overview.toLowerCase().includes(q)
        )
      }

      if (filters?.location) {
        const loc = filters.location.toLowerCase()
        results = results.filter(
          (c) =>
            c.location.toLowerCase().includes(loc) ||
            c.city?.toLowerCase().includes(loc) ||
            c.state?.toLowerCase().includes(loc)
        )
      }

      if (typeof filters?.maxFees === 'number') {
        results = results.filter((c) => c.fees <= filters.maxFees!)
      }

      resolve(results)
    }, DELAY)
  })
}

export async function getCollegeById(id: string): Promise<College> {
  return new Promise<College>((resolve, reject) => {
    setTimeout(() => {
      const resolvedId = resolveCollegeSlug(id)
      const found = colleges.find((c) => c.id === resolvedId)
      if (!found) {
        const err = new Error('College not found') as Error & { status?: number }
        err.status = 404
        return reject(err)
      }
      resolve(found)
    }, DELAY)
  })
}

export function getAllColleges(): College[] {
  return colleges
}

export async function searchExternalColleges(q: string, state?: string): Promise<{ name: string; state: string; city: string }[]> {
  try {
    const params = new URLSearchParams({ q, limit: '20' })
    if (state) params.set('state', state)
    const res = await fetch(`/api/colleges/external?${params}`)
    if (!res.ok) return []
    const data = await res.json()
    return data.colleges || []
  } catch {
    return []
  }
}

export { getCollegesByFilters, predictColleges } from './collegeData'

export default { getColleges, getCollegeById, getAllColleges, searchExternalColleges }
