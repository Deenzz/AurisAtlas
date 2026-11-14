import React from 'react';
import {
  Bookmark,
  BookOpen,
  ClipboardCheck,
  Ear,
  HelpCircle,
  Moon,
  Search,
  Stethoscope,
  Sun,
} from 'lucide-react';
import { WorkspaceTab } from '../types/ear';

interface NavbarProps {
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSearch: () => void;
  onOpenProgress: () => void;
  bookmarkCount: number;
  hasDueReminder: boolean;
}

const NAV_ITEMS: { id: WorkspaceTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: WorkspaceTab.ATLAS, label: '3D Atlas', icon: Ear },
  { id: WorkspaceTab.DISEASES, label: 'Diseases', icon: Stethoscope },
  { id: WorkspaceTab.EXAM, label: 'Clinical Exam', icon: ClipboardCheck },
  { id: WorkspaceTab.QUIZ, label: 'Quizzes', icon: HelpCircle },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  darkMode,
  onToggleDarkMode,
  onOpenSearch,
  onOpenProgress,
  bookmarkCount,
  hasDueReminder,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-2 px-3 sm:px-5">
        {/* Left: Brand */}
        <button
          type="button"
          onClick={() => onTabChange(WorkspaceTab.ATLAS)}
          className="flex items-center gap-2 rounded-lg px-1 py-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-600 text-white">
            <Ear className="h-4.5 w-4.5" />
          </span>
          <span className="font-display text-base font-bold tracking-tight text-slate-900 dark:text-white">
            AurisAtlas
          </span>
        </button>

        {/* Center: Primary Navigation (Desktop) */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary sections">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onTabChange(id)}
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Right: Search, Study/Bookmarks, Theme */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenSearch}
            className="inline-flex h-10 min-w-[40px] items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 sm:px-3"
            aria-label="Search anatomy and diseases"
          >
            <Search className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Search</span>
          </button>

          <button
            type="button"
            onClick={onOpenProgress}
            className="relative inline-flex h-10 min-w-[40px] items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:px-3"
            aria-label="Study progress, bookmarks, and reminders"
          >
            <Bookmark className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            <span className="hidden sm:inline">Study Hub</span>
            <span className="font-mono text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
              {bookmarkCount}
            </span>
            {hasDueReminder && (
              <span className="ml-0.5 rounded bg-amber-600 px-1 py-0.5 text-[10px] font-bold text-white">
                Due
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onToggleDarkMode}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Compact Sub-Nav Bar (<=768px) */}
      <nav
        className="grid grid-cols-4 border-t border-slate-200 bg-slate-50/70 md:hidden dark:border-slate-800 dark:bg-slate-900/70"
        aria-label="Mobile sections"
      >
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={`flex min-h-[44px] flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-[11px] font-semibold transition-colors ${
                active
                  ? 'text-sky-700 dark:text-sky-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
