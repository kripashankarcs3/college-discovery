# Technical Design Document — EduPath College Discovery Platform

## Overview

EduPath is a production-grade college discovery platform for Indian students built on **Next.js 14 (App Router)**. The existing repository is a minimal starter with 12 mock colleges, a simplified `College` type, and basic list/detail/compare pages. This design governs a complete rebuild of the type system, data layer, state management, hooks, components, pages, and design system to meet all 12 requirements.

The rebuild strategy is **additive-first**: the new `src/` directory tree is introduced alongside the existing top-level directories. Once the new code is wired together, the old directories (`lib/`, `mocks/`, `components/features/`, `components/ui/`, `app/`) are replaced by their `src/` equivalents. This avoids breaking the dev server during migration.

---

## Architecture

### Technology Stack

| Concern | Library / Tool |
|---|---|
| Framework | Next.js 14 (App Router, React Server Components where possible) |
| Language | TypeScript 5 (`strict: true`) |
| Styling | Tailwind CSS 3 with custom `navy`, `electric`, `gold` tokens |
| UI Primitives | shadcn/ui (Button, Badge, Card, Input, Tabs, Select, Slider, Dialog, Drawer, Skeleton, Tooltip) |
| State Management | Zustand 4 (filterStore, compareStore with `persist`) |
| Data Fetching | TanStack Query v5 (`@tanstack/react-query`) |
| Animations | Framer Motion 11 |
| Icons | Lucide React |
| Fonts | `next/font/google` — Playfair Display (headings), DM Sans (body) |

### Rendering Strategy

```
Route                  Strategy
/                      Static (SSG) — hero + featured colleges derived from static data
/colleges              Client Component — filter state drives re-renders via Zustand + TanStack Query
/colleges/[id]         Server Component — college data fetched server-side; tabs rendered client-side
/compare               Client Component — Compare Store (sessionStorage-persisted Zustand)
/predictor             Client Component — all computation is client-side; no server data needed
```

### High-Level Data Flow

```
Static mock data (src/lib/data/colleges.ts)
          │
          ▼
  TanStack Query (useCollegeSearch) ──── CollegeFilters (Filter Store)
          │
          ▼
  /colleges listing page
          │
          ▼
  CollegeCard ──── "Add to Compare" ──── Compare Store (sessionStorage)
          │                                       │
          ▼                                       ▼
  /colleges/[id]                          /compare
  detail page                             CompareTable
                                          CompareDrawer (fixed bottom)

  PredictorInput
          │
  usePredictor hook (pure computation)
          │
          ▼
  /predictor
  PredictorResults
```

---

## Folder Structure

```
src/
├── app/
│   ├── layout.tsx                  # Root layout: fonts, Navbar, QueryProvider, CompareDrawer
│   ├── page.tsx                    # Landing page (SSG)
│   ├── not-found.tsx               # Global 404
│   ├── colleges/
│   │   ├── page.tsx                # College listing (client)
│   │   └── [id]/
│   │       └── page.tsx            # College detail (server + client tabs)
│   ├── compare/
│   │   └── page.tsx                # Comparison tool (client)
│   └── predictor/
│       └── page.tsx                # Rank predictor (client)
│
├── components/
│   ├── ui/                         # shadcn/ui primitives (re-exported + custom)
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── skeleton.tsx
│   │   ├── tabs.tsx
│   │   ├── select.tsx
│   │   ├── slider.tsx
│   │   ├── dialog.tsx
│   │   ├── drawer.tsx
│   │   ├── tooltip.tsx
│   │   ├── RatingBadge.tsx         # Req 8.8
│   │   ├── FeeBadge.tsx            # Req 8.9
│   │   └── index.ts
│   ├── shared/
│   │   ├── Navbar.tsx              # Top navigation (Req 3.6)
│   │   ├── Footer.tsx
│   │   └── PageTransition.tsx      # Framer Motion page wrapper (Req 11.2)
│   ├── college/
│   │   ├── CollegeCard.tsx         # Req 4.7, 11.3, 11.7
│   │   ├── CollegeHero.tsx         # Req 5.2
│   │   ├── CollegeTabs.tsx         # Req 5.3–5.7, 11.5
│   │   ├── CollegeTable.tsx        # Req 5.5
│   │   ├── SearchFilterBar.tsx     # Req 4.2
│   │   └── CollegesGrid.tsx        # Skeleton + grid wrapper (Req 4.9)
│   ├── compare/
│   │   ├── CompareTable.tsx        # Req 6.3, 6.9
│   │   └── CompareDrawer.tsx       # Req 6.6, 6.7, 11.4
│   └── predictor/
│       ├── PredictorForm.tsx       # Req 7.2, 7.7
│       └── PredictorResults.tsx    # Req 7.6, 11.8
│
├── hooks/
│   ├── useCollegeSearch.ts         # Req 10.1, 10.2
│   ├── useCompare.ts               # Req 10.3
│   └── usePredictor.ts             # Req 10.4, 10.5
│
├── lib/
│   ├── data/
│   │   ├── colleges.ts             # 50+ College entries (Req 2.1, 2.2)
│   │   └── courses.ts              # Flat Course[] array (Req 2.6)
│   ├── store/
│   │   ├── filterStore.ts          # Zustand filter store (Req 9.1)
│   │   └── compareStore.ts         # Zustand compare store (Req 9.2–9.4)
│   └── utils/
│       ├── filterColleges.ts       # Pure filtering + sorting logic
│       ├── predictor.ts            # Rank prediction pure functions (Req 7.4, 7.5)
│       └── formatters.ts           # Currency, rank, percentage formatters
│
├── types/
│   └── college.ts                  # All TypeScript interfaces (Req 1.1–1.6, Req 12.4)
│
└── styles/
    └── globals.css                 # Tailwind base + custom CSS vars
```

