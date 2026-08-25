export function formatFees(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`
  }
  return `₹${amount.toLocaleString('en-IN')}`
}

export function formatLPA(amount: number): string {
  return `${amount} LPA`
}

export function formatPercent(amount: number): string {
  return `${amount}%`
}
