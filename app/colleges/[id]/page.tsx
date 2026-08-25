"use client"
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState, use } from 'react'
import { getCollegeById } from '../../../lib/api'
import { getCollegeBySlug, colleges as allCollegesData } from '../../../lib/collegeData'
import { Button } from '../../../components/ui'
import { College } from '../../../lib/types'
import { 
  ArrowLeft, MapPin, TrendingUp, Star, IndianRupee, BookOpen, Bookmark, 
  ExternalLink, Calendar, Shield, Award, Phone, Mail, Globe, CheckCircle, 
  ChevronRight, GraduationCap, AlertTriangle, RefreshCw, Building2, Users,
  Microscope, Medal, Timer, PartyPopper, Award as AwardIcon
} from 'lucide-react'

function MetricCard({ icon: Icon, label, value, badgeStyle }: { icon: React.ElementType; label: string; value: string; badgeStyle?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, x: 2 }}
      className="flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-300 group"
      style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
        >
          <Icon className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
        </div>
        <span className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      </div>

      {badgeStyle ? (
        <span className={`text-xs sm:text-sm font-bold px-2.5 py-1 rounded-lg ${badgeStyle}`}>
          {value}
        </span>
      ) : (
        <span className="text-xs sm:text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {value}
        </span>
      )}
    </motion.div>
  )
}