---

## Components and Interfaces

### Navbar

```tsx
// src/components/shared/Navbar.tsx
// Server Component (no client state)
// Props: none
// Links: /, /colleges, /compare, /predictor
// Uses: next/font playfair for brand name
```

### CollegeCard

```tsx
// src/components/college/CollegeCard.tsx
interface CollegeCardProps {
  college: College
  index?: number           // for stagger delay (Req 11.3)
  chanceResult?: PredictorResult  // optional annotation for predictor page
}
```

Renders: name, type badge, city/state, NIRF rank, star rating, fees range (`FeeBadge`), placement rate, up to 3 exam tags. Framer Motion `whileHover` scale 1.02. Stagger delay = `index * 0.08s`.

### SearchFilterBar

```tsx
// src/components/college/SearchFilterBar.tsx
// Client Component
// Reads from / writes to Filter Store (useFilterStore)
// Controls: keyword Input, type Select, exam Select, state Select,
//           NIRF range Slider, fees range Slider, sortBy Select
// On mount: pre-populates query from URL ?q param (Req 4.5)
// On change: calls setFilter() — no submit button needed
```

### CollegeTabs

```tsx
// src/components/college/CollegeTabs.tsx
// Client Component
interface CollegeTabsProps {
  college: College
}
// Tabs: Overview | Courses | Placements | Reviews
// Uses shadcn Tabs primitive
// Tab content wrapped in AnimatePresence + motion.div for fade-slide (Req 11.5)
```

### CompareTable

```tsx
// src/components/compare/CompareTable.tsx
interface CompareTableProps {
  colleges: College[]
}
// Rows: Name, Type, Location, Established, NIRF, Rating, Fees, AvgPkg, MaxPkg, PlacementRate, Exams, Courses count
// Winning cell highlighted with gold text + bg (Req 6.9)
// Win logic: lowest for fees/nirf; highest for rating/avgPackage/maxPackage/placementRate
```

### CompareDrawer

```tsx
// src/components/compare/CompareDrawer.tsx
// Client Component — reads useCompareStore
// Fixed bottom bar, visible when selected.length >= 1
// AnimatePresence + motion.div y: 100% → 0 with spring (Req 11.4, 6.8)
```

### PredictorForm

```tsx
// src/components/predictor/PredictorForm.tsx
interface PredictorFormProps {
  onSubmit: (input: PredictorInput) => void
}
// Fields: exam (Select), rank (Input type=number), category (Select)
// Validation: rank must be > 0 and numeric; shows error if not (Req 7.7)
```

### PredictorResults

```tsx
// src/components/predictor/PredictorResults.tsx
interface PredictorResultsProps {
  results: PredictorResult[]
}
// Renders CollegeCard-style cards with chance badge overlay
// Chance badge colours: High=green, Medium=amber, Low=red, Very Low=slate
// Staggered entrance animation (Req 11.8)
```

### RatingBadge

