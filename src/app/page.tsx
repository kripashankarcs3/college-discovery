import { SearchBar } from '@/components/shared'
import { CollegeCard } from '@/components/college'
import { colleges } from '@/lib/data/colleges'
import { PageTransition } from '@/components/shared'
import { motion } from 'framer-motion'
import { pageVariants, cardVariants } from '@/lib/utils/animations'
import { RatingBadge, RankBadge } from '@/components/ui'

// Get featured colleges (lowest NIRF)
const featuredColleges = [...colleges].sort((a, b) => a.nirf - b.nirf).slice(0, 6)

// Get unique states count
const uniqueStates = new Set(colleges.map((c) => c.location.state)).size

export default function LandingPage() {
  const count = colleges.length

  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-purple-900/20 to-navy-900" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-electric/10 via-transparent to-transparent" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-electric/5 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="initial"
              animate="animate"
              className="flex flex-col items-center text-center max-w-4xl mx-auto"
            >
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-electric/10 border border-electric/20 mb-8"
              >
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-sm font-medium text-electric tracking-wide">
                  Trusted by 100,000+ Students
                </span>
              </motion.div>

              <motion.h1
                variants={pageVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-7xl font-display font-bold text-slate-100 mb-6 leading-tight"
              >
                Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric to-purple-400">Perfect College</span>
              </motion.h1>

              <motion.p
                variants={pageVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.3 }}
                className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed"
              >
                Discover, compare, and choose the best engineering and medical colleges in India based on NIRF rankings, placements, and fees.
              </motion.p>

              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.4 }}
                className="w-full max-w-2xl"
              >
                <SearchBar placeholder="Search colleges, cities, courses, or exams..." />
              </motion.div>

              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.5 }}
                className="flex flex-wrap justify-center gap-4 mt-8"
              >
                <div className="px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-center">
                  <div className="text-3xl font-display font-bold text-electric">{featuredColleges[0].nirf}-{featuredColleges[4].nirf}</div>
                  <div className="text-sm text-slate-400">Top NIRF Ranks</div>
                </div>
                <div className="px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-center">
                  <div className="text-3xl font-display font-bold text-gold">{count}</div>
                  <div className="text-sm text-slate-400">Colleges</div>
                </div>
                <div className="px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-center">
                  <div className="text-3xl font-display font-bold text-purple-400">{uniqueStates}</div>
                  <div className="text-sm text-slate-400">States</div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center pt-2">
              <div className="w-1 h-2 bg-slate-400 rounded-full" />
            </div>
          </motion.div>
        </section>

        {/* Featured Colleges Section */}
        <section className="py-24 bg-slate-900/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.h2
                variants={pageVariants}
                initial="initial"
                animate="animate"
                className="text-3xl md:text-4xl font-display font-bold text-slate-100 mb-4"
              >
                Top <span className="text-electric">Rated Colleges</span>
              </motion.h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Curated list of India's best institutions based on NIRF rankings, placements, and academic excellence
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredColleges.map((college, index) => (
                <motion.div
                  key={college.id}
                  variants={cardVariants(index)}
                  initial="initial"
                  animate="animate"
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                  className="transform transition-all duration-300"
                >
                  <CollegeCard college={college} index={index} />
                </motion.div>
              ))}
            </div>

            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.6 }}
              className="mt-12 text-center"
            >
              <a
                href="/colleges"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-electric to-purple-600 hover:from-electric/90 hover:to-purple-600/90 text-white rounded-xl font-semibold shadow-lg shadow-electric/30 hover:shadow-electric/50 hover:-translate-y-1 transition-all duration-200"
              >
                View All Colleges
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </motion.div>
          </div>
        </section>

        {/* Try Predictor Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-electric/5 to-purple-600/5" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.7 }}
                className="p-12 rounded-3xl bg-slate-800/50 backdrop-blur-lg border border-electric/20 shadow-2xl shadow-electric/10"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold to-yellow-500 rounded-2xl mb-6 shadow-xl shadow-gold/30">
                  <svg className="w-8 h-8 text-navy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-100 mb-4">
                  Can't Decide?
                </h2>
                <p className="text-slate-400 mb-8 text-lg">
                  Use our advanced Rank Predictor tool to estimate your admission chances at top colleges based on your entrance exam rank and category.
                </p>
                <a
                  href="/predictor"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-gold to-yellow-500 hover:from-gold/90 hover:to-yellow-500/90 text-navy-900 rounded-xl font-bold text-lg shadow-lg shadow-gold/30 hover:shadow-gold/50 hover:-translate-y-1 transition-all duration-200"
                >
                  Try Rank Predictor
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Popular Searches */}
        <section className="py-20 bg-slate-900/30">
          <div className="container mx-auto px-4">
            <motion.h2
              variants={pageVariants}
              initial="initial"
              animate="animate"
              className="text-3xl font-display font-bold text-slate-100 mb-8 text-center"
            >
              Popular Searches
            </motion.h2>
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {['IIT', 'NIT', 'B.Tech', 'MBA', 'NEET', 'JEE Main', 'JEE Advanced', 'CAT', 'BITSAT', 'VITEEE'].map(
                (search) => (
                  <a
                    key={search}
                    href={`/colleges?q=${search}`}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/5 hover:border-electric/30 text-slate-200 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                  >
                    {search}
                  </a>
                )
              )}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
