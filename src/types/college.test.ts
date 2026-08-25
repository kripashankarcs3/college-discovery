import { describe, it, expect } from 'vitest'
import type { Course, Review, College, CollegeFilters, PredictorInput, PredictorResult } from './college'
import { DEFAULT_FILTERS } from './college'

// Compile-time assignability checks using `satisfies`
const exampleCourse = {
  id: 'c1',
  name: 'B.Tech CSE',
  duration: '4 years',
  fees: 200000,
  seats: 60,
  eligibility: 'JEE Advanced',
} satisfies Course

const exampleReview = {
  id: 'r1',
  author: 'Alice',
  rating: 4,
  date: '2024-01-01',
  body: 'Great college',
  tags: ['placement', 'faculty'],
} satisfies Review

const exampleCollege = {
  id: 'iit-bombay',
  name: 'Indian Institute of Technology Bombay',
  shortName: 'IIT Bombay',
  location: { city: 'Mumbai', state: 'Maharashtra' },
  type: 'IIT' as const,
  fees: { min: 100000, max: 250000 },
  rating: 4.8,
  nirf: 3,
  exams: ['JEE Advanced' as const],
  courses: [exampleCourse],
  placements: {
    avgPackage: 20,
    maxPackage: 80,
    placementRate: 95,
    topRecruiters: ['Google', 'Microsoft'],
  },
  reviews: [exampleReview],
  established: 1958,
  logo: 'https://example.com/logo.png',
  heroImage: 'https://example.com/hero.png',
  about: 'Premier technical institution.',
  tags: ['IIT', 'engineering', 'research'],
} satisfies College

const exampleFilters = {
  query: '',
  type: '',
  exam: '',
  state: '',
  nirf: [1, 1000] as [number, number],
  fees: [0, 50] as [number, number],
  sortBy: 'nirf' as const,
} satisfies CollegeFilters

const examplePredictorInput = {
  exam: 'JEE Main' as const,
  rank: 5000,
  category: 'General' as const,
} satisfies PredictorInput

const examplePredictorResult = {
  college: exampleCollege,
  chance: 'High' as const,
  chancePercent: 90,
  cutoffRank: 4000,
} satisfies PredictorResult

describe('college.ts type exports', () => {
  it('Course interface has required fields', () => {
    expect(typeof exampleCourse.id).toBe('string')
    expect(typeof exampleCourse.name).toBe('string')
    expect(typeof exampleCourse.duration).toBe('string')
    expect(typeof exampleCourse.fees).toBe('number')
    expect(typeof exampleCourse.seats).toBe('number')
    expect(typeof exampleCourse.eligibility).toBe('string')
  })

  it('Review interface has required fields', () => {
    expect(typeof exampleReview.id).toBe('string')
    expect(typeof exampleReview.author).toBe('string')
    expect(typeof exampleReview.rating).toBe('number')
    expect(typeof exampleReview.date).toBe('string')
    expect(typeof exampleReview.body).toBe('string')
    expect(Array.isArray(exampleReview.tags)).toBe(true)
  })

  it('College interface has required fields', () => {
    expect(typeof exampleCollege.id).toBe('string')
    expect(typeof exampleCollege.name).toBe('string')
    expect(typeof exampleCollege.shortName).toBe('string')
    expect(typeof exampleCollege.location.city).toBe('string')
    expect(typeof exampleCollege.location.state).toBe('string')
    expect(['IIT', 'NIT', 'Private', 'Deemed', 'State']).toContain(exampleCollege.type)
    expect(typeof exampleCollege.fees.min).toBe('number')
    expect(typeof exampleCollege.fees.max).toBe('number')
    expect(typeof exampleCollege.rating).toBe('number')
    expect(typeof exampleCollege.nirf).toBe('number')
    expect(Array.isArray(exampleCollege.exams)).toBe(true)
    expect(Array.isArray(exampleCollege.courses)).toBe(true)
    expect(typeof exampleCollege.placements.avgPackage).toBe('number')
    expect(typeof exampleCollege.placements.maxPackage).toBe('number')
    expect(typeof exampleCollege.placements.placementRate).toBe('number')
    expect(Array.isArray(exampleCollege.placements.topRecruiters)).toBe(true)
    expect(Array.isArray(exampleCollege.reviews)).toBe(true)
    expect(typeof exampleCollege.established).toBe('number')
    expect(typeof exampleCollege.logo).toBe('string')
    expect(typeof exampleCollege.heroImage).toBe('string')
    expect(typeof exampleCollege.about).toBe('string')
    expect(Array.isArray(exampleCollege.tags)).toBe(true)
  })

  it('CollegeFilters interface has required fields', () => {
    expect(typeof exampleFilters.query).toBe('string')
    expect(typeof exampleFilters.type).toBe('string')
    expect(typeof exampleFilters.exam).toBe('string')
    expect(typeof exampleFilters.state).toBe('string')
    expect(Array.isArray(exampleFilters.nirf)).toBe(true)
    expect(exampleFilters.nirf).toHaveLength(2)
    expect(Array.isArray(exampleFilters.fees)).toBe(true)
    expect(exampleFilters.fees).toHaveLength(2)
    expect(['nirf', 'rating', 'fees', 'placement']).toContain(exampleFilters.sortBy)
  })

  it('PredictorInput interface has required fields', () => {
    expect(['JEE Main', 'JEE Advanced', 'NEET']).toContain(examplePredictorInput.exam)
    expect(typeof examplePredictorInput.rank).toBe('number')
    expect(['General', 'OBC', 'SC', 'ST', 'EWS']).toContain(examplePredictorInput.category)
  })

  it('PredictorResult interface has required fields', () => {
    expect(typeof examplePredictorResult.college).toBe('object')
    expect(['High', 'Medium', 'Low', 'Very Low']).toContain(examplePredictorResult.chance)
    expect(typeof examplePredictorResult.chancePercent).toBe('number')
    expect(typeof examplePredictorResult.cutoffRank).toBe('number')
  })

  it('DEFAULT_FILTERS matches expected values', () => {
    expect(DEFAULT_FILTERS.query).toBe('')
    expect(DEFAULT_FILTERS.type).toBe('')
    expect(DEFAULT_FILTERS.exam).toBe('')
    expect(DEFAULT_FILTERS.state).toBe('')
    expect(DEFAULT_FILTERS.nirf).toEqual([1, 1000])
    expect(DEFAULT_FILTERS.fees).toEqual([0, 50])
    expect(DEFAULT_FILTERS.sortBy).toBe('nirf')
  })

  it('DEFAULT_FILTERS satisfies CollegeFilters', () => {
    const f: CollegeFilters = DEFAULT_FILTERS
    expect(f).toBeDefined()
  })
})
