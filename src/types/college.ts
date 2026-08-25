// Requirement 1.1
export interface Course {
  id: string
  name: string
  duration: string
  fees: number
  seats: number
  eligibility: string
}

// Requirement 1.2
export interface Review {
  id: string
  author: string
  rating: number
  date: string
  body: string
  tags: string[]
}

// Requirement 1.3
export interface College {
  id: string
  name: string
  shortName: string
  location: { city: string; state: string }
  type: 'IIT' | 'NIT' | 'Private' | 'Deemed' | 'State'
  fees: { min: number; max: number }
  rating: number
  nirf: number
  exams: ('JEE Main' | 'JEE Advanced' | 'CAT' | 'NEET' | 'GATE' | 'CLAT')[]
  courses: Course[]
  placements: {
    avgPackage: number
    maxPackage: number
    placementRate: number
    topRecruiters: string[]
  }
  reviews: Review[]
  established: number
  logo: string
  heroImage: string
  about: string
  tags: string[]
}

// Requirement 1.4
export interface CollegeFilters {
  query: string
  type: College['type'] | ''
  exam: string
  state: string
  nirf: [number, number]
  fees: [number, number]
  sortBy: 'nirf' | 'rating' | 'fees' | 'placement'
}

// Requirement 1.5
export interface PredictorInput {
  exam: 'JEE Main' | 'JEE Advanced' | 'NEET'
  rank: number
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS'
}

// Requirement 1.6
export interface PredictorResult {
  college: College
  chance: 'High' | 'Medium' | 'Low' | 'Very Low'
  chancePercent: number
  cutoffRank: number
}

export const DEFAULT_FILTERS: CollegeFilters = {
  query: '',
  type: '',
  exam: '',
  state: '',
  nirf: [1, 1000],
  fees: [0, 50],
  sortBy: 'nirf',
}
