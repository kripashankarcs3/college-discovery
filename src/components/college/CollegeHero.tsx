'use client'

import { motion } from 'framer-motion'
import type { College } from '@/types/college'
import { RankBadge, CollegeTypeBadge } from '@/components/ui'
import { useCompare } from '@/hooks/useCompare'

interface CollegeHeroProps {
  college: College
}

export function CollegeHero({ college }: CollegeHeroProps) {
  const { add, isSelected, selected } = useCompare()

  const handleAddCompare = () => {
    if (!isSelected(college.id)) {
      add(college)
    }
  }

  return (
    <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-6">
      <img
        src={college.heroImage}
        alt={college.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/50 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <div className="container mx-auto flex flex-col md:flex-row items-start md:items-end gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-5xl font-display font-bold text-slate-100 mb-2">
              {college.name}
            </h1>
            <div className="flex items-center gap-2 text-slate-300">
              <span>{college.location.city}</span>
              <span>•</span>
              <span>{college.location.state}</span>
              <span>•</span>
              <span>Established: {college.established}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <CollegeTypeBadge type={college.type} />
            <RankBadge rank={college.nirf} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="container mx-auto mt-6"
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="px-4 py-2 bg-slate-800/50 rounded-lg">
              <span className="text-slate-400 text-sm">Rating</span>
              <div className="text-xl font-bold text-slate-100">{college.rating}/5</div>
            </div>
            <div className="px-4 py-2 bg-slate-800/50 rounded-lg">
              <span className="text-slate-400 text-sm">Avg Package</span>
              <div className="text-xl font-bold text-slate-100">{college.placements.avgPackage} LPA</div>
            </div>
            <div className="px-4 py-2 bg-slate-800/50 rounded-lg">
              <span className="text-slate-400 text-sm">Courses</span>
              <div className="text-xl font-bold text-slate-100">{college.courses.length}</div>
            </div>
            <div className="px-4 py-2 bg-slate-800/50 rounded-lg">
              <span className="text-slate-400 text-sm">Fees</span>
              <div className="text-xl font-bold text-slate-100">
                ₹{(college.fees.min / 100000).toFixed(1)}L - ₹{(college.fees.max / 100000).toFixed(1)}L
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="container mx-auto mt-6 flex gap-3"
        >
          {isSelected(college.id) ? (
            <button
              disabled
              className="px-6 py-2 bg-slate-700 text-slate-400 rounded-lg font-medium cursor-not-allowed"
            >
              Added to Compare
            </button>
          ) : selected.length >= 3 ? (
              <span
                className="px-6 py-2 bg-slate-700 text-slate-400 rounded-lg font-medium cursor-not-allowed"
                title="Maximum 3 colleges allowed for comparison"
              >
                Add to Compare
              </span>
          ) : (
            <button
              onClick={handleAddCompare}
              className="px-6 py-2 bg-electric hover:bg-blue-600 text-navy-900 rounded-lg font-medium transition-colors"
            >
              Add to Compare
            </button>
          )}
          <button className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg font-medium transition-colors">
            Save
          </button>
        </motion.div>
      </div>
    </div>
  )
}
