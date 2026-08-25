"use client"
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Check, RefreshCw, Target, Zap, IndianRupee, Star } from 'lucide-react'
import { predictColleges } from '../../lib/collegeData'
import { PredictorResult } from '../../lib/types'

const steps = [
  { id: 1, label: 'Choose Exam' },
  { id: 2, label: 'Rank & Category' },
  { id: 3, label: 'View Results' },
]

const examOptions = [
  { id: 'JEE Main', label: 'JEE Main', info: 'NITs, IIITs, GFTIs' },
  { id: 'JEE Advanced', label: 'JEE Advanced', info: 'IITs & top technical colleges' },
  { id: 'NEET', label: 'NEET', info: 'Medical colleges' },
]

const categories = ['General', 'OBC', 'SC', 'ST', 'EWS']

const chanceBuckets = [
  { title: 'High Chance', min: 80, max: 100, accent: 'from-emerald-500 to-teal-500' },
  { title: 'Good Chance', min: 50, max: 80, accent: 'from-amber-400 to-orange-500' },
  { title: 'Low Chance', min: 0, max: 50, accent: 'from-rose-500 to-fuchsia-500' },
]

export default function PredictorPage() {
  const [step, setStep] = useState(1)
  const [exam, setExam] = useState('JEE Main')
  const [rank, setRank] = useState('2500')
  const [category, setCategory] = useState('General')
  const [results, setResults] = useState<PredictorResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePredict = () => {
    const numericRank = Number(rank)
    if (!rank || Number.isNaN(numericRank) || numericRank <= 0) {
      setError('Please enter a valid rank greater than zero.')
      return
    }

    setError('')
    setLoading(true)

    window.setTimeout(() => {
      const input = {
        exam,
        rank: numericRank,
        score: 0,
        category,
        state: '',
        course: '',
      }
      const res = predictColleges(input as any)
      setResults(res.slice(0, 30))
      setLoading(false)
      setStep(3)
    }, 700)
  }

  const resetAll = () => {
    setStep(1)
    setExam('JEE Main')
    setRank('2500')
    setCategory('General')
    setResults([])
    setLoading(false)
    setError('')
  }

  return (
    <main className="relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 animate-gradient-xy opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(99,102,241,0.08), transparent 50%), radial-gradient(circle at 80% 70%, rgba(236,72,153,0.06), transparent 50%)', backgroundSize: '200% 200%' }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <Target className="w-3.5 h-3.5 text-electric-100" />
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Rank Predictor</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Predict your <span className="gradient-text-animated">Admission Chances</span>
            </h1>
            <p className="mt-3 text-sm max-w-2xl mx-auto" style={{ color: 'var(--text-tertiary)' }}>
              Use your exam rank and category to see which colleges you can target and how likely admission is.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.5fr_0.9fr]">
            <div className="space-y-8">
              <div className="relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 -z-10 mx-[16.6%]" style={{ backgroundColor: 'var(--border-subtle)' }}>
                  <motion.div className="h-full bg-gradient-to-r from-electric-100 to-accent-purple"
                    initial={false}
                    animate={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }} />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {steps.map((stepItem) => {
                    const done = step > stepItem.id
                    const active = step === stepItem.id
                    return (
                      <div key={stepItem.id} className={`relative rounded-[2rem] p-5 text-center transition-all duration-300 ${active ? 'bg-gradient-to-r from-electric-100 to-accent-purple shadow-glow-purple' : done ? 'bg-electric-100/10' : 'bg-[var(--bg-card)]'}`}
                        style={{ border: active ? 'none' : `1px solid ${done ? 'rgba(59,130,246,0.3)' : 'var(--border-subtle)'}` }}>
                        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em]"
                          style={{ color: active ? '#fff' : done ? 'var(--text-electric-100, #4B90FF)' : 'var(--text-muted)' }}>
                          {done ? <Check className="w-3.5 h-3.5" /> : null} Step {stepItem.id}
                        </div>
                        <div className="mt-3 text-sm font-medium" style={{ color: active ? '#fff' : 'var(--text-primary)' }}>{stepItem.label}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="exam" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                    <div className="rounded-[2rem] border border-white/10 bg-[var(--bg-card)] p-8 shadow-[0_40px_120px_-60px_rgba(0,0,0,0.5)]">
                      <div className="mb-6">
                        <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Choose your exam</h2>
                        <p className="text-sm text-[var(--text-tertiary)] mt-2">Pick the entrance exam you took so the predictor can use the appropriate cutoff logic.</p>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-3">
                        {examOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setExam(option.id)}
                            className={`rounded-[1.75rem] border p-5 text-left transition-all duration-300 ${exam === option.id ? 'border-electric-100 bg-electric-100/10 shadow-glow' : 'border-white/10 bg-[var(--bg-elevated)] hover:border-electric-100 hover:bg-white/5'}`}
                          >
                            <div className="text-sm font-semibold mb-2" style={{ color: exam === option.id ? '#4B90FF' : 'var(--text-primary)' }}>{option.label}</div>
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{option.info}</p>
                          </button>
                        ))}
                      </div>
                      <div className="mt-8 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-electric-100 to-accent-purple px-6 py-3 text-sm font-semibold text-white transition-all duration-500 hover:shadow-glow-purple btn-shine"
                        >
                          Continue <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="details" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                    <div className="rounded-[2rem] border border-white/10 bg-[var(--bg-card)] p-8 shadow-[0_40px_120px_-60px_rgba(0,0,0,0.5)]">
                      <div className="mb-6">
                        <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Rank & category</h2>
                        <p className="text-sm text-[var(--text-tertiary)] mt-2">Enter your exam rank and select the category you belong to.</p>
                      </div>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>Rank</label>
                          <div className="relative">
                            <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                            <input
                              type="number"
                              value={rank}
                              onChange={(e) => setRank(e.target.value)}
                              placeholder="e.g. 2500"
                              className="w-full rounded-[1.5rem] border border-white/10 bg-[var(--bg-elevated)] pl-11 pr-4 py-4 text-sm outline-none transition-all duration-300 focus:border-electric-100 focus:ring-2 focus:ring-electric-100/30"
                              style={{ color: 'var(--text-primary)' }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>Category</div>
                          <div className="grid grid-cols-2 gap-3">
                            {categories.map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => setCategory(option)}
                                className={`rounded-full border px-4 py-3 text-sm font-medium transition-all duration-300 ${category === option ? 'border-electric-100 bg-electric-100/10 text-electric-100' : 'border-white/10 bg-[var(--bg-elevated)] text-white/80 hover:border-electric-100 hover:bg-white/5'}`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}
                      <div className="mt-8 flex flex-col gap-3 sm:flex-row items-center justify-between pt-4 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-white/80 transition-all duration-300 hover:border-electric-100 hover:text-white"
                        >
                          ← Back
                        </button>
                        <button
                          type="button"
                          onClick={handlePredict}
                          disabled={loading}
                          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-electric-100 to-accent-purple px-6 py-3 text-sm font-semibold text-white transition-all duration-500 hover:shadow-glow-purple btn-shine disabled:opacity-50"
                        >
                          {loading ? (
                            <><RefreshCw className="w-4 h-4 animate-spin" /> Predicting...</>
                          ) : (
                            <><Zap className="w-4 h-4" /> Predict Now</>
                          )}
                        </button>
                      </div>
                      <p className="mt-5 text-xs text-[var(--text-tertiary)]">Predictions are indicative and depend on historical cutoff data and college ratings.</p>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                    <div className="rounded-[2rem] border border-white/10 bg-[var(--bg-card)] p-6 shadow-[0_40px_120px_-60px_rgba(0,0,0,0.5)] mb-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Your results</h2>
                          <p className="text-sm text-[var(--text-tertiary)] mt-2">{results.length} colleges match your profile.</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={resetAll}
                            className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-white/80 transition-all duration-300 hover:border-electric-100 hover:text-white"
                          >
                            Start Over
                          </button>
                          <button
                            type="button"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="rounded-full bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10"
                          >
                            Back to top
                          </button>
                        </div>
                      </div>

                      {results.length > 0 && (
                        <div className="mt-6 pt-5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                          <div className="flex h-2.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                            {chanceBuckets.map((bucket) => {
                              const count = results.filter((r) => r.chance >= bucket.min && r.chance < bucket.max).length
                              const pct = (count / results.length) * 100
                              return pct > 0 ? (
                                <motion.div key={bucket.title} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                                  className={`bg-gradient-to-r ${bucket.accent}`} title={`${bucket.title}: ${count}`} />
                              ) : null
                            })}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 mt-3">
                            {chanceBuckets.map((bucket) => {
                              const count = results.filter((r) => r.chance >= bucket.min && r.chance < bucket.max).length
                              return (
                                <div key={bucket.title} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                                  <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${bucket.accent}`} />
                                  {bucket.title} <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{count}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                      {chanceBuckets.map((bucket) => {
                        const bucketItems = results.filter((result) => result.chance >= bucket.min && result.chance < bucket.max)
                        return (
                          <div key={bucket.title} className="rounded-[2rem] border border-white/10 bg-[var(--bg-card)] p-5">
                            <div className="flex items-center justify-between mb-5">
                              <div>
                                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{bucket.title}</div>
                                <div className="text-[11px] text-[var(--text-tertiary)]">{bucketItems.length} colleges</div>
                              </div>
                              <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r ${bucket.accent}`}>
                                {bucketItems.length === 0 ? 'Empty' : `${bucketItems.length} listed`}
                              </span>
                            </div>

                            {bucketItems.length === 0 ? (
                              <div className="rounded-3xl border border-white/10 bg-[var(--bg-elevated)] p-5 text-sm text-[var(--text-tertiary)]">
                                No colleges in this bucket yet.
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {bucketItems.map((result) => (
                                  <Link
                                    key={result.college.id}
                                    href={`/colleges/${result.college.id}`}
                                    className="group block rounded-[1.75rem] border border-white/10 bg-[var(--bg-elevated)] p-5 transition-all duration-300 hover:border-electric-100 hover:shadow-glow relative overflow-hidden"
                                  >
                                    <span className="absolute top-4 right-4 rounded-full px-3 py-1 text-[11px] font-semibold text-white"
                                      style={{ backgroundColor: bucket.title === 'High Chance' ? '#10B981' : bucket.title === 'Good Chance' ? '#F59E0B' : '#F43F5E' }}>
                                      {result.chance}%
                                    </span>
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="min-w-0">
                                        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{result.college.name}</h3>
                                        <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{result.college.city}, {result.college.state}</p>
                                      </div>
                                      <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                                        {result.college.type}
                                      </span>
                                    </div>
                                    <div className="mt-4 grid gap-2 sm:grid-cols-2 text-[11px] text-[var(--text-tertiary)]">
                                      <div className="flex items-center gap-2">
                                        <IndianRupee className="w-3.5 h-3.5" />
                                        <span>₹{result.college.fees.toLocaleString()} / yr</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Star className="w-3.5 h-3.5 text-gold-100" />
                                        <span>{result.college.rating} rating</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span>{result.college.placementRate}% placement</span>
                                      </div>
                                      {result.previousCutoff !== undefined && (
                                        <div className="flex items-center gap-2">
                                          <span>Cutoff {result.previousCutoff}</span>
                                        </div>
                                      )}
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <aside className="space-y-4">
              <div className="rounded-[2rem] border border-white/10 bg-[var(--bg-card)] p-6">
                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>How it works</h3>
                <ul className="space-y-3 text-sm text-[var(--text-tertiary)]">
                  <li>1. Choose your exam from JEE Main, JEE Advanced, or NEET.</li>
                  <li>2. Enter your rank and category.</li>
                  <li>3. See colleges grouped by chance percentage.</li>
                </ul>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-[var(--bg-card)] p-6 text-sm text-[var(--text-tertiary)]">
                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Disclaimer</h3>
                <p>These results are indicative and based on historical cutoff data. They help narrow your target colleges, but do not guarantee admission.</p>
              </div>
            </aside>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
