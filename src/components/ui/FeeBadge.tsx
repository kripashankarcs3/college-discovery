export function FeeBadge({ min, max }: { min: number; max: number }) {
  // Convert INR to lakhs for display
  const minLPA = (min / 100000).toFixed(1)
  const maxLPA = (max / 100000).toFixed(1)

  // Determine color based on max fee tier
  const maxLakhs = max / 100000
  let colorClass = 'text-green-400'
  if (maxLakhs > 3) colorClass = 'text-red-400'
  else if (maxLakhs > 1) colorClass = 'text-gold'

  return (
    <span className={`text-sm font-semibold ${colorClass}`}>
      ₹{minLPA}L – ₹{maxLPA}L
    </span>
  )
}
