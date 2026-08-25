"use client"
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, GraduationCap } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg mx-auto text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <GraduationCap className="w-10 h-10 text-electric-100" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>404 Error</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Page not found
          </h1>
          <p className="text-base max-w-sm mx-auto mb-8" style={{ color: 'var(--text-tertiary)' }}>
            The college you are looking for may have been removed, renamed, or the link may be incorrect.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/colleges" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-electric-100 to-accent-purple text-white font-semibold text-sm transition-all duration-500 hover:shadow-glow-purple btn-shine">
              <GraduationCap className="w-4 h-4" /> Browse Colleges
            </Link>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-500"
              style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
              <ArrowLeft className="w-4 h-4" /> Back Home
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
