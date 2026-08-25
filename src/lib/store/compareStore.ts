import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { College } from '@/types/college'

interface CompareStore {
  colleges: College[]
  addCollege: (college: College) => void
  removeCollege: (id: string) => void
  clearCompare: () => void
}

export const useCompareStore = create(
  persist<CompareStore>(
    (set, get) => ({
      colleges: [],
      addCollege: (college) => {
        const { colleges } = get()
        if (colleges.length >= 3) {
          // Replace oldest entry (index 0)
          set({ colleges: [...colleges.slice(1), college] })
        } else {
          set({ colleges: [...colleges, college] })
        }
      },
      removeCollege: (id) =>
        set((state) => ({
          colleges: state.colleges.filter((c) => c.id !== id),
        })),
      clearCompare: () => set({ colleges: [] }),
    }),
    {
      name: 'edupath-compare',
      storage: createJSONStorage(() => ({
        getItem: () => {
          try {
            return sessionStorage.getItem('edupath-compare')
          } catch {
            return null
          }
        },
        setItem: (key, value) => {
          try {
            sessionStorage.setItem(key, value)
          } catch {
            // Ignore sessionStorage errors (e.g., in SSR or private mode)
          }
        },
        removeItem: () => {
          try {
            sessionStorage.removeItem('edupath-compare')
          } catch {
            // Ignore sessionStorage errors
          }
        },
      })),
    }
  )
)
