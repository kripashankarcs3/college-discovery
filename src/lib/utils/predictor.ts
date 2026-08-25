import type { College, PredictorInput, PredictorResult } from '@/types/college'

export const CATEGORY_MULTIPLIERS: Record<PredictorInput['category'], number> = {
  General: 1.0,
  EWS: 1.25,
  OBC: 1.5,
  SC: 3.0,
  ST: 4.0,
}

// Thresholds per exam: (High, Medium, Low) multipliers
const EXAM_THRESHOLDS: Record<PredictorInput['exam'], [number, number, number]> = {
  'JEE Advanced': [1.0, 1.5, 2.5],
  'JEE Main': [1.0, 2.0, 4.0],
  NEET: [1.0, 1.8, 3.0],
}

export function computeChance(
  rank: number,
  baseCutoff: number,
  exam: PredictorInput['exam'],
  category: PredictorInput['category']
): Pick<PredictorResult, 'chance' | 'chancePercent'> {
  const categoryMultiplier = CATEGORY_MULTIPLIERS[category]
  const effectiveCutoff = baseCutoff * categoryMultiplier
  const ratio = rank / effectiveCutoff

  const [highThreshold, mediumThreshold, lowThreshold] = EXAM_THRESHOLDS[exam]

  let chance: PredictorResult['chance']
  let chancePercent: number

  if (ratio <= highThreshold) {
    chance = 'High'
    chancePercent = 90
  } else if (ratio <= mediumThreshold) {
    chance = 'Medium'
    chancePercent = 60
  } else if (ratio <= lowThreshold) {
    chance = 'Low'
    chancePercent = 30
  } else {
    chance = 'Very Low'
    chancePercent = 10
  }

  return { chance, chancePercent }
}

export function runPredictor(
  input: PredictorInput,
  colleges: College[],
  cutoffs: Record<string, Partial<Record<PredictorInput['exam'], number>>>
): PredictorResult[] {
  // Filter colleges that accept the selected exam
  const relevantColleges = colleges.filter((c) => c.exams.includes(input.exam))

  // Compute results for each college
  const results = relevantColleges
    .map((college) => {
      const cutoff = cutoffs[college.id]?.[input.exam]
      if (!cutoff) return null

      const { chance, chancePercent } = computeChance(input.rank, cutoff, input.exam, input.category)
      const cutoffRank = cutoff

      return {
        college,
        chance,
        chancePercent,
        cutoffRank,
      }
    })
    .filter((r): r is PredictorResult => r !== null)

  // Sort by chance (High > Medium > Low > Very Low) then by chancePercent
  const chanceOrder: Record<string, number> = { High: 0, Medium: 1, Low: 2, 'Very Low': 3 }
  results.sort((a, b) => {
    if (a.chance !== b.chance) {
      return chanceOrder[a.chance] - chanceOrder[b.chance]
    }
    return b.chancePercent - a.chancePercent
  })

  return results
}
