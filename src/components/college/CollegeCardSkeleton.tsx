export function CollegeCardSkeleton() {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
      {/* Hero Skeleton */}
      <div className="h-32 bg-slate-700" />

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="h-6 w-3/4 bg-slate-700 rounded" />
          <div className="h-4 w-1/2 bg-slate-700 rounded" />
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4">
          <div className="h-4 w-20 bg-slate-700 rounded" />
          <div className="h-4 w-24 bg-slate-700 rounded" />
        </div>

        {/* Fees */}
        <div className="h-4 w-24 bg-slate-700 rounded" />

        {/* Exams */}
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-slate-700 rounded" />
          <div className="h-5 w-16 bg-slate-700 rounded" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <div className="h-9 w-1/2 bg-slate-700 rounded" />
          <div className="h-9 w-1/2 bg-slate-700 rounded" />
        </div>
      </div>
    </div>
  )
}
