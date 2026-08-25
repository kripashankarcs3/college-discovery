"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bookmark, Clock, BarChart3, Star, Trash2, ArrowRight, GraduationCap } from 'lucide-react'
import { getCollegeById } from '../../lib/api'
import { College } from '../../lib/types'

function CollegeRow({ id, index, savedIds, onRemove }: { id: string; index: number; savedIds: string[]; onRemove: (id: string) => void }) {
  const [college, setCollege] = useState<College | null>(null)

  useEffect(() => {
    getCollegeById(id).then(setCollege).catch(() => {})
  }, [id])

  if (!college) return null

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
      className="flex items-center justify-between p-4 rounded-xl transition-all duration-300"
      style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
      <Link href={`/colleges/${college.id}`} className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
          <img src={college.image} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium truncate hover:text-electric-100 transition-colors" style={{ color: 'var(--text-primary)' }}>{college.name}</div>
          <div className="text-xs flex items-center gap-2 mt-0.5" style={{ color: 'var(--text-muted)' }}>
            <span>{college.city}</span>
            <span>&middot;</span>
            <span>{college.rating} ★</span>
          </div>
        </div>
      </Link>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>₹{college.fees.toLocaleString('en-US')}</span>
        <button onClick={() => onRemove(college.id)} className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors">
          <Trash2 className="w-3.5 h-3.5 text-red-400" />
        </button>
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const [savedColleges, setSavedColleges] = useState<string[]>([])
  const [recentViews, setRecentViews] = useState<string[]>([])

  useEffect(() => {
    setSavedColleges(JSON.parse(localStorage.getItem('savedColleges') || '[]'))
    setRecentViews(JSON.parse(localStorage.getItem('recentViews') || '[]'))
  }, [])

  const handleRemove = (id: string) => {
    const updated = savedColleges.filter(s => s !== id)
    setSavedColleges(updated)
    localStorage.setItem('savedColleges', JSON.stringify(updated))
  }

  const clearAll = () => {
    setSavedColleges([])
    localStorage.setItem('savedColleges', '[]')
  }

  return (
    <main className="relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 animate-gradient-xy opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(99,102,241,0.08), transparent 50%), radial-gradient(circle at 80% 70%, rgba(236,72,153,0.06), transparent 50%)', backgroundSize: '200% 200%' }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <GraduationCap className="w-3.5 h-3.5 text-electric-100" />
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Dashboard</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                My <span className="gradient-text-electric">Dashboard</span>
              </h1>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>Manage your saved colleges and track your college journey.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: Bookmark, label: 'Saved Colleges', value: savedColleges.length, gradient: 'from-electric-100 to-accent-purple' },
              { icon: Clock, label: 'Recent Views', value: recentViews.length, gradient: 'from-accent-cyan to-electric-100' },
              { icon: BarChart3, label: 'Comparisons', value: 0, gradient: 'from-accent-purple to-accent-pink' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold gradient-text bg-gradient-to-r" style={{ backgroundImage: stat.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {stat.value}
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                    <stat.icon className="w-5 h-5 text-electric-100" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="rounded-2xl p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-display font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Bookmark className="w-5 h-5 text-electric-100" /> Saved Colleges
              </h2>
              {savedColleges.length > 0 && (
                <button onClick={clearAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 hover:bg-red-500/10"
                  style={{ color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <Trash2 className="w-3.5 h-3.5" /> Clear All
                </button>
              )}
            </div>

            {savedColleges.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                  <Bookmark className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
                </div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>No saved colleges yet</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Start exploring and save colleges you like!</p>
                <Link href="/colleges" className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-electric-100 to-accent-purple text-white text-sm font-semibold btn-shine">
                  Browse Colleges <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {savedColleges.map((id, i) => (
                  <CollegeRow key={id} id={id} index={i} savedIds={savedColleges} onRemove={handleRemove} />
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            {[
              { href: '/predictor', icon: BarChart3, label: 'College Predictor', desc: 'Check your admission chances' },
              { href: '/compare', icon: BarChart3, label: 'Compare Colleges', desc: 'Side-by-side comparison' },
            ].map((link, i) => (
              <Link key={i} href={link.href}
                className="group flex items-center justify-between rounded-2xl p-5 transition-all duration-500 card-hover-effect"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                    <link.icon className="w-5 h-5 text-electric-100" />
                  </div>
                  <div>
                    <div className="text-sm font-medium group-hover:text-electric-100 transition-colors" style={{ color: 'var(--text-primary)' }}>{link.label}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{link.desc}</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" style={{ color: 'var(--text-muted)' }} />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  )
}
