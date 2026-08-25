import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  className?: string
  icon?: React.ReactNode
}

export const Input: React.FC<InputProps> = ({ label, className = '', icon, ...rest }) => {
  return (
    <div className="w-full">
      {label ? (
        <label className="block text-xs font-medium text-slate-400 mb-1.5 tracking-wide uppercase">
          {label}
        </label>
      ) : null}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            {icon}
          </div>
        )}
        <input
          className={`w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 backdrop-blur-sm transition-all duration-300 focus:border-electric-100/50 focus:outline-none focus:ring-2 focus:ring-electric-100/20 focus:bg-white/[0.07] hover:border-white/20 ${
            icon ? 'pl-10' : ''
          } ${className}`}
          {...rest}
        />
        <div className="absolute inset-0 rounded-xl pointer-events-none border border-white/5" />
      </div>
    </div>
  )
}

export default Input
