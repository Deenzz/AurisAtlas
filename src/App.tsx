import React, { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Bookmark,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  RotateCcw,
  Stethoscope,
} from 'lucide-react';
import { DiseaseExplorer } from './components/DiseaseExplorer';
import { EarScene3D } from './components/EarScene3D';
import { ExamModulesView } from './components/ExamModulesView';
import { Navbar } from './components/Navbar';
import { OtoscopeVisualizer } from './components/OtoscopeVisualizer';
import { ProgressDrawer } from './components/ProgressDrawer';
import { QuizModule } from './components/QuizModule';
import { SearchModal } from './components/SearchModal';
import { ANATOMY_STRUCTURES, REGION_LABELS } from './data/anatomyData';
import { EAR_DISEASES, NORMAL_OTOSCOPE_SPEC } from './data/diseasesData';
import {
  EarDisease,
  EarRegion,
  LayerKey,
  LayerVisibility,
  StudyProgress,
  StudyReminder,
  ViewCameraPreset,
  WorkspaceTab,
} from './types/ear';
import { isReminderDue, toggleIdInList } from './utils/earLogic';

const STORAGE_KEYS = {
  DARK: 'aurisatlas_dark_v1',
  PROGRESS: 'aurisatlas_progress_v1',
  REMINDERS: 'aurisatlas_reminders_v1',
};

const DEFAULT_LAYERS: LayerVisibility = {
  [LayerKey.PINNA]: true,
  [LayerKey.CANAL]: true,
  [LayerKey.TYMPANIC_MEMBRANE]: true,
  [LayerKey.OSSICLES]: true,
  [LayerKey.MIDDLE_CAVITY]: true,
  [LayerKey.INNER_LABYRINTH]: true,
  [LayerKey.NERVES_VESSELS]: true,
};

const DEFAULT_PROGRESS: StudyProgress = {
  studiedStructureIds: [],
  studiedDiseaseIds: [],
  completedExamIds: [],
  bookmarkedStructureIds: ['pars-flaccida', 'stapes'],
  bookmarkedDiseaseIds: ['acquired-cholesteatoma'],
  quizAnswers: {},
};

