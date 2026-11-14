import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bookmark,
  CheckCircle2,
  Eye,
  Search,
  ShieldAlert,
  Stethoscope,
} from 'lucide-react';
import { DISEASE_CATEGORY_LABELS, EAR_DISEASES } from '../data/diseasesData';
import { DiseaseCategory, EarDisease } from '../types/ear';
import { OtoscopeVisualizer } from './OtoscopeVisualizer';

interface DiseaseExplorerProps {
  selectedDiseaseId: string;
  onSelectDisease: (id: string) => void;
  onInspectIn3D: (disease: EarDisease) => void;
  bookmarkedDiseaseIds: string[];
  onToggleBookmark: (id: string) => void;
  studiedDiseaseIds: string[];
  onToggleStudied: (id: string) => void;
}

const SEVERITY_LABELS: Record<EarDisease['severity'], string> = {
  routine: 'Routine Outpatient',
  urgent: 'Urgent ENT Review',
  surgical: 'Surgical / Specialist',
  emergency: 'Otologic Emergency',
};

const SEVERITY_COLORS: Record<EarDisease['severity'], string> = {
  routine: 'text-emerald-700 dark:text-emerald-400',
  urgent: 'text-amber-700 dark:text-amber-400',
  surgical: 'text-sky-700 dark:text-sky-400',
  emergency: 'text-rose-700 dark:text-rose-400',
};