```tsx
// src/components/ui/RatingBadge.tsx
interface RatingBadgeProps {
  rating: number   // 0–5
  className?: string
}
// Displays "★ {rating}" with gold fill
// aria-label="Rating: {rating} out of 5"
```

### FeeBadge

```tsx
// src/components/ui/FeeBadge.tsx
interface FeeBadgeProps {
  min: number   // in lakhs (raw INR / 100000)
  max: number
  className?: string
}
// Formats: "₹{min}L – ₹{max}L"
// Colour: green if max < 1L, amber if max 1L–3L, red if max > 3L
```

---

## Data Models

All interfaces live in `src/types/college.ts`.

```typescript
// Requirement 1.1
export interface Course {
  id: string
  name: string
  duration: string      // e.g. "4 years"
  fees: number          // annual INR
  seats: number
  eligibility: string
}

// Requirement 1.2
export interface Review {
  id: string
  author: string
  rating: number        // 1–5
  date: string          // ISO date string
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
  fees: { min: number; max: number }       // annual INR
  rating: number                           // 0–5
  nirf: number                             // positive integer
  exams: ('JEE Main' | 'JEE Advanced' | 'CAT' | 'NEET' | 'GATE' | 'CLAT')[]
  courses: Course[]
  placements: {
    avgPackage: number       // LPA
    maxPackage: number       // LPA
    placementRate: number    // 0–100
    topRecruiters: string[]
  }
  reviews: Review[]
  established: number        // year
  logo: string               // URL
  heroImage: string          // URL
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
  fees: [number, number]     // in lakhs
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
```

### Default Filter Values

```typescript
export const DEFAULT_FILTERS: CollegeFilters = {
  query: '',
  type: '',
  exam: '',
  state: '',
  nirf: [1, 1000],
  fees: [0, 50],      // lakhs
  sortBy: 'nirf',
}
```

### Cutoff Rank Model

Each `College` entry in the data file includes a derived `cutoffRanks` map used by the predictor:

```typescript
// Internal to src/lib/data/colleges.ts — not exported on the College interface
// Stored as a separate lookup map for clean separation
export const collegeCutoffs: Record<string, Partial<Record<PredictorInput['exam'], number>>> = {
  'iit-bombay': { 'JEE Advanced': 150 },
  'iit-delhi':  { 'JEE Advanced': 100 },
  // ...
}
```

---

## State Management Design

### Filter Store (`src/lib/store/filterStore.ts`)

```typescript
interface FilterStore {
  // state
  filters: CollegeFilters
  // actions
  setFilter: <K extends keyof CollegeFilters>(key: K, value: CollegeFilters[K]) => void
  resetFilters: () => void
}
```

- Not persisted (resets on tab close; URL params handle sharing — Req 4.8)
- URL sync: `/colleges` page reads query params on mount and calls `setFilter`

### Compare Store (`src/lib/store/compareStore.ts`)

```typescript
interface CompareStore {
  // state
  colleges: College[]
  // actions
  addCollege: (college: College) => void
  removeCollege: (id: string) => void
  clearCompare: () => void
}
```

- Persisted with `zustand/middleware/persist` → `sessionStorage` key `edupath-compare`
- `addCollege`: if `colleges.length >= 3`, replace `colleges[0]` with new college (Req 9.3)

---

## Custom Hooks Design

### `useCollegeSearch`

```typescript
function useCollegeSearch(filters: CollegeFilters): {
  data: College[]
  isLoading: boolean
  error: Error | null
}
```

- Uses `useQuery` from TanStack Query
- Query key: `['colleges', filters]` — auto-invalidates when filters change (Req 10.2)
- Query function: calls `filterColleges(allColleges, filters)` — pure in-memory; no HTTP
- `staleTime: 5 * 60 * 1000` (5 minutes — Req 4.10)

### `useCompare`

```typescript
function useCompare(): {
  selected: College[]
  add: (college: College) => void
  remove: (id: string) => void
  clear: () => void
  isSelected: (id: string) => boolean
}
```

### `usePredictor`

```typescript
function usePredictor(): {
  results: PredictorResult[]
  compute: (input: PredictorInput) => void
  isComputing: boolean
}
```

- `compute` runs synchronously (pure function) but sets `isComputing: true` for one tick to trigger skeleton
- Filters `allColleges` to only those with `exams.includes(input.exam)` before computing (Req 10.5)

---

## Predictor Algorithm Design

Located in `src/lib/utils/predictor.ts`.

