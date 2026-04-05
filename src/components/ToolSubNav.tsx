import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Layers, Scissors, Minimize2, RefreshCw, Grid, Trash2, Maximize, FileImage } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const pdfQuickTools = [
  { name: 'Merge PDF', href: '/pdf/merge', icon: Layers },
  { name: 'Split PDF', href: '/pdf/split', icon: Scissors },
  { name: 'Compress PDF', href: '/pdf/compress', icon: Minimize2 },
];

const imageQuickTools = [
  { name: 'Compress Image', href: '/image/compress', icon: Minimize2 },
  { name: 'Resize Image', href: '/image/resize', icon: Maximize },
  { name: 'Remove BG', href: '/image/remove-bg', icon: Trash2 },
];

export default function ToolSubNav() {
  const location = useLocation();
  const isPdf = location.pathname.startsWith('/pdf');
  const isImage = location.pathname.startsWith('/image');
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  if (!isPdf && !isImage) return null;

  const tools = isPdf ? pdfQuickTools : imageQuickTools;
  const typeLabel = isPdf ? 'PDF' : 'IMAGE';

  return (
    <div className="w-full bg-white border-b border-slate-100 sticky top-16 z-40 shadow-sm overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-center gap-8 whitespace-nowrap">
        {tools.map((tool) => (
          <Link
            key={tool.name}
            to={tool.href}
            className={cn(
              "text-[11px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2 px-2 py-1 rounded-lg",
              location.pathname === tool.href 
                ? "text-brand-600 bg-brand-50" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            <tool.icon size={14} strokeWidth={2.5} />
            {tool.name}
          </Link>
        ))}

        {/* Convert Dropdown */}
        <div 
          className="relative"
          onMouseEnter={() => setActiveDropdown('convert')}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <button className={cn(
            "text-[11px] font-black uppercase tracking-[0.15em] flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all",
            activeDropdown === 'convert' ? "text-brand-600 bg-brand-50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
          )}>
            Convert {typeLabel} <ChevronDown size={12} strokeWidth={3} className={cn("transition-transform", activeDropdown === 'convert' && "rotate-180")} />
          </button>
          
          <AnimatePresence>
            {activeDropdown === 'convert' && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl border border-slate-100 shadow-xl p-2"
              >
                {isPdf ? (
                  <>
                    <Link to="/pdf/to-word" className="flex items-center gap-2 p-2 text-[10px] font-bold text-slate-600 hover:bg-slate-50 rounded-lg">PDF to Word</Link>
                    <Link to="/pdf/to-jpg" className="flex items-center gap-2 p-2 text-[10px] font-bold text-slate-600 hover:bg-slate-50 rounded-lg">PDF to JPG</Link>
                    <Link to="/pdf/from-jpg" className="flex items-center gap-2 p-2 text-[10px] font-bold text-slate-600 hover:bg-slate-50 rounded-lg">JPG to PDF</Link>
                  </>
                ) : (
                  <>
                    <Link to="/image/convert" className="flex items-center gap-2 p-2 text-[10px] font-bold text-slate-600 hover:bg-slate-50 rounded-lg">Format Converter</Link>
                    <Link to="/image/to-pdf" className="flex items-center gap-2 p-2 text-[10px] font-bold text-slate-600 hover:bg-slate-50 rounded-lg">Image to PDF</Link>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* All Tools Link */}
        <Link
          to="/"
          className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-500 hover:text-slate-900 flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-slate-50 transition-all"
        >
          All {typeLabel} Tools <ChevronDown size={12} strokeWidth={3} />
        </Link>
      </div>
    </div>
  );
}
