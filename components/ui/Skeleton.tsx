import React from 'react'

interface SkeletonProps {
  className?: string
  variant?: 'default' | 'card' | 'circle'
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'default' }) => {
  const variants = {
    default: 'rounded-xl',
    card: 'rounded-2xl',
    circle: 'rounded-full',
  }

  return (
    <div
      className={`skeleton-pulse ${variants[variant]} ${className}`}
      aria-hidden="true"
    />
  )
}

export default Skeleton
