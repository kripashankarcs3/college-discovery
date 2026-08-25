import type { Variant, Variants } from 'framer-motion'

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
}

export const cardVariants = (index: number): Variants => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { delay: index * 0.08, duration: 0.35 } },
})

export const drawerVariants: Variants = {
  initial: { y: '100%' },
  animate: { y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { y: '100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
}

export const tabContentVariants: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
}
