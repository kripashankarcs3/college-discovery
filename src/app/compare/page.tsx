'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCompareStore } from '@/lib/store/compareStore'
import { CompareTable } from '@/components/compare'
import { CollegeCard } from '@/components/college'
import { colleges } from '@/lib/data/colleges'
import { PageTransition } from '@/components/shared'
import { pageVariants } from '@/lib/utils/animations'

export default function ComparePage() {
  const { colleges: selected, removeCollege, clearCompare } = useCompareStore()
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false)

  // Find colleges that aren't selected
  const unselectedColleges = colleges.filter((c) => !selected.some((s) => s.id === c.id))

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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric to-gold">
              College
            </span>{' '}
            Comparison
          </h1>
          <p className="text-slate-400">Compare up to 3 colleges side-by-side</p>
        </motion.div>

        {selected.length < 2 ? (
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-electric/10 to-purple-600/10 rounded-3xl mb-6">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="text-2xl font-display font-bold text-slate-100 mb-4">Select Colleges to Compare</h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Add at least 2 colleges to compare their features, fees, placements, and more.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <div className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 text-sm">
                IIT Bombay vs IIT Delhi
              </div>
              <div className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 text-sm">
                VIT vs Manipal
              </div>
              <div className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 text-sm">
                DTU vs NSUT
              </div>
            </div>

            {unselectedColleges.length > 0 && (
              <>
                <h4 className="text-lg font-display font-bold text-slate-100 mb-6">Add Colleges:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {unselectedColleges.slice(0, 9).map((college) => (
                    <motion.div
                      key={college.id}
                      whileHover={{ y: -5 }}
                      className="transform transition-all duration-300"
                    >
                      <CollegeCard college={college} />
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
          >
            {/* Compare Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {selected.slice(0, 3).map((college, i) => (
                    <div
                      key={college.id}
                      className="w-10 h-10 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-slate-200 relative z-10"
                      title={college.name}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-slate-400">
                  {selected.length} of 3 colleges selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowOnlyDifferences(!showOnlyDifferences)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showOnlyDifferences
                      ? 'bg-electric/20 text-electric'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Show differences only
                </button>
                <button
                  onClick={clearCompare}
                  className="px-4 py-2 bg-slate-700 hover:bg-red-900/30 hover:text-red-400 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Comparison Table */}
            <CompareTable colleges={selected} />

            <div className="mt-12 text-center">
              <p className="text-slate-500 text-sm">
                * Values highlighted in gold represent the best option in that category
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  )
}
