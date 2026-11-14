import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { EAR_DISEASES } from '../data/diseasesData';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { QuizCategory, StudyProgress } from '../types/ear';
import { OtoscopeVisualizer } from './OtoscopeVisualizer';

interface QuizModuleProps {
  quizAnswers: StudyProgress['quizAnswers'];
  onAnswerQuestion: (questionId: string, selectedIndex: number, isCorrect: boolean) => void;
  onResetQuizzes: () => void;
  onJumpToDisease: (diseaseId: string) => void;
  onJumpToStructure: (structureId: string) => void;
}

const CATEGORY_LABELS: Record<QuizCategory, string> = {
  [QuizCategory.ALL]: 'All Topics',
  [QuizCategory.ANATOMY]: 'Anatomy',
  [QuizCategory.OTOSCOPY]: 'Otoscopy',
  [QuizCategory.CLINICAL]: 'Clinical Vignettes',
  [QuizCategory.TREATMENT]: 'Treatment Protocols',
};

export const QuizModule: React.FC<QuizModuleProps> = ({
  quizAnswers,
  onAnswerQuestion,
  onResetQuizzes,
  onJumpToDisease,
  onJumpToStructure,
}) => {
  const [category, setCategory] = useState<QuizCategory>(QuizCategory.ALL);
  const [currentIndex, setCurrentIndex] = useState(0);

  const questions = useMemo(() => {
    if (category === QuizCategory.ALL) return QUIZ_QUESTIONS;
    return QUIZ_QUESTIONS.filter((q) => q.category === category);
  }, [category]);

  const safeIndex = Math.min(currentIndex, Math.max(0, questions.length - 1));
  const currentQ = questions[safeIndex];
  const savedAnswer = currentQ ? quizAnswers[currentQ.id] : undefined;

  const linkedDisease = currentQ?.linkedDiseaseId
    ? EAR_DISEASES.find((d) => d.id === currentQ.linkedDiseaseId)
    : undefined;

  const totalAttempted = Object.keys(quizAnswers).length;
  const totalCorrect = Object.values(quizAnswers).filter((a) => a.isCorrect).length;

  return (
    <div className="mx-auto max-w-[1140px] px-3 py-5 sm:px-5">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Interactive Otoscopy & Clinical Assessment
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Test anatomical landmarks, otoscopic pattern recognition, and safe clinical management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <p className="text-slate-500 dark:text-slate-400">Session Score</p>
            <p className="font-mono text-sm font-bold text-slate-900 tabular-nums dark:text-white">
              {totalCorrect} / {totalAttempted} correct ({QUIZ_QUESTIONS.length} total)
            </p>
          </div>
          {totalAttempted > 0 && (
            <button
              type="button"
              onClick={onResetQuizzes}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-5 flex flex-wrap gap-1.5">
        {(Object.keys(CATEGORY_LABELS) as QuizCategory[]).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setCategory(cat);
              setCurrentIndex(0);
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              category === cat
                ? 'bg-sky-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {currentQ && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Question Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:col-span-8 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-sky-700 uppercase dark:text-sky-400">
                {CATEGORY_LABELS[currentQ.category as unknown as QuizCategory] ?? currentQ.category} ·{' '}
                {currentQ.difficulty.replace('_', ' ')}
              </span>
              <span className="font-mono tabular-nums">
                Question {safeIndex + 1} of {questions.length}
              </span>
            </div>

            <h2 className="mt-3 font-display text-lg font-bold leading-snug text-slate-900 dark:text-white">
              {currentQ.prompt}
            </h2>

            <div className="mt-5 space-y-2.5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = savedAnswer?.selectedIndex === idx;
                const isCorrectOpt = idx === currentQ.correctIndex;
                const revealed = Boolean(savedAnswer);

                let btnStyle =
                  'border-slate-200 bg-white text-slate-800 hover:border-sky-400 hover:bg-sky-50/40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-sky-600';
                if (revealed) {
                  if (isCorrectOpt) {
                    btnStyle =
                      'border-emerald-500 bg-emerald-50 text-emerald-950 dark:border-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-100';
                  } else if (isSelected && !isCorrectOpt) {
                    btnStyle =
                      'border-rose-500 bg-rose-50 text-rose-950 dark:border-rose-600 dark:bg-rose-950/50 dark:text-rose-100';
                  } else {
                    btnStyle =
                      'border-slate-200 bg-slate-50/60 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={revealed}
                    onClick={() =>
                      onAnswerQuestion(currentQ.id, idx, idx === currentQ.correctIndex)
                    }
                    className={`flex min-h-[48px] w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${btnStyle}`}
                  >
                    <span className="flex items-start gap-2.5">
                      <span className="font-mono text-xs font-bold opacity-70">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <span>{opt}</span>
                    </span>
                    {revealed && isCorrectOpt && (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    )}
                    {revealed && isSelected && !isCorrectOpt && (
                      <XCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {savedAnswer && (
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                <p
                  className={`text-xs font-bold uppercase ${
                    savedAnswer.isCorrect
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-rose-700 dark:text-rose-400'
                  }`}
                >
                  {savedAnswer.isCorrect ? 'Correct Clinical Reasoning' : 'Clinical Explanation'}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {currentQ.rationale}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {currentQ.linkedDiseaseId && (
                    <button
                      type="button"
                      onClick={() => onJumpToDisease(currentQ.linkedDiseaseId!)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:underline dark:text-sky-400"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Open Disease Protocol & 3D View
                    </button>
                  )}
                  {currentQ.linkedStructureId && (
                    <button
                      type="button"
                      onClick={() => onJumpToStructure(currentQ.linkedStructureId!)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:underline dark:text-sky-400"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Inspect Structure in 3D Atlas
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Question Navigation */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
              <button
                type="button"
                disabled={safeIndex === 0}
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                className="h-10 rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={safeIndex >= questions.length - 1}
                onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-sky-600 px-4 text-xs font-semibold text-white hover:bg-sky-700 disabled:opacity-40"
              >
                Next Question
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Question Navigator + Optional Otoscope Reference */}
          <aside className="space-y-4 lg:col-span-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                Question Map
              </h3>
              <div className="mt-3 grid grid-cols-6 gap-1.5">
                {questions.map((q, idx) => {
                  const ans = quizAnswers[q.id];
                  const active = idx === safeIndex;
                  let cls =
                    'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300';
                  if (ans) {
                    cls = ans.isCorrect
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-rose-500 bg-rose-500 text-white';
                  }
                  if (active) {
                    cls += ' ring-2 ring-sky-500 ring-offset-1 dark:ring-offset-slate-900';
                  }
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-9 rounded-lg border font-mono text-xs font-bold ${cls}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {linkedDisease && savedAnswer && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="mb-2 text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Otoscopic Reference · {linkedDisease.name}
                </p>
                <OtoscopeVisualizer
                  title={linkedDisease.name}
                  spec={linkedDisease.otoscopeSpec}
                />
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
};
