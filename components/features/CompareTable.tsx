"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { College } from '../../lib/types'
import { Badge } from '../ui'
import { MapPin, IndianRupee, TrendingUp, Star, BookOpen, Crown } from 'lucide-react'

interface Props {
  colleges: College[]
}

const RowIcon = ({ icon: Icon, label }: { icon: React.ElementType; label: string }) => (
  <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
    <Icon className="w-4 h-4" />
    <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
  </div>
)

export const CompareTable: React.FC<Props> = ({ colleges }) => {
  if (!colleges || colleges.length < 2) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="p-12 rounded-2xl text-center" style={{ border: '1px dashed var(--border-default)', backgroundColor: 'var(--bg-elevated)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.1))', border: '1px solid var(--border-subtle)' }}>
            <BookOpen className="w-8 h-8 text-electric-100" />
          </div>
          <p className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>Select at least two colleges to compare</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Choose from the list on the left to get started.</p>
        </div>
      </motion.div>
    )
  }

  const bestFeesId = [...colleges].sort((a, b) => a.fees - b.fees)[0]?.id
  const bestPlacementId = [...colleges].sort((a, b) => b.placementRate - a.placementRate)[0]?.id
  const bestRatingId = [...colleges].sort((a, b) => b.rating - a.rating)[0]?.id

  const rows = [
    { label: 'Location', icon: MapPin, getValue: (c: College) => c.location },
    { label: 'Annual Fees', icon: IndianRupee, getValue: (c: College) => `₹${c.fees.toLocaleString('en-US')}`, highlight: true, gradient: 'from-gold-100 to-accent-orange', bestId: bestFeesId },
    { label: 'Placement Rate', icon: TrendingUp, getValue: (c: College) => `${c.placementRate}%`, colorize: true, bestId: bestPlacementId },
    { label: 'Rating', icon: Star, getValue: (c: College) => `${c.rating} / 5`, highlight: true, gradient: 'from-gold-100 to-accent-orange', bestId: bestRatingId },
    { label: 'Courses', icon: BookOpen, getValue: (c: College) => c.courses.slice(0, 3).join(', '), courses: true },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}>
      <div className="overflow-hidden rounded-2xl" style={{ border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-card)', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="min-w-[600px] w-full">
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-elevated)' }}>
                <th className="p-5 text-left text-xs font-semibold uppercase tracking-widest w-40" style={{ color: 'var(--text-muted)' }}>
                  Feature
                </th>
                {colleges.map((c) => (
                  <th key={c.id} className="p-5 text-left align-top min-w-[180px]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0" style={{ border: '1px solid var(--border-subtle)' }}>
                        <img src={c.image} alt="" className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none' }} />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-sm font-semibold gradient-text-electric leading-tight">{c.name}</span>
                        <span className="block text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{c.city}</span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <motion.tr
                  key={row.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className="transition-colors duration-300"
                  style={{ borderTop: '1px solid var(--border-subtle)', backgroundColor: index % 2 === 0 ? 'color-mix(in srgb, var(--bg-elevated) 40%, transparent)' : 'transparent' }}
                >
                  <td className="p-5">
                    <RowIcon icon={row.icon} label={row.label} />
                  </td>
                  {colleges.map((c) => (
                    <td key={c.id} className="p-5">
                      {row.courses ? (
                        <div className="flex flex-wrap gap-1.5">
                          {c.courses.slice(0, 3).map((course) => (
                            <Badge key={course} variant="default">
                              {course}
                            </Badge>
                          ))}
                          {c.courses.length > 3 && (
                            <Badge variant="default">+{c.courses.length - 3}</Badge>
                          )}
                        </div>
                      ) : row.colorize ? (
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold"
                          style={{ color: c.placementRate >= 80 ? '#34D399' : c.placementRate >= 60 ? '#FBBF24' : 'var(--text-secondary)' }}>
                          {row.getValue(c)}
                          {row.bestId === c.id && <Crown className="w-3.5 h-3.5 text-gold-100 fill-gold-100" />}
                        </span>
                      ) : row.highlight ? (
                        <span className={`inline-flex items-center gap-1.5 text-sm font-bold gradient-text bg-gradient-to-r ${row.gradient}`}>
                          {row.getValue(c)}
                          {row.bestId === c.id && <Crown className="w-3.5 h-3.5 text-gold-100 fill-gold-100" />}
                        </span>
                      ) : (
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{row.getValue(c)}</span>
                      )}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}

export default CompareTable
