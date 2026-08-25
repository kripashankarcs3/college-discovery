import React from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'premium' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  className?: string
  asChild?: boolean
  loading?: boolean
}

const base =
  'inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-100/50 disabled:opacity-50 disabled:pointer-events-none select-none'

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-electric-100 to-accent-purple text-white hover:shadow-glow-purple hover:scale-[1.02] active:scale-[0.98] btn-shine',
  secondary:
    'bg-white/10 text-white border border-white/10 hover:bg-white/20 hover:border-white/20 backdrop-blur-sm active:scale-[0.98]',
  ghost:
    'bg-transparent text-electric-100 hover:bg-white/5',
  premium:
    'bg-gradient-to-r from-accent-indigo via-accent-purple to-accent-pink text-white hover:shadow-glow-purple-lg hover:scale-[1.02] active:scale-[0.98] btn-shine',
  outline:
    'border border-white/20 text-white hover:bg-white/10 hover:border-white/40 backdrop-blur-sm active:scale-[0.98]',
}

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs gap-1.5',
  md: 'px-6 py-3 text-sm gap-2',
  lg: 'px-8 py-4 text-base gap-2.5',
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  asChild = false,
  loading = false,
  children,
  disabled,
  ...rest
}) => {
  const Component = asChild ? 'span' : 'button'

  return (
    <Component
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </Component>
  )
}

export default Button
