"use client"
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { getColleges } from '../../lib/api'
import { College } from '../../lib/types'
import CompareTable from '../../components/features/CompareTable'
import { Input, Button } from '../../components/ui'
import { Search, Plus, X, BarChart3, GraduationCap, ArrowLeft } from 'lucide-react'

export default function ComparePage() {
  const [options, setOptions] = useState<College[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [results, setResults] = useState<College[]>([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    getColleges().then((c) => setOptions(c))
  }, [])

  useEffect(() => {
    const res = options.filter((o) => selected.includes(o.id))
    setResults(res)
  }, [selected, options])

  const toggle = (id: string) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id].slice(0, 3)))
  }

  const filteredOptions = options.filter(
    (o) => o.name.toLowerCase().includes(query.toLowerCase()) || o.location.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <main className="relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 animate-gradient-xy opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(99,102,241,0.08), transparent 50%), radial-gradient(circle at 80% 70%, rgba(236,72,153,0.06), transparent 50%)', backgroundSize: '200% 200%' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
          {/* Hero */}
          <section className="relative rounded-2xl p-6 sm:p-8 overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <BarChart3 className="w-3.5 h-3.5 text-electric-100" />
                  <span className="text-xs font-medium text-electric-100">Compare Tool</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  Side-by-Side <span className="gradient-text-animated">Comparisons</span>
                </h1>
                <p className="mt-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>Select 2-3 colleges to compare fees, placements, ratings, and more.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                      style={{ backgroundColor: i < selected.length ? undefined : 'var(--bg-elevated)', backgroundImage: i < selected.length ? 'linear-gradient(135deg, #3B82F6, #8B5CF6)' : undefined, border: i < selected.length ? 'none' : '1px solid var(--border-default)' }} />
                  ))}
                </div>
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#93C5FD', border: '1px solid rgba(59,130,246,0.2)' }}>
                  {selected.length} of 3 selected
                </span>
              </div>
            </div>
          </section>

          {/* Grid */}
          <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
            {/* Left Panel */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
              className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div className="p-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search colleges..." icon={<Search className="w-4 h-4" />} />
              </div>
              <div className="p-3 max-h-[500px] overflow-y-auto scrollbar-thin space-y-2">
                <AnimatePresence mode="popLayout">
                  {filteredOptions.map((o) => (
                    <motion.div key={o.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}>
                      <motion.button onClick={() => toggle(o.id)} whileHover={{ scale: 1.01, x: 2 }} whileTap={{ scale: 0.99 }}
                        disabled={!selected.includes(o.id) && selected.length >= 3}
                        className="w-full flex items-center gap-3 rounded-xl p-3 transition-all duration-300 text-left disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ backgroundColor: selected.includes(o.id) ? 'rgba(59,130,246,0.08)' : 'var(--bg-elevated)', border: `1px solid ${selected.includes(o.id) ? 'rgba(59,130,246,0.3)' : 'var(--border-subtle)'}` }}>
                        <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0" style={{ border: '1px solid var(--border-subtle)' }}>
                          <img src={o.image} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.visibility = 'hidden' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>{o.name}</div>
                          <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{o.location}</div>
                        </div>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0 ${
                          selected.includes(o.id) ? 'bg-electric-100/20 text-electric-100' : ''
                        }`} style={{ backgroundColor: selected.includes(o.id) ? undefined : 'var(--bg-card)' }}>
                          {selected.includes(o.id) ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
                        </div>
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {filteredOptions.length === 0 && (
                  <p className="text-center text-sm py-8" style={{ color: 'var(--text-muted)' }}>No colleges found</p>
                )}
              </div>
            </motion.div>

            {/* Right Panel */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
              <div className="rounded-2xl p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <div className="mb-6">
                  <AnimatePresence mode="popLayout">
                    {selected.length === 0 ? (
                      <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        Pick at least two colleges to start comparing.
                      </motion.div>
                    ) : (
                      <motion.div key="selected" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex flex-wrap items-center gap-2">
                        {selected.map((id) => {
                          const college = options.find((o) => o.id === id)
                          return (
                            <motion.button key={id} layout initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                              onClick={() => toggle(id)}
                              className="group flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full transition-all duration-300 hover:shadow-glow"
                              style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#93C5FD', border: '1px solid rgba(59,130,246,0.2)' }}>
                              {college?.image && (
                                <span className="w-6 h-6 rounded-full overflow-hidden shrink-0" style={{ border: '1px solid rgba(59,130,246,0.3)' }}>
                                  <img src={college.image} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.visibility = 'hidden' }} />
                                </span>
                              )}
                              <span className="text-sm font-medium">{college?.name ?? id}</span>
                              <X className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                            </motion.button>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <CompareTable colleges={results} />
              </div>
            </motion.div>
          </section>
        </motion.div>
      </div>
    </main>
  )
}
