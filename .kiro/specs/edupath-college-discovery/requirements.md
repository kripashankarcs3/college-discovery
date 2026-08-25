# Requirements Document

## Introduction

EduPath is a production-grade college discovery platform for Indian students built on Next.js 14 (App Router). It enables students to search and filter 50+ Indian colleges by type, fees, NIRF rank, entrance exam, and location; explore rich college detail pages with tabs for Overview, Courses, Placements, and Reviews; compare up to three colleges side-by-side; and use a Rank Predictor tool to estimate admission chances based on JEE/NEET rank inputs. The platform follows an editorial/magazine design aesthetic with a dark navy background, electric blue accents, warm gold highlights, Playfair Display headings, and DM Sans body text — delivering a luxury education brand feel with Framer Motion animations throughout.

The existing codebase is a minimal Next.js starter with a simplified `College` type and ~12 mock entries. This spec governs a full rebuild of types, data, pages, components, stores, hooks, and utilities to meet the production-grade requirements described below.

---

## Glossary

- **Platform**: The EduPath Next.js 14 application.
- **College**: A higher-education institution represented by the `College` TypeScript interface.
- **Course**: A programme offered by a College, represented by the `Course` interface.
- **Review**: A student-authored review of a College, represented by the `Review` interface.
- **User**: A student visitor interacting with the Platform.
- **Rank Predictor**: The tool that accepts a JEE Main / JEE Advanced / NEET rank and predicts admission chances at each College.
- **Compare Drawer**: The persistent UI element that tracks colleges selected for comparison.
- **Filter Store**: The Zustand store holding active filter state across the colleges listing page.
- **Compare Store**: The Zustand store holding the list of colleges (max 3) selected for comparison.
- **NIRF**: National Institutional Ranking Framework — the official Indian ranking index used as `nirf` on the `College` model.
- **LPA**: Lakhs Per Annum — unit used for placement package figures.
- **TanStack Query**: The async-state management library (`@tanstack/react-query`) used for all data-fetching hooks.
- **Framer Motion**: The animation library used for page transitions and component entrance animations.
- **shadcn/ui**: The component library whose primitives (Button, Badge, Card, Input, Tabs, Select, Slider, Dialog, Drawer, Skeleton, Tooltip) are used as the UI foundation.
- **Zustand**: The lightweight state-management library used for Compare Store and Filter Store.

---

## Requirements

### Requirement 1: TypeScript Domain Model

**User Story:** As a developer, I want a complete, strictly-typed domain model, so that every part of the Platform shares a single source of truth for data shapes and compile-time safety is guaranteed throughout.

#### Acceptance Criteria

1. THE Platform SHALL export a `Course` interface with fields: `id: string`, `name: string`, `duration: string`, `fees: number`, `seats: number`, `eligibility: string`.
2. THE Platform SHALL export a `Review` interface with fields: `id: string`, `author: string`, `rating: number`, `date: string`, `body: string`, `tags: string[]`.
3. THE Platform SHALL export a `College` interface with fields: `id: string`, `name: string`, `shortName: string`, `location: { city: string; state: string }`, `type: 'IIT' | 'NIT' | 'Private' | 'Deemed' | 'State'`, `fees: { min: number; max: number }`, `rating: number`, `nirf: number`, `exams: ('JEE Main' | 'JEE Advanced' | 'CAT' | 'NEET' | 'GATE' | 'CLAT')[]`, `courses: Course[]`, `placements: { avgPackage: number; maxPackage: number; placementRate: number; topRecruiters: string[] }`, `reviews: Review[]`, `established: number`, `logo: string`, `heroImage: string`, `about: string`, `tags: string[]`.
4. THE Platform SHALL export a `CollegeFilters` interface with fields: `query: string`, `type: College['type'] | ''`, `exam: string`, `state: string`, `nirf: [number, number]`, `fees: [number, number]`, `sortBy: 'nirf' | 'rating' | 'fees' | 'placement'`.
5. THE Platform SHALL export a `PredictorInput` interface with fields: `exam: 'JEE Main' | 'JEE Advanced' | 'NEET'`, `rank: number`, `category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS'`.
6. THE Platform SHALL export a `PredictorResult` interface with fields: `college: College`, `chance: 'High' | 'Medium' | 'Low' | 'Very Low'`, `chancePercent: number`, `cutoffRank: number`.
7. WHEN TypeScript compilation is run, THE Platform SHALL produce zero type errors across all source files.