```typescript
const CATEGORY_MULTIPLIERS: Record<PredictorInput['category'], number> = {
  General: 1.0,
  EWS:     1.25,
  OBC:     1.5,
  SC:      3.0,
  ST:      4.0,
}

// Effective cutoff = baseCutoff * categoryMultiplier
// Thresholds per exam:
//   JEE Advanced: ≤1.0× High, ≤1.5× Medium, ≤2.5× Low, else Very Low
//   JEE Main:     ≤1.0× High, ≤2.0× Medium, ≤4.0× Low, else Very Low
//   NEET:         ≤1.0× High, ≤1.8× Medium, ≤3.0× Low, else Very Low

function computeChance(
  rank: number,
  baseCutoff: number,
  exam: PredictorInput['exam'],
  category: PredictorInput['category']
): Pick<PredictorResult, 'chance' | 'chancePercent'>

function runPredictor(
  input: PredictorInput,
  colleges: College[],
  cutoffs: typeof collegeCutoffs
): PredictorResult[]
```

`chancePercent` derivation: `High=90`, `Medium=60`, `Low=30`, `Very Low=10` (fixed indicative values since no real distribution data exists).

---

## URL Filter Sync Design

`/colleges` page:

1. On mount: read `searchParams` from `useSearchParams()` → call `setFilter` for each param present.
2. On filter change: `useEffect` on `filters` → `router.replace('/colleges?' + serialize(filters), { scroll: false })`.
3. Serialisation: only non-default values are written to the URL to keep URLs clean.

---

## Design System Tokens

### tailwind.config.js Extensions

```javascript
theme: {
  extend: {
    colors: {
      navy:     '#0A0F1E',
      electric: '#3B82F6',
      gold:     '#F59E0B',
    },
    fontFamily: {
      display: ['var(--font-playfair)', 'Georgia', 'serif'],
      sans:    ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
    },
  },
}
```

### Font Loading (Root Layout)

```typescript
import { Playfair_Display, DM_Sans } from 'next/font/google'
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const dmSans   = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
```

---

## Animation Variants (Framer Motion)

