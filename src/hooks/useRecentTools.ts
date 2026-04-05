import { useState, useCallback } from 'react';

export interface RecentTool {
  name: string;
  href: string;
  category: 'pdf' | 'image' | 'exam';
  visitedAt: number;
}

const STORAGE_KEY = 'exampixl_recent';
const MAX_ITEMS = 6;

function readFromStorage(): RecentTool[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useRecentTools() {
  const [recent, setRecent] = useState<RecentTool[]>(readFromStorage);

  const track = useCallback((tool: Omit<RecentTool, 'visitedAt'>) => {
    setRecent(prev => {
      const filtered = prev.filter(t => t.href !== tool.href);
      const updated = [{ ...tool, visitedAt: Date.now() }, ...filtered].slice(0, MAX_ITEMS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch { /* storage full, ignore */ }
      return updated;
    });
  }, []);

  return { recent, track };
}
