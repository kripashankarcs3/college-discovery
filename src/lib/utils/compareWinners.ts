import type { College } from '@/types/college'

export function getWinnerIndices(colleges: College[]): Record<string, number> {
  const winners: Record<string, number> = {}

  if (colleges.length === 0) return winners

  // Minimize: NIRF, Fees (min)
  let minNirfIndex = 0
  let minFeesIndex = 0

  // Maximize: Rating, AvgPackage, MaxPackage, PlacementRate
  let maxRatingIndex = 0
  let maxAvgPackageIndex = 0
  let maxMaxPackageIndex = 0
  let maxPlacementRateIndex = 0

  for (let i = 1; i < colleges.length; i++) {
    const college = colleges[i]

    // Minimize NIRF (lower is better)
    if (college.nirf < colleges[minNirfIndex].nirf) {
      minNirfIndex = i
    }

    // Minimize Fees (lower is better)
    if (college.fees.min < colleges[minFeesIndex].fees.min) {
      minFeesIndex = i
    }

    // Maximize Rating (higher is better)
    if (college.rating > colleges[maxRatingIndex].rating) {
      maxRatingIndex = i
    }

    // Maximize Avg Package (higher is better)
    if (college.placements.avgPackage > colleges[maxAvgPackageIndex].placements.avgPackage) {
      maxAvgPackageIndex = i
    }

    // Maximize Max Package (higher is better)
    if (college.placements.maxPackage > colleges[maxMaxPackageIndex].placements.maxPackage) {
      maxMaxPackageIndex = i
    }

    // Maximize Placement Rate (higher is better)
    if (college.placements.placementRate > colleges[maxPlacementRateIndex].placements.placementRate) {
      maxPlacementRateIndex = i
    }
  }

  winners['nirf'] = minNirfIndex
  winners['fees'] = minFeesIndex
  winners['rating'] = maxRatingIndex
  winners['avgPackage'] = maxAvgPackageIndex
  winners['maxPackage'] = maxMaxPackageIndex
  winners['placementRate'] = maxPlacementRateIndex

  return winners
}
