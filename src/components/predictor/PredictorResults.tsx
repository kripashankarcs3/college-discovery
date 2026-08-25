'use client'

import { motion } from 'framer-motion'
import type { PredictorResult } from '@/types/college'
import { cardVariants } from '@/lib/utils/animations'
import { CollegeCard } from '@/components/college'
import { ChanceBadge } from '@/components/ui'

interface PredictorResultsProps {
  results: PredictorResult[]
}

export function PredictorResults({ results }: PredictorResultsProps) {
  if (results.length === 0) {
    return <div className="text-center py-12 text-slate-400">No results to display</div>
  }

  // Group by chance
  const highChance = results.filter((r) => r.chance === 'High')
  const goodChance = results.filter((r) => r.chance === 'Medium')
  const lowChance = results.filter((r) => r.chance === 'Low' || r.chance === 'Very Low')

  return (
    <div className="space-y-8">
      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* High Chance Column */}
        <div className="bg-green-900/20 rounded-xl p-4 border border-green-900/50">
          <h3 className="text-lg font-display font-bold text-green-400 mb-4">High Chance ({highChance.length})</h3>
          <div className="space-y-3">
            {highChance.map((result, index) => (
              <motion.div
                key={result.college.id}
                variants={cardVariants(index)}
                initial="initial"
                animate="animate"
              >
                <div className="relative">
                  <ChanceBadge chance="High" />
                  <div className="text-xs text-green-300 mt-1">
                    {result.chancePercent}% probability
                  </div>
                </div>
                <div className="mt-2">
                  <CollegeCard college={result.college} chanceResult={result} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Good Chance Column */}
        <div className="bg-amber-900/20 rounded-xl p-4 border border-amber-900/50">
          <h3 className="text-lg font-display font-bold text-amber-400 mb-4">Good Chance ({goodChance.length})</h3>
          <div className="space-y-3">
            {goodChance.map((result, index) => (
              <motion.div
                key={result.college.id}
                variants={cardVariants(index)}
                initial="initial"
                animate="animate"
              >
                <div className="relative">
                  <ChanceBadge chance="Medium" />
                  <div className="text-xs text-amber-300 mt-1">
                    {result.chancePercent}% probability
                  </div>
                </div>
                <div className="mt-2">
                  <CollegeCard college={result.college} chanceResult={result} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Low Chance Column */}
        <div className="bg-red-900/20 rounded-xl p-4 border border-red-900/50">
          <h3 className="text-lg font-display font-bold text-red-400 mb-4">Low Chance ({lowChance.length})</h3>
          <div className="space-y-3">
            {lowChance.map((result, index) => (
              <motion.div
                key={result.college.id}
                variants={cardVariants(index)}
                initial="initial"
                animate="animate"
              >
                <div className="relative">
                  <ChanceBadge chance={result.chance} />
                  <div className="text-xs text-red-300 mt-1">
                    {result.chancePercent}% probability
                  </div>
                </div>
                <div className="mt-2">
                  <CollegeCard college={result.college} chanceResult={result} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-4 justify-center text-center">
        <div className="px-6 py-3 bg-slate-800/50 rounded-lg">
          <div className="text-2xl font-bold text-slate-100">{results.length}</div>
          <div className="text-sm text-slate-400">Colleges Analyzed</div>
        </div>
        <div className="px-6 py-3 bg-slate-800/50 rounded-lg">
          <div className="text-2xl font-bold text-green-400">{highChance.length}</div>
          <div className="text-sm text-slate-400">High Chance</div>
        </div>
        <div className="px-6 py-3 bg-slate-800/50 rounded-lg">
          <div className="text-2xl font-bold text-amber-400">{goodChance.length}</div>
          <div className="text-sm text-slate-400">Good Chance</div>
        </div>
        <div className="px-6 py-3 bg-slate-800/50 rounded-lg">
          <div className="text-2xl font-bold text-red-400">{lowChance.length}</div>
          <div className="text-sm text-slate-400">Low Chance</div>
        </div>
      </div>
    </div>
  )
}
