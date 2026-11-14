import {
  AnatomicalStructure,
  EarDisease,
  StudyProgress,
  StudyReminder,
  TympanogramType,
} from '../types/ear';

export type RinneResult = 'positive' | 'negative';
export type WeberResult = 'central' | 'right' | 'left';

export interface AudiologyInterpretationInput {
  rightRinne: RinneResult;
  leftRinne: RinneResult;
  weber: WeberResult;
  rightTymp: TympanogramType;
  leftTymp: TympanogramType;
  rightHighEcv?: boolean;
  leftHighEcv?: boolean;
}

export interface AudiologyInterpretationOutput {
  primaryPattern: string;
  affectedSide: 'None / Symmetric' | 'Right Ear' | 'Left Ear' | 'Bilateral';
  mechanism: string;
  likelyConditions: string[];
  clinicalPearl: string;
}

export function interpretAudiologyFindings(
  input: AudiologyInterpretationInput
): AudiologyInterpretationOutput {
  const { rightRinne, leftRinne, weber, rightTymp, leftTymp, rightHighEcv, leftHighEcv } = input;

  // 1. Check False-Negative Rinne (Profound unilateral SNHL / "dead ear")
  if (rightRinne === 'negative' && leftRinne === 'positive' && weber === 'left') {
    return {
      primaryPattern: 'Right Profound SNHL (False-Negative Right Rinne)',
      affectedSide: 'Right Ear',
      mechanism:
        'Right mastoid bone conduction crosses the skull to stimulate the healthy left cochlea, producing an apparent BC > AC on the right while Weber lateralizes cleanly to the healthy left ear.',
      likelyConditions: [
        'Right profound Sudden SNHL',
        'Right Vestibular Schwannoma (acoustic neuroma)',
        'Right Transverse Temporal Bone Fracture',
      ],
      clinicalPearl:
        'Always interpret Rinne together with Weber—an isolated Rinne negative without Weber lateralization to that ear warns of a dead ear!',
    };
  }

  if (leftRinne === 'negative' && rightRinne === 'positive' && weber === 'right') {
    return {
      primaryPattern: 'Left Profound SNHL (False-Negative Left Rinne)',
      affectedSide: 'Left Ear',
      mechanism:
        'Left mastoid bone conduction crosses the skull to stimulate the healthy right cochlea, yielding an apparent BC > AC on the left while Weber lateralizes to the right ear.',
      likelyConditions: [
        'Left profound Sudden SNHL',
        'Left Vestibular Schwannoma (acoustic neuroma)',
        'Left Transverse Temporal Bone Fracture',
      ],
      clinicalPearl:
        'Perform masking / pure-tone audiometry urgently and arrange Gadolinium MRI IAC if asymmetric SNHL is confirmed.',
    };
  }

  // 2. Bilateral Conductive Hearing Loss
  if (rightRinne === 'negative' && leftRinne === 'negative') {
    const bilateralConditions: string[] = [];
    if (rightTymp === TympanogramType.TYPE_B || leftTymp === TympanogramType.TYPE_B) {
      if (rightHighEcv || leftHighEcv) {
        bilateralConditions.push('Bilateral TM perforation or patent ventilation tubes');
      } else {
        bilateralConditions.push('Bilateral Otitis Media with Effusion (Glue Ear) or impacted cerumen');
      }
    }
    if (rightTymp === TympanogramType.TYPE_AS || leftTymp === TympanogramType.TYPE_AS) {
      bilateralConditions.push('Bilateral Otosclerosis or Tympanosclerosis');
    }
    if (rightTymp === TympanogramType.TYPE_C || leftTymp === TympanogramType.TYPE_C) {
      bilateralConditions.push('Bilateral Eustachian Tube Dysfunction / Atelectasis');
    }
    if (bilateralConditions.length === 0) {
      bilateralConditions.push('Bilateral Conductive Hearing Loss (cerumen, OME, or otosclerosis)');
    }
    return {
      primaryPattern: 'Bilateral Conductive Hearing Loss',
      affectedSide: 'Bilateral',
      mechanism:
        'Both ears exhibit bone conduction exceeding air conduction (>=15–20 dB air-bone gap bilaterally); Weber lateralizes to whichever ear has the larger conductive gap.',
      likelyConditions: bilateralConditions,
      clinicalPearl:
        'Check Ear Canal Volume (ECV) on any flat Type B curve: low (<0.3 mL) = wax, normal = OME, high (>2.0 mL) = perforation or patent grommet.',
    };
  }

  // 3. Unilateral Conductive Hearing Loss (Right or Left)
  if (rightRinne === 'negative' && (weber === 'right' || weber === 'central')) {
    return buildUnilateralChlOutput('Right Ear', rightTymp, Boolean(rightHighEcv));
  }

  if (leftRinne === 'negative' && (weber === 'left' || weber === 'central')) {
    return buildUnilateralChlOutput('Left Ear', leftTymp, Boolean(leftHighEcv));
  }

  // 4. Unilateral Sensorineural Hearing Loss (Rinne Positive bilaterally + Weber lateralizes away from worse ear)
  if (rightRinne === 'positive' && leftRinne === 'positive' && weber !== 'central') {
    const betterSide = weber === 'right' ? 'Right' : 'Left';
    const worseSide = weber === 'right' ? 'Left' : 'Right';
    return {
      primaryPattern: `${worseSide} Sensorineural Hearing Loss (or very mild ${betterSide} CHL <15 dB)`,
      affectedSide: worseSide === 'Right' ? 'Right Ear' : 'Left Ear',
      mechanism: `Air conduction remains greater than bone conduction bilaterally, and Weber lateralizes toward the ${betterSide} cochlea.`,
      likelyConditions: [
        `${worseSide} Sudden Sensorineural Hearing Loss (SSNHL)`,
        `${worseSide} Vestibular Schwannoma (acoustic neuroma)`,
        `${worseSide} Ménière's Disease (if fluctuating low-frequency + vertigo)`,
      ],
      clinicalPearl:
        'In acute onset (<72h), SSNHL is a time-critical steroid emergency; in chronic unilateral SNHL, obtain Gadolinium MRI of the IAC.',
    };
  }

  // 5. Normal or Symmetric
  const tympNote =
    rightTymp === TympanogramType.TYPE_C || leftTymp === TympanogramType.TYPE_C
      ? 'Negative middle ear pressure (Type C) indicates early Eustachian tube dysfunction without significant air-bone gap yet.'
      : rightTymp === TympanogramType.TYPE_B || leftTymp === TympanogramType.TYPE_B
        ? 'Flat Type B tympanogram despite Rinne positive can occur with early/mild effusion (<15 dB gap) or probe occlusion against canal wall.'
        : 'Normal middle ear compliance and intact ossicular transmission.';

  return {
    primaryPattern: 'Normal Hearing (or Symmetric Bilateral SNHL)',
    affectedSide: 'None / Symmetric',
    mechanism: 'Air conduction exceeds bone conduction bilaterally and Weber is heard centrally.',
    likelyConditions:
      rightTymp === TympanogramType.TYPE_A && leftTymp === TympanogramType.TYPE_A
        ? ['Normal otologic mechanics', 'Symmetric presbycusis or noise-induced SNHL (confirm with audiogram)']
        : ['Early Eustachian dysfunction or sub-threshold middle ear effusion'],
    clinicalPearl: tympNote,
  };
}

