"use client"
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Search, MapPin, GraduationCap, TrendingUp, Star, ArrowRight, BookOpen, Users, Zap, BarChart3, Shield, ChevronRight, Clock, CheckCircle, ExternalLink, Menu, X, Filter, SlidersHorizontal } from 'lucide-react'
import { getAllColleges } from '../lib/api'
import { exams, blogPosts, faqs } from '../lib/staticData'
import { College, BlogPost, Exam, FAQ } from '../lib/types'

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let animationId: number | null = null
    let visible = true
    let particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = []

    let resizeRaf: number | null = null
    const resize = () => {
      if (resizeRaf) return
      resizeRaf = requestAnimationFrame(() => {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
        resizeRaf = null
      })
    }
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    window.addEventListener('resize', resize)

    const count = Math.min(25, Math.floor((canvas.width * canvas.height) / 30000))
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.4 + 0.1,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'rgba(59, 130, 246, 0.3)'
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.05)'
      ctx.lineWidth = 0.5

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.beginPath()
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x
          const dy = particles[j].y - p.y
          if (dx * dx + dy * dy < 10000) {
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(particles[j].x, particles[j].y)
          }
        }
      }
      ctx.stroke()
    }

    const animate = () => {
      draw()
      animationId = requestAnimationFrame(animate)
    }

    const start = () => { if (animationId === null && visible && document.visibilityState === 'visible') animate() }
    const stop = () => { if (animationId !== null) { cancelAnimationFrame(animationId); animationId = null } }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      visible ? start() : stop()
    }, { threshold: 0 })
    io.observe(canvas)

    const onVisibilityChange = () => { document.visibilityState === 'visible' ? start() : stop() }
    document.addEventListener('visibilitychange', onVisibilityChange)

    start()

    return () => {
      stop()
      io.disconnect()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      if (resizeRaf) cancelAnimationFrame(resizeRaf)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none gpu-layer" style={{ maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)' }} />
}

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}

function AnimatedCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 2000
    const step = Math.ceil(end / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(timer) } else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, end])

  return <span ref={ref}>{count}{suffix}</span>
}

const categoryIcons: Record<string, string> = {
  Engineering: '🔬', Management: '📊', Medical: '🏥', 'Liberal Arts': '📚', Law: '⚖️', Science: '🧪', Commerce: '💰', Design: '🎨',
}

