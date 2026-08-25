import { useCallback } from 'react'
import { useCompareStore } from '@/lib/store/compareStore'
import type { College } from '@/types/college'

export function useCompare() {
  const { colleges: selected, addCollege, removeCollege, clearCompare } = useCompareStore()

  const add = useCallback(
    (college: College) => {
      addCollege(college)
    },
    [addCollege]
  )

  const remove = useCallback(
    (id: string) => {
      removeCollege(id)
    },
    [removeCollege]
  )

  const isSelected = useCallback(
    (id: string) => {
      return selected.some((c) => c.id === id)
    },
    [selected]
  )

  return {
    selected,
    add,
    remove,
    clear: clearCompare,
    isSelected,
  }
}
