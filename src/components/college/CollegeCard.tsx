'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { College, PredictorResult } from '@/types/college'
import { cardVariants } from '@/lib/utils/animations'
import { RatingBadge } from '@/components/ui'
import { FeeBadge, CollegeTypeBadge, RankBadge, ChanceBadge } from '@/components/ui'
import { useCompare } from '@/hooks/useCompare'

interface CollegeCardProps {
  college: College
  index?: number
  chanceResult?: PredictorResult
}

export function CollegeCard({ college, index = 0, chanceResult }: CollegeCardProps) {
  const { add, isSelected } = useCompare()

  const handleAddCompare = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isSelected(college.id)) {
      add(college)
    }
  }

  return (
    <motion.div
      layout
      variants={cardVariants(index)}
      initial="initial"
      animate="animate"
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      className="group relative bg-slate-800/50 backdrop-blur-md border border-white/5 hover:border-electric/30 rounded-2xl overflow-hidden shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-electric/10 transition-all duration-300"
    >
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-electric/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Hero Image */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={college.heroImage}
          alt={college.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent" />
        <div className="absolute top-3 right-3">
          <RankBadge rank={college.nirf} />
        </div>
        <div className="absolute bottom-3 left-3">
          <CollegeTypeBadge type={college.type} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4 relative z-10">
        <div>
          <h3 className="font-display font-bold text-xl text-slate-100 leading-tight mb-1 group-hover:text-electric transition-colors">
            {college.name}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-slate-400">
            <span>{college.location.city}</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span>{college.location.state}</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 bg-slate-700/50 px-2 py-1 rounded-lg">
            <RatingBadge rating={college.rating} className="text-[10px]" />
          </div>
          <div className="flex items-center gap-1.5 text-slate-300 bg-slate-700/30 px-2 py-1 rounded-lg">
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>{college.placements.placementRate}%</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300 bg-slate-700/30 px-2 py-1 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span>{college.placements.avgPackage} LPA</span>
          </div>
        </div>

        {/* Fees */}
        <div className="bg-slate-700/30 px-3 py-2 rounded-lg border border-slate-700/50">
          <FeeBadge min={college.fees.min} max={college.fees.max} />
        </div>

        {/* Exams */}
        <div className="flex flex-wrap gap-1.5">
          {college.exams.slice(0, 3).map((exam) => (
            <span
              key={exam}
              className="px-2 py-1 bg-slate-700/50 hover:bg-slate-700 rounded text-xs text-slate-300 border border-slate-700/50 transition-colors cursor-default"
            >
              {exam}
            </span>
          ))}
          {college.exams.length > 3 && (
            <span className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300 border border-slate-700/50">
              +{college.exams.length - 3}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Link
            href={`/colleges/${college.id}`}
            className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 group/btn"
          >
            View Details
            <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <button
            onClick={handleAddCompare}
            disabled={isSelected(college.id)}
            className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              isSelected(college.id)
                ? 'bg-green-900/30 text-green-400 border border-green-800 cursor-not-allowed'
                : 'bg-electric hover:bg-blue-600 text-navy-900 shadow-lg shadow-electric/20 hover:shadow-electric/40 hover:-translate-y-0.5'
            }`}
          >
            {isSelected(college.id) ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Added
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Compare
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
