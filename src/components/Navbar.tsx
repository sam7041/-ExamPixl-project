import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FileText, Image as ImageIcon, Pen, Menu, X, Moon, Sun, ChevronDown, LayoutGrid,
  Maximize, Minimize2, Crop, Layers, Palette, Zap, RefreshCw, FileImage,
  Trash2, Scissors, Grid, Type, Settings, Sparkles, RotateCw, Square,
  Circle, ImagePlus, Monitor, Wind, Shield, Clock, Mail, Lock, Unlock,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const pdfTools = [
  { name: 'Merge PDF', href: '/pdf/merge', icon: Layers, description: 'Combine multiple PDFs' },
  { name: 'Split PDF', href: '/pdf/split', icon: Scissors, description: 'Extract pages from a PDF' },
  { name: 'Compress PDF', href: '/pdf/compress', icon: Minimize2, description: 'Reduce PDF file size' },
  { name: 'PDF to Word', href: '/pdf/to-word', icon: FileText, description: 'Editable Word document' },
  { name: 'PDF to Image', href: '/pdf/to-jpg', icon: ImageIcon, description: 'Extract or convert pages' },
  { name: 'Rotate PDF', href: '/pdf/rotate', icon: RotateCw, description: 'Rotate pages any direction' },
  { name: 'Unlock PDF', href: '/pdf/unlock', icon: Unlock, description: 'Remove password protection' },
  { name: 'Protect PDF', href: '/pdf/protect', icon: Lock, description: 'Encrypt with password' },
];

const imageTools = [
  {
    category: 'Conversion & Optimization',
    items: [
      { name: 'Format Converter', href: '/image/convert', icon: RefreshCw, description: 'JPG, PNG, WebP, HEIC' },
      { name: 'Smart Compress', href: '/image/compress', icon: Minimize2, description: 'Lossy/lossless optimizer' },
      { name: 'WebP Optimizer', href: '/image/webp', icon: Wind, description: 'Web-optimized images' },
      { name: 'Strip Metadata', href: '/image/strip-exif', icon: Shield, description: 'Remove EXIF data' },
      { name: 'Progressive JPEG', href: '/image/progressive', icon: Clock, description: 'Faster loading images' },
    ],
  },
  {
    category: 'Size & Transform',
    items: [
      { name: 'Smart Resize', href: '/image/resize', icon: Maximize, description: 'Resize by px, % or presets' },
      { name: 'Crop Image', href: '/image/crop', icon: Crop, description: 'Custom ratios, free crop' },
      { name: 'Rotate & Flip', href: '/image/transform', icon: RotateCw, description: '90°, 180°, custom angles' },
      { name: 'Round Corners', href: '/image/round', icon: Circle, description: 'Radius on image edges' },
      { name: 'Borders & Padding', href: '/image/border', icon: Square, description: 'Frames and spacing' },
    ],
  },
  {
    category: 'Background & Effects',
    items: [
      { name: 'Remove Background', href: '/image/remove-bg', icon: Trash2, description: 'AI transparency' },
      { name: 'Change Background', href: '/image/bg-color', icon: Palette, description: 'Solid color or swap' },
      { name: 'Filters & Effects', href: '/image/filters', icon: Sparkles, description: 'Sepia, blur, sharpen...' },
      { name: 'Adjustments', href: '/image/adjust', icon: Settings, description: 'Brightness, contrast, sat.' },
      { name: 'Watermark', href: '/image/watermark', icon: Type, description: 'Text or logo overlays' },
    ],
  },
  {
    category: 'Bulk & Advanced',
    items: [
      { name: 'Batch Process', href: '/image/bulk', icon: Zap, description: 'Process many images at once' },
      { name: 'Image to PDF', href: '/image/to-pdf', icon: FileImage, description: 'Convert images to PDF' },
      { name: 'Collage Maker', href: '/image/collage', icon: Grid, description: 'Grids and layouts' },
      { name: 'Merge Images', href: '/image/merge', icon: ImagePlus, description: 'Combine multiple images' },
      { name: 'Responsive Gen', href: '/image/responsive', icon: Monitor, description: 'Web/mobile sizes' },
    ],
  },
  {
    category: '🎯 Exam Tools',
    items: [
      { name: 'Exam Photo Validator', href: '/image/exam-photo', icon: Sparkles, description: 'Auto-fix for JEE/NEET/UPSC' },
      { name: 'Signature Canvas', href: '/image/signature-canvas', icon: Pen, description: 'Draw & export at exam size' },
    ],
  },
];