function buildUnilateralChlOutput(
  side: 'Right Ear' | 'Left Ear',
  tymp: TympanogramType,
  highEcv: boolean
): AudiologyInterpretationOutput {
  let conditions: string[];
  let pearl: string;

  switch (tymp) {
    case TympanogramType.TYPE_B:
      if (highEcv) {
        conditions = [
          'Tympanic membrane perforation (safe CSOM or traumatic)',
          'Patent ventilation tube (grommet)',
        ];
        pearl = 'Flat Type B + High Ear Canal Volume (>2.0 mL) confirms air communication through an open TM defect or grommet.';
      } else {
        conditions = [
          'Otitis Media with Effusion (Glue Ear — in adults, examine nasopharynx!)',
          'Acute Otitis Media / Cholesterol Granuloma',
          'Complete Cerumen Impaction (if ECV < 0.3 mL)',
        ];
        pearl = 'In an adult with unilateral OME, nasopharyngeal endoscopy of the Fossa of Rosenmüller is mandatory to exclude NPC.';
      }
      break;
    case TympanogramType.TYPE_AS:
      conditions = ['Otosclerosis (stapes footplate fixation)', 'Middle ear Tympanosclerosis'];
      pearl = 'Look for absent acoustic stapedial reflexes and Carhart notch (2000 Hz BC dip) on pure-tone audiometry.';
      break;
    case TympanogramType.TYPE_AD:
      conditions = ['Ossicular chain discontinuity (incudostapedial dislocation)', 'Hypermobile monomeric TM scar'];
      pearl = 'History of head/ear trauma + >=40 dB air-bone gap + Type Ad strongly favors ossicular disruption.';
      break;
    case TympanogramType.TYPE_C:
      conditions = ['Eustachian Tube Dysfunction', 'Tympanic Membrane Atelectasis (Sadé I–III)'];
      pearl = 'Negative middle ear pressure (< -100 daPa) pulls the drum medially; inspect pars flaccida for retraction pockets.';
      break;
    default:
      conditions = ['Early Otosclerosis', 'Cholesteatoma behind intact drum', 'Partial ossicular fixation'];
      pearl = 'A normal Type A peak with conductive loss requires microscopic inspection of the attic and ossicular mobility.';
  }

  return {
    primaryPattern: `${side} Conductive Hearing Loss`,
    affectedSide: side,
    mechanism: `Bone conduction exceeds air conduction in the ${side.toLowerCase()}, and Weber lateralizes toward the affected conductive ear.`,
    likelyConditions: conditions,
    clinicalPearl: pearl,
  };
}

export interface SearchMatch {
  type: 'structure' | 'disease';
  id: string;
  title: string;
  subtitle: string;
  score: number;
}

