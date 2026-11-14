import React, { useState } from 'react';
import {
  Bell,
  Bookmark,
  CheckCircle2,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { ANATOMY_STRUCTURES } from '../data/anatomyData';
import { EAR_DISEASES } from '../data/diseasesData';
import { EXAM_MODULES } from '../data/examModulesData';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { StudyProgress, StudyReminder } from '../types/ear';
import { computeStudyStats, formatReminderFrequency, isReminderDue } from '../utils/earLogic';

interface ProgressDrawerProps {
  open: boolean;
  onClose: () => void;
  progress: StudyProgress;
  reminders: StudyReminder[];
  onAddReminder: (reminder: Omit<StudyReminder, 'id' | 'createdAt'>) => void;
  onToggleReminder: (id: string) => void;
  onCompleteReminder: (id: string) => void;
  onDeleteReminder: (id: string) => void;
  onOpenStructure: (id: string) => void;
  onOpenDisease: (id: string) => void;
  onRemoveBookmark: (type: 'structure' | 'disease', id: string) => void;
}

export const ProgressDrawer: React.FC<ProgressDrawerProps> = ({
  open,
  onClose,
  progress,
  reminders,
  onAddReminder,
  onToggleReminder,
  onCompleteReminder,
  onDeleteReminder,
  onOpenStructure,
  onOpenDisease,
  onRemoveBookmark,
}) => {
  const [label, setLabel] = useState('Evening Otoscopy Review');
  const [timeOfDay, setTimeOfDay] = useState('19:30');
  const [frequency, setFrequency] = useState<StudyReminder['frequency']>('daily');
  const [focusTopic, setFocusTopic] = useState('Tympanic Membrane & Cholesteatoma');
  const [notifStatus, setNotifStatus] = useState<string | null>(null);

  if (!open) return null;

  const stats = computeStudyStats(
    progress,
    ANATOMY_STRUCTURES.length,
    EAR_DISEASES.length,
    EXAM_MODULES.length,
    QUIZ_QUESTIONS.length
  );

  const bookmarkedStructures = ANATOMY_STRUCTURES.filter((s) =>
    progress.bookmarkedStructureIds.includes(s.id)
  );
  const bookmarkedDiseases = EAR_DISEASES.filter((d) =>
    progress.bookmarkedDiseaseIds.includes(d.id)
  );

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;
    onAddReminder({
      label: label.trim(),
      timeOfDay,
      frequency,
      focusTopic: focusTopic.trim() || 'Ear Anatomy & Otoscopy',
      enabled: true,
    });
    setLabel('');
  };

  const handleEnableBrowserAlerts = async () => {
    if (typeof Notification === 'undefined') {
      setNotifStatus('Browser notifications are unavailable here; in-app reminder banners remain active.');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setNotifStatus(
        permission === 'granted'
          ? 'Desktop/browser notifications enabled for due study reminders.'
          : 'Permission declined; in-app study reminder banner remains active.'
      );
    } catch {
      setNotifStatus('In-app study reminder banner active.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/50"
      role="dialog"
      aria-modal="true"
      aria-label="Study progress, bookmarks, and reminders"
      onClick={onClose}
    >
      <div
        className="atlas-scroll flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Study Hub
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Mastery progress, saved bookmarks & study reminders
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Study Hub"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Section 1: Progress Overview */}
        <section className="border-b border-slate-200 py-4 dark:border-slate-800">
          <div className="flex items-baseline justify-between">
            <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              Overall Mastery
            </h3>
            <span className="font-mono text-xl font-bold text-sky-600 tabular-nums dark:text-sky-400">
              {stats.overallMasteryPct}%
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-sky-600 transition-all duration-300"
              style={{ width: `${stats.overallMasteryPct}%` }}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg border border-slate-200 p-2.5 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400">Structures Studied</p>
              <p className="mt-0.5 font-mono text-sm font-semibold text-slate-900 tabular-nums dark:text-white">
                {progress.studiedStructureIds.length} / {ANATOMY_STRUCTURES.length}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-2.5 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400">Diseases Reviewed</p>
              <p className="mt-0.5 font-mono text-sm font-semibold text-slate-900 tabular-nums dark:text-white">
                {progress.studiedDiseaseIds.length} / {EAR_DISEASES.length}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-2.5 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400">Exam Modules</p>
              <p className="mt-0.5 font-mono text-sm font-semibold text-slate-900 tabular-nums dark:text-white">
                {progress.completedExamIds.length} / {EXAM_MODULES.length}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-2.5 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400">Quiz Accuracy</p>
              <p className="mt-0.5 font-mono text-sm font-semibold text-slate-900 tabular-nums dark:text-white">
                {stats.quizCorrectCount}/{stats.quizAttemptedCount} ({stats.quizAccuracyPct}%)
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Bookmarks */}
        <section className="border-b border-slate-200 py-4 dark:border-slate-800">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              <Bookmark className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
              Saved Bookmarks ({bookmarkedStructures.length + bookmarkedDiseases.length})
            </h3>
          </div>

          {bookmarkedStructures.length === 0 && bookmarkedDiseases.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bookmark any anatomical structure or ear pathology while studying to return quickly.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {bookmarkedStructures.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-2 py-2">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenStructure(s.id);
                      onClose();
                    }}
                    className="min-w-0 text-left text-xs font-semibold text-slate-800 hover:text-sky-600 dark:text-slate-200 dark:hover:text-sky-400"
                  >
                    <span className="block truncate">{s.name}</span>
                    <span className="text-[11px] font-normal text-slate-500">Anatomy</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveBookmark('structure', s.id)}
                    aria-label={`Remove bookmark for ${s.name}`}
                    className="p-1.5 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
              {bookmarkedDiseases.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-2 py-2">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenDisease(d.id);
                      onClose();
                    }}
                    className="min-w-0 text-left text-xs font-semibold text-slate-800 hover:text-sky-600 dark:text-slate-200 dark:hover:text-sky-400"
                  >
                    <span className="block truncate">{d.name}</span>
                    <span className="text-[11px] font-normal text-slate-500">Pathology</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveBookmark('disease', d.id)}
                    aria-label={`Remove bookmark for ${d.name}`}
                    className="p-1.5 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Section 3: Customizable Study Reminders */}
        <section className="py-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              <Bell className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              Study Reminders
            </h3>
            <button
              type="button"
              onClick={handleEnableBrowserAlerts}
              className="text-[11px] font-semibold text-sky-600 hover:underline dark:text-sky-400"
            >
              Enable Browser Alerts
            </button>
          </div>
          {notifStatus && (
            <p className="mb-3 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] text-slate-600 dark:bg-slate-900 dark:text-slate-400">
              {notifStatus}
            </p>
          )}

          <form onSubmit={handleCreateReminder} className="space-y-2.5 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Reminder Label
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Daily Otoscopy Drill"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Time
                </label>
                <input
                  type="time"
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-xs text-slate-900 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Schedule
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as StudyReminder['frequency'])}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="daily">Every day</option>
                  <option value="twice_daily">Twice daily</option>
                  <option value="every_2_days">Every 2 days</option>
                  <option value="weekdays">Weekdays only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Focus Topic
              </label>
              <input
                type="text"
                value={focusTopic}
                onChange={(e) => setFocusTopic(e.target.value)}
                placeholder="e.g. Tuning forks & OME"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white hover:bg-sky-700"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Study Reminder
            </button>
          </form>

          {reminders.length > 0 && (
            <ul className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
              {reminders.map((rem) => {
                const due = isReminderDue(rem);
                return (
                  <li key={rem.id} className="flex items-start justify-between gap-2 py-2.5">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          checked={rem.enabled}
                          onChange={() => onToggleReminder(rem.id)}
                          aria-label={`Enable ${rem.label}`}
                          className="h-3.5 w-3.5 accent-sky-600"
                        />
                        <span
                          className={`truncate text-xs font-semibold ${
                            rem.enabled
                              ? 'text-slate-900 dark:text-slate-100'
                              : 'text-slate-400 line-through'
                          }`}
                        >
                          {rem.label}
                        </span>
                        {due && (
                          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            Due Now
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 pl-5 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="font-mono tabular-nums">{rem.timeOfDay}</span> ·{' '}
                        {formatReminderFrequency(rem.frequency)} · {rem.focusTopic}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      {due && (
                        <button
                          type="button"
                          onClick={() => onCompleteReminder(rem.id)}
                          title="Mark study session completed"
                          className="rounded p-1 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onDeleteReminder(rem.id)}
                        aria-label={`Delete reminder ${rem.label}`}
                        className="rounded p-1 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};
