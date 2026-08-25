export function CollegeTypeBadge({ type }: { type: 'IIT' | 'NIT' | 'Private' | 'Deemed' | 'State' }) {
  const colors = {
    IIT: 'bg-blue-900/30 text-blue-400 border-blue-800',
    NIT: 'bg-indigo-900/30 text-indigo-400 border-indigo-800',
    Private: 'bg-purple-900/30 text-purple-400 border-purple-800',
    Deemed: 'bg-teal-900/30 text-teal-400 border-teal-800',
    State: 'bg-slate-700 text-slate-300 border-slate-600',
  }

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${colors[type]}`}>
      {type}
    </span>
  )
}
