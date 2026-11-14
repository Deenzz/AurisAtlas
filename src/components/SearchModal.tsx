import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Ear, Search, Stethoscope, X } from 'lucide-react';
import { ANATOMY_STRUCTURES } from '../data/anatomyData';
import { EAR_DISEASES } from '../data/diseasesData';
import { searchAtlasItems } from '../utils/earLogic';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  onSelectStructure: (id: string) => void;
  onSelectDisease: (id: string) => void;
}

const QUICK_SUGGESTIONS = [
  'Prussak',
  'Stapes',
  'Cholesteatoma',
  'Cone of Light',
  'Glomus',
  'Chorda Tympani',
  'Otosclerosis',
  'Arnold nerve',
];

export const SearchModal: React.FC<SearchModalProps> = ({
  open,
  onClose,
  onSelectStructure,
  onSelectDisease,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
    } else {
      setQuery('');
    }
  }, [open]);

  const matches = useMemo(
    () => searchAtlasItems(query, ANATOMY_STRUCTURES, EAR_DISEASES),
    [query]
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 px-3 pt-16 sm:pt-24"
      role="dialog"
      aria-modal="true"
      aria-label="Search ear anatomy and pathologies"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <Search className="h-4.5 w-4.5 shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search structures, nerves, quadrants, or ear diseases…"
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="atlas-scroll max-h-[60vh] overflow-y-auto p-3">
          {!query.trim() ? (
            <div>
              <p className="px-2 pb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                High-Yield Searches
              </p>
              <div className="flex flex-wrap gap-1.5 px-2 pb-2">
                {QUICK_SUGGESTIONS.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-sky-400 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-sky-500"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : matches.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No matching anatomical structures or diseases found for “{query}”.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {matches.slice(0, 14).map((item) => (
                <li key={`${item.type}-${item.id}`}>
                  <button
                    type="button"
                    onClick={() => {
                      if (item.type === 'structure') onSelectStructure(item.id);
                      else onSelectDisease(item.id);
                      onClose();
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/70"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          item.type === 'structure'
                            ? 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-400'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                        }`}
                      >
                        {item.type === 'structure' ? (
                          <Ear className="h-4 w-4" />
                        ) : (
                          <Stethoscope className="h-4 w-4" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {item.title}
                        </p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {item.type === 'structure' ? 'Anatomy' : 'Pathology'} · {item.subtitle}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
