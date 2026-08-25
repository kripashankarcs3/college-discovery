'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { usePredictor } from '@/hooks/usePredictor'
import { PredictorForm, PredictorResults } from '@/components/predictor'
import { PageTransition } from '@/components/shared'
import { pageVariants, cardVariants } from '@/lib/utils/animations'
import { colleges } from '@/lib/data/colleges'

export default function PredictorPage() {
  const { results, compute, isComputing } = usePredictor()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (input: any) => {
    compute(input)
    setSubmitted(true)
  }

  const resultCount = results.length
  const highCount = results.filter((r) => r.chance === 'High').length
  const mediumCount = results.filter((r) => r.chance === 'Medium').length
  const lowCount = results.filter((r) => r.chance === 'Low' || r.chance === 'Very Low').length

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 min-h-screen">
        {/* Header */}
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          className="mb-8"
        >
          <h1 className="text-4xl font-display font-bold text-slate-100 mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-500">
              Rank
            </span>{' '}
            Predictor
          </h1>
          <p className="text-slate-400">Check your admission chances at top Indian colleges</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
          >
            <div className="glass-panel p-6 md:p-8 rounded-2xl shadow-2xl shadow-black/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-electric to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-navy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-slate-100">Rank Predictor</h2>
                  <p className="text-xs text-slate-400">Calculate your admission chances</p>
                </div>
              </div>

              <PredictorForm onSubmit={handleSubmit} />

              {/* Success State */}
              {submitted && results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-slate-700/30 rounded-xl border border-slate-600/50"
                >
                  <h3 className="font-display font-bold text-slate-100 mb-4">Results Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-green-900/20 rounded-xl border border-green-900/30">
                      <div className="text-2xl font-display font-bold text-green-400">{highCount}</div>
                      <div className="text-xs text-green-300 mt-1">High Chance</div>
                    </div>
                    <div className="text-center p-4 bg-amber-900/20 rounded-xl border border-amber-900/30">
                      <div className="text-2xl font-display font-bold text-amber-400">{mediumCount}</div>
                      <div className="text-xs text-amber-300 mt-1">Good Chance</div>
                    </div>
                    <div className="text-center p-4 bg-red-900/20 rounded-xl border border-red-900/30">
                      <div className="text-2xl font-display font-bold text-red-400">{lowCount}</div>
                      <div className="text-xs text-red-300 mt-1">Low Chance</div>
                    </div>
                    <div className="text-center p-4 bg-slate-800 rounded-xl border border-slate-700">
                      <div className="text-2xl font-display font-bold text-slate-200">{resultCount}</div>
                      <div className="text-xs text-slate-400 mt-1">Total</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-4 text-center">
                    Results are based on historical cutoff data. Actual admission depends on various factors.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            {isComputing ? (
              <div className="glass-panel p-12 text-center rounded-2xl">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-electric to-purple-600 rounded-2xl mb-6 animate-pulse">
                  <svg className="w-8 h-8 text-navy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-display font-bold text-xl text-slate-100 mb-2">Analyzing Your Rank</h3>
                <p className="text-slate-400 text-sm">Cross-referencing with {colleges.length} colleges...</p>
              </div>
            ) : submitted && results.length > 0 ? (
              <PredictorResults results={results} />
            ) : (
              <div className="glass-panel p-12 text-center rounded-2xl h-full flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-gold to-yellow-500 rounded-3xl mb-6 shadow-2xl shadow-gold/20 flex items-center justify-center">
                  <svg className="w-10 h-10 text-navy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-display font-bold text-2xl text-slate-100 mb-3">Predict Your Chances</h3>
                <p className="text-slate-400 text-center max-w-xs">
                  Enter your exam rank and category to get personalized admission predictions
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
