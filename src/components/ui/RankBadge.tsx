import { Medal } from 'lucide-react'

export function RankBadge({ rank }: { rank: number }) {
  return (
    <div className="flex items-center gap-1 bg-navy-700 px-2 py-1 rounded text-sm">
      <Medal className="w-3 h-3 text-gold" />
      <span className="text-slate-100 font-bold">{rank}</span>
    </div>
  )
}
