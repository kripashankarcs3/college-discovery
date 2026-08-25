'use client'

import { motion } from 'framer-motion'
import { pageVariants } from '@/lib/utils/animations'

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  )
}
