import { Star } from 'lucide-react'

export function RatingBadge({ rating, className = '' }: { rating: number; className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`} aria-label={`Rating: ${rating} out of 5`}>
      <Star className="w-4 h-4 text-gold fill-gold" />
      <span className="text-slate-100 font-semibold">{rating}</span>
    </div>
  )
}
