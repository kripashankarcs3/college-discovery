"use client"

export function LogoIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-600 shadow-md shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105 ${className}`}>
      {/* Graduation Cap & Discovery Sparkle Vector Logo */}
      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12.2v4.8c0 1.8 4.2 2.8 6 2.8s6-1 6-2.8v-4.8" />
      </svg>
      {/* Compass/Discovery Pulse Indicator */}
      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-white dark:border-slate-900 shadow-sm" />
    </div>
  )
}

export default function Logo({ size = "normal" }: { size?: "normal" | "large" }) {
  const isLarge = size === "large"
  return (
    <div className="flex items-center gap-2.5 group">
      <LogoIcon className={isLarge ? "w-9 h-9" : "w-8 h-8"} />
      <div className="flex flex-col">
        <span className={`font-display font-extrabold tracking-tight ${isLarge ? "text-lg sm:text-xl" : "text-base sm:text-lg"}`} style={{ color: 'var(--text-primary)' }}>
          College<span className="text-indigo-600 dark:text-indigo-400">Discovery</span>
        </span>
      </div>
    </div>
  )
}
