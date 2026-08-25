export interface College {
  id: string
  name: string
  location: string
  city: string
  state: string
  fees: number
  rating: number
  placementRate: number
  placementAverage: number
  placementHighest: number
  courses: string[]
  overview: string
  image: string
  type: 'Government' | 'Private' | 'Deemed' | 'Central'
  approval: string[]
  established: number
  ranking?: {
    nirf?: number
    outlook?: number
    times?: number
    collegedunia?: number
  }
  cutoffs?: {
    exam: string
    year: number
    round: number
    score: number
  }[]
  scholarships?: {
    name: string
    amount: string
    eligibility: string
  }[]
  facilities: string[]
  admissionProcess?: string[]
  contact?: {
    phone: string
    email: string
    website: string
  }
  reviews?: {
    name: string
    rating: number
    comment: string
    date: string
  }[]
  gallery?: string[]
  imageSource?: string
  imageAttribution?: string
  topRecruiters?: string[]
  campusSize?: string
  totalStudents?: number
  facultyCount?: number
  accreditation?: string
  hostelFees?: string
  courseFees?: { name: string; totalFees: string; duration: string }[]
  importantDates?: { event: string; date: string }[]
  annualEvents?: string[]
  notableAlumni?: string[]
}

export interface PredictorInput {
  exam: string
  rank: number
  score: number
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS'
  state: string
  course: string
  collegeTypePreference?: string
  maxFees?: number
}

export interface PredictorResult {
  college: College
  chance: number
  previousCutoff?: number
  difference?: number
  category: string
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  image: string
  date: string
  category: string
  author: string
  slug: string
}

export interface Exam {
  id: string
  name: string
  fullName: string
  level: string
  date: string
  applicationDate: string
  participatingColleges: number
  description: string
  icon: string
}

export interface FAQ {
  question: string
  answer: string
  category: string
}

export interface DashboardItem {
  id: string
  collegeId: string
  collegeName: string
  type: 'saved' | 'recent' | 'compared'
  date: string
  image: string
}
