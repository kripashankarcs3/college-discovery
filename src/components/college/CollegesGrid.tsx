import { CollegeCard, CollegeCardSkeleton } from '@/components/college'

interface CollegesGridProps {
  colleges: any[]
  isLoading: boolean
  error: Error | null
}

export function CollegesGrid({ colleges, isLoading, error }: CollegesGridProps) {
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">Error loading colleges. Please try again.</p>
        <button className="px-4 py-2 bg-electric text-navy-900 rounded-lg font-medium">
          Retry
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CollegeCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (colleges.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 mb-4">No colleges found. Try different filters.</p>
        <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg font-medium transition-colors">
          Clear all filters
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {colleges.map((college, index) => (
        <CollegeCard key={college.id} college={college} index={index} />
      ))}
    </div>
  )
}
