import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'premium' | 'success' | 'warning' | 'info'
}

const variants = {
  default: 'border border-[var(--border-subtle)]',
  premium: 'bg-gradient-to-r from-electric-100/20 to-accent-purple/20 text-electric-100 border border-electric-100/20',
  success: 'bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20',
  warning: 'bg-gold-50/10 text-gold-100 border border-gold-100/20',
  info: 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20',
}

export const Badge: React.FC<BadgeProps> = ({ children, className = '', variant = 'default' }) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm ${variants[variant]} ${className}`}
    style={variant === 'default' ? { backgroundColor: 'var(--bg-elevated)', color: 'var(--text-secondary)' } : undefined}
  >
    {children}
  </span>
)

export default Badge
