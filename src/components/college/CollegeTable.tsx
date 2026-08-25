import type { College } from '@/types/college'
import { formatFees } from '@/lib/utils/formatters'

interface CollegeTableProps {
  courses: College['courses']
}

export function CollegeTable({ courses }: CollegeTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-800/50 border-b border-slate-700">
            <th className="px-4 py-3 text-slate-300 font-semibold">Course</th>
            <th className="px-4 py-3 text-slate-300 font-semibold">Duration</th>
            <th className="px-4 py-3 text-slate-300 font-semibold">Fees</th>
            <th className="px-4 py-3 text-slate-300 font-semibold">Seats</th>
            <th className="px-4 py-3 text-slate-300 font-semibold">Eligibility</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
              <td className="px-4 py-3 text-slate-100">{course.name}</td>
              <td className="px-4 py-3 text-slate-300">{course.duration}</td>
              <td className="px-4 py-3 text-slate-100">{formatFees(course.fees)}</td>
              <td className="px-4 py-3 text-slate-300">{course.seats}</td>
              <td className="px-4 py-3 text-slate-300">{course.eligibility}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
