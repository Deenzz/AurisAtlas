import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertOctagon,
  CheckCircle2,
  ClipboardCheck,
  Clock,
} from 'lucide-react';
import { EXAM_MODULES } from '../data/examModulesData';
import { TympanogramType } from '../types/ear';
import {
  interpretAudiologyFindings,
  RinneResult,
  WeberResult,
} from '../utils/earLogic';

interface ExamModulesViewProps {
  completedExamIds: string[];
  onToggleExamCompleted: (id: string) => void;
}

const TYMP_CURVE_PATHS: Record<TympanogramType, { path: string; label: string; desc: string }> = {
  [TympanogramType.TYPE_A]: {
    path: 'M 10,84 Q 72,82 95,30 Q 118,82 190,84',
    label: 'Type A (Normal)',
    desc: 'Normal peak compliance near 0 daPa (−100 to +50 daPa)',
  },
  [TympanogramType.TYPE_AS]: {
    path: 'M 10,84 Q 75,82 95,64 Q 115,82 190,84',
    label: 'Type As (Shallow / Stiff)',
    desc: 'Reduced peak compliance: Otosclerosis or ossicular tympanosclerosis',
  },
  [TympanogramType.TYPE_AD]: {
    path: 'M 10,84 Q 76,82 95,10 Q 114,82 190,84',
    label: 'Type Ad (Hypermobile)',
    desc: 'Tall sharp peak: Ossicular discontinuity or flaccid monomeric TM',
  },
  [TympanogramType.TYPE_B]: {
    path: 'M 10,82 L 190,82',
    label: 'Type B (Flat)',
    desc: 'No compliance peak: OME (normal ECV), perforation/grommet (high ECV), or wax (low ECV)',
  },
  [TympanogramType.TYPE_C]: {
    path: 'M 10,84 Q 36,80 54,36 Q 74,82 190,84',
    label: 'Type C (Negative Pressure)',
    desc: 'Peak shifted < −100 daPa: Eustachian tube dysfunction / retraction',
  },
};

