# Implementation Plan: EduPath College Discovery Platform

## Overview

Full rebuild of the existing Next.js starter into the production-grade EduPath platform. Work proceeds in the `src/` directory tree. Each task group is independently runnable. The final task wires everything together and removes the legacy top-level directories.

All imports use the `@/` path alias. All code is TypeScript with `strict: true`. Tailwind classes reference the custom `navy`, `electric`, and `gold` tokens defined in `tailwind.config.js`.

---

## Tasks

- [x] 1. Bootstrap: tsconfig paths, Tailwind tokens, font config, and dependencies
  - Update `tsconfig.json` to add `"paths": { "@/*": ["./src/*"] }` and set `baseUrl: "."`. Create `src/` directory.
  - Extend `tailwind.config.js` with full colour scales: `navy: { 900: '#0A0F1E', 800: '#0F172A', 700: '#1E293B' }`, `electric: { 500: '#3B82F6', 400: '#60A5FA' }`, `gold: { 500: '#F59E0B', 400: '#FBBF24' }`, `success: '#10B981'`. Add `fontFamily.display` (Playfair Display) and `fontFamily.sans` (DM Sans). Update `content` globs to include `./src/**/*.{ts,tsx}`.
  - Install production dependencies: `zustand`, `@tanstack/react-query`, `framer-motion`, `@radix-ui/react-tabs`, `@radix-ui/react-select`, `@radix-ui/react-slider`, `@radix-ui/react-tooltip`, `@radix-ui/react-dialog`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`.
  - Install dev dependencies: `vitest`, `@vitejs/plugin-react`, `fast-check`, `@testing-library/react`, `@testing-library/user-event`, `jsdom`.
  - Create `src/styles/globals.css` importing Tailwind directives and setting `html { background: #0A0F1E; color: #F1F5F9; }`.
  - _Requirements: 8.1–8.7, 12.7_

- [x] 2. TypeScript domain model
  - Create `src/types/college.ts` with all six exported interfaces: `Course`, `Review`, `College`, `CollegeFilters`, `PredictorInput`, `PredictorResult`.
  - Export `DEFAULT_FILTERS: CollegeFilters` constant.
  - _Requirements: 1.1–1.6_

  - [ ]* 2.1 Write unit tests for type conformance
    - In `src/types/college.test.ts`, write compile-time `satisfies` checks and runtime `typeof` guards for all interfaces.
    - _Requirements: 1.7_

- [x] 3. Mock data — 50+ colleges
  - Create `src/lib/data/colleges.ts` exporting `const colleges: College[]` with at least 50 entries.
  - Include all required institutions: IIT Bombay, IIT Delhi, IIT Madras, IIT Kanpur, IIT Kharagpur, IIT Roorkee, IIT Guwahati, NIT Trichy, NIT Surathkal, NIT Warangal, NIT Calicut, BITS Pilani, BITS Goa, BITS Hyderabad, VIT Vellore, Manipal Institute of Technology, DTU Delhi, NSUT Delhi, Jadavpur University, Anna University, IIIT Hyderabad, IIIT Allahabad, Thapar University, SRM University Chennai, Amrita University, PSG Tech, Coimbatore Institute of Technology, BIT Ranchi, PEC Chandigarh, NIT Jaipur, NIT Rourkela, MNNIT Allahabad, NIT Durgapur, NIT Kurukshetra, NIT Hamirpur, NIT Bhopal, SVNIT Surat, NIT Silchar, AMU Aligarh, BHU Varanasi, Jamia Millia Islamia, Christ University Bengaluru, Symbiosis Pune, LPU Phagwara, Chandigarh University, Amity University Noida, KIIT Bhubaneswar, and Bennett University Greater Noida.
  - Assign realistic NIRF values: IITs 1–10, NITs 20–80, private/deemed 50–200.
  - Each entry must have `courses.length >= 2` and `reviews.length >= 2`.
  - Set `placements.placementRate` between 0 and 100 for every entry.
  - Export `collegeCutoffs: Record<string, Partial<Record<PredictorInput['exam'], number>>>` — each IIT entry gets a `'JEE Advanced'` cutoff, each NIT entry gets a `'JEE Main'` cutoff, medical colleges get a `'NEET'` cutoff. These cutoff values are used directly by the predictor.
  - Add per-college fields for realistic variety: hostel fees, scholarship availability (as tags), accreditation tags.
  - Create `src/lib/data/courses.ts` exporting a flat `Course[]` array of all unique courses referenced across colleges.
  - _Requirements: 2.1–2.6_

  - [ ]* 3.1 Write property tests for data invariants
    - In `src/lib/data/colleges.property.test.ts`, assert:
      - `colleges.length >= 50`
      - All required institution names from Req 2.2 are present
      - `placementRate ∈ [0, 100]` for every entry
      - `nirf >= 1 && Number.isInteger(nirf)` for every entry
      - `courses.length >= 2 && reviews.length >= 2` for every entry
    - _Requirements: 2.1–2.5_

- [x] 4. Utility functions — filtering, predictor, formatters, animations
  - Create `src/lib/utils/filterColleges.ts` — `filterColleges(colleges, filters)`:
    - Keyword search across `name`, `shortName`, `location.city`, `location.state`, `tags`
    - Type filter, exam filter (array includes), state filter, NIRF range [min, max], fees range in lakhs
    - Sort by: `nirf` asc, `rating` desc, `fees` (by `fees.min`) asc/desc, `placement` (by `avgPackage`) desc
  - Create `src/lib/utils/predictor.ts`:
    - Export `CATEGORY_MULTIPLIERS`: General=1.0, EWS=1.25, OBC=1.5, SC=3.0, ST=4.0
    - `computeChance(rank, baseCutoff, exam, category)` — applies multiplier, then:
      - JEE Advanced: ≤1.0× → High(90%), ≤1.5× → Medium(60%), ≤2.5× → Low(30%), else Very Low(10%)
      - JEE Main: ≤1.0× → High, ≤2.0× → Medium, ≤4.0× → Low, else Very Low
      - NEET: ≤1.0× → High, ≤1.8× → Medium, ≤3.0× → Low, else Very Low
    - `runPredictor(input, colleges, cutoffs)` — filters to colleges accepting `input.exam`, computes chance for each, returns sorted `PredictorResult[]` (High first)
    - Include score grouping for "High Chance" (>80%), "Good Chance" (50–80%), "Low Chance" (20–50%) labels for the UI columns
  - Create `src/lib/utils/formatters.ts` — `formatFees(n)`, `formatLPA(n)`, `formatPercent(n)`
  - Create `src/lib/utils/animations.ts` — `pageVariants`, `cardVariants(index)`, `drawerVariants`, `tabContentVariants`
  - Create `src/lib/utils/filterParams.ts` — `serializeFilters(filters): URLSearchParams` and `deserializeFilters(params): CollegeFilters`
  - _Requirements: 4.2–4.4, 4.8, 7.4, 7.5, 11.2–11.5_

  - [ ]* 4.1 Write unit tests for filterColleges
    - Test type/exam/state/NIRF/fees filters individually, combined, empty results, sort correctness.
    - _Requirements: 4.2, 4.3_

  - [ ]* 4.2 Write property test — filter result subset invariant
    - Every result from `filterColleges` must satisfy all active filter criteria.
    - **Feature: edupath-college-discovery, Property 4**. _Requirements: 4.3_

  - [ ]* 4.3 Write property test — URL filter round-trip
    - `serializeFilters → deserializeFilters` must be identity.
    - **Feature: edupath-college-discovery, Property 5**. _Requirements: 4.8_

  - [ ]* 4.4 Write unit tests for predictor
    - Concrete rank/cutoff examples for all 3 exams × 5 categories, including boundary values.
    - _Requirements: 7.4, 7.5_

  - [ ]* 4.5 Write property tests for predictor
    - Property 6: every result college accepts the selected exam.
    - Property 7: `computeChance` returns exact tier per threshold formula.
    - **Feature: edupath-college-discovery, Properties 6 & 7**. _Requirements: 7.3–7.5, 10.5_

- [x] 5. Zustand stores
  - `src/lib/store/filterStore.ts` — `useFilterStore` with `filters: CollegeFilters`, `setFilter<K>(key, value)`, `resetFilters()`. No persistence.
  - `src/lib/store/compareStore.ts` — `useCompareStore` with `colleges: College[]`, `addCollege` (max-3 by shifting index 0), `removeCollege(id)`, `clearCompare`. Persist via `zustand/middleware/persist` → `sessionStorage` key `edupath-compare`. SSR-safe (try/catch around `createJSONStorage`).
  - _Requirements: 9.1–9.4_

  - [ ]* 5.1 Write unit tests for filter store (_Requirements: 9.1, 9.5_)
  - [ ]* 5.2 Write property test — filter store reset idempotence (**Property 9**. _Requirements: 9.5_)
  - [ ]* 5.3 Write unit tests for compare store (_Requirements: 9.2, 9.3_)
  - [ ]* 5.4 Write property test — compare store capacity invariant (**Property 8**. _Requirements: 6.2, 9.3_)

- [x] 6. Custom hooks
  - `src/hooks/useCollegeSearch.ts` — TanStack Query `useQuery(['colleges', filters])` wrapping `filterColleges`, `staleTime: 5min`. Returns `{ data, isLoading, error }`.
  - `src/hooks/useCompare.ts` — wraps `useCompareStore`, exposes `{ selected, add, remove, clear, isSelected(id) }`.
  - `src/hooks/usePredictor.ts` — exposes `{ results, compute, isComputing }`. Async-tick `isComputing` flag for skeleton UX.
  - _Requirements: 10.1–10.5_

- [x] 7. Checkpoint — run all tests written so far
  - Run `vitest --run`. All tests must pass before proceeding.

- [x] 8. shadcn/ui primitives and shared UI components
  - Add shadcn/ui primitives to `src/components/ui/`: `button.tsx`, `badge.tsx`, `card.tsx`, `input.tsx`, `skeleton.tsx`, `tabs.tsx`, `select.tsx`, `slider.tsx`, `dialog.tsx`, `drawer.tsx`, `tooltip.tsx`. Export all from `index.ts`.
  - `src/components/ui/RatingBadge.tsx` — `★ {rating}` in gold, `aria-label="Rating: {rating} out of 5"`.
  - `src/components/ui/FeeBadge.tsx` — `₹{min}L – ₹{max}L`, colour-tiered: green <1L, amber 1–3L, red >3L.
  - `src/components/ui/RankBadge.tsx` — NIRF rank with medal icon (Lucide `Medal`), electric blue accent.
  - `src/components/ui/ChanceBadge.tsx` — colour-coded by tier: green=High, amber=Medium, red=Low, slate=Very Low.
  - `src/components/ui/CollegeTypeBadge.tsx` — distinct colours: IIT=electric blue, NIT=indigo, Private=purple, Deemed=teal, State=slate.
  - `src/components/shared/Navbar.tsx` — glassmorphism style (`backdrop-blur-md bg-navy-900/80`). Logo: "EduPath" + compass/graduation Lucide icon. Links: Colleges, Compare (with count badge from `useCompareStore`), Predictor. Mobile hamburger menu with slide-out drawer.
  - `src/components/shared/SearchBar.tsx` — standalone search input for the landing page. On submit navigates to `/colleges?q={query}`.
  - `src/components/shared/Footer.tsx` — dark footer with copyright and nav links.
  - `src/components/shared/PageTransition.tsx` — `motion.div` with `pageVariants`.
  - _Requirements: 8.1–8.10, 3.6, 12.2_

  - [ ]* 8.1 Write unit tests for RatingBadge and FeeBadge — aria-label, gold class, fee tier colour boundaries.

- [x] 9. CollegeCard component
  - `src/components/college/CollegeCard.tsx` — client component. Props: `college`, `index?`, `chanceResult?`.
  - Display: logo + name (Playfair Display) + location, `CollegeTypeBadge`, `RankBadge` (top-right corner), `RatingBadge` (gold stars), `FeeBadge`, avg placement package, up to 3 exam chips, "View Details" → `/colleges/[id]`, "+ Compare" button (calls `useCompare().add`).
  - Framer Motion: `cardVariants(index)` entrance, `whileHover={{ scale: 1.02 }}` spring.
  - When `chanceResult` provided: render `ChanceBadge` overlay with `chancePercent`.
  - `src/components/college/CollegeCardSkeleton.tsx` — matching skeleton layout using shadcn `Skeleton`.
  - _Requirements: 4.7, 5.8, 11.3, 11.7_

- [x] 10. SearchFilterBar component
  - `src/components/college/SearchFilterBar.tsx` — client component reading/writing `useFilterStore`.
  - Exam filter: checkboxes for JEE Main, JEE Advanced, CAT, NEET.
  - College Type: checkboxes for IIT, NIT, Private, Deemed, State.
  - Fees range: dual `Slider` [0–25 LPA].
  - Rating filter: buttons for 4+, 3+, 2+ stars.
  - State: multi-select (derived from unique states in college data).
  - NIRF rank range: dual `Slider`.
  - Sort options: NIRF Rank, Rating, Fees Low→High, Fees High→Low, Placement Package.
  - "Active filters" chips showing each applied filter with ×-remove.
  - "Clear all filters" button → `resetFilters()`.
  - On mount: read `useSearchParams()` → pre-populate `query` from `?q`.
  - On mobile: render as a slide-in `Drawer` triggered by a "Filters" button.
  - _Requirements: 4.2–4.6_

- [x] 11. CollegesGrid and college listing page
  - `src/components/college/CollegesGrid.tsx` — responsive 2-column grid. Loading: 6 `CollegeCardSkeleton`. Empty: "No colleges found. Try different filters." with "Clear all filters" action.
  - `src/app/colleges/page.tsx` — client component.
    - Full-width debounced search bar at top showing dynamic result count: "Showing {n} colleges".
    - Left sidebar: `SearchFilterBar` (sticky). Right: `CollegesGrid`.
    - Sync filters ↔ URL via `useSearchParams` + `useRouter`.
    - "Load More" button (not full pagination) — reveal 12 more cards per click.
    - `useMemo` for filtered results; virtualise list if >50 items.
  - _Requirements: 4.1, 4.3–4.10_

- [x] 12. College detail page
  - `src/components/college/CollegeHero.tsx` — full-width hero image with dark gradient overlay. Name (Playfair Display h1), `CollegeTypeBadge`, location, established year. Key stats row: NIRF Rank | Rating | Avg Package | Total Courses. "+ Compare" button (disabled + `Tooltip` if 3 already selected). "Save" button (UI only).
  - `src/components/college/CollegeTable.tsx` — table: Course | Duration | Total Fees | Seats | Eligibility. Filterable by course type (B.Tech, M.Tech, MBA, etc.).
  - `src/components/college/CollegeTabs.tsx` — client component, 6 tabs with `AnimatePresence` + `tabContentVariants`:
    1. **Overview** — `about` text, key highlights grid, exams accepted, location map placeholder.
    2. **Courses & Fees** — `CollegeTable` with course-type filter.
    3. **Placements** — avg/max package stat cards, placement rate, CSS-only bar chart (year-wise trend, hardcoded data), top recruiters as text badges.
    4. **Reviews** — 5-star breakdown visual bars, `Review` cards (anonymous name, date, `RatingBadge`, body, tags), "Write a Review" CTA (Dialog, no backend).
    5. **Campus Life** — static placeholder with tags and a description paragraph.
    6. **Q&A** — static placeholder.
  - `src/app/colleges/[id]/page.tsx` — server component. `notFound()` if id missing. Renders `CollegeHero` + `CollegeTabs`. Wrapped in `PageTransition`. Add `generateMetadata` for SEO (title, description from `college.about`).
  - `src/components/college/DetailPageSkeleton.tsx` — skeleton layout matching the detail page structure.
  - _Requirements: 5.1–5.11, 11.5_

- [x] 13. CompareTable component and getWinnerIndices utility
  - `src/lib/utils/compareWinners.ts` — `getWinnerIndices(colleges)`: min wins for fees/nirf, max wins for rating/avgPackage/maxPackage/placementRate.
  - `src/components/compare/CompareTable.tsx` — grouped row categories:
    - **Basic Info**: NIRF Rank, Established, Type, Location, Accreditation
    - **Fees**: Min Fees/year, Max Fees/year (formatted), Scholarship Available
    - **Academics**: Courses Offered (count), Exams Accepted, Student-Faculty Ratio (static placeholder)
    - **Placements**: Avg Package, Max Package, Placement Rate %, Top Recruiters (3 badges)
    - **Ratings**: Overall, Academics, Campus Life, Placement (static breakdowns from rating)
  - Winning cells: `text-gold font-bold bg-gold/10`. Placeholder when `colleges.length < 2`.
  - Toggle: "Show differences only" — hide rows where all values are equal.
  - Export as image: `html2canvas` integration — "Export" button captures the table div.
  - _Requirements: 6.3, 6.4, 6.9_

  - [ ]* 13.1 Write property test — CompareTable winner highlighting correctness (**Property 10**. _Requirements: 6.9_)

- [x] 14. CompareDrawer component and compare page
  - `src/components/compare/CompareDrawer.tsx` — fixed bottom bar. Shows selected college thumbnails (logo + name). "Compare Now" → `/compare`. "×" remove per college. `AnimatePresence` + `drawerVariants` (spring y=100%→0).
  - `src/app/compare/page.tsx` — client component.
    - If 0 colleges selected: empty state with inline search to add colleges directly. Suggest popular comparisons: "IIT Bombay vs IIT Delhi", "VIT vs Manipal", etc.
    - If 1+ selected: `CompareTable` on right, add-slot panel on left ("+ Add College" search).
    - "Add College" slot if <3 colleges selected, each column has a "Remove" button.
    - Bloomberg terminal aesthetic: data-dense, clear hierarchy, monospace numbers.
  - Add `CompareDrawer` to `src/app/layout.tsx`.
  - Install `html2canvas` for export feature.
  - _Requirements: 6.1–6.8, 11.4_

- [ ] 15. Checkpoint — verify colleges listing, detail, and compare pages render correctly
  - Run dev server, manually verify all three pages render with mock data.
  - Run all tests. Fix any failures before proceeding.

- [x] 16. Predictor page
  - `src/components/predictor/PredictorForm.tsx` — 3-step wizard with progress bar:
    - Step 1: Exam selection (JEE Main / JEE Advanced / CAT / NEET) — large card buttons.
    - Step 2: Rank input (number) + Category (General/OBC/SC/ST/EWS) + Home State select.
    - Step 3: Preferences — course type preference, college type preference (IIT/NIT/Private), max fees slider.
    - Framer Motion step transitions (slide in from right, slide out to left).
    - Validation: rank must be positive number; show inline errors.
    - "How is this calculated?" expandable accordion info box.
    - Disclaimer paragraph (predictions are indicative).
  - `src/components/predictor/PredictorResults.tsx` — 3 columns: "High Chance" | "Good Chance" | "Low Chance". Each column shows `CollegeCard` with `ChanceBadge` overlay. "Compare top picks" CTA pre-fills compare page with top 3. "Save this prediction" button (UI only). Staggered card entrance animation.
  - `src/app/predictor/page.tsx` — client component. `usePredictor` hook. Renders `PredictorForm` → on submit → `PredictorResults`. Loading skeleton during `isComputing`.
  - _Requirements: 7.1–7.9, 11.8_

- [x] 17. Root layout, landing page, and final wiring
  - `src/app/layout.tsx` — root layout. `Playfair_Display` + `DM_Sans` via `next/font/google` with CSS vars. `<html className={...}>` + `<body className="bg-navy-900 text-slate-100 font-sans">`. Wrap children in `QueryClientProvider`. Include `<Navbar />`, `<main>`, `<Footer />`, `<CompareDrawer />`. Add `<MotionConfig reducedMotion="user">` wrapper.
  - `src/app/page.tsx` — SSG server component.
    - Full-viewport hero: "Find Your Perfect College" (Playfair Display, large), tagline, centred `SearchBar` (prominent, 600px wide on desktop).
    - Stats row: "50+ Top Institutions | 28 States | 10L+ Students" — client sub-component with count-up animation.
    - Popular searches: chip links for IIT, NIT, MBA, Engineering, NEET.
    - Featured colleges: horizontal-scroll row of 6 `CollegeCard` components (lowest NIRF). Staggered entrance.
    - "Try the Predictor" CTA section with electric blue gradient background.
    - Fully responsive: hero stacks vertically on `< md`.
  - `src/app/not-found.tsx` — themed 404 with link back to `/colleges`.
  - Add SEO meta tags to all pages via `generateMetadata`.
  - _Requirements: 3.1–3.7, 12.1, 12.6_

- [x] 18. Migrate and clean up legacy directories
  - Remove or redirect legacy top-level `app/`, `components/`, `lib/`, `mocks/` once `src/` equivalents are wired.
  - Verify `@/` path alias works everywhere. Run `npx tsc --noEmit` — zero errors.
  - _Requirements: 1.7, 12.1–12.7_

- [ ] 19. Final polish and production readiness
  - Loading skeletons: `CollegeCardSkeleton` and `DetailPageSkeleton` in all loading states.
  - Empty states: zero search results, compare with no colleges, predictor before submission.
  - Error boundaries: wrap each page's main content.
  - Responsive audit: filters as slide-in Drawer on mobile; compare table horizontal-scroll on mobile; detail page bottom tab bar on mobile.
  - Performance: `React.memo` on `CollegeCard`, `useMemo` for all filter computations.
  - SEO: `generateMetadata` on colleges listing, college detail, compare, and predictor pages.
  - Subtle page transition animations between routes via `PageTransition`.
  - Run `vitest --run` — all tests pass. Run `npx tsc --noEmit` — zero errors.
  - _Requirements: all_

---

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1"] },
    { "wave": 2, "tasks": ["2"] },
    { "wave": 3, "tasks": ["3"] },
    { "wave": 4, "tasks": ["4"] },
    { "wave": 5, "tasks": ["5"] },
    { "wave": 6, "tasks": ["6"] },
    { "wave": 7, "tasks": ["7"] },
    { "wave": 8, "tasks": ["8"] },
    { "wave": 9, "tasks": ["9", "10"] },
    { "wave": 10, "tasks": ["11", "12"] },
    { "wave": 11, "tasks": ["13"] },
    { "wave": 12, "tasks": ["14"] },
    { "wave": 13, "tasks": ["15"] },
    { "wave": 14, "tasks": ["16"] },
    { "wave": 15, "tasks": ["17"] },
    { "wave": 16, "tasks": ["18"] },
    { "wave": 17, "tasks": ["19"] }
  ]
}
```

## Notes

- Tasks marked `*` are optional — skip for a faster MVP.
- Property tests use **fast-check**, minimum 100 iterations each.
- Unit/component tests use **Vitest** + **@testing-library/react**.
- All internal imports use `@/` — no relative `../../` paths inside `src/`.
- Compare store must handle SSR gracefully (sessionStorage not available server-side).
- Wrap root layout in `<MotionConfig reducedMotion="user">` to respect OS motion preferences.
- `html2canvas` is required for the compare page export feature — add to production deps in task 14.
- shadcn/ui components can be added via `npx shadcn-ui@latest add <component>` or copied manually.
- Target: Lighthouse 90+ Performance, 95+ Accessibility.
