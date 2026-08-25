import Link from 'next/link'
import { Mail, MapPin, Code, Globe, Smartphone, Tablet, BookOpen, Award, Compass } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-navy-900 border-t border-slate-800 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-electric via-purple-600 to-gold opacity-20" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-electric/10 to-transparent rounded-bl-full pointer-events-none" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-electric to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-electric/20">
                <Compass className="w-5 h-5 text-navy-900" />
              </div>
              <div>
                <span className="text-xl font-display font-bold text-slate-100">EduPath</span>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">College Discovery</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your journey to the perfect college starts here. Discover, compare, and choose the best institution for your academic future.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-electric/20 flex items-center justify-center text-slate-400 hover:text-electric transition-all duration-200">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-electric/20 flex items-center justify-center text-slate-400 hover:text-electric transition-all duration-200">
                <Smartphone className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-electric/20 flex items-center justify-center text-slate-400 hover:text-electric transition-all duration-200">
                <Tablet className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-display font-bold text-slate-100 mb-6 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-electric" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'All Colleges', href: '/colleges' },
                { name: 'Top IITs', href: '/colleges?type=IIT' },
                { name: 'Top NITs', href: '/colleges?type=NIT' },
                { name: 'Compare Colleges', href: '/compare' },
                { name: 'Rank Predictor', href: '/predictor' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-slate-400 hover:text-electric hover:translate-x-2 transition-all duration-200 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-electric transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-display font-bold text-slate-100 mb-6 flex items-center gap-2">
              <Award className="w-4 h-4 text-gold" />
              Resources
            </h3>
            <ul className="space-y-3">
              {[
                'College Guidelines',
                'Exam Notifications',
                'Admission Help',
                'College Comparisons',
                'Rank Predictor Guide',
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-electric hover:translate-x-2 transition-all duration-200 group flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-electric transition-colors" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-display font-bold text-slate-100 mb-6 flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-400" />
              Connect
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-400">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm">India-wide Coverage</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-sm">500+ Colleges Listed</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                  <Code className="w-4 h-4" />
                </div>
                <span className="text-sm">Data-driven Insights</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-slate-500 text-sm">
            © {currentYear} EduPath. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-electric transition-colors">Privacy</a>
            <a href="#" className="hover:text-electric transition-colors">Terms</a>
            <a href="#" className="hover:text-electric transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
