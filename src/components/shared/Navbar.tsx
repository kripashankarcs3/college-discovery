'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Compass, Menu, X, Star, MapPin } from 'lucide-react'
import { useCompareStore } from '@/lib/store/compareStore'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { colleges: selected } = useCompareStore()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-navy-900/90 backdrop-blur-lg border-b border-slate-800/50 py-3'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-electric rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-electric to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Compass className="w-6 h-6 text-navy-900" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-slate-100 tracking-tight">
                EduPath
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                College Discovery
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-slate-800/30 backdrop-blur-md rounded-full px-6 py-2 border border-slate-700/30">
            <Link
              href="/colleges"
              className="px-5 py-2 text-sm font-medium text-slate-300 hover:text-electric hover:bg-electric/10 rounded-full transition-all duration-200"
            >
              Colleges
            </Link>
            <Link
              href="/compare"
              className="relative px-5 py-2 text-sm font-medium text-slate-300 hover:text-electric hover:bg-electric/10 rounded-full transition-all duration-200"
            >
              Compare
              {selected.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-navy-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg ring-2 ring-navy-900">
                  {selected.length}
                </span>
              )}
            </Link>
            <Link
              href="/predictor"
              className="px-5 py-2 text-sm font-medium text-slate-300 hover:text-electric hover:bg-electric/10 rounded-full transition-all duration-200"
            >
              Predictor
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="/colleges"
              className="px-6 py-2.5 bg-electric hover:bg-blue-600 text-navy-900 font-semibold rounded-lg shadow-lg shadow-electric/20 hover:shadow-electric/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              <Star className="w-4 h-4 fill-current" />
              <span>Start Discovering</span>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center bg-slate-800/50 hover:bg-slate-800/80 rounded-full transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-200" />
            ) : (
              <Menu className="w-6 h-6 text-slate-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-navy-900/95 backdrop-blur-xl z-40 transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="container mx-auto px-4 py-20">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-electric to-blue-600 rounded-3xl shadow-2xl shadow-electric/30 mb-4">
                <Compass className="w-8 h-8 text-navy-900" />
              </div>
              <h2 className="text-3xl font-display font-bold text-slate-100">
                EduPath
              </h2>
              <p className="text-slate-400">Find Your Perfect College</p>
            </div>

            <div className="space-y-4">
              <Link
                href="/colleges"
                className="block w-full p-4 bg-slate-800/50 hover:bg-electric/10 rounded-xl border border-slate-700 hover:border-electric/30 transition-all duration-200 text-left flex items-center justify-between group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-lg font-medium text-slate-200 group-hover:text-electric transition-colors">
                  All Colleges
                </span>
                <MapPin className="w-5 h-5 text-slate-400 group-hover:text-electric transition-colors" />
              </Link>

              <Link
                href="/compare"
                className="block w-full p-4 bg-slate-800/50 hover:bg-electric/10 rounded-xl border border-slate-700 hover:border-electric/30 transition-all duration-200 text-left flex items-center justify-between group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${selected.length > 0 ? 'bg-gold' : 'bg-slate-600'}`} />
                  <span className="text-lg font-medium text-slate-200 group-hover:text-electric transition-colors">
                    Compare Colleges
                  </span>
                </div>
                {selected.length > 0 && (
                  <span className="px-2 py-1 bg-gold text-navy-900 text-sm font-bold rounded-lg">
                    {selected.length}
                  </span>
                )}
              </Link>

              <Link
                href="/predictor"
                className="block w-full p-4 bg-slate-800/50 hover:bg-electric/10 rounded-xl border border-slate-700 hover:border-electric/30 transition-all duration-200 text-left flex items-center justify-between group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-lg font-medium text-slate-200 group-hover:text-electric transition-colors">
                  Rank Predictor
                </span>
                <Compass className="w-5 h-5 text-slate-400 group-hover:text-electric transition-colors" />
              </Link>
            </div>

            <div className="pt-8 border-t border-slate-800">
              <a
                href="/colleges"
                className="block w-full py-4 bg-electric hover:bg-blue-600 text-navy-900 font-bold text-center rounded-xl shadow-xl shadow-electric/20 hover:shadow-electric/40 hover:-translate-y-1 transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Colleges
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