function getInitialTheme() {
  if (typeof window === 'undefined') return false;
  // Check localStorage first, then fall back to DOM, then system preference
  const stored = localStorage.getItem('theme');
  if (stored === 'dark') return true;
  if (stored === 'light') return false;
  return document.documentElement.classList.contains('dark');
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'pdf' | 'image' | null>(null);
  const [isDark, setIsDark] = useState(getInitialTheme);

  const location = useLocation();

  // Ensure DOM is synced on initial mount
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    setMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const navLinkClass = useCallback((path: string) =>
    cn(
      'px-4 py-2.5 text-sm font-bold rounded-lg transition-all',
      location.pathname === path
        ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
    ),
  [location.pathname]);

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b border-slate-300 dark:border-slate-700 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-sm"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo + desktop links */}
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2.5 group" aria-label="ExamPixl home">
              <img 
                src="/logo.png" 
                alt="ExamPixl" 
                className="h-12 w-12 object-contain group-hover:scale-105 transition-transform"
              />
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Exam<span className="text-brand-600 dark:text-brand-400">Pixl</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center space-x-1">
              <Link to="/" className={navLinkClass('/')}>Home</Link>

              {/* PDF dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('pdf')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all',
                    activeDropdown === 'pdf' || location.pathname.startsWith('/pdf')
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  )}
                  aria-expanded={activeDropdown === 'pdf'}
                  aria-haspopup="true"
                >
                  PDF Tools
                  <ChevronDown size={14} className={cn('transition-transform duration-200', activeDropdown === 'pdf' && 'rotate-180')} aria-hidden="true" />
                </button>

                <AnimatePresence>
                  {activeDropdown === 'pdf' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute left-0 top-full mt-2 w-72 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-2xl"
                      role="menu"
                    >
                      {pdfTools.map((tool) => (
                        <Link
                          key={tool.name}
                          to={tool.href}
                          role="menuitem"
                          className="flex items-center gap-3.5 rounded-xl p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-brand-500 group-hover:text-white transition-all shadow-sm">
                            <tool.icon size={20} aria-hidden="true" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">{tool.name}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{tool.description}</p>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Image dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('image')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all',
                    activeDropdown === 'image' || location.pathname.startsWith('/image')
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  )}
                  aria-expanded={activeDropdown === 'image'}
                  aria-haspopup="true"
                >
                  Image Tools
                  <ChevronDown size={14} className={cn('transition-transform duration-200', activeDropdown === 'image' && 'rotate-180')} aria-hidden="true" />
                </button>

                <AnimatePresence>
                  {activeDropdown === 'image' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute left-0 top-full mt-2 w-[1000px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl"
                      role="menu"
                    >
                      <div className="grid grid-cols-5 gap-8">
                        {imageTools.map((group) => (
                          <div key={group.category}>
                            <p className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 px-2 mb-4">
                              {group.category}
                            </p>
                            <div className="space-y-1">
                              {group.items.map((tool) => (
                                <Link
                                  key={tool.name}
                                  to={tool.href}
                                  role="menuitem"
                                  className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
                                >
                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-brand-500 group-hover:text-white transition-all shadow-sm">
                                    <tool.icon size={18} aria-hidden="true" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">{tool.name}</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{tool.description}</p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/contact" className={navLinkClass('/contact')}>Connect to Us</Link>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDark(d => !d)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
            </button>

            <button
              className="lg:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-8">
              <div className="space-y-2">
                {[
                  { to: '/', icon: LayoutGrid, label: 'Home' },
                  { to: '/contact', icon: Mail, label: 'Connect to Us' },
                ].map(({ to, icon: Icon, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-lg font-bold text-slate-900 dark:text-white rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                      <Icon size={20} aria-hidden="true" />
                    </div>
                    {label}
                  </Link>
                ))}
              </div>

              <div className="space-y-3">
                <p className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">PDF Tools</p>
                {pdfTools.map(tool => (
                  <Link
                    key={tool.name}
                    to={tool.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                  >
                    <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                      <tool.icon size={16} aria-hidden="true" />
                    </div>
                    {tool.name}
                  </Link>
                ))}
              </div>

              <div className="space-y-3">
                <p className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Image Tools</p>
                {imageTools.flatMap(g => g.items).map(tool => (
                  <Link
                    key={tool.name}
                    to={tool.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                  >
                    <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                      <tool.icon size={16} aria-hidden="true" />
                    </div>
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