export default function Home() {
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.98])
  const allColleges = getAllColleges()
  const topColleges = [...allColleges].sort((a, b) => b.rating - a.rating).slice(0, 8)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const suggestions = searchQuery.trim()
    ? allColleges.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : []

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSuggestions(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <main className="relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Hero Section */}
      <motion.section style={{ opacity: heroOpacity, scale: heroScale }} className="relative pt-4 pb-12 sm:pt-6 sm:pb-16 lg:pt-8 lg:pb-20 overflow-hidden">
        {/* Relatable College Campus Image Background */}
        <div className="absolute inset-0 -z-20 pointer-events-none overflow-hidden">
          <img
            src="/images/hero_college_bg.jpg"
            alt="College Campus"
            className="w-full h-full object-cover opacity-55 dark:opacity-40 scale-105 gpu-layer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)] opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)] opacity-45" />
        </div>

        {/* Soft Ambient Spotlight Radial Glow behind Heading */}
        <div className="absolute inset-0 -z-10 pointer-events-none flex items-center justify-center">
          <div
            className="w-[46rem] h-[26rem] rounded-full blur-[100px] opacity-35 dark:opacity-25"
            style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.35) 0%, rgba(37,99,235,0.18) 45%, transparent 75%)' }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="relative">
            <ParticleField />

            {/* Left Floating Badge (Desktop) */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="hidden lg:flex absolute left-0 top-6 items-center gap-3 px-4 py-2.5 rounded-2xl backdrop-blur-xl shadow-xl z-20 hover:scale-105 transition-all duration-300"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>500+ Top Colleges</div>
                <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>NIRF & Govt Approved</div>
              </div>
            </motion.div>

            {/* Right Floating Badge (Desktop) */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="hidden lg:flex absolute right-0 top-10 items-center gap-3 px-4 py-2.5 rounded-2xl backdrop-blur-xl shadow-xl z-20 hover:scale-105 transition-all duration-300"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-emerald-400">98.4% Accuracy</div>
                <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>AI Admission Predictor</div>
              </div>
            </motion.div>

            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <Zap className="w-4 h-4 text-electric-100" />
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>India&apos;s Smartest College Discovery Platform</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-[1.1]">
                <span style={{ color: 'var(--text-primary)' }}>Find Your Dream College </span>
                <br />
                <span className="gradient-text-animated text-glow">in Seconds</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.8 }}
                className="mt-4 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Compare 30+ top Indian colleges, check your admission chances, filter by fees and location, and make informed decisions about your future.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-6 max-w-2xl mx-auto" ref={searchRef}>
                <div className="relative">
                  <div className="flex items-center gap-2 p-2 rounded-2xl backdrop-blur-sm" style={{ backgroundColor: 'color-mix(in srgb, var(--bg-card) 80%, transparent)', border: '1px solid var(--border-subtle)' }}>
                    <Search className="w-5 h-5 ml-3 shrink-0" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true) }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="Search for colleges, courses, or locations..."
                      className="flex-1 bg-transparent border-none outline-none text-sm py-3 placeholder:text-sm"
                      style={{ color: 'var(--text-primary)' }}
                    />
                    <Link
                      href={searchQuery.trim() ? `/colleges?q=${encodeURIComponent(searchQuery.trim())}` : '/colleges'}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-electric-100 to-accent-purple text-white font-semibold text-sm hover:shadow-glow-purple transition-all duration-300 btn-shine whitespace-nowrap"
                    >
                      Explore
                    </Link>
                  </div>
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden z-20 shadow-elevation-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                      {suggestions.map((c) => (
                        <Link key={c.id} href={`/colleges/${c.id}`}
                          className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.04]"
                          style={{ color: 'var(--text-secondary)' }}>
                          <GraduationCap className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
                          <div className="text-left flex-1 min-w-0">
                            <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{c.name}</div>
                            <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{c.location} &middot; {c.courses.slice(0, 2).join(', ')}</div>
                          </div>
                          <span className="flex items-center gap-1 text-xs font-medium whitespace-nowrap" style={{ color: 'var(--text-tertiary)' }}>
                            ₹{c.fees.toLocaleString('en-US')}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Popular:</span>
                  {['IIT', 'NIT', 'IIIT', 'BHU', 'JNU', 'DTU'].map(tag => (
                    <Link key={tag} href={`/colleges?q=${tag}`}
                      className="text-xs px-3 py-1 rounded-full transition-colors hover:text-electric-100"
                      style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-tertiary)' }}>
                      {tag}
                    </Link>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }}
                className="mt-16 flex items-center justify-center gap-8 sm:gap-16 flex-wrap">
                {[
                  { value: allColleges.length, suffix: '+', label: 'Colleges' },
                  { value: 92, suffix: '%', label: 'Avg Placement' },
                  { value: 50, suffix: '+', label: 'Courses' },
                  { value: 10, suffix: 'K+', label: 'Students Guided', static: true },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold gradient-text-electric">
                      {item.static ? item.value : <AnimatedCounter end={item.value as number} suffix={item.suffix} />}
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-transparent to-transparent pointer-events-none" style={{ background: 'linear-gradient(to top, var(--bg-primary), transparent)' }} />
      </motion.section>

      {/* Top Colleges */}
      <section className="relative py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                  <Star className="w-3.5 h-3.5 text-electric-100" />
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Top Rated</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                  Top <span className="gradient-text-electric">Colleges</span> in India
                </h2>
              </div>
              <Link href="/colleges"
                className="group inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-electric-100"
                style={{ color: 'var(--text-tertiary)' }}>
                View All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {topColleges.map((college, index) => (
              <ScrollReveal key={college.id} delay={index * 0.05}>
                <Link href={`/colleges/${college.id}`} className="group block">
                  <div
                    className="relative rounded-2xl overflow-hidden transition-all duration-500 card-hover-effect"
                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
                  >
                    <div className="relative h-40 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                      <img src={college.image} alt={college.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                        <Star className="w-3 h-3 text-gold-100 fill-gold-100" />
                        <span className="text-xs font-semibold text-white">{college.rating}</span>
                      </div>
                      <span className="absolute bottom-3 left-3 z-20 text-xs px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/10">
                        {college.type}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-display font-semibold text-sm truncate group-hover:text-electric-100 transition-colors" style={{ color: 'var(--text-primary)' }}>
                        {college.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                        <span className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>{college.city}, {college.state}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                        <div>
                          <div className="text-sm font-bold gradient-text-gold">₹{college.fees.toLocaleString('en-US')}</div>
                          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>per year</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-accent-emerald">{college.placementRate}%</div>
                          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>placement</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Exams */}
      <section className="relative py-20" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <BookOpen className="w-3.5 h-3.5 text-electric-100" />
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Entrance Exams</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                Popular <span className="gradient-text-electric">Exams</span> 2026
              </h2>
              <p className="mt-3 text-sm" style={{ color: 'var(--text-tertiary)' }}>Stay updated with exam dates, application deadlines, and participating colleges.</p>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:gap-5 grid-cols-2 md:grid-cols-4">
            {exams.slice(0, 8).map((exam, index) => (
              <ScrollReveal key={exam.id} delay={index * 0.05}>
                <div className="rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                  <div className="text-2xl mb-3">{exam.icon}</div>
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{exam.name}</h3>
                  <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-tertiary)' }}>{exam.description}</p>
                  <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{exam.participatingColleges} colleges</span>
                    <span className={`text-xs font-medium ${exam.applicationDate === 'Applications Open' ? 'text-accent-emerald' : 'text-slate-500'}`}>
                      {exam.applicationDate}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <Zap className="w-3.5 h-3.5 text-electric-100" />
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Why Choose Us</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                Everything You Need to <span className="gradient-text-electric">Decide Better</span>
              </h2>
              <p className="mt-3 text-sm max-w-xl mx-auto" style={{ color: 'var(--text-tertiary)' }}>
                Powerful tools to research, compare, predict, and find the perfect college for your future.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {[
              { icon: Search, title: 'Smart Search', description: 'Search colleges by name, location, course, or fees. Get instant results with intelligent filtering.', gradient: 'from-electric-100 to-accent-purple' },
              { icon: BarChart3, title: 'College Predictor', description: 'Enter your exam rank and category to see your admission chances with cutoff comparisons.', gradient: 'from-accent-cyan to-electric-100' },
              { icon: TrendingUp, title: 'Side-by-Side Compare', description: 'Compare up to 3 colleges across fees, placements, ratings, courses, and location.', gradient: 'from-accent-purple to-accent-pink' },
              { icon: Shield, title: 'Verified Data', description: 'All data sourced from official websites, government portals, and verified student reviews.', gradient: 'from-accent-emerald to-accent-cyan' },
              { icon: Users, title: 'Student Reviews', description: 'Read authentic reviews from current students and alumni about their college experience.', gradient: 'from-accent-orange to-gold-100' },
              { icon: Clock, title: 'Real-time Updates', description: 'Stay informed with latest exam dates, admission deadlines, cutoff changes, and college news.', gradient: 'from-accent-pink to-accent-purple' },
            ].map((feature, index) => (
              <ScrollReveal key={index} delay={index * 0.08}>
                <motion.div whileHover={{ y: -6, scale: 1.01 }}
                  className="group relative p-6 sm:p-8 rounded-2xl transition-all duration-500 h-full"
                  style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 rounded-2xl`} />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                      <feature.icon className="w-6 h-6 text-electric-100" />
                    </div>
                    <h3 className="font-display font-semibold text-base mb-2" style={{ color: 'var(--text-primary)' }}>{feature.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{feature.description}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Predictor CTA */}
      <section className="relative py-20" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="relative rounded-3xl overflow-hidden p-10 sm:p-16" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05))', border: '1px solid var(--border-subtle)' }}>
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                    <Zap className="w-3.5 h-3.5 text-electric-100" />
                    <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>AI-Powered</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                    Check Your College <span className="gradient-text-electric">Admission Chances</span>
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                    Use our smart college predictor to find out which colleges you can get into based on your exam rank, category, and preferences. Get instant probability scores and cutoff comparisons.
                  </p>
                  <div className="flex flex-wrap gap-3 mt-6">
                    <Link href="/predictor"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-electric-100 to-accent-purple text-white font-semibold text-sm transition-all duration-500 hover:shadow-glow-purple btn-shine">
                      Try Predictor <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link href="/colleges"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-500"
                      style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                      Browse Colleges
                    </Link>
                  </div>
                </div>
                <div className="shrink-0">
                  <div className="w-48 h-48 rounded-3xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1))', border: '1px solid var(--border-subtle)' }}>
                    <span className="text-6xl">🎯</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Blog/News */}
      <section id="blog" className="relative py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                  <BookOpen className="w-3.5 h-3.5 text-electric-100" />
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Latest Updates</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                  News & <span className="gradient-text-electric">Articles</span>
                </h2>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {blogPosts.slice(0, 3).map((post, index) => (
              <ScrollReveal key={post.id} delay={index * 0.1}>
                <div className="rounded-2xl overflow-hidden transition-all duration-500 card-hover-effect" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                  <div className="relative h-48 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm" style={{ backgroundColor: 'rgba(59,130,246,0.2)', color: '#93C5FD', border: '1px solid rgba(59,130,246,0.3)' }}>
                      {post.category}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{post.date} &middot; {post.author}</div>
                    <h3 className="font-display font-semibold text-sm mt-2 line-clamp-2 transition-colors hover:text-electric-100" style={{ color: 'var(--text-primary)' }}>
                      {post.title}
                    </h3>
                    <p className="text-xs mt-2 line-clamp-2" style={{ color: 'var(--text-tertiary)' }}>{post.excerpt}</p>
                    <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1 text-xs font-medium mt-3 transition-colors hover:text-electric-100" style={{ color: 'var(--text-tertiary)' }}>
                      Read More <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative py-20" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>FAQs</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                Frequently Asked <span className="gradient-text-electric">Questions</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <ScrollReveal key={index} delay={index * 0.05}>
                <FAQItem faq={faq} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <Users className="w-3.5 h-3.5 text-electric-100" />
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Testimonials</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                What Students <span className="gradient-text-electric">Say</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {[
              { name: 'Rahul Sharma', role: 'B.Tech Student, IIT Kanpur', text: 'This platform made my college search so much easier. The predictor was spot on for my JEE rank!', rating: 5 },
              { name: 'Priya Patel', role: 'MBA Candidate, IIM Ahmedabad', text: 'The comparison tool helped me decide between 3 top B-schools. Incredibly useful and intuitive.', rating: 5 },
              { name: 'Amit Singh', role: 'Medical Aspirant, Delhi', text: 'Detailed college information and cutoff data helped me choose the right medical college. Highly recommended!', rating: 5 },
            ].map((t, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="rounded-2xl p-6 sm:p-8 transition-all duration-300" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-gold-100 text-gold-100" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>"{t.text}"</p>
                  <div className="flex items-center gap-3 mt-6 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-100 to-accent-purple flex items-center justify-center text-white font-semibold text-sm">
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{t.name}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function FAQItem({ faq }: { faq: FAQ }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl overflow-hidden transition-all duration-300" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 sm:p-5 text-left">
        <span className="text-sm font-medium pr-4" style={{ color: 'var(--text-primary)' }}>{faq.question}</span>
        <ChevronRight className={`w-4 h-4 shrink-0 transition-transform duration-300 ${open ? 'rotate-90' : ''}`} style={{ color: 'var(--text-muted)' }} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{faq.answer}</p>
      </div>
    </div>
  )
}
