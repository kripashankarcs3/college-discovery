"use client"
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Input, Button } from '../ui'
import { Search, MapPin, IndianRupee, RotateCcw } from 'lucide-react'

interface Filters {
  location?: string
  maxFees?: number
}

interface Props {
  onSearch: (query?: string, filters?: Filters) => void
}

export const SearchFilterBar: React.FC<Props> = ({ onSearch }) => {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [maxFees, setMaxFees] = useState<string>('')

  const handleSearch = () => {
    const filters: Filters = {}
    if (location.trim()) filters.location = location.trim()
    const mf = parseInt(maxFees || '', 10)
    if (!Number.isNaN(mf) && mf > 0) filters.maxFees = mf
    onSearch(query.trim(), filters)
  }

  const handleClear = () => {
    setQuery('')
    setLocation('')
    setMaxFees('')
    onSearch()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="rounded-2xl border border-white/[0.06] bg-glass-gradient backdrop-blur-2xl shadow-card relative overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-electric-100/[0.03] via-transparent to-accent-purple/[0.03] pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          {/* Search input */}
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search colleges, courses or locations..."
            icon={<Search className="w-4 h-4" />}
            className="py-3.5"
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Ghaziabad, Delhi"
              icon={<MapPin className="w-4 h-4" />}
            />
            <Input
              label="Max Annual Fees (INR)"
              value={maxFees}
              onChange={(e) => setMaxFees(e.target.value)}
              placeholder="e.g., 200000"
              type="number"
              icon={<IndianRupee className="w-4 h-4" />}
            />
            <div className="flex items-end gap-3 sm:col-span-2 lg:col-span-1">
              <motion.button
                onClick={handleSearch}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 rounded-xl bg-gradient-to-r from-electric-100 to-accent-purple text-white font-semibold text-sm px-6 py-3 transition-all duration-300 hover:shadow-glow-purple btn-shine flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search
              </motion.button>
              <motion.button
                onClick={handleClear}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 font-medium text-sm px-5 py-3 transition-all duration-300 hover:bg-white/[0.08] hover:text-white flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default SearchFilterBar