export function searchAtlasItems(
  query: string,
  structures: AnatomicalStructure[],
  diseases: EarDisease[]
): SearchMatch[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const tokens = normalized.split(/\s+/).filter(Boolean);
  const results: SearchMatch[] = [];

  for (const s of structures) {
    const haystack = `${s.name} ${s.latinName ?? ''} ${s.summary} ${s.clinicalSignificance} ${s.keywords.join(' ')}`.toLowerCase();
    let score = 0;
    if (s.name.toLowerCase().includes(normalized)) score += 10;
    if (s.keywords.some((k) => k.toLowerCase().includes(normalized))) score += 6;
    if (tokens.every((t) => haystack.includes(t))) score += 4;
    if (score > 0) {
      results.push({
        type: 'structure',
        id: s.id,
        title: s.name,
        subtitle: s.latinName || s.region.replace(/_/g, ' '),
        score,
      });
    }
  }

  for (const d of diseases) {
    const haystack = `${d.name} ${d.subtitle} ${d.summary} ${d.otoscopicFindings.join(' ')} ${d.keywords.join(' ')}`.toLowerCase();
    let score = 0;
    if (d.name.toLowerCase().includes(normalized)) score += 10;
    if (d.keywords.some((k) => k.toLowerCase().includes(normalized))) score += 6;
    if (tokens.every((t) => haystack.includes(t))) score += 4;
    if (score > 0) {
      results.push({
        type: 'disease',
        id: d.id,
        title: d.name,
        subtitle: d.subtitle,
        score,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}

export function toggleIdInList(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

export interface StudyStats {
  structuresMasteredPct: number;
  diseasesMasteredPct: number;
  examsCompletedPct: number;
  quizAccuracyPct: number;
  quizAttemptedCount: number;
  quizCorrectCount: number;
  overallMasteryPct: number;
}

export function computeStudyStats(
  progress: StudyProgress,
  totalStructures: number,
  totalDiseases: number,
  totalExams: number,
  totalQuizzes: number
): StudyStats {
  const structuresMasteredPct =
    totalStructures > 0 ? Math.round((progress.studiedStructureIds.length / totalStructures) * 100) : 0;
  const diseasesMasteredPct =
    totalDiseases > 0 ? Math.round((progress.studiedDiseaseIds.length / totalDiseases) * 100) : 0;
  const examsCompletedPct =
    totalExams > 0 ? Math.round((progress.completedExamIds.length / totalExams) * 100) : 0;

  const entries = Object.values(progress.quizAnswers);
  const quizAttemptedCount = entries.length;
  const quizCorrectCount = entries.filter((e) => e.isCorrect).length;
  const quizAccuracyPct =
    quizAttemptedCount > 0 ? Math.round((quizCorrectCount / quizAttemptedCount) * 100) : 0;
  const quizCoveragePct = totalQuizzes > 0 ? Math.round((quizCorrectCount / totalQuizzes) * 100) : 0;

  const overallMasteryPct = Math.round(
    (structuresMasteredPct + diseasesMasteredPct + examsCompletedPct + quizCoveragePct) / 4
  );

  return {
    structuresMasteredPct,
    diseasesMasteredPct,
    examsCompletedPct,
    quizAccuracyPct,
    quizAttemptedCount,
    quizCorrectCount,
    overallMasteryPct,
  };
}

export function isReminderDue(reminder: StudyReminder, now: Date = new Date()): boolean {
  if (!reminder.enabled) return false;
  const [hoursStr, minsStr] = reminder.timeOfDay.split(':');
  const targetH = Number(hoursStr);
  const targetM = Number(minsStr);
  if (Number.isNaN(targetH) || Number.isNaN(targetM)) return false;

  const day = now.getDay(); // 0 = Sun, 6 = Sat
  if (reminder.frequency === 'weekdays' && (day === 0 || day === 6)) {
    return false;
  }

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const targetMinutes = targetH * 60 + targetM;

  if (reminder.lastCompletedAt) {
    const last = new Date(reminder.lastCompletedAt);
    const sameDay =
      last.getFullYear() === now.getFullYear() &&
      last.getMonth() === now.getMonth() &&
      last.getDate() === now.getDate();

    if (reminder.frequency === 'every_2_days') {
      const diffHours = (now.getTime() - last.getTime()) / (1000 * 60 * 60);
      if (diffHours < 36) return false;
    } else if (reminder.frequency === 'twice_daily') {
      const diffHours = (now.getTime() - last.getTime()) / (1000 * 60 * 60);
      if (diffHours < 8) return false;
    } else if (sameDay) {
      return false;
    }
  }

  return nowMinutes >= targetMinutes;
}

export function formatReminderFrequency(freq: StudyReminder['frequency']): string {
  switch (freq) {
    case 'daily':
      return 'Every day';
    case 'twice_daily':
      return 'Twice daily';
    case 'every_2_days':
      return 'Every 2 days';
    case 'weekdays':
      return 'Weekdays only';
  }
}