export const DiseaseExplorer: React.FC<DiseaseExplorerProps> = ({
  selectedDiseaseId,
  onSelectDisease,
  onInspectIn3D,
  bookmarkedDiseaseIds,
  onToggleBookmark,
  studiedDiseaseIds,
  onToggleStudied,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'all' | DiseaseCategory>('all');
  const [searchText, setSearchText] = useState('');

  const filteredDiseases = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return EAR_DISEASES.filter((d) => {
      if (categoryFilter !== 'all' && d.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.subtitle.toLowerCase().includes(q) ||
        d.keywords.some((k) => k.toLowerCase().includes(q)) ||
        d.otoscopicFindings.some((f) => f.toLowerCase().includes(q))
      );
    });
  }, [categoryFilter, searchText]);

  const activeDisease = useMemo(
    () => EAR_DISEASES.find((d) => d.id === selectedDiseaseId) ?? filteredDiseases[0] ?? EAR_DISEASES[0],
    [selectedDiseaseId, filteredDiseases]
  );

  const isBookmarked = bookmarkedDiseaseIds.includes(activeDisease.id);
  const isStudied = studiedDiseaseIds.includes(activeDisease.id);

  return (
    <div className="mx-auto max-w-[1440px] px-3 py-5 sm:px-5">
      {/* Header & Search/Category Bar */}
      <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Ear Disease Scenarios & Treatment Protocols
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {EAR_DISEASES.length} clinical presentations from outer pinna to skull base with synchronized otoscopic signs and management.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Filter diseases or findings…"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-9 text-sm text-slate-900 focus:border-sky-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              categoryFilter === 'all'
                ? 'bg-sky-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            All Scenarios ({EAR_DISEASES.length})
          </button>
          {(Object.keys(DISEASE_CATEGORY_LABELS) as DiseaseCategory[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                categoryFilter === cat
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {DISEASE_CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split: Left Disease Directory | Right Clinical Protocol & Otoscopy */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Directory List */}
        <aside className="lg:col-span-4">
          <div className="atlas-scroll max-h-[420px] divide-y divide-slate-200 overflow-y-auto rounded-xl border border-slate-200 bg-white lg:max-h-[720px] dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
            {filteredDiseases.length === 0 ? (
              <p className="p-6 text-center text-sm text-slate-500">
                No diseases match your current filter.
              </p>
            ) : (
              filteredDiseases.map((disease) => {
                const selected = disease.id === activeDisease.id;
                const studied = studiedDiseaseIds.includes(disease.id);
                return (
                  <button
                    key={disease.id}
                    type="button"
                    onClick={() => onSelectDisease(disease.id)}
                    className={`flex w-full items-start justify-between gap-2 px-4 py-3 text-left transition-colors ${
                      selected
                        ? 'bg-sky-50/90 dark:bg-sky-950/40'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-semibold ${
                          selected
                            ? 'text-sky-800 dark:text-sky-300'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {disease.name}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                        {DISEASE_CATEGORY_LABELS[disease.category]} ·{' '}
                        <span className={SEVERITY_COLORS[disease.severity]}>
                          {SEVERITY_LABELS[disease.severity]}
                        </span>
                      </p>
                    </div>
                    {studied && (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Active Pathology Detail */}
        <section className="lg:col-span-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
            {/* Title + Actions */}
            <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-start dark:border-slate-800">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {DISEASE_CATEGORY_LABELS[activeDisease.category]} ·{' '}
                  <span className={SEVERITY_COLORS[activeDisease.severity]}>
                    {SEVERITY_LABELS[activeDisease.severity]}
                  </span>
                </p>
                <h2 className="mt-1 font-display text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
                  {activeDisease.name}
                </h2>
                <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                  {activeDisease.subtitle}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onInspectIn3D(activeDisease)}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-sky-600 px-3.5 text-xs font-semibold text-white hover:bg-sky-700"
                >
                  <Eye className="h-4 w-4" />
                  Inspect in 3D
                </button>
                <button
                  type="button"
                  onClick={() => onToggleBookmark(activeDisease.id)}
                  className={`inline-flex h-10 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold ${
                    isBookmarked
                      ? 'border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <Bookmark className="h-4 w-4" />
                  {isBookmarked ? 'Saved' : 'Bookmark'}
                </button>
                <button
                  type="button"
                  onClick={() => onToggleStudied(activeDisease.id)}
                  className={`inline-flex h-10 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold ${
                    isStudied
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {isStudied ? 'Studied' : 'Mark Studied'}
                </button>
              </div>
            </div>

            {/* Otoscope + Summary Two-Column Band */}
            <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-12">
              <div className="md:col-span-5">
                <OtoscopeVisualizer title={activeDisease.name} spec={activeDisease.otoscopeSpec} />
              </div>

              <div className="space-y-4 md:col-span-7">
                <div>
                  <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    Pathophysiology & Overview
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {activeDisease.summary}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    Key Otoscopic Findings
                  </h3>
                  <ul className="mt-1.5 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                    {activeDisease.otoscopicFindings.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    Presenting Symptoms
                  </h3>
                  <ul className="mt-1.5 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                    {activeDisease.symptoms.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Diagnostics & Red Flags */}
            <div className="mt-6 grid grid-cols-1 gap-4 border-t border-slate-200 pt-5 md:grid-cols-2 dark:border-slate-800">
              <div className="space-y-2">
                <h3 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  <Stethoscope className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                  Diagnostic Profile
                </h3>
                <dl className="space-y-1.5 text-xs">
                  <div>
                    <dt className="font-semibold text-slate-800 dark:text-slate-200">Tuning Fork (512 Hz)</dt>
                    <dd className="text-slate-600 dark:text-slate-400">{activeDisease.diagnostics.tuningFork}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-800 dark:text-slate-200">Tympanometry</dt>
                    <dd className="font-mono text-slate-600 dark:text-slate-400">
                      Type {activeDisease.diagnostics.tympanometry}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-800 dark:text-slate-200">Audiometry</dt>
                    <dd className="text-slate-600 dark:text-slate-400">{activeDisease.diagnostics.audiometry}</dd>
                  </div>
                  {activeDisease.diagnostics.imagingOrLabs && (
                    <div>
                      <dt className="font-semibold text-slate-800 dark:text-slate-200">Imaging / Workup</dt>
                      <dd className="text-slate-600 dark:text-slate-400">{activeDisease.diagnostics.imagingOrLabs}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-rose-700 uppercase dark:text-rose-400">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Clinical Red Flags
                  </h3>
                  <ul className="mt-1.5 space-y-1 text-xs text-rose-800 dark:text-rose-300">
                    {activeDisease.redFlags.map((rf, i) => (
                      <li key={i}>• {rf}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    Differential Diagnosis
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    {activeDisease.differentialDiagnosis.join(' · ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Treatment Protocol */}
            <div className="mt-5 border-t border-slate-200 pt-5 dark:border-slate-800">
              <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                Clinical Treatment Protocol
              </h3>
              <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Medical & Conservative Management
                  </h4>
                  <ul className="mt-1.5 space-y-1.5 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    {activeDisease.treatmentProtocol.medical.map((m, i) => (
                      <li key={i}>• {m}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Surgical & Procedural Intervention
                  </h4>
                  <ul className="mt-1.5 space-y-1.5 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    {activeDisease.treatmentProtocol.surgical.map((s, i) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {activeDisease.treatmentProtocol.contraindications && (
                <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <div>
                    <span className="font-semibold">Contraindications & Cautions: </span>
                    {activeDisease.treatmentProtocol.contraindications.join(' · ')}
                  </div>
                </div>
              )}

              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                <strong className="text-slate-700 dark:text-slate-300">Follow-up:</strong>{' '}
                {activeDisease.treatmentProtocol.followUp}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
