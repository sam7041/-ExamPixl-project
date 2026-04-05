import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface SubNavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface SubNavProps {
  items: SubNavItem[];
  title: string;
}

export default function SubNav({ items, title }: SubNavProps) {
  const location = useLocation();

  return (
    <div className="sticky top-16 z-40 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center gap-8 whitespace-nowrap">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-1 h-4 bg-brand-500 rounded-full" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">{title}</span>
          </div>
          
          <div className="flex items-center gap-1">
            {items.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "relative px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                    isActive 
                      ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20" 
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  <item.icon size={14} />
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeSubNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