function ErrorState({ message, onRetry, recommendations }: { message: string; onRetry: () => void; recommendations: { id: string; name: string; city: string; rating: number; fees: number; placementRate: number; image: string; type: string }[] }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        <AlertTriangle className="w-10 h-10 text-gold-100" />
      </div>
      <h2 className="text-2xl font-display font-bold mb-2" style={{ color: 'var(--text-primary)' }}>College Not Found</h2>
      <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'var(--text-tertiary)' }}>{message}</p>
      <div className="flex items-center justify-center gap-3 mb-12">
        <button onClick={onRetry} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-electric-100 to-accent-purple text-white text-sm font-semibold btn-shine">
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
        <Link href="/colleges" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
          Browse All Colleges
        </Link>
      </div>

      <div className="text-left">
        <h3 className="text-lg font-display font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <GraduationCap className="w-5 h-5 text-electric-100" /> Recommended Colleges
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {recommendations.map((rec, i) => (
            <Link key={rec.id} href={`/colleges/${rec.id}`}
              className="group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 card-hover-effect"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                <img src={rec.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate group-hover:text-electric-100 transition-colors" style={{ color: 'var(--text-primary)' }}>{rec.name}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{rec.city}</div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs font-semibold gradient-text-gold">₹{rec.fees.toLocaleString('en-US')}</span>
                  <span className="text-xs text-accent-emerald">{rec.placementRate}%</span>
                  <span className="flex items-center gap-0.5 text-xs"><Star className="w-3 h-3 text-gold-100 fill-gold-100" />{rec.rating}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: 'var(--text-muted)' }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CollegeDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [college, setCollege] = useState<College | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const fetchCollege = () => {
    setLoading(true)
    setError(null)
    getCollegeById(id)
      .then((c) => {
        setCollege(c)
        try {
          const recent = JSON.parse(localStorage.getItem('recentViews') || '[]')
          const updated = [id, ...recent.filter((r: string) => r !== id)].slice(0, 10)
          localStorage.setItem('recentViews', JSON.stringify(updated))
        } catch {}
      })
      .catch((err) => {
        setCollege(null)
        setError(err?.message || 'Could not load college details')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchCollege() }, [id])

  useEffect(() => {
    try {
      const savedList = JSON.parse(localStorage.getItem('savedColleges') || '[]')
      setSaved(savedList.includes(id))
    } catch {}
  }, [id])

  const toggleSave = () => {
    try {
      const savedList = JSON.parse(localStorage.getItem('savedColleges') || '[]')
      if (saved) {
        const updated = savedList.filter((s: string) => s !== id)
        localStorage.setItem('savedColleges', JSON.stringify(updated))
        setSaved(false)
      } else {
        localStorage.setItem('savedColleges', JSON.stringify([...savedList, id]))
        setSaved(true)
      }
    } catch {}
  }

  if (loading) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="skeleton-pulse h-8 w-48 rounded-xl mb-6" />
          <div className="skeleton-pulse h-80 rounded-2xl mb-8" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton-pulse h-20 rounded-xl" />)}
          </div>
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="skeleton-pulse h-96 rounded-2xl" />
            <div className="skeleton-pulse h-96 rounded-2xl" />
          </div>
        </div>
      </main>
    )
  }

  if (error || !college) {
    const recommendations = allCollegesData
      .filter(c => c.id !== id)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6)
      .map(c => ({ id: c.id, name: c.name, city: c.city, rating: c.rating, fees: c.fees, placementRate: c.placementRate, image: c.image, type: c.type }))

    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <ErrorState message={error || 'This college could not be found. It may have been removed or the link may be incorrect.'} onRetry={fetchCollege} recommendations={recommendations} />
      </main>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'courses', label: 'Courses & Fees' },
    { id: 'admission', label: 'Admission' },
    { id: 'placement', label: 'Placements' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'reviews', label: 'Reviews' },
  ]

  return (
    <main className="relative overflow-hidden min-h-screen">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/colleges" className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium transition-colors mb-3 hover:text-electric-100 group" style={{ color: 'var(--text-tertiary)' }}>
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Colleges
          </Link>

          {/* Premium Hero Section */}
          <section className="overflow-hidden rounded-2xl mb-5 relative transition-all duration-500 shadow-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <div className="relative h-60 sm:h-80 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-black/40 to-transparent z-10" />
              <motion.img
                src={college.image}
                alt={college.name}
                className="w-full h-full object-cover"
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800' }}
              />
              
              {/* Top Badges */}
              <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-xl bg-black/40 border border-white/15 text-xs font-medium text-white shadow-md">
                    <Building2 className="w-3.5 h-3.5 text-electric-100" />
                    <span>{college.type}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-xl bg-black/40 border border-white/15 text-xs font-medium text-white shadow-md">
                    <Calendar className="w-3.5 h-3.5 text-accent-cyan" />
                    <span>Est. {college.established}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-xl bg-black/50 border border-amber-400/30 text-xs font-bold text-amber-300 shadow-md">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{college.rating} / 5</span>
                </div>
              </div>

              {/* Bottom Overlaid Title Info */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                    {college.approval.map(a => (
                      <span key={a} className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle className="w-3 h-3 text-emerald-400" /> {a}
                      </span>
                    ))}
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold tracking-tight text-white drop-shadow-md">
                    {college.name}
                  </h1>
                  <div className="flex items-center gap-1.5 mt-1 text-white/80 text-xs sm:text-sm font-medium">
                    <MapPin className="w-3.5 h-3.5 text-electric-100 shrink-0" />
                    <span>{college.location}, {college.state}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={toggleSave}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs sm:text-sm transition-all active:scale-95 shadow-md"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-electric-100 text-electric-100' : ''}`} />
                    <span>{saved ? 'Saved' : 'Save'}</span>
                  </button>

                  <button
                    onClick={() => window.open(college.contact?.website || '#', '_blank')}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-electric-100 via-accent-purple to-accent-pink hover:opacity-95 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-electric-100/20 transition-all hover:scale-105 active:scale-95 btn-shine"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Apply Now</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Premium Metric Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            {/* Card 1: Annual Fees */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="relative overflow-hidden rounded-2xl p-5 group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Annual Fees</span>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <IndianRupee className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-display font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                ₹{college.fees.toLocaleString('en-US')}
              </div>
              <div className="text-xs mt-2 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                <span>Avg course tuition / year</span>
              </div>
            </motion.div>

            {/* Card 2: Avg Package */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="relative overflow-hidden rounded-2xl p-5 group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-electric-100 via-accent-cyan to-accent-purple" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Avg Package</span>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20 text-electric-100">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-display font-bold tracking-tight gradient-text-cyber">
                ₹{(college.placementAverage / 100000).toFixed(1)} LPA
              </div>
              <div className="text-xs mt-2 flex items-center gap-1 text-emerald-400">
                <span>Highest CTC: ₹{(college.placementHighest / 100000).toFixed(1)} LPA</span>
              </div>
            </motion.div>

            {/* Card 3: Placement Rate */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="relative overflow-hidden rounded-2xl p-5 group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Placement Rate</span>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-emerald-400">
                {college.placementRate}%
              </div>
              <div className="w-full bg-emerald-500/10 rounded-full h-1.5 mt-3 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{ width: `${college.placementRate}%` }} />
              </div>
            </motion.div>

            {/* Card 4: Rating */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="relative overflow-hidden rounded-2xl p-5 group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Rating</span>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-display font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {college.rating} <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>/ 5</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(college.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Premium Floating Tabs Navigation */}
          <div className="mb-5 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1.5 p-1.5 rounded-2xl w-max sm:w-full justify-start sm:justify-between"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              {tabs.map(tab => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="relative px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 whitespace-nowrap z-10 flex items-center gap-2"
                    style={{ color: isActive ? '#fff' : 'var(--text-secondary)' }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeCollegeTab"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-electric-100 to-accent-purple shadow-lg shadow-electric-100/25 -z-10"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              {activeTab === 'overview' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="relative overflow-hidden rounded-2xl p-6 sm:p-8 group/card"
                  style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                  <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 blur-3xl" style={{ backgroundColor: 'rgba(99,102,241,0.04)' }} />
                  <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <span className="w-1 h-6 rounded-full bg-gradient-to-b from-electric-100 to-accent-purple inline-block" />
                    Overview
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{college.overview}</p>

                  {/* Campus Stats */}
                  {(college.campusSize || college.totalStudents || college.facultyCount) && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
                      {college.campusSize && (
                        <div className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                          <Building2 className="w-5 h-5 mx-auto mb-1.5 text-electric-100" />
                          <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{college.campusSize}</div>
                          <div className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>Campus Size</div>
                        </div>
                      )}
                      {college.totalStudents && (
                        <div className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                          <Users className="w-5 h-5 mx-auto mb-1.5 text-accent-emerald" />
                          <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{college.totalStudents.toLocaleString('en-US')}+</div>
                          <div className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>Students</div>
                        </div>
                      )}
                      {college.facultyCount && (
                        <div className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                          <Microscope className="w-5 h-5 mx-auto mb-1.5 text-accent-purple" />
                          <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{college.facultyCount}+</div>
                          <div className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>Faculty</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Accreditation */}
                  {college.accreditation && (
                    <div className="mt-6">
                      <h3 className="text-sm font-display font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Accreditation</h3>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#34D399', border: '1px solid rgba(16,185,129,0.2)' }}>
                        <Award className="w-3.5 h-3.5" /> {college.accreditation}
                      </span>
                    </div>
                  )}

                  {college.ranking && Object.keys(college.ranking).length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-display font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Rankings</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {Object.entries(college.ranking).map(([key, val]) => (
                          <div key={key} className="text-center p-3.5 rounded-xl border transition-all duration-300 hover:scale-105"
                            style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
                            <div className="text-lg font-extrabold text-indigo-400">#{val}</div>
                            <div className="text-[11px] uppercase font-semibold tracking-wider mt-0.5" style={{ color: 'var(--text-secondary)' }}>{key}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Annual Events */}
                  {college.annualEvents && college.annualEvents.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-display font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Annual Events</h3>
                      <div className="flex flex-wrap gap-2">
                        {college.annualEvents.map((event, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                            <PartyPopper className="w-3 h-3 text-electric-100" /> {event}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notable Alumni */}
                  {college.notableAlumni && college.notableAlumni.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-display font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Notable Alumni</h3>
                      <div className="space-y-2">
                        {college.notableAlumni.map((alum, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                            <Medal className="w-4 h-4 shrink-0 text-gold-100" />
                            <span>{alum}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {college.contact && (
                    <div className="mt-6 space-y-2">
                      <h3 className="text-sm font-display font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Contact</h3>
                      <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-tertiary)' }}><Phone className="w-3.5 h-3.5" /> {college.contact.phone}</div>
                      <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-tertiary)' }}><Mail className="w-3.5 h-3.5" /> {college.contact.email}</div>
                      <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-tertiary)' }}><Globe className="w-3.5 h-3.5" /> {college.contact.website}</div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'courses' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="relative overflow-hidden rounded-2xl p-6 sm:p-8 group/card"
                  style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                  <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 blur-3xl" style={{ backgroundColor: 'rgba(251,191,36,0.04)' }} />
                  <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <span className="w-1 h-6 rounded-full bg-gradient-to-b from-gold-100 to-orange-500 inline-block" />
                    Courses Offered
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {college.courses.map((course, index) => (
                      <span key={course}
                        className="px-4 py-2 rounded-xl text-sm transition-all duration-300 cursor-default"
                        style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>
                        {course}
                      </span>
                    ))}
                  </div>

                  {/* Course-wise Fee Breakdown */}
                  {college.courseFees && college.courseFees.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-display font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Course-wise Fee Structure</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr style={{ backgroundColor: 'var(--bg-elevated)' }}>
                              <th className="p-3 text-left font-medium" style={{ color: 'var(--text-tertiary)' }}>Course</th>
                              <th className="p-3 text-left font-medium" style={{ color: 'var(--text-tertiary)' }}>Duration</th>
                              <th className="p-3 text-right font-medium" style={{ color: 'var(--text-tertiary)' }}>Total Fees</th>
                            </tr>
                          </thead>
                          <tbody>
                            {college.courseFees.map((cf, i) => (
                              <tr key={i} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                                <td className="p-3 font-medium" style={{ color: 'var(--text-primary)' }}>{cf.name}</td>
                                <td className="p-3" style={{ color: 'var(--text-secondary)' }}>{cf.duration}</td>
                                <td className="p-3 text-right font-semibold gradient-text-gold">{cf.totalFees}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {college.hostelFees && (
                    <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                      <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Hostel & Accommodation</span>
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{college.hostelFees}</span>
                    </div>
                  )}

                  <div className="mt-4">
                    <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                      <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Average Annual Fees</span>
                      <span className="text-lg font-bold gradient-text-gold">₹{college.fees.toLocaleString('en-US')}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'placement' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="relative overflow-hidden rounded-2xl p-6 sm:p-8 group/card"
                  style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                  <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 blur-3xl" style={{ backgroundColor: 'rgba(16,185,129,0.04)' }} />
                  <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <span className="w-1 h-6 rounded-full bg-gradient-to-b from-accent-emerald to-emerald-700 inline-block" />
                    Placements
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-5 rounded-xl" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Placement Rate</div>
                      <div className="text-2xl font-bold text-accent-emerald mt-1">{college.placementRate}%</div>
                    </div>
                    <div className="text-center p-5 rounded-xl" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Average Package</div>
                      <div className="text-2xl font-bold gradient-text-gold mt-1">₹{(college.placementAverage / 100000).toFixed(1)}L</div>
                    </div>
                    <div className="text-center p-5 rounded-xl" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Highest Package</div>
                      <div className="text-2xl font-bold gradient-text-electric mt-1">₹{(college.placementHighest / 100000).toFixed(1)}L</div>
                    </div>
                  </div>

                  {/* Top Recruiters */}
                  {college.topRecruiters && college.topRecruiters.length > 0 && (
                    <div>
                      <h3 className="text-sm font-display font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Top Recruiters</h3>
                      <div className="flex flex-wrap gap-2">
                        {college.topRecruiters.map((company, i) => (
                          <span key={i} className="px-4 py-2 rounded-xl text-xs font-medium transition-all hover:shadow-md"
                            style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>
                            {company}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'facilities' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="relative overflow-hidden rounded-2xl p-6 sm:p-8 group/card"
                  style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                  <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 blur-3xl" style={{ backgroundColor: 'rgba(6,182,212,0.04)' }} />
                  <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <span className="w-1 h-6 rounded-full bg-gradient-to-b from-cyan-500 to-cyan-700 inline-block" />
                    Facilities
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {college.facilities.map((fac, i) => (
                      <motion.div key={fac} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                        <CheckCircle className="w-4 h-4 text-accent-emerald shrink-0" />
                        <span className="text-xs" style={{ color: 'var(--text-primary)' }}>{fac}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="relative overflow-hidden rounded-2xl p-6 sm:p-8 group/card"
                  style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                  <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 blur-3xl" style={{ backgroundColor: 'rgba(244,63,94,0.04)' }} />
                  <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <span className="w-1 h-6 rounded-full bg-gradient-to-b from-rose-500 to-rose-700 inline-block" />
                    Student Reviews
                  </h2>
                  {college.reviews && college.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {college.reviews.map((review, i) => (
                        <div key={i} className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{review.name}</span>
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{review.date}</span>
                          </div>
                          <div className="flex gap-1 mb-2">
                            {Array.from({ length: review.rating }).map((_, j) => (
                              <Star key={j} className="w-3.5 h-3.5 fill-gold-100 text-gold-100" />
                            ))}
                          </div>
                          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No reviews yet for this college.</p>
                  )}
                </motion.div>
              )}

              {activeTab === 'admission' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="relative overflow-hidden rounded-2xl p-6 sm:p-8 group/card"
                  style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                  <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 blur-3xl" style={{ backgroundColor: 'rgba(168,85,247,0.04)' }} />
                  <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <span className="w-1 h-6 rounded-full bg-gradient-to-b from-accent-purple to-purple-700 inline-block" />
                    Admission Process
                  </h2>
                  <div className="space-y-3 mb-6">
                    {[
                      'Fill the application form available on the official website.',
                      'Appear for the required entrance examination (if applicable).',
                      'Meet the cutoff criteria for your category.',
                      'Participate in the counselling process.',
                      'Complete document verification and pay the admission fee.',
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                        <div className="w-7 h-7 rounded-full bg-electric-100/10 text-electric-100 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                        <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{step}</span>
                      </div>
                    ))}
                  </div>

                  {/* Important Dates */}
                  {college.importantDates && college.importantDates.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-display font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Important Dates</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr style={{ backgroundColor: 'var(--bg-elevated)' }}>
                              <th className="p-3 text-left font-medium" style={{ color: 'var(--text-tertiary)' }}>Event</th>
                              <th className="p-3 text-right font-medium" style={{ color: 'var(--text-tertiary)' }}>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {college.importantDates.map((d, i) => (
                              <tr key={i} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                                <td className="p-3" style={{ color: 'var(--text-primary)' }}>{d.event}</td>
                                <td className="p-3 text-right font-medium" style={{ color: 'var(--text-secondary)' }}>{d.date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {college.cutoffs && college.cutoffs.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-display font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Previous Cutoffs</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr style={{ backgroundColor: 'var(--bg-elevated)' }}>
                              <th className="p-3 text-left font-medium" style={{ color: 'var(--text-tertiary)' }}>Exam</th>
                              <th className="p-3 text-left font-medium" style={{ color: 'var(--text-tertiary)' }}>Year</th>
                              <th className="p-3 text-left font-medium" style={{ color: 'var(--text-tertiary)' }}>Round</th>
                              <th className="p-3 text-left font-medium" style={{ color: 'var(--text-tertiary)' }}>Cutoff Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {college.cutoffs.map((c, i) => (
                              <tr key={i} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                                <td className="p-3" style={{ color: 'var(--text-primary)' }}>{c.exam}</td>
                                <td className="p-3" style={{ color: 'var(--text-primary)' }}>{c.year}</td>
                                <td className="p-3" style={{ color: 'var(--text-primary)' }}>Round {c.round}</td>
                                <td className="p-3 font-semibold" style={{ color: 'var(--text-primary)' }}>{c.score}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl p-6 group/card" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 blur-3xl" style={{ backgroundColor: 'rgba(99,102,241,0.04)' }} />
                <h3 className="text-base font-display font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <span className="w-1 h-5 rounded-full bg-gradient-to-b from-electric-100 to-accent-purple inline-block" />
                  Key Metrics
                </h3>
                <div className="space-y-2.5">
                  <MetricCard icon={IndianRupee} label="Annual Fees" value={`₹${college.fees.toLocaleString('en-US')}`} badgeStyle="bg-amber-500/10 text-amber-400 border border-amber-500/20" />
                  <MetricCard icon={TrendingUp} label="Placement Rate" value={`${college.placementRate}%`} badgeStyle="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" />
                  <MetricCard icon={TrendingUp} label="Avg Package" value={`₹${(college.placementAverage / 100000).toFixed(1)}L`} badgeStyle="bg-indigo-500/10 text-electric-100 border border-indigo-500/20" />
                  <MetricCard icon={TrendingUp} label="Highest Package" value={`₹${(college.placementHighest / 100000).toFixed(1)}L`} badgeStyle="bg-purple-500/10 text-purple-400 border border-purple-500/20" />
                  <MetricCard icon={Star} label="Rating" value={`${college.rating} / 5`} badgeStyle="bg-amber-500/10 text-amber-300 border border-amber-500/20" />
                  <MetricCard icon={MapPin} label="Location" value={college.city} />
                  <MetricCard icon={BookOpen} label="Courses" value={`${college.courses.length} courses`} />
                  <MetricCard icon={Calendar} label="Established" value={`${college.established}`} />
                  <MetricCard icon={Shield} label="Type" value={college.type} />
                </div>
              </div>

              <Link href="/predictor"
                className="group flex items-center justify-between rounded-2xl p-5 transition-all duration-500 hover:scale-[1.02]"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', backgroundImage: 'linear-gradient(135deg, rgba(99,102,241,0.04), transparent)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(99,102,241,0.1)' }}>
                    <TrendingUp className="w-4 h-4 text-electric-100" />
                  </div>
                  <span className="text-sm font-medium transition-colors group-hover:text-electric-100" style={{ color: 'var(--text-primary)' }}>
                    Check Admission Chances
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" style={{ color: 'var(--text-muted)' }} />
              </Link>

              <Link href="/compare"
                className="group flex items-center justify-between rounded-2xl p-5 transition-all duration-500 hover:scale-[1.02]"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', backgroundImage: 'linear-gradient(135deg, rgba(251,191,36,0.04), transparent)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(251,191,36,0.1)' }}>
                    <Award className="w-4 h-4 text-gold-100" />
                  </div>
                  <span className="text-sm font-medium transition-colors group-hover:text-electric-100" style={{ color: 'var(--text-primary)' }}>
                    Compare with Others
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" style={{ color: 'var(--text-muted)' }} />
              </Link>

              {college.contact?.website && (
                <a href={college.contact.website} target="_blank" rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-2xl p-5 transition-all duration-500 hover:scale-[1.02]"
                  style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', backgroundImage: 'linear-gradient(135deg, rgba(16,185,129,0.04), transparent)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}>
                      <Globe className="w-4 h-4 text-accent-emerald" />
                    </div>
                    <span className="text-sm font-medium transition-colors group-hover:text-accent-emerald" style={{ color: 'var(--text-primary)' }}>
                      Visit Official Website
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" style={{ color: 'var(--text-muted)' }} />
                </a>
              )}

              {college.cutoffs && college.cutoffs.length > 0 && (
                <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Entrance Exams</h4>
                  <div className="flex flex-wrap gap-2">
                    {[...new Set(college.cutoffs.map(c => c.exam))].map(exam => (
                      <span key={exam} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: 'rgba(99,102,241,0.08)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                        {exam}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.aside>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
