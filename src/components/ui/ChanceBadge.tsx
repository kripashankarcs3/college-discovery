export function ChanceBadge({ chance }: { chance: 'High' | 'Medium' | 'Low' | 'Very Low' }) {
  const colors = {
    High: 'bg-green-900/30 text-green-400 border-green-800',
    Medium: 'bg-amber-900/30 text-amber-400 border-amber-800',
    Low: 'bg-red-900/30 text-red-400 border-red-800',
    'Very Low': 'bg-slate-700 text-slate-300 border-slate-600',
  }

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${colors[chance]}`}>
      {chance} Chance
    </span>
  )
}
