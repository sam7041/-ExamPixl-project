import React, { useMemo } from 'react';
import { useRecentTools } from '@/src/hooks/useRecentTools';
import { Link } from 'react-router-dom';
import {
  FileText, Image as ImageIcon, Maximize, RefreshCw,
  ArrowRight, FileImage, Layers, Type, Wand2, Lock, Unlock,
  ShieldCheck, CheckCircle2, Trash2, Presentation, Table, Globe, Archive,
  FileX, ExternalLink, Wrench, Crop, Edit3, EyeOff, Columns, Sparkles, Languages,
  Palette, Settings, Scissors, Minimize2, RotateCw, Square, Wind, Clock, ImagePlus
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

type ToolCategory = 'red' | 'blue' | 'green' | 'special';

interface Tool {
  name: string;
  description: string;
  icon: React.ElementType;
  href: string;
  category: ToolCategory;
  isNew?: boolean;
}

const tools: Tool[] = [
  { name: 'Merge PDF', description: 'Combine multiple PDFs into one document easily.', icon: Layers, href: '/pdf/merge', category: 'red' },
  { name: 'Split PDF', description: 'Separate one page or a whole set into independent files.', icon: Scissors, href: '/pdf/split', category: 'red' },
  { name: 'Compress PDF', description: 'Reduce file size while optimizing for maximal quality.', icon: Minimize2, href: '/pdf/compress', category: 'red' },
  { name: 'PDF to Word', description: 'Convert PDFs into editable DOC and DOCX documents.', icon: FileText, href: '/pdf/to-word', category: 'blue' },
  { name: 'PDF to JPG', description: 'Extract images or convert each page to a JPG image.', icon: FileImage, href: '/pdf/to-jpg', category: 'blue' },
  { name: 'JPG to PDF', description: 'Convert JPG images to PDF in seconds with custom margins.', icon: Layers, href: '/pdf/from-jpg', category: 'blue' },
  { name: 'Sign PDF', description: 'Sign documents and request signatures securely.', icon: Wand2, href: '/pdf/sign', category: 'blue' },
  { name: 'Watermark', description: 'Stamp an image or text over your PDF in seconds.', icon: ShieldCheck, href: '/pdf/watermark', category: 'blue' },
  { name: 'Rotate PDF', description: 'Rotate your PDFs the way you need them instantly.', icon: RotateCw, href: '/pdf/rotate', category: 'blue' },
  { name: 'Unlock PDF', description: 'Remove PDF password security and use them as you want.', icon: Unlock, href: '/pdf/unlock', category: 'blue' },
  { name: 'Protect PDF', description: 'Encrypt PDF documents to prevent unauthorized access.', icon: Lock, href: '/pdf/protect', category: 'blue', isNew: true },
  { name: 'Organize PDF', description: 'Sort, add and delete PDF pages with drag and drop.', icon: Layers, href: '/pdf/organize', category: 'blue', isNew: true },
  { name: 'Page Numbers', description: 'Add page numbers into PDFs with custom positions.', icon: Type, href: '/pdf/page-numbers', category: 'blue' },
  { name: 'Scan to PDF', description: 'Scan documents from mobile and send to browser.', icon: RefreshCw, href: '/pdf/scan', category: 'blue' },
  { name: 'OCR PDF', description: 'Convert scanned PDFs into editable documents.', icon: Type, href: '/pdf/to-text', category: 'blue' },
  { name: 'Word to PDF', description: 'Convert DOC and DOCX files to professional PDF.', icon: FileText, href: '/pdf/from-word', category: 'blue' },
  { name: 'PowerPoint to PDF', description: 'Convert PPT slideshows to easy-to-view PDF.', icon: Presentation, href: '/pdf/from-ppt', category: 'blue' },
  { name: 'Excel to PDF', description: 'Convert EXCEL spreadsheets to readable PDF.', icon: Table, href: '/pdf/from-excel', category: 'blue' },
  { name: 'HTML to PDF', description: 'Convert web pages in HTML to PDF via URL.', icon: Globe, href: '/pdf/from-html', category: 'blue' },
  { name: 'PDF to PowerPoint', description: 'Convert your PDF files to PPT and PPTX slideshows.', icon: Presentation, href: '/pdf/to-ppt', category: 'blue' },
  { name: 'PDF to Excel', description: 'Extract data directly from PDF into Excel spreadsheets.', icon: Table, href: '/pdf/to-excel', category: 'blue' },
  { name: 'PDF to PDF/A', description: 'Convert PDF documents to PDF/A for archiving.', icon: Archive, href: '/pdf/to-pdfa', category: 'blue' },
  { name: 'Remove Pages', description: 'Delete unwanted pages from a PDF document.', icon: FileX, href: '/pdf/remove-pages', category: 'red' },
  { name: 'Extract Pages', description: 'Extract specific pages and save as independent files.', icon: ExternalLink, href: '/pdf/extract-pages', category: 'red' },
  { name: 'Repair PDF', description: 'Fix damaged or corrupted PDF files instantly.', icon: Wrench, href: '/pdf/repair', category: 'blue' },
  { name: 'Crop PDF', description: 'Trim the margins and adjust the visible area.', icon: Crop, href: '/pdf/crop', category: 'blue' },
  { name: 'Edit PDF', description: 'Add text, images, or annotations to a PDF.', icon: Edit3, href: '/pdf/edit', category: 'blue' },
  { name: 'Redact PDF', description: 'Permanently remove sensitive info from your PDFs.', icon: EyeOff, href: '/pdf/redact', category: 'blue' },
  { name: 'Compare PDF', description: 'Find differences between two PDF versions.', icon: Columns, href: '/pdf/compare', category: 'blue' },
  { name: 'AI Summarizer', description: 'Get key points from your PDF using AI power.', icon: Sparkles, href: '/pdf/ai-summary', category: 'special', isNew: true },
  { name: 'Translate PDF', description: 'Translate your PDF into any language in seconds.', icon: Languages, href: '/pdf/translate', category: 'blue', isNew: true },
  { name: 'Smart Resize', description: 'Resize images by pixels, % or presets with quality.', icon: Maximize, href: '/image/resize', category: 'green', isNew: true },
  { name: 'Compress Image', description: 'Optimize JPG and PNG images for web submission.', icon: Minimize2, href: '/image/compress', category: 'green' },
  { name: 'Format Converter', description: 'Convert images between JPG, PNG, WebP, SVG, HEIC.', icon: RefreshCw, href: '/image/convert', category: 'green' },
  { name: 'Crop Image', description: 'Crop images with custom ratios or free framing.', icon: Crop, href: '/image/crop', category: 'green' },
  { name: 'Remove Background', description: 'AI-powered background removal for transparent PNGs.', icon: Trash2, href: '/image/remove-bg', category: 'green', isNew: true },
  { name: 'WebP Optimizer', description: 'Convert and optimize images for the modern web.', icon: Wind, href: '/image/webp', category: 'green' },
  { name: 'Rotate & Flip', description: 'Rotate images or flip them horizontally/vertically.', icon: RotateCw, href: '/image/transform', category: 'green' },
  { name: 'Round Corners', description: 'Add a modern look by rounding image corners.', icon: Clock, href: '/image/round', category: 'green' },
  { name: 'Borders & Padding', description: 'Add custom borders or padding around images.', icon: Square, href: '/image/border', category: 'green' },
  { name: 'Filters & Effects', description: 'Apply professional filters like Grayscale or Sepia.', icon: Sparkles, href: '/image/filters', category: 'green' },
  { name: 'Adjustments', description: 'Fine-tune brightness, contrast, and saturation.', icon: Settings, href: '/image/adjust', category: 'green' },
  { name: 'Watermark', description: 'Protect your images with text or logo overlays.', icon: Type, href: '/image/watermark', category: 'green' },
  { name: 'Image to PDF', description: 'Convert one or multiple images into a PDF.', icon: FileImage, href: '/image/to-pdf', category: 'green', isNew: true },
  { name: 'Exam Photo Validator', description: 'Auto-resize your photo to exact JEE, NEET, UPSC, SSC specs.', icon: Sparkles, href: '/image/exam-photo', category: 'special', isNew: true },
  { name: 'Signature Canvas', description: 'Draw and export your signature at the exact exam dimensions.', icon: Maximize, href: '/image/signature-canvas', category: 'green', isNew: true },
];

const iconColor: Record<ToolCategory, string> = {
  red: 'bg-red-100 text-red-600',
  blue: 'bg-brand-100 text-brand-700',
  green: 'bg-success-100 text-success-700',
  special: 'bg-gradient-to-br from-brand-100 to-accent-100 text-brand-700',
};

function RecentToolsBar() {
  const { recent } = useRecentTools();
  if (recent.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div className="bg-white rounded-2xl border border-slate-200 px-6 py-4 flex items-center gap-4 flex-wrap shadow-md">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-widest shrink-0">
          <Clock size={13} aria-hidden="true" />
          Recent
        </div>
        {recent.map(tool => (
          <a
            key={tool.href}
            href={tool.href}
            className="px-4 py-2.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-800 hover:bg-brand-100 hover:text-brand-700 hover:shadow-md transition-all"
          >
            {tool.name}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const categories = useMemo(() => [
    {
      id: 'merge-split',
      title: 'Merge & Split PDF',
      tools: tools.filter(t =>
        t.name.includes('Merge') || t.name.includes('Split') ||
        t.name.includes('Remove Pages') || t.name.includes('Extract Pages')
      ),
    },
    {
      id: 'optimize',
      title: 'Optimize PDF',
      tools: tools.filter(t => t.name.includes('Compress') || t.name.includes('Repair')),
    },
    {
      id: 'convert-to',
      title: 'Convert to PDF',
      tools: tools.filter(t => t.name.includes('to PDF') && !t.name.includes('Scan')),
    },
    {
      id: 'convert-from',
      title: 'Convert from PDF',
      tools: tools.filter(t => t.name.startsWith('PDF to')),
    },
    {
      id: 'edit-organize',
      title: 'Edit & Organize PDF',
      tools: tools.filter(t =>
        !t.name.includes('Merge') && !t.name.includes('Split') &&
        !t.name.includes('Compress') && !t.name.includes('to PDF') &&
        !t.name.startsWith('PDF to') && !t.name.includes('Remove Pages') &&
        !t.name.includes('Extract Pages') && !t.name.includes('Repair') &&
        !t.href.startsWith('/image')
      ),
    },
    {
      id: 'image-tools',
      title: 'Image Tools',
      tools: tools.filter(t => t.href.startsWith('/image')),
    },
  ], []);

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden" aria-label="Hero">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 via-success-50/20 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wider mb-8">
              <Sparkles size={14} aria-hidden="true" />
              50+ Free Tools
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-950 mb-8 leading-[1.1]">
              Free PDF & Image Tools <br />
              <span className="bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">Built for Students</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-700 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
              Compress, merge, split, convert PDFs and images — all directly in your browser.
              No uploads, no account, completely free.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="#tools"
                className="px-8 py-4 bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-2xl font-bold shadow-lg shadow-brand-600/30 hover:shadow-xl hover:shadow-brand-600/40 hover:scale-105 transition-all"
              >
                Explore All Tools
              </a>
              <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold">
                <ShieldCheck size={18} className="text-success-600" aria-hidden="true" />
                Files never leave your device
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recently Used */}
      <RecentToolsBar />

      {/* Quick nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-28 relative z-20">
        <nav
          aria-label="Tool categories"
          className="bg-white rounded-3xl shadow-2xl shadow-slate-300/40 border border-slate-200 p-3 flex flex-wrap items-center justify-center gap-1 md:gap-2"
        >
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="px-5 md:px-7 py-3 rounded-2xl text-xs md:text-sm font-bold uppercase tracking-wider text-slate-800 hover:bg-brand-50 hover:text-brand-700 hover:shadow-md transition-all flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-brand-600" aria-hidden="true" />
              {cat.title}
            </a>
          ))}
        </nav>
      </div>

      {/* Tool sections */}
      <div id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-40 space-y-32">
        {categories.map((cat) => (
          <section key={cat.id} id={cat.id} aria-labelledby={`heading-${cat.id}`} className="scroll-mt-24">
            <div className="flex items-center gap-8 mb-14">
              <h2
                id={`heading-${cat.id}`}
                className="text-3xl font-black text-slate-950 uppercase tracking-[0.15em] whitespace-nowrap"
              >
                {cat.title}
              </h2>
              <div className="h-1.5 flex-grow bg-gradient-to-r from-brand-400 to-transparent rounded-full" aria-hidden="true" />
            </div>

            <div className="bento-grid">
              {cat.tools.map((tool) => (
                <Link
                  key={tool.name}
                  to={tool.href}
                  className={cn(
                    'tool-card group h-full flex flex-col',
                    tool.category === 'special' && 'border-brand-300 bg-gradient-to-br from-brand-50 to-accent-50/30'
                  )}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={cn(
                        'w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-md',
                        iconColor[tool.category]
                      )}
                    >
                      <tool.icon size={28} strokeWidth={1.5} aria-hidden="true" />
                    </div>

                    {(tool.isNew || tool.category === 'special') && (
                      <span
                        className={cn(
                          'px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider',
                          tool.category === 'special'
                            ? 'bg-brand-500 text-white animate-pulse'
                            : 'bg-indigo-100 text-indigo-600'
                        )}
                      >
                        {tool.category === 'special' ? 'AI' : 'New'}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">{tool.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{tool.description}</p>

                  <div className="mt-auto pt-6 flex items-center text-xs font-bold text-slate-400 group-hover:text-brand-600 transition-colors">
                    Try free <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Trust bar */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 py-32 relative overflow-hidden" aria-label="Why ExamPixl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 via-accent-500 to-brand-500" aria-hidden="true" />
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
            Your files stay on your device. Always.
          </h2>
          <p className="text-slate-300 text-lg mb-16 max-w-2xl mx-auto font-medium">
            Every tool on ExamPixl runs in your browser using WebAssembly and the Canvas API.
            Nothing is ever uploaded to a server.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: ShieldCheck, color: 'text-brand-400 group-hover:bg-brand-500', title: '100% Secure', sub: 'Local browser processing' },
              { icon: Lock, color: 'text-accent-400 group-hover:bg-accent-500', title: 'Zero Uploads', sub: 'Files never leave your device' },
              { icon: CheckCircle2, color: 'text-success-400 group-hover:bg-success-500', title: 'Free Forever', sub: 'No hidden costs or limits' },
            ].map(({ icon: Icon, color, title, sub }) => (
              <div key={title} className="flex flex-col items-center group">
                <div className={cn('h-16 w-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 transition-all duration-300', color)}>
                  <Icon size={32} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm font-medium">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
