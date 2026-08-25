import { create } from 'zustand'
import type { CollegeFilters } from '@/types/college'
import { DEFAULT_FILTERS } from '@/types/college'

interface FilterStore {
  filters: CollegeFilters
  setFilter: <K extends keyof CollegeFilters>(key: K, value: CollegeFilters[K]) => void
  resetFilters: () => void
}

export const useFilterStore = create<FilterStore>((set) => ({
  filters: { ...DEFAULT_FILTERS },
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),
}))
