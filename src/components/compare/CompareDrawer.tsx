'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useCompareStore } from '@/lib/store/compareStore'
import Link from 'next/link'
import type { College } from '@/types/college'

export function CompareDrawer() {
  const { colleges: selected, removeCollege } = useCompareStore()

  return (
    <AnimatePresence>
      {selected.length > 0 && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-40"
        >
          <div className="bg-navy-900/95 backdrop-blur-md border-t border-slate-700 p-4">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-slate-100 font-semibold mb-2">Selected Colleges ({selected.length}/3)</h3>
                  <div className="flex flex-wrap gap-2">
                    {selected.map((college) => (
                      <div key={college.id} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg">
                        <div className="w-8 h-8 bg-electric rounded flex items-center justify-center text-navy-900 font-bold text-xs">
                          {college.shortName.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm text-slate-200">{college.shortName}</span>
                        <button
                          onClick={() => removeCollege(college.id)}
                          className="text-slate-400 hover:text-red-400 ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <Link
                  href="/compare"
                  className="px-6 py-2 bg-electric hover:bg-blue-600 text-navy-900 rounded-lg font-medium transition-colors whitespace-nowrap"
                >
                  Compare Now
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
