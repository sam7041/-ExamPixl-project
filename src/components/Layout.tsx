import { Outlet, Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import Navbar from './Navbar';
import ToolSubNav from './ToolSubNav';

const footerLinks = {
  'PDF Tools': [
    { label: 'Compress PDF', href: '/pdf/compress' },
    { label: 'Merge PDF', href: '/pdf/merge' },
    { label: 'Split PDF', href: '/pdf/split' },
    { label: 'PDF to Word', href: '/pdf/to-word' },
    { label: 'PDF to JPG', href: '/pdf/to-jpg' },
    { label: 'Protect PDF', href: '/pdf/protect' },
  ],
  'Image Tools': [
    { label: 'Compress Image', href: '/image/compress' },
    { label: 'Smart Resize', href: '/image/resize' },
    { label: 'Remove Background', href: '/image/remove-bg' },
    { label: 'Format Converter', href: '/image/convert' },
    { label: 'Image to PDF', href: '/image/to-pdf' },
    { label: 'Crop Image', href: '/image/crop' },
    { label: 'Exam Photo Validator', href: '/image/exam-photo' },
    { label: 'Signature Canvas', href: '/image/signature-canvas' },
  ],
  'Company': [
    { label: 'Write to Us', href: '/contact' },
  ],
};

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ToolSubNav />
      <main className="flex-grow" id="main-content">
        <Outlet />
      </main>

      <footer className="border-t border-slate-300 bg-slate-900 text-white py-20" role="contentinfo">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-6 group" aria-label="ExamPixl home">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-500 text-white group-hover:scale-110 transition-transform shadow-lg">
                  <Sparkles size={20} aria-hidden="true" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                  Exam<span className="text-brand-400">Pixl</span>
                </span>
              </Link>
              <p className="text-slate-300 text-sm leading-relaxed max-w-xs font-medium">
                Free PDF and image tools built for students. Everything runs in your browser — no uploads, no account.
              </p>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">{title}</h3>
                <ul className="space-y-3">
                  {links.map(({ label, href }) => (
                    <li key={href}>
                      <Link to={href} className="text-sm text-slate-300 hover:text-brand-400 transition-colors font-medium">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p className="font-medium">© {new Date().getFullYear()} ExamPixl. Built for students, by students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