export const ExamModulesView: React.FC<ExamModulesViewProps> = ({
  completedExamIds,
  onToggleExamCompleted,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState(EXAM_MODULES[0].id);

  // Interactive Tuning Fork & Tympanometry Diagnostic Simulator state
  const [rightRinne, setRightRinne] = useState<RinneResult>('negative');
  const [leftRinne, setLeftRinne] = useState<RinneResult>('positive');
  const [weber, setWeber] = useState<WeberResult>('right');
  const [rightTymp, setRightTymp] = useState<TympanogramType>(TympanogramType.TYPE_AS);
  const [leftTymp, setLeftTymp] = useState<TympanogramType>(TympanogramType.TYPE_A);
  const [rightHighEcv, setRightHighEcv] = useState(false);

  const diagnosticResult = useMemo(
    () =>
      interpretAudiologyFindings({
        rightRinne,
        leftRinne,
        weber,
        rightTymp,
        leftTymp,
        rightHighEcv,
        leftHighEcv: false,
      }),
    [rightRinne, leftRinne, weber, rightTymp, leftTymp, rightHighEcv]
  );

  const activeModule =
    EXAM_MODULES.find((m) => m.id === selectedModuleId) ?? EXAM_MODULES[0];
  const isCompleted = completedExamIds.includes(activeModule.id);

  return (
    <div className="mx-auto max-w-[1440px] space-y-8 px-3 py-5 sm:px-5">
      {/* Interactive Diagnostic Simulator */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
          <div>
            <h1 className="font-display text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
              Clinical Examination & Audiology Simulator
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Combine 512 Hz Rinne, Weber, and Tympanometry inputs to test conductive, sensorineural, and False-Negative Rinne patterns.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 dark:text-sky-400">
            <Activity className="h-4 w-4" />
            512 Hz Interactive Solver
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Controls */}
          <div className="space-y-4 lg:col-span-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Right Ear Rinne (512 Hz)
                </p>
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  {(['positive', 'negative'] as RinneResult[]).map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setRightRinne(val)}
                      className={`min-h-[38px] rounded-lg px-2 text-xs font-semibold transition-colors ${
                        rightRinne === val
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {val === 'positive' ? 'Positive (AC>BC)' : 'Negative (BC>AC)'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Left Ear Rinne (512 Hz)
                </p>
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  {(['positive', 'negative'] as RinneResult[]).map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setLeftRinne(val)}
                      className={`min-h-[38px] rounded-lg px-2 text-xs font-semibold transition-colors ${
                        leftRinne === val
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {val === 'positive' ? 'Positive (AC>BC)' : 'Negative (BC>AC)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Weber */}
            <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Weber Test Lateralization (Midline Forehead)
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(['right', 'central', 'left'] as WeberResult[]).map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWeber(w)}
                    className={`min-h-[38px] rounded-lg px-2 text-xs font-semibold capitalize transition-colors ${
                      weber === w
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {w === 'central' ? 'Midline / Equal' : `Louder in ${w}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Tympanogram */}
            <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Right Ear Tympanogram Curve
                </p>
                {rightTymp === TympanogramType.TYPE_B && (
                  <label className="flex items-center gap-1.5 text-xs font-medium text-sky-700 dark:text-sky-400">
                    <input
                      type="checkbox"
                      checked={rightHighEcv}
                      onChange={(e) => setRightHighEcv(e.target.checked)}
                      className="h-3.5 w-3.5 accent-sky-600"
                    />
                    High ECV (&gt;2.0 mL)
                  </label>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {Object.values(TympanogramType).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setRightTymp(t)}
                    className={`min-h-[36px] rounded-lg px-3 font-mono text-xs font-semibold transition-colors ${
                      rightTymp === t
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    Type {t}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Left Tympanogram:</span>
                <select
                  value={leftTymp}
                  onChange={(e) => setLeftTymp(e.target.value as TympanogramType)}
                  aria-label="Left ear tympanogram type"
                  className="rounded-md border border-slate-200 bg-white px-2 py-1 font-mono text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  {Object.values(TympanogramType).map((t) => (
                    <option key={t} value={t}>
                      Type {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Live Curve + Interpretation Output */}
          <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 lg:col-span-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="w-full shrink-0 rounded-lg border border-slate-200 bg-white p-2 sm:w-48 dark:border-slate-800 dark:bg-slate-900">
                <svg viewBox="0 0 200 100" className="h-24 w-full" role="img" aria-label={`Tympanogram ${TYMP_CURVE_PATHS[rightTymp].label}`}>
                  <line x1="10" y1="86" x2="190" y2="86" stroke="#94a3b8" strokeWidth="1" />
                  <line x1="95" y1="8" x2="95" y2="86" stroke="#cbd5e1" strokeDasharray="3 3" strokeWidth="1" />
                  <path
                    d={TYMP_CURVE_PATHS[rightTymp].path}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <text x="14" y="96" fontSize="8" fill="#64748b">-300 daPa</text>
                  <text x="90" y="96" fontSize="8" fill="#64748b">0</text>
                  <text x="160" y="96" fontSize="8" fill="#64748b">+200</text>
                </svg>
                <p className="mt-1 text-center text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  {TYMP_CURVE_PATHS[rightTymp].label}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold tracking-wider text-sky-700 uppercase dark:text-sky-400">
                  Diagnostic Synthesis · {diagnosticResult.affectedSide}
                </p>
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  {diagnosticResult.primaryPattern}
                </h2>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {diagnosticResult.mechanism}
                </p>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-200 pt-3 text-xs dark:border-slate-800">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Most Likely Etiologies:{' '}
                </span>
                <span className="text-slate-600 dark:text-slate-400">
                  {diagnosticResult.likelyConditions.join(' · ')}
                </span>
              </div>
              <div className="rounded-lg bg-sky-50 px-3 py-2 text-sky-900 dark:bg-sky-950/50 dark:text-sky-200">
                <strong>Clinical Pearl: </strong>
                {diagnosticResult.clinicalPearl}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OSCE & Clinical Examination Modules */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <h2 className="mb-3 font-display text-lg font-bold text-slate-900 dark:text-white">
            Student Examination & OSCE Modules
          </h2>
          <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
            {EXAM_MODULES.map((mod) => {
              const selected = mod.id === activeModule.id;
              const done = completedExamIds.includes(mod.id);
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => setSelectedModuleId(mod.id)}
                  className={`flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left transition-colors ${
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
                      {mod.title}
                    </p>
                    <p className="mt-0.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>{mod.category}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                        <Clock className="h-3 w-3" />
                        {mod.durationMinutes} min
                      </span>
                    </p>
                  </div>
                  {done && (
                    <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
              <div>
                <p className="text-xs font-semibold text-sky-700 uppercase dark:text-sky-400">
                  {activeModule.category} · {activeModule.durationMinutes} min OSCE Guide
                </p>
                <h3 className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-white">
                  {activeModule.title}
                </h3>
                <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                  {activeModule.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onToggleExamCompleted(activeModule.id)}
                className={`inline-flex h-10 items-center gap-1.5 rounded-lg border px-3.5 text-xs font-semibold transition-colors ${
                  isCompleted
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                <ClipboardCheck className="h-4 w-4" />
                {isCompleted ? 'Module Completed' : 'Mark Module Complete'}
              </button>
            </div>

            <div className="mt-4 space-y-5">
              <div>
                <h4 className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Learning Objectives
                </h4>
                <ul className="mt-1.5 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  {activeModule.objectives.map((obj, idx) => (
                    <li key={idx}>• {obj}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Step-by-Step Examination Protocol
                </h4>
                <div className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                  {activeModule.techniqueSteps.map((st, idx) => (
                    <div key={idx} className="p-3.5">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {st.step}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                        {st.detail}
                      </p>
                      {st.clinicalTip && (
                        <p className="mt-1.5 text-xs font-medium text-sky-700 dark:text-sky-400">
                          Tip: {st.clinicalTip}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Normal vs. Pathologic Interpretation
                </h4>
                <div className="mt-2 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-400">
                      <tr>
                        <th className="px-3 py-2.5 font-semibold">Parameter</th>
                        <th className="px-3 py-2.5 font-semibold">Normal</th>
                        <th className="px-3 py-2.5 font-semibold">Abnormal Significance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {activeModule.normalVsAbnormal.map((row, idx) => (
                        <tr key={idx}>
                          <td className="px-3 py-2.5 font-semibold text-slate-900 dark:text-slate-100">
                            {row.finding}
                          </td>
                          <td className="px-3 py-2.5 text-emerald-700 dark:text-emerald-400">
                            {row.normal}
                          </td>
                          <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300">
                            {row.abnormal}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {activeModule.contraindications && (
                <div className="flex items-start gap-2 rounded-xl bg-rose-50 p-3.5 text-xs text-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
                  <AlertOctagon className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                  <div>
                    <p className="font-bold">Critical Safety Contraindications</p>
                    <ul className="mt-1 space-y-1">
                      {activeModule.contraindications.map((c, idx) => (
                        <li key={idx}>• {c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