const DEFAULT_REMINDERS: StudyReminder[] = [
  {
    id: 'default-rem-1',
    label: 'Daily Otoscopy & Anatomy Review',
    timeOfDay: '19:00',
    frequency: 'daily',
    focusTopic: 'Tympanic Membrane Quadrants & Cholesteatoma',
    enabled: false,
    createdAt: '2026-11-01T00:00:00.000Z',
  },
];

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() =>
    loadJson<boolean>(STORAGE_KEYS.DARK, false)
  );
  const [activeTab, setActiveTab] = useState<WorkspaceTab>(WorkspaceTab.ATLAS);
  const [progress, setProgress] = useState<StudyProgress>(() =>
    loadJson<StudyProgress>(STORAGE_KEYS.PROGRESS, DEFAULT_PROGRESS)
  );
  const [reminders, setReminders] = useState<StudyReminder[]>(() =>
    loadJson<StudyReminder[]>(STORAGE_KEYS.REMINDERS, DEFAULT_REMINDERS)
  );

  // 3D Atlas & Otoscopy synchronized state
  const [layerVisibility, setLayerVisibility] = useState<LayerVisibility>(DEFAULT_LAYERS);
  const [explodeAmount, setExplodeAmount] = useState(0);
  const [cameraPreset, setCameraPreset] = useState<ViewCameraPreset>(ViewCameraPreset.OVERVIEW);
  const [selectedStructureId, setSelectedStructureId] = useState<string>('tympanic-membrane');
  const [inspectorTab, setInspectorTab] = useState<'structure' | 'otoscope'>('structure');
  const [activeDiseaseId, setActiveDiseaseId] = useState<string | null>(null); // null = normal ear
  const [diseaseExplorerId, setDiseaseExplorerId] = useState<string>(EAR_DISEASES[0].id);

  // Modals / Drawers
  const [searchOpen, setSearchOpen] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const [nowTick, setNowTick] = useState(() => new Date());

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
    try {
      localStorage.setItem(STORAGE_KEYS.DARK, JSON.stringify(darkMode));
    } catch {
      // ignore storage quota errors
    }
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
    } catch {
      // ignore
    }
  }, [reminders]);

  // Periodically check due reminders every 30s
  useEffect(() => {
    const timer = window.setInterval(() => setNowTick(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  const dueReminders = useMemo(
    () => reminders.filter((r) => isReminderDue(r, nowTick)),
    [reminders, nowTick]
  );

  const selectedStructure = useMemo(
    () =>
      ANATOMY_STRUCTURES.find((s) => s.id === selectedStructureId) ?? ANATOMY_STRUCTURES[0],
    [selectedStructureId]
  );

  const active3DDisease = useMemo(
    () => (activeDiseaseId ? EAR_DISEASES.find((d) => d.id === activeDiseaseId) : undefined),
    [activeDiseaseId]
  );

  const handleToggleLayer = (layer: LayerKey) => {
    setLayerVisibility((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleSelectStructure = (id: string, switchTab = true) => {
    const found = ANATOMY_STRUCTURES.find((s) => s.id === id);
    if (!found) return;
    setSelectedStructureId(found.id);
    setLayerVisibility((prev) => ({ ...prev, [found.layer]: true }));
    setCameraPreset(found.cameraPreset);
    setInspectorTab('structure');
    if (switchTab) setActiveTab(WorkspaceTab.ATLAS);
  };

  const handleInspectDiseaseIn3D = (disease: EarDisease) => {
    setActiveDiseaseId(disease.id);
    setDiseaseExplorerId(disease.id);
    setLayerVisibility((prev) => ({ ...prev, [disease.focusLayer]: true }));
    setCameraPreset(disease.cameraPreset);
    setInspectorTab('otoscope');
    setActiveTab(WorkspaceTab.ATLAS);
  };

  const handleOpenDiseaseInExplorer = (id: string) => {
    setDiseaseExplorerId(id);
    setActiveTab(WorkspaceTab.DISEASES);
  };

  const handleToggleBookmarkStructure = (id: string) => {
    setProgress((p) => ({
      ...p,
      bookmarkedStructureIds: toggleIdInList(p.bookmarkedStructureIds, id),
    }));
  };

  const handleToggleBookmarkDisease = (id: string) => {
    setProgress((p) => ({
      ...p,
      bookmarkedDiseaseIds: toggleIdInList(p.bookmarkedDiseaseIds, id),
    }));
  };

  const handleToggleStudiedStructure = (id: string) => {
    setProgress((p) => ({
      ...p,
      studiedStructureIds: toggleIdInList(p.studiedStructureIds, id),
    }));
  };

  const handleToggleStudiedDisease = (id: string) => {
    setProgress((p) => ({
      ...p,
      studiedDiseaseIds: toggleIdInList(p.studiedDiseaseIds, id),
    }));
  };

  const handleToggleExamCompleted = (id: string) => {
    setProgress((p) => ({
      ...p,
      completedExamIds: toggleIdInList(p.completedExamIds, id),
    }));
  };

  const handleAnswerQuestion = (
    questionId: string,
    selectedIndex: number,
    isCorrect: boolean
  ) => {
    setProgress((p) => ({
      ...p,
      quizAnswers: {
        ...p.quizAnswers,
        [questionId]: {
          selectedIndex,
          isCorrect,
          answeredAt: new Date().toISOString(),
        },
      },
    }));
  };

  const handleResetQuizzes = () => {
    setProgress((p) => ({ ...p, quizAnswers: {} }));
  };

  const handleAddReminder = (rem: Omit<StudyReminder, 'id' | 'createdAt'>) => {
    const item: StudyReminder = {
      ...rem,
      id: `rem-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setReminders((prev) => [item, ...prev]);
  };

  const handleToggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleCompleteReminder = (id: string) => {
    const iso = new Date().toISOString();
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, lastCompletedAt: iso } : r))
    );
  };

  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const bookmarkCount =
    progress.bookmarkedStructureIds.length + progress.bookmarkedDiseaseIds.length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((d) => !d)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenProgress={() => setProgressOpen(true)}
        bookmarkCount={bookmarkCount}
        hasDueReminder={dueReminders.length > 0}
      />

      {/* Due Study Reminder Banner */}
      {dueReminders.length > 0 && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/60 dark:text-amber-100">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                <strong>Study Reminder Due:</strong> {dueReminders[0].label} — Focus:{' '}
                {dueReminders[0].focusTopic}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCompleteReminder(dueReminders[0].id)}
              className="rounded-md bg-amber-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-amber-700"
            >
              Mark Complete
            </button>
          </div>
        </div>
      )}

      {/* Workspace Views */}
      <main>
        {activeTab === WorkspaceTab.ATLAS && (
          <div className="mx-auto max-w-[1440px] px-3 py-4 sm:px-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              {/* Left / Main Unobstructed 3D Stage */}
              <div className="h-[58vh] min-h-[420px] lg:col-span-8 lg:h-[calc(100vh-108px)]">
                <EarScene3D
                  darkMode={darkMode}
                  layerVisibility={layerVisibility}
                  onToggleLayer={handleToggleLayer}
                  explodeAmount={explodeAmount}
                  onExplodeChange={setExplodeAmount}
                  cameraPreset={cameraPreset}
                  onCameraPresetChange={setCameraPreset}
                  selectedStructureId={selectedStructure.id}
                  onSelectStructure={(id) => handleSelectStructure(id, false)}
                  activeOtoscopeSpec={active3DDisease?.otoscopeSpec ?? NORMAL_OTOSCOPE_SPEC}
                  activeDiseaseName={active3DDisease?.name}
                />
              </div>

              {/* Right Clinical Inspector Deck */}
              <aside className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white lg:col-span-4 lg:h-[calc(100vh-108px)] dark:border-slate-800 dark:bg-slate-900">
                {/* Inspector Mode Switcher */}
                <div className="grid grid-cols-2 border-b border-slate-200 p-1.5 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setInspectorTab('structure')}
                    className={`rounded-lg py-2 text-xs font-semibold transition-colors ${
                      inspectorTab === 'structure'
                        ? 'bg-sky-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                  >
                    Anatomical Inspector
                  </button>
                  <button
                    type="button"
                    onClick={() => setInspectorTab('otoscope')}
                    className={`rounded-lg py-2 text-xs font-semibold transition-colors ${
                      inspectorTab === 'otoscope'
                        ? 'bg-sky-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                  >
                    Otoscope & Pathology
                  </button>
                </div>

                {/* Scrollable Inspector Body */}
                <div className="atlas-scroll flex-1 overflow-y-auto p-4">
                  {inspectorTab === 'structure' ? (
                    <div className="space-y-4">
                      {/* Quick Structure Selector */}
                      <div>
                        <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                          Jump to Structure
                        </label>
                        <select
                          value={selectedStructure.id}
                          onChange={(e) => handleSelectStructure(e.target.value, false)}
                          aria-label="Select anatomical structure"
                          className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-900 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                        >
                          {(Object.keys(REGION_LABELS) as EarRegion[]).map((reg) => (
                            <optgroup key={reg} label={REGION_LABELS[reg]}>
                              {ANATOMY_STRUCTURES.filter((s) => s.region === reg).map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.name}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </div>

                      {/* Structure Title & Actions */}
                      <div className="border-b border-slate-200 pb-3 dark:border-slate-800">
                        <p className="text-xs font-semibold text-sky-700 dark:text-sky-400">
                          {REGION_LABELS[selectedStructure.region]}
                          {selectedStructure.quadrant ? ` · Quadrant: ${selectedStructure.quadrant}` : ''}
                        </p>
                        <h2 className="mt-1 font-display text-lg font-bold text-slate-900 dark:text-white">
                          {selectedStructure.name}
                        </h2>
                        {selectedStructure.latinName && (
                          <p className="text-xs italic text-slate-500 dark:text-slate-400">
                            {selectedStructure.latinName}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleBookmarkStructure(selectedStructure.id)}
                            className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold ${
                              progress.bookmarkedStructureIds.includes(selectedStructure.id)
                                ? 'border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                                : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <Bookmark className="h-3.5 w-3.5" />
                            {progress.bookmarkedStructureIds.includes(selectedStructure.id)
                              ? 'Bookmarked'
                              : 'Bookmark'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleStudiedStructure(selectedStructure.id)}
                            className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold ${
                              progress.studiedStructureIds.includes(selectedStructure.id)
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {progress.studiedStructureIds.includes(selectedStructure.id)
                              ? 'Studied'
                              : 'Mark Studied'}
                          </button>
                        </div>
                      </div>

                      {/* Details */}
                      <div>
                        <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                          Anatomy & Function
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                          {selectedStructure.summary}
                        </p>
                      </div>

                      <dl className="space-y-2.5 border-t border-slate-200 pt-3 text-xs dark:border-slate-800">
                        {selectedStructure.measurements && (
                          <div>
                            <dt className="font-semibold text-slate-900 dark:text-slate-100">
                              Dimensions / Landmarks
                            </dt>
                            <dd className="mt-0.5 text-slate-600 dark:text-slate-400">
                              {selectedStructure.measurements}
                            </dd>
                          </div>
                        )}
                        {selectedStructure.nerveSupply && (
                          <div>
                            <dt className="font-semibold text-slate-900 dark:text-slate-100">
                              Innervation
                            </dt>
                            <dd className="mt-0.5 text-slate-600 dark:text-slate-400">
                              {selectedStructure.nerveSupply}
                            </dd>
                          </div>
                        )}
                        {selectedStructure.bloodSupply && (
                          <div>
                            <dt className="font-semibold text-slate-900 dark:text-slate-100">
                              Vascular Supply
                            </dt>
                            <dd className="mt-0.5 text-slate-600 dark:text-slate-400">
                              {selectedStructure.bloodSupply}
                            </dd>
                          </div>
                        )}
                      </dl>

                      <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-3 text-xs dark:border-sky-900 dark:bg-sky-950/40">
                        <p className="font-bold text-sky-900 dark:text-sky-200">
                          Clinical & Otoscopic Significance
                        </p>
                        <p className="mt-1 leading-relaxed text-sky-900/90 dark:text-sky-300">
                          {selectedStructure.clinicalSignificance}
                        </p>
                      </div>

                      {selectedStructure.relatedIds.length > 0 && (
                        <div>
                          <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                            Related Structures
                          </h3>
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {selectedStructure.relatedIds.map((rid) => {
                              const rel = ANATOMY_STRUCTURES.find((item) => item.id === rid);
                              if (!rel) return null;
                              return (
                                <button
                                  key={rid}
                                  type="button"
                                  onClick={() => handleSelectStructure(rid, false)}
                                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:border-sky-500 hover:text-sky-700 dark:border-slate-700 dark:text-slate-300"
                                >
                                  {rel.name.split(' (')[0]}
                                  <ChevronRight className="h-3 w-3" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Otoscope & Pathology Synchronized Panel */
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                            Simulate Pathology on 3D Ear
                          </label>
                          {active3DDisease && (
                            <button
                              type="button"
                              onClick={() => setActiveDiseaseId(null)}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 hover:underline dark:text-sky-400"
                            >
                              <RotateCcw className="h-3 w-3" />
                              Reset Normal
                            </button>
                          )}
                        </div>
                        <select
                          value={activeDiseaseId ?? 'normal'}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'normal') {
                              setActiveDiseaseId(null);
                            } else {
                              const d = EAR_DISEASES.find((item) => item.id === val);
                              if (d) {
                                setActiveDiseaseId(d.id);
                                setCameraPreset(d.cameraPreset);
                              }
                            }
                          }}
                          aria-label="Select pathology for 3D otoscope view"
                          className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-900 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                        >
                          <option value="normal">Normal Healthy Right Ear</option>
                          {EAR_DISEASES.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <OtoscopeVisualizer
                        title={active3DDisease?.name ?? 'Normal Healthy Right Ear'}
                        spec={active3DDisease?.otoscopeSpec ?? NORMAL_OTOSCOPE_SPEC}
                        onSelectLandmark={(sid) => handleSelectStructure(sid, false)}
                      />

                      {active3DDisease ? (
                        <div className="space-y-3 border-t border-slate-200 pt-3 dark:border-slate-800">
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                              {active3DDisease.name}
                            </h3>
                            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                              {active3DDisease.otoscopicFindings.join(' ')}
                            </p>
                          </div>
                          <div className="text-xs">
                            <p className="font-semibold text-slate-800 dark:text-slate-200">
                              Quick Protocol Summary
                            </p>
                            <p className="mt-0.5 text-slate-600 dark:text-slate-400">
                              {active3DDisease.treatmentProtocol.medical[0] ||
                                active3DDisease.treatmentProtocol.surgical[0]}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenDiseaseInExplorer(active3DDisease.id)}
                            className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-sky-600 px-3 text-xs font-semibold text-white hover:bg-sky-700"
                          >
                            <Stethoscope className="h-3.5 w-3.5" />
                            Full Diagnosis & Treatment Protocol
                            <ExternalLink className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2 border-t border-slate-200 pt-3 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            Normal Otoscopic Landmarks
                          </p>
                          <p>
                            Pearly-gray translucent pars tensa, crisp cone of light at 5 o’clock (right ear), oblique malleus handle, intact Shrapnell membrane, and brisk pneumatic mobility.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </div>
        )}

        {activeTab === WorkspaceTab.DISEASES && (
          <DiseaseExplorer
            selectedDiseaseId={diseaseExplorerId}
            onSelectDisease={setDiseaseExplorerId}
            onInspectIn3D={handleInspectDiseaseIn3D}
            bookmarkedDiseaseIds={progress.bookmarkedDiseaseIds}
            onToggleBookmark={handleToggleBookmarkDisease}
            studiedDiseaseIds={progress.studiedDiseaseIds}
            onToggleStudied={handleToggleStudiedDisease}
          />
        )}

        {activeTab === WorkspaceTab.EXAM && (
          <ExamModulesView
            completedExamIds={progress.completedExamIds}
            onToggleExamCompleted={handleToggleExamCompleted}
          />
        )}

        {activeTab === WorkspaceTab.QUIZ && (
          <QuizModule
            quizAnswers={progress.quizAnswers}
            onAnswerQuestion={handleAnswerQuestion}
            onResetQuizzes={handleResetQuizzes}
            onJumpToDisease={(did) => handleOpenDiseaseInExplorer(did)}
            onJumpToStructure={(sid) => handleSelectStructure(sid, true)}
          />
        )}
      </main>

      {/* Modals & Drawers */}
      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectStructure={(id) => handleSelectStructure(id, true)}
        onSelectDisease={(id) => handleOpenDiseaseInExplorer(id)}
      />

      <ProgressDrawer
        open={progressOpen}
        onClose={() => setProgressOpen(false)}
        progress={progress}
        reminders={reminders}
        onAddReminder={handleAddReminder}
        onToggleReminder={handleToggleReminder}
        onCompleteReminder={handleCompleteReminder}
        onDeleteReminder={handleDeleteReminder}
        onOpenStructure={(id) => handleSelectStructure(id, true)}
        onOpenDisease={(id) => handleOpenDiseaseInExplorer(id)}
        onRemoveBookmark={(type, id) => {
          if (type === 'structure') handleToggleBookmarkStructure(id);
          else handleToggleBookmarkDisease(id);
        }}
      />
    </div>
  );
}