---

### Requirement 2: College Mock Data

**User Story:** As a developer, I want at least 50 realistic Indian college entries, so that all features — filtering, comparison, prediction, and detail pages — have sufficient variety to demonstrate real platform behaviour.

#### Acceptance Criteria

1. THE Platform SHALL include at least 50 `College` objects in `src/lib/data/colleges.ts` conforming exactly to the `College` interface.
2. THE Platform SHALL include the following specific institutions: IIT Bombay, IIT Delhi, IIT Madras, IIT Kanpur, IIT Kharagpur, IIT Roorkee, IIT Guwahati, NIT Trichy, NIT Surathkal, NIT Warangal, NIT Calicut, BITS Pilani, BITS Goa, BITS Hyderabad, VIT Vellore, Manipal Institute of Technology, DTU Delhi, NSUT Delhi, Jadavpur University, Anna University, IIIT Hyderabad, IIIT Allahabad, Thapar University, SRM University Chennai, Amrita University, PSG Tech, Coimbatore Institute of Technology, Birla Institute of Technology Ranchi, PEC Chandigarh, NIT Jaipur, NIT Rourkela, MNNIT Allahabad, NIT Durgapur, NIT Kurukshetra, NIT Hamirpur, NIT Bhopal, SVNIT Surat, NIT Silchar, Aligarh Muslim University, BHU Varanasi, Jamia Millia Islamia, Delhi Technological University (duplicate-check with DTU), Christ University Bengaluru, Symbiosis Institute of Technology Pune, LPU Phagwara, Chandigarh University, Amity University Noida, KIIT University Bhubaneswar, Kalinga Institute of Industrial Technology, and Bennett University Greater Noida.
3. WHEN a `College` entry includes placement data, THE Platform SHALL set `placements.placementRate` to a value between 0 and 100.
4. WHEN a `College` entry includes a `nirf` value, THE Platform SHALL set it to a positive integer reflecting realistic NIRF rankings (IITs: 1–10, NITs: 20–80, private: 50–200).
5. THE Platform SHALL include at least 2 `Course` objects and at least 2 `Review` objects per `College` entry.
6. THE Platform SHALL include a `src/lib/data/courses.ts` file exporting a flat array of all unique `Course` objects referenced across colleges.

---

### Requirement 3: Landing Page with Hero Search

**User Story:** As a User, I want an engaging landing page with a prominent search bar, so that I can immediately begin discovering colleges that match my interests.

#### Acceptance Criteria

1. THE Platform SHALL render a full-viewport hero section on the root route (`/`) containing the EduPath brand name, a tagline, and a `SearchBar` component.
2. WHEN a User types a query into the `SearchBar` and submits it, THE Platform SHALL navigate the User to `/colleges?q={query}`.
3. THE Platform SHALL display a statistics bar on the landing page showing total college count, total state count, and a "50+ top institutions" label derived from the mock data.
4. THE Platform SHALL display a featured-colleges section showing cards for 6 top-ranked colleges (lowest `nirf` values) below the hero.
5. WHEN Framer Motion is available, THE Platform SHALL animate the hero heading, subheading, search bar, and statistics bar using staggered entrance animations on mount.
6. THE Platform SHALL display a `Navbar` component with links to `/colleges`, `/compare`, and `/predictor` on every page via the root layout.
7. THE Platform SHALL be fully responsive: hero layout stacks vertically on viewports narrower than 768 px and displays side-by-side content on wider viewports.

---

### Requirement 4: College Listing with Multi-Faceted Filters

**User Story:** As a User, I want to filter and sort colleges by multiple criteria simultaneously, so that I can narrow down institutions that fit my academic profile and budget.

#### Acceptance Criteria

