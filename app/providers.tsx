"use client"
import { ReactNode } from 'react'
import { MotionConfig } from 'framer-motion'
import { ThemeProvider } from '../context/ThemeContext'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.4 }}>
        {children}
      </MotionConfig>
    </ThemeProvider>
  )
}
