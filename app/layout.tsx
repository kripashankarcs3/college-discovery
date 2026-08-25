import '../styles/globals.css'
import { Space_Grotesk, Inter } from 'next/font/google'
import { Providers } from './providers'
import Header from './Header'
import { PageTransition } from '../components/PageTransition'
import { AuroraBackground } from '../components/AuroraBackground'
import SmoothScroll from '../components/SmoothScroll'
import Logo from '../components/Logo'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata = {
  title: 'College Discovery | Find Your Perfect College',
  description: 'Discover and compare top colleges across India. Get detailed insights on placements, fees, ratings, cutoffs, and campus life.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <Providers>
          <SmoothScroll>
            <AuroraBackground />
            <div className="noise-overlay" />
            <Header />
            <PageTransition>
              <div className="relative">{children}</div>
            </PageTransition>
            <Footer />
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  )
}

function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ borderTop: '1px solid var(--border-subtle)', backgroundColor: 'color-mix(in srgb, var(--bg-primary) 50%, transparent)', backdropFilter: 'blur(20px)' }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), rgba(59,130,246,0.5), transparent)' }} />
      <div className="absolute -bottom-32 left-1/4 w-72 h-72 rounded-full opacity-[0.06] blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #8B5CF6, transparent 70%)' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="mb-4">
              <Logo size="large" />
            </div>
            <p className="text-sm max-w-sm leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              India&apos;s most comprehensive college discovery platform. Compare colleges, check admission chances, and make informed decisions about your future.
            </p>
            <div className="flex items-center gap-2 mt-5">
              {['𝕏', 'in', 'ig', 'yt'].map((s) => (
                <a key={s} href="#" aria-label={s}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow"
                  style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-tertiary)', border: '1px solid var(--border-subtle)' }}>
                  {s}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Quick Links</h4>
            <div className="flex flex-col gap-2">
              <a href="/colleges" className="text-sm transition-colors hover:text-electric-100" style={{ color: 'var(--text-tertiary)' }}>Browse Colleges</a>
              <a href="/predictor" className="text-sm transition-colors hover:text-electric-100" style={{ color: 'var(--text-tertiary)' }}>College Predictor</a>
              <a href="/compare" className="text-sm transition-colors hover:text-electric-100" style={{ color: 'var(--text-tertiary)' }}>Compare Institutions</a>
              <a href="/dashboard" className="text-sm transition-colors hover:text-electric-100" style={{ color: 'var(--text-tertiary)' }}>My Dashboard</a>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Resources</h4>
            <div className="flex flex-col gap-2">
              <a href="#blog" className="text-sm transition-colors hover:text-electric-100" style={{ color: 'var(--text-tertiary)' }}>Blog & News</a>
              <a href="#faq" className="text-sm transition-colors hover:text-electric-100" style={{ color: 'var(--text-tertiary)' }}>FAQs</a>
              <a href="#" className="text-sm transition-colors hover:text-electric-100" style={{ color: 'var(--text-tertiary)' }}>Privacy Policy</a>
              <a href="#" className="text-sm transition-colors hover:text-electric-100" style={{ color: 'var(--text-tertiary)' }}>Terms of Service</a>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              &copy; {new Date().getFullYear()} College Discovery. All rights reserved.
            </p>
            <p className="text-xs inline-flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
              Made with <span className="text-red-500 animate-pulse">❤️</span> in India for scholars.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