1. THE Platform SHALL render the college listing at `/colleges` displaying all colleges by default, sorted by `nirf` ascending.
2. THE Platform SHALL provide filter controls for: keyword search, college type (IIT / NIT / Private / Deemed / State), entrance exam, state, NIRF rank range (slider), annual fees range (slider), and sort order.
3. WHEN a User changes any filter value, THE Filter Store SHALL update immediately and the listing SHALL re-render with matching results without a full page reload.
4. THE Platform SHALL persist filter state in the Filter Store so that navigating to a detail page and pressing Back returns the User to the same filtered view.
5. WHEN the URL contains a `q` query parameter, THE Platform SHALL pre-populate the keyword search filter from that parameter on mount.
6. WHEN no colleges match the active filters, THE Platform SHALL display an empty-state message with a "Clear filters" action.
7. THE Platform SHALL display each college as a `CollegeCard` showing: name, type badge, location, NIRF rank, rating, fees range, placement rate, and up to 3 exam tags.
8. THE Platform SHALL support URL-based filter sharing: active filters SHALL be reflected as query parameters so that a shared URL reproduces the same filtered view.
9. WHEN the listing is loading, THE Platform SHALL display skeleton cards in place of `CollegeCard` components.
10. THE Platform SHALL use TanStack Query to fetch and cache college data, with a stale time of 5 minutes.

---

### Requirement 5: College Detail Page with Tabs

**User Story:** As a User, I want a detailed college profile page with tabbed sections, so that I can explore comprehensive information about a specific institution before making a decision.

#### Acceptance Criteria

1. THE Platform SHALL render a college detail page at `/colleges/[id]` for each college in the dataset.
2. THE Platform SHALL display a full-width hero image with an overlay containing the college name, type, location, and NIRF rank.
3. THE Platform SHALL render four tabs: Overview, Courses, Placements, and Reviews.
4. WHEN the Overview tab is active, THE Platform SHALL display the college's `about` text, key stats (established year, rating, fees range, top exams), and a tags list.
5. WHEN the Courses tab is active, THE Platform SHALL display a `CollegeTable` listing all courses with columns: name, duration, annual fees, seats, and eligibility.
6. WHEN the Placements tab is active, THE Platform SHALL display average package (LPA), maximum package (LPA), placement rate (%), and a list of top recruiters.
7. WHEN the Reviews tab is active, THE Platform SHALL display all `Review` objects for the college, each showing author name, date, star rating, body text, and tags.
8. THE Platform SHALL display an "Add to Compare" button on the detail page that adds the college to the Compare Store (if fewer than 3 colleges are already selected).
9. WHEN the Compare Store already contains 3 colleges, THE Platform SHALL display the "Add to Compare" button as disabled with a tooltip explaining the 3-college limit.
10. WHEN Framer Motion is available, THE Platform SHALL animate tab content transitions using a fade-and-slide entrance animation.
11. IF a college `id` does not exist in the dataset, THEN THE Platform SHALL render the Next.js `notFound()` response.

---

### Requirement 6: College Comparison Tool

**User Story:** As a User, I want to compare up to three colleges side-by-side on a dedicated page, so that I can make an informed decision based on a structured attribute comparison.

#### Acceptance Criteria

1. THE Platform SHALL render the comparison tool at `/compare`.
2. THE Platform SHALL allow the User to select up to 3 colleges for comparison; selecting a 4th SHALL replace the last selected college.
3. THE Platform SHALL display a `CompareTable` with rows for: College Name, Type, Location, Established, NIRF Rank, Rating, Annual Fees (min–max), Avg Package (LPA), Max Package (LPA), Placement Rate, Top Exams, and Courses count.
4. WHEN fewer than 2 colleges are selected, THE Platform SHALL display a placeholder prompt inside the comparison area.
5. THE Compare Store SHALL be a Zustand store persisted in `sessionStorage` so that the comparison state survives page navigations within the same browser tab.
6. THE Platform SHALL display a `CompareDrawer` — a fixed bottom bar — that appears whenever 1 or more colleges are in the Compare Store, showing selected college names and a "Compare Now" link to `/compare`.
7. WHEN a User clicks "Remove" next to a college in the `CompareDrawer`, THE Compare Store SHALL remove that college immediately.
8. WHEN Framer Motion is available, THE Platform SHALL animate the `CompareDrawer` sliding up from the bottom when it first appears and sliding down when it disappears.
9. THE Platform SHALL highlight the winning value in each `CompareTable` row (e.g., lowest fees, highest rating) with a gold accent colour.

