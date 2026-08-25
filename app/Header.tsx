"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

import Logo from '../components/Logo'

const navItems = [
  { href: '/colleges', label: 'Colleges' },
  { href: '/predictor', label: 'Predictor' },
  { href: '/compare', label: 'Compare' },
  { href: '/dashboard', label: 'Dashboard' },
]

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    let lastScrolled = false
    const onScroll = () => {
      const isScrolled = window.scrollY > 12
      if (isScrolled !== lastScrolled) {
        lastScrolled = isScrolled
        setScrolled(isScrolled)
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 gpu-layer"
      style={{
        backgroundColor: scrolled
          ? 'var(--bg-primary)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-default)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.12)' : 'none',
        willChange: 'transform, background-color, border-color',
        transform: 'translate3d(0,0,0)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 sm:h-14">
          <Link href="/">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-1 sm:gap-1.5">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-3 py-1.5 text-xs sm:text-sm rounded-full transition-all duration-300 hover:bg-white/[0.06] group/nav"
                  style={{ color: active ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                >
                  {item.label}
                  <span
                    className="absolute left-3 right-3 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-electric-100 to-accent-purple transition-transform duration-300 origin-left"
                    style={{ transform: active ? 'scaleX(1)' : 'scaleX(0)' }}
                  />
                  <span className="absolute left-3 right-3 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-electric-100 to-accent-purple scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-300 origin-left opacity-60" />
                </Link>
              )
            })}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-white/[0.06] ml-1"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                  transition={{ duration: 0.25 }}
                  className="flex"
                >
                  {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </nav>

          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-white/[0.06]"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-white/[0.06]"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="md:hidden overflow-hidden"
            style={{ borderTop: '1px solid var(--border-subtle)', backgroundColor: 'color-mix(in srgb, var(--bg-primary) 95%, transparent)' }}
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navItems.map((item, i) => {
                const active = pathname === item.href || pathname?.startsWith(item.href + '/')
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className="block px-4 py-3 text-sm rounded-xl transition-all duration-300"
                      style={{
                        color: active ? '#fff' : 'var(--text-secondary)',
                        backgroundColor: active ? 'rgba(99,102,241,0.9)' : 'transparent',
                      }}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
