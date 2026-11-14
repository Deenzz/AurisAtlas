import assert from 'node:assert/strict';
import test from 'node:test';
import { ANATOMY_STRUCTURES } from '../data/anatomyData.ts';
import { EAR_DISEASES } from '../data/diseasesData.ts';
import { TympanogramType } from '../types/ear.ts';
import {
  computeStudyStats,
  interpretAudiologyFindings,
  isReminderDue,
  searchAtlasItems,
  toggleIdInList,
} from './earLogic.ts';

test('interpretAudiologyFindings detects unilateral otosclerosis with Type As', () => {
  const result = interpretAudiologyFindings({
    rightRinne: 'negative',
    leftRinne: 'positive',
    weber: 'right',
    rightTymp: TympanogramType.TYPE_AS,
    leftTymp: TympanogramType.TYPE_A,
  });
  assert.equal(result.affectedSide, 'Right Ear');
  assert.match(result.primaryPattern, /Conductive Hearing Loss/i);
  assert.ok(result.likelyConditions.some((c) => /Otosclerosis/i.test(c)));
});

test('interpretAudiologyFindings detects False-Negative Rinne in profound unilateral SNHL', () => {
  const result = interpretAudiologyFindings({
    rightRinne: 'negative',
    leftRinne: 'positive',
    weber: 'left',
    rightTymp: TympanogramType.TYPE_A,
    leftTymp: TympanogramType.TYPE_A,
  });
  assert.match(result.primaryPattern, /False-Negative/i);
  assert.equal(result.affectedSide, 'Right Ear');
  assert.ok(result.likelyConditions.some((c) => /Schwannoma|Sudden SNHL/i.test(c)));
});

test('interpretAudiologyFindings distinguishes OME vs Perforation by ECV on Type B', () => {
  const ome = interpretAudiologyFindings({
    rightRinne: 'positive',
    leftRinne: 'negative',
    weber: 'left',
    rightTymp: TympanogramType.TYPE_A,
    leftTymp: TympanogramType.TYPE_B,
    leftHighEcv: false,
  });
  assert.ok(ome.likelyConditions.some((c) => /Effusion/i.test(c)));

  const perf = interpretAudiologyFindings({
    rightRinne: 'positive',
    leftRinne: 'negative',
    weber: 'left',
    rightTymp: TympanogramType.TYPE_A,
    leftTymp: TympanogramType.TYPE_B,
    leftHighEcv: true,
  });
  assert.ok(perf.likelyConditions.some((c) => /perforation|ventilation tube/i.test(c)));
});

test('searchAtlasItems locates structures and diseases accurately', () => {
  const prussakMatches = searchAtlasItems('Prussak', ANATOMY_STRUCTURES, EAR_DISEASES);
  assert.ok(prussakMatches.length >= 2);
  assert.equal(prussakMatches[0].id, 'prussaks-space');

  const glomusMatches = searchAtlasItems('rising sun', ANATOMY_STRUCTURES, EAR_DISEASES);
  assert.ok(glomusMatches.some((m) => m.id === 'glomus-tympanicum-jugulare'));
});

test('toggleIdInList and computeStudyStats calculate accurate mastery metrics', () => {
  let list = toggleIdInList([], 'stapes');
  assert.deepEqual(list, ['stapes']);
  list = toggleIdInList(list, 'stapes');
  assert.deepEqual(list, []);

  const stats = computeStudyStats(
    {
      studiedStructureIds: ['stapes', 'malleus', 'cochlea'],
      studiedDiseaseIds: ['otosclerosis'],
      completedExamIds: ['otoscope-technique'],
      bookmarkedStructureIds: ['stapes'],
      bookmarkedDiseaseIds: [],
      quizAnswers: {
        q1: { selectedIndex: 1, isCorrect: true, answeredAt: '2026-11-10T10:00:00Z' },
        q2: { selectedIndex: 0, isCorrect: false, answeredAt: '2026-11-10T10:01:00Z' },
      },
    },
    10,
    10,
    5,
    10
  );
  assert.equal(stats.structuresMasteredPct, 30);
  assert.equal(stats.diseasesMasteredPct, 10);
  assert.equal(stats.examsCompletedPct, 20);
  assert.equal(stats.quizAccuracyPct, 50);
  assert.equal(stats.overallMasteryPct, 18); // avg of 30, 10, 20, 10
});

test('isReminderDue respects time of day, weekdays, and completed status', () => {
  const wednesdayEvening = new Date(2026, 10, 11, 19, 30); // Wed Nov 11 2026 19:30
  const due = isReminderDue(
    {
      id: 'r1',
      label: 'Otoscopy Drill',
      timeOfDay: '18:00',
      frequency: 'daily',
      focusTopic: 'Cholesteatoma',
      enabled: true,
      createdAt: '2026-11-01T00:00:00Z',
    },
    wednesdayEvening
  );
  assert.equal(due, true);

  const alreadyCompletedToday = isReminderDue(
    {
      id: 'r1',
      label: 'Otoscopy Drill',
      timeOfDay: '18:00',
      frequency: 'daily',
      focusTopic: 'Cholesteatoma',
      enabled: true,
      lastCompletedAt: new Date(2026, 10, 11, 18, 15).toISOString(),
      createdAt: '2026-11-01T00:00:00Z',
    },
    wednesdayEvening
  );
  assert.equal(alreadyCompletedToday, false);

  const sunday = new Date(2026, 10, 15, 20, 0);
  const weekdayOnly = isReminderDue(
    {
      id: 'r2',
      label: 'Weekday Review',
      timeOfDay: '09:00',
      frequency: 'weekdays',
      focusTopic: 'Anatomy',
      enabled: true,
      createdAt: '2026-11-01T00:00:00Z',
    },
    sunday
  );
  assert.equal(weekdayOnly, false);
});