---

### Requirement 7: Rank Predictor Tool

**User Story:** As a User, I want to input my entrance exam rank and category, so that I can receive a prediction of my admission chances at each college in the dataset.

#### Acceptance Criteria

1. THE Platform SHALL render the Rank Predictor at `/predictor`.
2. THE Platform SHALL render a `PredictorForm` accepting: exam selection (JEE Main, JEE Advanced, or NEET), numeric rank input, and category selection (General, OBC, SC, ST, EWS).
3. WHEN a User submits the `PredictorForm`, THE Predictor SHALL compute a `PredictorResult` for each college that accepts the selected exam.
4. THE Predictor SHALL assign `chance` values according to the following cutoff logic:
   - JEE Advanced: rank ≤ cutoff × 1.0 → High; ≤ × 1.5 → Medium; ≤ × 2.5 → Low; > × 2.5 → Very Low.
   - JEE Main: rank ≤ cutoff × 1.0 → High; ≤ × 2.0 → Medium; ≤ × 4.0 → Low; > × 4.0 → Very Low.
   - NEET: rank ≤ cutoff × 1.0 → High; ≤ × 1.8 → Medium; ≤ × 3.0 → Low; > × 3.0 → Very Low.
5. THE Predictor SHALL apply a category multiplier to the effective cutoff rank: OBC × 1.5, SC × 3.0, ST × 4.0, EWS × 1.25, General × 1.0.
6. THE Platform SHALL display `PredictorResults` as a sortable list of `CollegeCard`-style cards, each annotated with a chance badge (colour-coded: green for High, amber for Medium, red for Low, grey for Very Low) and the `chancePercent`.
7. WHEN the `PredictorForm` is submitted with a rank ≤ 0 or non-numeric value, THE Platform SHALL display a validation error message and SHALL NOT compute results.
8. WHEN Framer Motion is available, THE Platform SHALL animate result cards entering the list with a staggered slide-up effect.
9. THE Platform SHALL display a disclaimer on the predictor page stating that predictions are indicative and based on historical cutoff data.

---

### Requirement 8: Global Design System and Theming

**User Story:** As a User, I want a consistent, polished visual identity across all pages, so that the Platform communicates quality and inspires confidence in the information presented.

#### Acceptance Criteria

1. THE Platform SHALL use a dark navy (`#0A0F1E`) background colour as the global base across all pages.
2. THE Platform SHALL use electric blue (`#3B82F6`) as the primary accent colour for interactive elements (buttons, links, active states).
3. THE Platform SHALL use warm gold (`#F59E0B`) as the highlight colour for badges, winning values, and emphasis elements.
4. THE Platform SHALL load "Playfair Display" for all heading elements (`h1`–`h3`) via `next/font/google`.
5. THE Platform SHALL load "DM Sans" for all body text via `next/font/google`.
6. THE Platform SHALL configure `tailwind.config.js` to extend the default palette with the custom colour tokens `navy`, `electric`, and `gold` mapping to the hex values above.
7. THE Platform SHALL apply the Tailwind `dark` variant configuration such that the navy background and light text are the default (not a toggled dark mode — this is the only mode).
8. THE Platform SHALL define a `RatingBadge` component that displays a star rating number with a gold fill and accessible `aria-label`.
9. THE Platform SHALL define a `FeeBadge` component that displays a formatted fee range (e.g., "₹2L – ₹4L") with an appropriate colour variant based on fee tier (green < ₹1L, amber ₹1L–₹3L, red > ₹3L).
10. THE Platform SHALL ensure all interactive elements meet WCAG 2.1 AA colour-contrast requirements against the navy background.

---

### Requirement 9: Zustand State Management

**User Story:** As a developer, I want predictable, centralised client-side state for filters and comparison, so that state changes are traceable and components stay decoupled from one another.

#### Acceptance Criteria

