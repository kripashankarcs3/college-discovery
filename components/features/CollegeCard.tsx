"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { College } from '../../lib/types'
import { MapPin, IndianRupee, TrendingUp, Star, Award, ArrowRight, Heart, GitCompare, GraduationCap, Sparkles } from 'lucide-react'

interface Props {
  college: College
}

function StatPill({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string; accent: string }) {
  return (
    <div className="flex items-center gap-2 p-2.5 rounded-xl transition-all duration-300 hover:scale-[1.03]" style={{ backgroundColor: 'var(--bg-elevated)' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)` }}>
        <Icon className="w-4 h-4" style={{ color: accent }} />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{value}</div>
        <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</div>
      </div>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
      <div className="aspect-[16/10] skeleton-pulse" />
      <div className="p-5 space-y-4">
        <div className="skeleton-pulse h-5 w-3/4 rounded-lg" />
        <div className="skeleton-pulse h-3 w-1/2 rounded-lg" />
        <div className="skeleton-pulse h-3 w-full rounded-lg" />
        <div className="flex gap-2">
          <div className="skeleton-pulse h-7 w-16 rounded-lg" />
          <div className="skeleton-pulse h-7 w-20 rounded-lg" />
          <div className="skeleton-pulse h-7 w-14 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="skeleton-pulse h-14 rounded-xl" />
          <div className="skeleton-pulse h-14 rounded-xl" />
          <div className="skeleton-pulse h-14 rounded-xl" />
          <div className="skeleton-pulse h-14 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export const CollegeCard: React.FC<Props> = ({ college }) => {
  const [saved, setSaved] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const nirfRank = college.ranking?.nirf

  useEffect(() => {
    try {
      const savedList = JSON.parse(localStorage.getItem('savedColleges') || '[]')
      setSaved(savedList.includes(college.id))
    } catch {}
  }, [college.id])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative"
    >
      <div className="relative rounded-[20px] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25)] hover:-translate-y-1.5"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[20px] pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.06), transparent 60%, rgba(236,72,153,0.04))' }} />
        <div className="absolute -inset-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[21px] pointer-events-none -z-10"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), transparent 50%, rgba(236,72,153,0.15))' }} />

        {/* Image Section */}
        <Link href={`/colleges/${college.id}`} className="block relative aspect-[16/10] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-electric-100/8 to-accent-purple/8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
          {!imgLoaded && (
            <div className="absolute inset-0 skeleton-pulse z-0" />
          )}
          <img
            src={college.image}
            alt={`${college.name} campus`}
            className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=375&fit=crop'
              setImgLoaded(true)
            }}
          />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 z-20 flex items-start justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {nirfRank && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md"
                  style={{ backgroundColor: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.08)', color: '#FCD34D' }}>
                  <Award className="w-3 h-3" /> NIRF #{nirfRank}
                </div>
              )}
              {college.placementRate >= 90 && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md"
                  style={{ backgroundColor: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.08)', color: '#34D399' }}>
                  <Sparkles className="w-3 h-3" /> Featured
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md shrink-0"
              style={{ backgroundColor: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Star className="w-3.5 h-3.5 text-gold-100 fill-gold-100" />
              <span className="text-white">{college.rating}</span>
            </div>
          </div>

          {/* Bottom Gradient Info */}
          <div className="absolute bottom-3 left-3 z-20">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium backdrop-blur-md"
              style={{ backgroundColor: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)' }}>
              <GraduationCap className="w-3 h-3" /> {college.type}
            </div>
          </div>
        </Link>

        {/* Content Section */}
        <div className="p-5 space-y-4">
          {/* Name & Location */}
          <Link href={`/colleges/${college.id}`} className="block group/link">
            <h3 className="text-lg font-display font-bold leading-tight transition-colors duration-300 group-hover/link:text-electric-100"
              style={{ color: 'var(--text-primary)' }}>
              {college.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm truncate" style={{ color: 'var(--text-tertiary)' }}>{college.city}, {college.state}</p>
            </div>
          </Link>

          {/* Description */}
          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-tertiary)' }}>
            {college.overview}
          </p>

          {/* Course Pills */}
          <div className="flex flex-wrap gap-1.5">
            {college.courses.slice(0, 3).map((course) => (
              <span key={course} className="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors duration-300"
                style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                {course}
              </span>
            ))}
            {college.courses.length > 3 && (
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium"
                style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>
                +{college.courses.length - 3}
              </span>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2">
            <StatPill icon={IndianRupee} label="Annual Fees" value={`₹${(college.fees / 1000).toFixed(0)}K`} accent="#F59E0B" />
            <StatPill icon={TrendingUp} label="Avg Package" value={`₹${(college.placementAverage / 100000).toFixed(1)}L`} accent="#10B981" />
            <StatPill icon={Award} label={nirfRank ? `NIRF #${nirfRank}` : 'Ranking'} value={nirfRank ? `#${nirfRank}` : '—'} accent="#8B5CF6" />
            <StatPill icon={Star} label="Rating" value={`${college.rating}/5`} accent="#F59E0B" />
          </div>

          {/* Action Area */}
          <div className="pt-2 space-y-2.5">
            <Link href={`/colleges/${college.id}`} className="block">
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 btn-shine"
                style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
              >
                Explore College
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </motion.div>
            </Link>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  try {
                    const savedList = JSON.parse(localStorage.getItem('savedColleges') || '[]')
                    if (saved) {
                      localStorage.setItem('savedColleges', JSON.stringify(savedList.filter((s: string) => s !== college.id)))
                      setSaved(false)
                    } else {
                      localStorage.setItem('savedColleges', JSON.stringify([...savedList, college.id]))
                      setSaved(true)
                    }
                  } catch {}
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 ${
                  saved ? 'shadow-sm' : 'hover:shadow-sm'
                }`}
                style={{
                  backgroundColor: saved ? 'rgba(239,68,68,0.1)' : 'var(--bg-elevated)',
                  color: saved ? '#EF4444' : 'var(--text-secondary)',
                  border: `1px solid ${saved ? 'rgba(239,68,68,0.2)' : 'var(--border-subtle)'}`
                }}
              >
                <Heart className={`w-3.5 h-3.5 transition-all duration-300 ${saved ? 'fill-current scale-110' : ''}`} />
                {saved ? 'Saved' : 'Save'}
              </button>
              <Link href={`/compare?ids=${college.id}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 hover:shadow-sm"
                style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                <GitCompare className="w-3.5 h-3.5" />
                Compare
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CollegeCard
