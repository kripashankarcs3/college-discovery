'use client'

import { motion } from 'framer-motion'
import { getWinnerIndices } from '@/lib/utils/compareWinners'
import type { College } from '@/types/college'
import { CollegeCard } from '@/components/college'
import { formatFees } from '@/lib/utils/formatters'

interface CompareTableProps {
  colleges: College[]
}

export function CompareTable({ colleges }: CompareTableProps) {
  const winnerIndices = getWinnerIndices(colleges)

  if (colleges.length < 2) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-display font-bold text-slate-100 mb-2">Compare Colleges</h3>
        <p className="text-slate-400 mb-4">Select at least 2 colleges to compare</p>
        <p className="text-sm text-slate-500">Add colleges using the "+ Compare" button on college cards</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* College Cards Header */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {colleges.map((college, index) => (
          <div key={college.id}>
            <CollegeCard college={college} index={index} />
          </div>
        ))}
      </motion.div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-800/30 border-b border-slate-700">
              <th className="px-4 py-3 text-left text-slate-300 font-semibold w-48">Attribute</th>
              {colleges.map((college) => (
                <th key={college.id} className="px-4 py-3 text-center text-slate-300 font-semibold">
                  {college.shortName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* NIRF Rank */}
            <tr className="border-b border-slate-800/50">
              <td className="px-4 py-3 text-slate-400">NIRF Rank</td>
              {colleges.map((college, i) => (
                <td
                  key={college.id}
                  className={`px-4 py-3 text-center ${i === winnerIndices['nirf'] ? 'text-green-400 font-bold bg-green-900/20' : 'text-slate-100'}`}
                >
                  {college.nirf}
                </td>
              ))}
            </tr>

            {/* Established */}
            <tr className="border-b border-slate-800/50">
              <td className="px-4 py-3 text-slate-400">Established</td>
              {colleges.map((college) => (
                <td key={college.id} className="px-4 py-3 text-center text-slate-100">
                  {college.established}
                </td>
              ))}
            </tr>

            {/* Type */}
            <tr className="border-b border-slate-800/50">
              <td className="px-4 py-3 text-slate-400">Type</td>
              {colleges.map((college) => (
                <td key={college.id} className="px-4 py-3 text-center text-slate-100">
                  {college.type}
                </td>
              ))}
            </tr>

            {/* Location */}
            <tr className="border-b border-slate-800/50">
              <td className="px-4 py-3 text-slate-400">Location</td>
              {colleges.map((college) => (
                <td key={college.id} className="px-4 py-3 text-center text-slate-100">
                  {college.location.city}, {college.location.state}
                </td>
              ))}
            </tr>

            {/* Rating */}
            <tr className="border-b border-slate-800/50">
              <td className="px-4 py-3 text-slate-400">Rating</td>
              {colleges.map((college, i) => (
                <td
                  key={college.id}
                  className={`px-4 py-3 text-center ${i === winnerIndices['rating'] ? 'text-green-400 font-bold bg-green-900/20' : 'text-slate-100'}`}
                >
                  {college.rating}/5
                </td>
              ))}
            </tr>

            {/* Fees */}
            <tr className="border-b border-slate-800/50">
              <td className="px-4 py-3 text-slate-400">Annual Fees</td>
              {colleges.map((college, i) => (
                <td
                  key={college.id}
                  className={`px-4 py-3 text-center ${i === winnerIndices['fees'] ? 'text-green-400 font-bold bg-green-900/20' : 'text-slate-100'}`}
                >
                  ₹{(college.fees.min / 100000).toFixed(1)}L - ₹{(college.fees.max / 100000).toFixed(1)}L
                </td>
              ))}
            </tr>

            {/* Avg Package */}
            <tr className="border-b border-slate-800/50">
              <td className="px-4 py-3 text-slate-400">Avg Package</td>
              {colleges.map((college, i) => (
                <td
                  key={college.id}
                  className={`px-4 py-3 text-center ${i === winnerIndices['avgPackage'] ? 'text-green-400 font-bold bg-green-900/20' : 'text-slate-100'}`}
                >
                  {college.placements.avgPackage} LPA
                </td>
              ))}
            </tr>

            {/* Max Package */}
            <tr className="border-b border-slate-800/50">
              <td className="px-4 py-3 text-slate-400">Max Package</td>
              {colleges.map((college, i) => (
                <td
                  key={college.id}
                  className={`px-4 py-3 text-center ${i === winnerIndices['maxPackage'] ? 'text-green-400 font-bold bg-green-900/20' : 'text-slate-100'}`}
                >
                  {college.placements.maxPackage} LPA
                </td>
              ))}
            </tr>

            {/* Placement Rate */}
            <tr className="border-b border-slate-800/50">
              <td className="px-4 py-3 text-slate-400">Placement Rate</td>
              {colleges.map((college, i) => (
                <td
                  key={college.id}
                  className={`px-4 py-3 text-center ${i === winnerIndices['placementRate'] ? 'text-green-400 font-bold bg-green-900/20' : 'text-slate-100'}`}
                >
                  {college.placements.placementRate}%
                </td>
              ))}
            </tr>

            {/* Courses */}
            <tr className="border-b border-slate-800/50">
              <td className="px-4 py-3 text-slate-400">Courses Offered</td>
              {colleges.map((college) => (
                <td key={college.id} className="px-4 py-3 text-center text-slate-100">
                  {college.courses.length}
                </td>
              ))}
            </tr>

            {/* Exams */}
            <tr>
              <td className="px-4 py-3 text-slate-400">Exams Accepted</td>
              {colleges.map((college) => (
                <td key={college.id} className="px-4 py-3 text-center text-slate-100">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {college.exams.map((exam) => (
                      <span key={exam} className="px-2 py-0.5 bg-slate-700 rounded text-xs">
                        {exam}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
