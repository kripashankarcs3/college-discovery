import type { CollegeFilters } from '@/types/college'

export function serializeFilters(filters: CollegeFilters): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.query) params.set('q', filters.query)
  if (filters.type) params.set('type', filters.type)
  if (filters.exam) params.set('exam', filters.exam)
  if (filters.state) params.set('state', filters.state)

  params.set('nirfMin', filters.nirf[0].toString())
  params.set('nirfMax', filters.nirf[1].toString())
  params.set('feesMin', filters.fees[0].toString())
  params.set('feesMax', filters.fees[1].toString())
  params.set('sortBy', filters.sortBy)

  return params
}

export function deserializeFilters(params: URLSearchParams): CollegeFilters {
  const query = params.get('q') || ''
  const type = (params.get('type') as any) || ''
  const exam = (params.get('exam') as any) || ''
  const state = (params.get('state') as any) || ''

  const nirfMin = parseInt(params.get('nirfMin') || '1', 10)
  const nirfMax = parseInt(params.get('nirfMax') || '1000', 10)
  const feesMin = parseFloat(params.get('feesMin') || '0')
  const feesMax = parseFloat(params.get('feesMax') || '50')
  const sortBy = (params.get('sortBy') as any) || 'nirf'

  return {
    query,
    type,
    exam,
    state,
    nirf: [nirfMin, nirfMax],
    fees: [feesMin, feesMax],
    sortBy,
  }
}
