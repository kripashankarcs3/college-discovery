'use client'

import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function SearchBar({ placeholder = "Search colleges, cities, or courses..." }: { placeholder?: string }) {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get('query') as string

    if (query.trim()) {
      router.push(`/colleges?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        name="query"
        type="text"
        placeholder={placeholder}
        className="w-full px-6 py-4 pl-12 rounded-full bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-all"
      />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
      <button
        type="submit"
        className="absolute right-2 top-2 bottom-2 px-4 bg-electric hover:bg-blue-600 text-navy-900 font-semibold rounded-full transition-colors"
      >
        Search
      </button>
    </form>
  )
}