```typescript
// src/lib/utils/animations.ts
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export const cardVariants = (index: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { delay: index * 0.08, duration: 0.35 } },
})

export const drawerVariants = {
  initial: { y: '100%' },
  animate: { y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit:    { y: '100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
}

export const tabContentVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.25 } },
  exit:    { opacity: 0, x: -20, transition: { duration: 0.2 } },
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

The following properties are derived from the prework analysis. The feature involves pure business logic functions (filtering, predictor computation, store mutations, URL serialisation) that are well-suited to property-based testing. UI rendering, infrastructure wiring, and TypeScript type definitions are excluded from PBT and covered by example-based tests instead.

These tests use **fast-check** (the leading TypeScript PBT library).

### Property 1: Placement Rate Bounds

*For any* college in the dataset, if the college has placement data, `placements.placementRate` must be a number in the inclusive range [0, 100].

**Validates: Requirements 2.3**

### Property 2: NIRF Positive Integer

*For any* college in the dataset with a `nirf` value, `nirf` must be a positive integer (greater than or equal to 1).

**Validates: Requirements 2.4**

### Property 3: Minimum Courses and Reviews Per College

*For any* college in the dataset, `courses.length >= 2` and `reviews.length >= 2`.

**Validates: Requirements 2.5**

### Property 4: Filter Result Subset Invariant

*For any* `CollegeFilters` value and the full college dataset, every college returned by `filterColleges(colleges, filters)` must individually satisfy all active filter criteria (type match, exam match, state match, nirf range, fees range, query match).

**Validates: Requirements 4.3**

### Property 5: URL Filter Round-Trip

*For any* `CollegeFilters` value, serialising the filters to URL query parameters and then deserialising back must produce a filters object equal to the original (for all fields that are URL-serialisable).

**Validates: Requirements 4.8**

### Property 6: Predictor Exam Filter Invariant

*For any* valid `PredictorInput`, every `PredictorResult` returned by `runPredictor` must come from a college whose `exams` array includes `input.exam`. No college that does not accept the selected exam should appear in the results.

**Validates: Requirements 7.3, 10.5**

### Property 7: Predictor Chance Classification Correctness

*For any* valid combination of rank, baseCutoff, exam type, and category, the `chance` value returned by `computeChance` must be exactly the tier dictated by the ratio `rank / (baseCutoff times categoryMultiplier)` compared against the exam-specific thresholds defined in Requirement 7.4.

**Validates: Requirements 7.4, 7.5**

### Property 8: Compare Store Capacity Invariant

*For any* sequence of `addCollege` calls on an initially empty Compare Store, the store's `colleges` array length must never exceed 3, and after each `addCollege` call the added college must be present in the store.

**Validates: Requirements 6.2, 9.3**

### Property 9: Filter Store Reset Idempotence

*For any* sequence of `setFilter` calls followed by `resetFilters`, the resulting filter state must equal `DEFAULT_FILTERS`, regardless of what filters were set before the reset.

**Validates: Requirements 9.5**

### Property 10: CompareTable Winner Highlighting Correctness

*For any* set of 2 to 3 colleges passed to the `getWinnerIndices` utility function, the index returned for each numeric row must correspond to the college with the optimal value (min for fees/nirf, max for rating/avgPackage/maxPackage/placementRate), and the returned index must be a valid index into the input array.

**Validates: Requirements 6.9**

## Error Handling

| Scenario | Handling |
|---|---|
| College `id` not in dataset | `notFound()` from `next/navigation` in `/colleges/[id]/page.tsx` |
| Predictor rank ≤ 0 or NaN | Client-side validation in `PredictorForm`; error message displayed, `onSubmit` not called |
| Compare store receives 4th college | `addCollege` shifts array: replaces index 0 |
| TanStack Query error | `isError` state shown in `CollegesGrid` with retry button |
| Empty filter results | Empty-state component with "Clear filters" action |
| `sessionStorage` unavailable (SSR) | Zustand `persist` wraps `createJSONStorage` in try/catch; falls back to in-memory |

---

## Testing Strategy

### Unit / Example-Based Tests

Framework: **Vitest** (compatible with Next.js 14 + TypeScript, no jest-environment-jsdom configuration overhead).

- `src/lib/utils/filterColleges.test.ts` — specific filter scenarios, empty results, sort order
- `src/lib/utils/predictor.test.ts` — concrete rank/cutoff examples for all 3 exams
- `src/lib/store/filterStore.test.ts` — `setFilter`, `resetFilters` with concrete values
- `src/lib/store/compareStore.test.ts` — `addCollege`, `removeCollege`, `clearCompare`
- `src/components/ui/FeeBadge.test.tsx` — fee tier colour logic
- `src/components/ui/RatingBadge.test.tsx` — aria-label, gold class
- `src/lib/data/colleges.test.ts` — array length ≥ 50, required institution names present

### Property-Based Tests

Framework: **fast-check** (`npm install --save-dev fast-check`). Each property test runs a minimum of **100 iterations**.

File: `src/lib/utils/predictor.property.test.ts`  
Tags: `Feature: edupath-college-discovery, Property N: <property text>`

- **Property 1** → iterate over all colleges in dataset (static data), assert `placementRate ∈ [0,100]`
- **Property 2** → iterate over all colleges, assert `nirf >= 1`
- **Property 3** → iterate over all colleges, assert `courses.length >= 2 && reviews.length >= 2`
- **Property 4** → `fc.record({ query, type, exam, state, nirf, fees, sortBy })` → `filterColleges` → assert each result satisfies the filter
- **Property 5** → `fc.record(filtersArb)` → `serializeFilters` → `deserializeFilters` → deep-equal original
- **Property 6** → `fc.record({ exam, rank, category })` → `runPredictor` → every result's `college.exams.includes(exam)`
- **Property 7** → `fc.record({ rank, cutoff, exam, category })` → `computeChance` → verify tier matches threshold formula
- **Property 8** → `fc.array(collegeArb, { minLength: 1, maxLength: 10 })` → sequential `addCollege` calls → `length <= 3 && includes(last added)`
- **Property 9** → `fc.array(filterMutationArb)` → apply mutations → `resetFilters` → deep-equal `DEFAULT_FILTERS`
- **Property 10** → `fc.array(collegeArb, { minLength: 2, maxLength: 3 })` → `getWinnerIndices` → verify index validity and optimality

### Integration Notes

- No HTTP requests: all data is in-memory mock data; TanStack Query wraps a synchronous function.
- Framer Motion: wrap tests in `<MotionConfig reducedMotion="always">` to disable animations in test environment.
- shadcn/ui: components are unstyled in test environment; test logic/aria attributes, not visual output.
