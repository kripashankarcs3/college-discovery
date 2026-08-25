'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { motion, AnimatePresence } from 'framer-motion'
import type { College } from '@/types/college'
import { tabContentVariants } from '@/lib/utils/animations'
import { CollegeTable } from '@/components/college'
import { RatingBadge } from '@/components/ui'
import { formatFees } from '@/lib/utils/formatters'

interface CollegeTabsProps {
  college: College
}

export function CollegeTabs({ college }: CollegeTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid grid-cols-4 md:grid-cols-6 gap-2 bg-slate-800/30 border border-slate-700 rounded-lg p-1">
        <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100">
          Overview
        </TabsTrigger>
        <TabsTrigger value="courses" className="data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100">
          Courses & Fees
        </TabsTrigger>
        <TabsTrigger value="placements" className="data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100">
          Placements
        </TabsTrigger>
        <TabsTrigger value="reviews" className="data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100">
          Reviews
        </TabsTrigger>
        <TabsTrigger value="campus" className="data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100">
          Campus Life
        </TabsTrigger>
        <TabsTrigger value="qa" className="data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100">
          Q&A
        </TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="overview">
          <motion.div
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            <h3 className="text-xl font-display font-bold text-slate-100 mb-4">About</h3>
            <p className="text-slate-300 leading-relaxed mb-6">{college.about}</p>

            <h3 className="text-xl font-display font-bold text-slate-100 mb-4">Key Highlights</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-slate-800/30 rounded-lg">
                <span className="text-slate-400 text-sm">Established</span>
                <div className="text-xl font-bold text-slate-100">{college.established}</div>
              </div>
              <div className="p-4 bg-slate-800/30 rounded-lg">
                <span className="text-slate-400 text-sm">Rating</span>
                <RatingBadge rating={college.rating} className="mt-1" />
              </div>
              <div className="p-4 bg-slate-800/30 rounded-lg">
                <span className="text-slate-400 text-sm">Fees</span>
                <div className="text-xl font-bold text-slate-100">
                  ₹{(college.fees.min / 100000).toFixed(1)}L - ₹{(college.fees.max / 100000).toFixed(1)}L
                </div>
              </div>
              <div className="p-4 bg-slate-800/30 rounded-lg">
                <span className="text-slate-400 text-sm">Exams</span>
                <div className="text-sm text-slate-100 mt-1">{college.exams.join(', ')}</div>
              </div>
            </div>

            <h3 className="text-xl font-display font-bold text-slate-100 mb-4">Location</h3>
            <div className="p-4 bg-slate-800/30 rounded-lg flex items-center justify-center h-64">
              <span className="text-slate-500">Map placeholder for {college.location.city}</span>
            </div>

            <h3 className="text-xl font-display font-bold text-slate-100 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {college.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-slate-700 rounded-full text-sm text-slate-300">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="courses">
          <motion.div
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            <h3 className="text-xl font-display font-bold text-slate-100 mb-4">Courses Offered</h3>
            <CollegeTable courses={college.courses} />
          </motion.div>
        </TabsContent>

        <TabsContent value="placements">
          <motion.div
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            <h3 className="text-xl font-display font-bold text-slate-100 mb-4">Placement Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-slate-800/30 rounded-lg text-center">
                <span className="text-slate-400 text-sm">Average Package</span>
                <div className="text-3xl font-bold text-green-400">{college.placements.avgPackage} LPA</div>
              </div>
              <div className="p-4 bg-slate-800/30 rounded-lg text-center">
                <span className="text-slate-400 text-sm">Maximum Package</span>
                <div className="text-3xl font-bold text-gold">{college.placements.maxPackage} LPA</div>
              </div>
              <div className="p-4 bg-slate-800/30 rounded-lg text-center">
                <span className="text-slate-400 text-sm">Placement Rate</span>
                <div className="text-3xl font-bold text-electric">{college.placements.placementRate}%</div>
              </div>
            </div>

            <h3 className="text-xl font-display font-bold text-slate-100 mb-4">Top Recruiters</h3>
            <div className="flex flex-wrap gap-2">
              {college.placements.topRecruiters.map((recruiter) => (
                <span key={recruiter} className="px-3 py-1 bg-slate-700 rounded-full text-sm text-slate-300">
                  {recruiter}
                </span>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="reviews">
          <motion.div
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            <h3 className="text-xl font-display font-bold text-slate-100 mb-4">Student Reviews</h3>
            {college.reviews.map((review) => (
              <div key={review.id} className="p-4 bg-slate-800/30 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Anonymous Student</span>
                  <span className="text-slate-500 text-sm">{review.date}</span>
                </div>
                <RatingBadge rating={review.rating} className="mb-2" />
                <p className="text-slate-300">{review.body}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {review.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <button className="mt-4 px-6 py-2 bg-electric hover:bg-blue-600 text-navy-900 rounded-lg font-medium transition-colors">
              Write a Review
            </button>
          </motion.div>
        </TabsContent>

        <TabsContent value="campus">
          <motion.div
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            <h3 className="text-xl font-display font-bold text-slate-100 mb-4">Campus Life</h3>
            <p className="text-slate-300">
              {college.name} offers a vibrant campus life with numerous clubs, societies, and events throughout the year.
              The campus features modern facilities including hostels, sports complexes, and cultural centers.
            </p>
          </motion.div>
        </TabsContent>

        <TabsContent value="qa">
          <motion.div
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            <h3 className="text-xl font-display font-bold text-slate-100 mb-4">Questions & Answers</h3>
            <p className="text-slate-400">Ask and answer questions about {college.name}</p>
          </motion.div>
        </TabsContent>
      </div>
    </Tabs>
  )
}
