import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'glass' | 'premium'
  hover?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'glass',
  hover = false,
  ...rest
}) => {
  const variants = {
    default: 'bg-midnight-200 border border-white/10',
    glass:
      'bg-glass-gradient backdrop-blur-2xl border border-white/10 shadow-card',
    premium:
      'bg-glass-gradient backdrop-blur-2xl border border-white/10 shadow-card gradient-border',
  }

  return (
    <div
      className={`rounded-2xl ${variants[variant]} ${
        hover
          ? 'transition-all duration-500 hover:shadow-elevation-4 hover:-translate-y-1 hover:border-white/20'
          : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}

export default Card
