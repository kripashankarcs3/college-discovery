'use client'

import { Search, X, Filter } from 'lucide-react'
import { useFilterStore } from '@/lib/store/filterStore'
import { collegeCutoffs } from '@/lib/data/colleges'
import type { College } from '@/types/college'
import { colleges } from '@/lib/data/colleges'

// Extract unique states from colleges
const states = Array.from(new Set(colleges.map((c) => c.location.state))).sort()

export function SearchFilterBar() {
  const { filters, setFilter, resetFilters } = useFilterStore()

  const activeFilterCount = [
    filters.query,
    filters.type,
    filters.exam,
    filters.state,
    filters.nirf[0] !== 1 || filters.nirf[1] !== 1000,
    filters.fees[0] !== 0 || filters.fees[1] !== 50,
    filters.sortBy !== 'nirf',
  ].filter(Boolean).length

  const handleClearAll = () => {
    resetFilters()
  }

  return (
    <div className="glass-panel p-6 space-y-6 sticky top-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-electric" />
          <h3 className="font-display font-bold text-lg text-slate-100">Filters</h3>
        </div>
        {activeFilterCount > 0 && (
          <span className="px-2 py-1 bg-electric/20 text-electric text-xs font-bold rounded-lg">
            {activeFilterCount}
          </span>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm text-slate-400 mb-2 font-medium">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search colleges..."
            value={filters.query}
            onChange={(e) => setFilter('query', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-all"
          />
        </div>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Applied Filters</span>
            <button
              onClick={handleClearAll}
              className="text-xs text-electric hover:text-blue-400 font-medium transition-colors"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.type && (
              <div className="flex items-center gap-1 px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-200">
                Type: {filters.type}
                <button onClick={() => setFilter('type', '')} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {filters.exam && (
              <div className="flex items-center gap-1 px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-200">
                Exam: {filters.exam}
                <button onClick={() => setFilter('exam', '')} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {filters.state && (
              <div className="flex items-center gap-1 px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-200">
                State: {filters.state}
                <button onClick={() => setFilter('state', '')} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {(filters.nirf[0] !== 1 || filters.nirf[1] !== 1000) && (
              <div className="flex items-center gap-1 px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-200">
                NIRF: {filters.nirf[0]}-{filters.nirf[1]}
                <button onClick={() => setFilter('nirf', [1, 1000])} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {(filters.fees[0] !== 0 || filters.fees[1] !== 50) && (
              <div className="flex items-center gap-1 px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-200">
                Fees: ₹{filters.fees[0]}L-₹{filters.fees[1]}L
                <button onClick={() => setFilter('fees', [0, 50])} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filters Grid */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider">College Type</label>
          <select
            value={filters.type}
            onChange={(e) => setFilter('type', e.target.value as any)}
            className="w-full px-3 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-all"
          >
            <option value="">All Types</option>
            <option value="IIT">IIT</option>
            <option value="NIT">NIT</option>
            <option value="Private">Private</option>
            <option value="Deemed">Deemed</option>
            <option value="State">State</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider">Entrance Exam</label>
          <select
            value={filters.exam}
            onChange={(e) => setFilter('exam', e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-all"
          >
            <option value="">All Exams</option>
            <option value="JEE Main">JEE Main</option>
            <option value="JEE Advanced">JEE Advanced</option>
            <option value="NEET">NEET</option>
            <option value="CAT">CAT</option>
            <option value="GATE">GATE</option>
            <option value="CLAT">CLAT</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider">State</label>
          <select
            value={filters.state}
            onChange={(e) => setFilter('state', e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-all"
          >
            <option value="">All States</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilter('sortBy', e.target.value as any)}
            className="w-full px-3 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-all"
          >
            <option value="nirf">NIRF Rank (Low to High)</option>
            <option value="rating">Rating (High to Low)</option>
            <option value="fees">Fees (Low to High)</option>
            <option value="placement">Average Package (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="pt-4 border-t border-slate-800">
        <p className="text-xs text-slate-500 text-center">
          Showing results from {colleges.length} colleges
        </p>
      </div>
    </div>
  )
}
