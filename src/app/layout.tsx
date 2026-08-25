import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PageTransition } from '@/components/shared'
import './globals.css'
import { Navbar } from '@/components/shared'
import { Footer } from '@/components/shared'
import { CompareDrawer } from '@/components/compare'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

// Create a single query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
})

export const metadata: Metadata = {
  title: 'EduPath - College Discovery Platform',
  description: 'Find your perfect college in India with NIRF rankings, placements, and fees information.',
  keywords: ['college', 'engineering', 'medical', 'NIRF', 'JEE', 'NEET', 'admission'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-navy-900 text-slate-100 font-sans min-h-screen flex flex-col">
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <CompareDrawer />
        </QueryClientProvider>
      </body>
    </html>
  )
}
