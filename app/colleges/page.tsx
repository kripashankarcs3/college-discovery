"use client"
import React, { useEffect, useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getColleges, searchExternalColleges } from '../../lib/api'
import { College } from '../../lib/types'
import CollegeCard from '../../components/features/CollegeCard'
import { Skeleton } from '../../components/ui'
import { Search, MapPin, IndianRupee, SlidersHorizontal, X, GraduationCap, AlertCircle, SearchX, Grid3X3, List, ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, TrendingUp, Star } from 'lucide-react'

function CollegesContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState(initialQuery)
  const [location, setLocation] = useState('')
  const [maxFees, setMaxFees] = useState('')
  const [collegeType, setCollegeType] = useState('')
  const [minRating, setMinRating] = useState('')
  const [minPlacement, setMinPlacement] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState(1)
  const [externalResults, setExternalResults] = useState<{ name: string; state: string; city: string }[]>([])
  const itemsPerPage = 10

  const fetch = async (q?: string, extraFilters?: any) => {
    setLoading(true)
    setError(null)
    setExternalResults([])
    try {
      const filters: any = { ...extraFilters }
      if (location.trim()) filters.location = location.trim()
      const mf = parseInt(maxFees || '', 10)
      if (!Number.isNaN(mf) && mf > 0) filters.maxFees = mf
      const res = await getColleges(q || query, filters)

      let filtered = res
      if (collegeType) filtered = filtered.filter(c => c.type.toLowerCase() === collegeType.toLowerCase())
      if (minRating) filtered = filtered.filter(c => c.rating >= parseFloat(minRating))
      if (minPlacement) filtered = filtered.filter(c => c.placementRate >= parseFloat(minPlacement))

      filtered.sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating
        if (sortBy === 'fees') return a.fees - b.fees
        if (sortBy === 'placement') return b.placementRate - a.placementRate
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        return 0
      })

      setColleges(filtered)

      if (filtered.length === 0 && (q || query)) {
        const ext = await searchExternalColleges(q || query, filters.location)
        setExternalResults(ext)
      }

      setPage(1)
    } catch (err: any) {
      setError(err?.message || 'Failed to load colleges')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialQuery) {
      fetch(initialQuery)
    } else {
      fetch()
    }
  }, [])

  useEffect(() => {
    if (!loading) fetch()
  }, [sortBy])

  const clearFilters = () => {
    setLocation('')
    setMaxFees('')
    setCollegeType('')
    setMinRating('')
    setMinPlacement('')
    setQuery('')
    fetch('')
  }

  const hasFilters = location || maxFees || collegeType || minRating || minPlacement
  const totalPages = Math.ceil(colleges.length / itemsPerPage)
  const paginatedColleges = colleges.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  return (
    <main className="relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 animate-gradient-xy opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(99,102,241,0.08), transparent 50%), radial-gradient(circle at 80% 70%, rgba(236,72,153,0.06), transparent 50%)', backgroundSize: '200% 200%' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
        {/* Hero */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="relative rounded-2xl p-6 sm:p-8 overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                <GraduationCap className="w-3.5 h-3.5 text-electric-100" />
                <span className="text-xs font-medium text-electric-100">College Finder</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Explore <span className="gradient-text-animated">{(colleges.length).toLocaleString('en-US')}+</span> Colleges
              </h1>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>Government, private and deemed institutions across India — search, filter and compare.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-center px-4 py-2.5 rounded-xl" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center justify-center gap-1 text-lg font-bold gradient-text-gold"><Star className="w-4 h-4 text-gold-100 fill-gold-100" />4.3</div>
                <div className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>Avg Rating</div>
              </div>
              <div className="text-center px-4 py-2.5 rounded-xl" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center justify-center gap-1 text-lg font-bold text-accent-emerald"><TrendingUp className="w-4 h-4" />85%</div>
                <div className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>Avg Placement</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Search & Filters */}
        <div className="rounded-2xl p-5 sm:p-6 space-y-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetch()}
                placeholder="Search colleges, courses or locations..."
                className="w-full rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-electric-100/40"
                style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }} />
            </div>
            <button onClick={() => fetch()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-electric-100 to-accent-purple text-white font-semibold text-sm transition-all duration-300 hover:shadow-glow-purple btn-shine">
              Search
            </button>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                showFilters || hasFilters ? 'bg-electric-100/10 text-electric-100 border-electric-100/30' : ''
              }`}
              style={{ backgroundColor: showFilters || hasFilters ? undefined : 'var(--bg-elevated)', color: showFilters || hasFilters ? undefined : 'var(--text-tertiary)', border: '1px solid var(--border-subtle)' }}>
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {hasFilters && <span className="w-5 h-5 rounded-full bg-electric-100 text-white text-xs flex items-center justify-center font-bold">!</span>}
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-tertiary)' }}>Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                      <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City or State"
                        className="w-full rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none transition-all duration-300 focus:ring-2 focus:ring-electric-100/40"
                        style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-tertiary)' }}>Max Fees</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                      <input type="number" value={maxFees} onChange={(e) => setMaxFees(e.target.value)} placeholder="e.g., 200000"
                        className="w-full rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none transition-all duration-300 focus:ring-2 focus:ring-electric-100/40"
                        style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-tertiary)' }}>College Type</label>
                    <select value={collegeType} onChange={(e) => setCollegeType(e.target.value)}
                      className="w-full rounded-xl px-3 py-2.5 text-xs outline-none transition-all duration-300 focus:ring-2 focus:ring-electric-100/40 cursor-pointer"
                      style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>
                      <option value="">All Types</option>
                      <option value="Government">Government</option>
                      <option value="Private">Private</option>
                      <option value="Deemed">Deemed</option>
                      <option value="Central">Central</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-tertiary)' }}>Min Rating</label>
                    <select value={minRating} onChange={(e) => setMinRating(e.target.value)}
                      className="w-full rounded-xl px-3 py-2.5 text-xs outline-none transition-all duration-300 focus:ring-2 focus:ring-electric-100/40 cursor-pointer"
                      style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>
                      <option value="">Any Rating</option>
                      <option value="4.5">4.5+</option>
                      <option value="4.0">4.0+</option>
                      <option value="3.5">3.5+</option>
                      <option value="3.0">3.0+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-tertiary)' }}>Placement %</label>
                    <select value={minPlacement} onChange={(e) => setMinPlacement(e.target.value)}
                      className="w-full rounded-xl px-3 py-2.5 text-xs outline-none transition-all duration-300 focus:ring-2 focus:ring-electric-100/40 cursor-pointer"
                      style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>
                      <option value="">Any Placement</option>
                      <option value="90">90%+</option>
                      <option value="80">80%+</option>
                      <option value="70">70%+</option>
                      <option value="60">60%+</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 mt-4">
                  {hasFilters && (
                    <button onClick={clearFilters}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 hover:bg-white/[0.06]"
                      style={{ color: 'var(--text-tertiary)', border: '1px solid var(--border-subtle)' }}>
                      <X className="w-3.5 h-3.5" /> Clear All
                    </button>
                  )}
                  <button onClick={() => { setShowFilters(false); fetch() }}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-electric-100 to-accent-purple text-white text-xs font-semibold btn-shine">
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              {paginatedColleges.length > 0 ? `Showing ${paginatedColleges.length} of ${colleges.length} colleges` : externalResults.length > 0 ? `${externalResults.length} colleges found` : '0 colleges'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl px-3 py-2 text-xs outline-none cursor-pointer transition-all duration-300 focus:ring-2 focus:ring-electric-100/40 hover:border-electric-100/40"
              style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
              <option value="rating">Sort by Rating</option>
              <option value="fees">Sort by Fees (Low)</option>
              <option value="placement">Sort by Placement</option>
              <option value="name">Sort by Name</option>
            </select>
            <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-card)' }}>
              <button onClick={() => setViewMode('grid')}
                className={`p-2.5 transition-all duration-300 ${viewMode === 'grid' ? 'bg-gradient-to-r from-electric-100 to-accent-purple text-white' : 'hover:bg-white/[0.06]'}`}
                style={{ color: viewMode === 'grid' ? undefined : 'var(--text-muted)' }}>
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode('list')}
                className={`p-2.5 transition-all duration-300 ${viewMode === 'list' ? 'bg-gradient-to-r from-electric-100 to-accent-purple text-white' : 'hover:bg-white/[0.06]'}`}
                style={{ color: viewMode === 'list' ? undefined : 'var(--text-muted)' }}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid gap-5 grid-cols-1 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-2xl" variant="card" />
              ))}
            </motion.div>
          ) : error ? (
            <motion.div key="error" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="rounded-2xl p-8" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <div className="flex items-center gap-3"><AlertCircle className="w-5 h-5 text-red-400" /><p className="text-red-400 text-sm">{error}</p></div>
            </motion.div>
          ) : paginatedColleges.length === 0 && externalResults.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-2xl p-16 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                <SearchX className="w-8 h-8 text-electric-100" />
              </div>
              <p className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>No colleges found</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Try adjusting your search or filters.</p>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {viewMode === 'grid' ? (
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                  {paginatedColleges.map((c) => <CollegeCard key={c.id} college={c} />)}
                </div>
              ) : (
                <div className="space-y-3">
                  {paginatedColleges.map((c) => (
                    <CollegeCard key={c.id} college={c} />
                  ))}
                </div>
              )}

              {paginatedColleges.length === 0 && externalResults.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pt-4">
                    <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-subtle)' }} />
                    <span className="text-xs font-medium px-3" style={{ color: 'var(--text-tertiary)' }}>More colleges from our database</span>
                    <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-subtle)' }} />
                  </div>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {externalResults.slice(0, 12).map((c, i) => (
                      <div key={i} className="rounded-xl p-4 transition-all duration-300 hover:shadow-md"
                        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                        <p className="text-sm font-medium line-clamp-2" style={{ color: 'var(--text-primary)' }}>{c.name}</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>{c.city}, {c.state}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    disabled={page === 1}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:-translate-x-0.5"
                    style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}
                    aria-label="Previous page">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition-all duration-300 ${
                        page === p ? 'bg-gradient-to-r from-electric-100 to-accent-purple text-white shadow-glow' : 'hover:-translate-y-0.5'
                      }`}
                      style={{ backgroundColor: page === p ? undefined : 'var(--bg-card)', color: page === p ? undefined : 'var(--text-secondary)', border: page === p ? 'none' : '1px solid var(--border-subtle)' }}>
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    disabled={page === totalPages}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:translate-x-0.5"
                    style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}
                    aria-label="Next page">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

export default function CollegesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-electric-100 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CollegesContent />
    </Suspense>
  )
}