1. THE Platform SHALL implement `src/lib/store/filterStore.ts` as a Zustand store exporting `useFilterStore` with state fields matching `CollegeFilters` and actions: `setFilter`, `resetFilters`.
2. THE Platform SHALL implement `src/lib/store/compareStore.ts` as a Zustand store exporting `useCompareStore` with state: `colleges: College[]` and actions: `addCollege`, `removeCollege`, `clearCompare`.
3. WHEN `addCollege` is called and the compare list already contains 3 colleges, THE Compare Store SHALL replace the oldest entry (index 0) with the new college.
4. THE Compare Store SHALL be persisted using Zustand's `persist` middleware targeting `sessionStorage` under the key `edupath-compare`.
5. WHEN `resetFilters` is called, THE Filter Store SHALL restore all fields to their default values: empty strings, full NIRF range [1, 1000], full fees range [0, 50], and sort `'nirf'`.

---

### Requirement 10: Custom Hooks

**User Story:** As a developer, I want reusable custom hooks encapsulating data-fetching and business logic, so that pages remain lean and logic can be tested in isolation.

#### Acceptance Criteria

1. THE Platform SHALL implement `src/hooks/useCollegeSearch.ts` that accepts a `CollegeFilters` object and returns `{ data: College[], isLoading: boolean, error: Error | null }` using TanStack Query.
2. WHEN `CollegeFilters` changes, `useCollegeSearch` SHALL invalidate and re-fetch the filtered college list.
3. THE Platform SHALL implement `src/hooks/useCompare.ts` that wraps `useCompareStore` and exposes `{ selected: College[], add, remove, clear, isSelected: (id: string) => boolean }`.
4. THE Platform SHALL implement `src/hooks/usePredictor.ts` that accepts a `PredictorInput` and returns `{ results: PredictorResult[], compute: (input: PredictorInput) => void, isComputing: boolean }`.
5. WHEN `usePredictor` computes results, THE Hook SHALL return only colleges whose `exams` array includes the selected exam.

---

### Requirement 11: Animations with Framer Motion

**User Story:** As a User, I want smooth, purposeful animations throughout the Platform, so that interactions feel premium and transitions provide spatial context.

#### Acceptance Criteria

1. THE Platform SHALL install `framer-motion` as a production dependency.
2. THE Platform SHALL wrap each page in a `motion.div` with a standard page-transition variant (opacity 0→1, y 20→0, duration 0.4 s).
3. THE Platform SHALL animate `CollegeCard` components with a staggered entrance: each card enters with opacity 0→1 and y 30→0, with a 0.08 s delay per index.
4. THE Platform SHALL animate the `CompareDrawer` with a y-axis slide: enters from y=100% to y=0 and exits to y=100%, using spring physics.
5. WHEN a tab changes on the college detail page, THE Platform SHALL animate the outgoing content fading out and the incoming content fading and sliding in from the right.
6. THE Platform SHALL animate the hero section statistics counter numbers using a count-up entrance animation.
7. WHEN hovering over a `CollegeCard`, THE Platform SHALL apply a subtle scale (1→1.02) and shadow elevation transition using Framer Motion's `whileHover`.

---

### Requirement 12: Folder Structure and File Organisation

**User Story:** As a developer, I want a consistent, documented folder structure, so that contributors can locate any file predictably and the codebase scales without structural ambiguity.

#### Acceptance Criteria

1. THE Platform SHALL place all application routes under `src/app/` following Next.js 14 App Router conventions.
2. THE Platform SHALL organise components into `src/components/ui/` (shadcn primitives), `src/components/college/`, `src/components/compare/`, `src/components/predictor/`, and `src/components/shared/`.
3. THE Platform SHALL place mock data in `src/lib/data/`, Zustand stores in `src/lib/store/`, and utility functions in `src/lib/utils/`.
4. THE Platform SHALL place all TypeScript interfaces and types in `src/types/college.ts`.
5. THE Platform SHALL place all custom hooks in `src/hooks/`.
6. THE Platform SHALL include a `src/app/predictor/page.tsx` route for the Rank Predictor tool.
7. WHEN TypeScript path aliases are configured in `tsconfig.json`, THE Platform SHALL map `@/*` to `./src/*` so that all internal imports use the `@/` prefix rather than relative `../../` paths.
