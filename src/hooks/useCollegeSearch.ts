import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { College, CollegeFilters } from '@/types/college'
import { filterColleges } from '@/lib/utils/filterColleges'
import { colleges } from '@/lib/data/colleges'

export function useCollegeSearch(filters: CollegeFilters) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['colleges', filters],
    queryFn: () => filterColleges(colleges, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Use useMemo for filtered results (in case we want to add caching)
  const filteredColleges = useMemo(() => {
    return data || []
  }, [data])

  return {
    data: filteredColleges,
    isLoading,
    error,
  }
}
