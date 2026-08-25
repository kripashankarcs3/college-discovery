'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useFilterStore } from '@/lib/store/filterStore'
import { useCollegeSearch } from '@/hooks/useCollegeSearch'
import { SearchFilterBar, CollegesGrid } from '@/components/college'

export default function CollegesPage() {
  const { filters, setFilter, resetFilters } = useFilterStore()
  const searchParams = useSearchParams()
  const router = useRouter()

  const { data: colleges, isLoading, error } = useCollegeSearch(filters)

  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [offset, setOffset] = useState(0)
  const BATCH_SIZE = 6

  const displayedColleges = colleges.slice(0, offset + BATCH_SIZE)

  // Sync URL params with filter state
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setFilter('query', q)
    }
  }, [searchParams, setFilter])

  // Handle filter changes and update URL
  useEffect(() => {
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

    const urlString = params.toString()
    router.replace(`/colleges?${urlString}`, { scroll: false })
  }, [filters, router])

  const handleLoadMore = () => {
    setOffset((prev) => prev + BATCH_SIZE)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-100">All Colleges</h1>
        <span className="text-slate-400">
          Showing {displayedColleges.length} of {colleges.length} colleges
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters (desktop) */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <SearchFilterBar />
        </div>

        {/* Mobile Filters Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 flex items-center justify-center gap-2"
          >
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Mobile Filters Panel */}
        {showMobileFilters && (
          <div className="lg:hidden mb-4">
            <SearchFilterBar />
          </div>
        )}

        {/* College Grid */}
        <div className="flex-1">
          <CollegesGrid colleges={displayedColleges} isLoading={isLoading} error={error} />

          {/* Load More Button */}
          {offset + BATCH_SIZE < colleges.length && (
            <button
              onClick={handleLoadMore}
              className="w-full mt-8 py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg font-medium transition-colors"
            >
              Load More
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
