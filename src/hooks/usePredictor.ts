import { useState, useCallback } from 'react'
import type { PredictorInput, PredictorResult } from '@/types/college'
import { runPredictor } from '@/lib/utils/predictor'
import { colleges } from '@/lib/data/colleges'
import { collegeCutoffs } from '@/lib/data/colleges'

export function usePredictor() {
  const [results, setResults] = useState<PredictorResult[]>([])
  const [isComputing, setIsComputing] = useState(false)

  const compute = useCallback((input: PredictorInput) => {
    setIsComputing(true)

    // Simulate async computation for better UX
    setTimeout(() => {
      const computedResults = runPredictor(input, colleges, collegeCutoffs)
      setResults(computedResults)
      setIsComputing(false)
    }, 100)
  }, [])

  return {
    results,
    compute,
    isComputing,
  }
}
