export enum WorkspaceTab {
  ATLAS = 'atlas',
  DISEASES = 'diseases',
  EXAM = 'exam',
  QUIZ = 'quiz',
}

export enum EarRegion {
  OUTER_EAR = 'outer_ear',
  TYMPANIC_MEMBRANE = 'tympanic_membrane',
  MIDDLE_EAR = 'middle_ear',
  MASTOID_EUSTACHIAN = 'mastoid_eustachian',
  INNER_EAR = 'inner_ear',
  NERVES_VESSELS = 'nerves_vessels',
}

export enum LayerKey {
  PINNA = 'pinna',
  CANAL = 'canal',
  TYMPANIC_MEMBRANE = 'tympanic_membrane',
  OSSICLES = 'ossicles',
  MIDDLE_CAVITY = 'middle_cavity',
  INNER_LABYRINTH = 'inner_labyrinth',
  NERVES_VESSELS = 'nerves_vessels',
}

export enum DiseaseCategory {
  PINNA = 'pinna',
  EAC = 'eac',
  TM_MIDDLE_EAR = 'tm_middle_ear',
  CHOLESTEATOMA = 'cholesteatoma',
  RETROTYMPANIC_MASS = 'retrotympanic_mass',
  INNER_EAR_NERVE = 'inner_ear_nerve',
  POSTSURGICAL = 'postsurgical',
}

export enum ViewCameraPreset {
  OVERVIEW = 'overview',
  OTOSCOPE = 'otoscope',
  MIDDLE_EAR = 'middle_ear',
  INNER_EAR = 'inner_ear',
  NERVES = 'nerves',
}

export enum TympanogramType {
  TYPE_A = 'A',
  TYPE_AS = 'As',
  TYPE_AD = 'Ad',
  TYPE_B = 'B',
  TYPE_C = 'C',
}

export enum QuizCategory {
  ALL = 'all',
  ANATOMY = 'anatomy',
  OTOSCOPY = 'otoscopy',
  CLINICAL = 'clinical',
  TREATMENT = 'treatment',
}

export type LayerVisibility = Record<LayerKey, boolean>;

export interface AnatomicalStructure {
  id: string;
  name: string;
  latinName?: string;
  region: EarRegion;
  layer: LayerKey;
  anchor: [number, number, number];
  cameraPreset: ViewCameraPreset;
  otoscopicVisible: boolean;
  quadrant?: 'AS' | 'AI' | 'PS' | 'PI' | 'PF' | 'UMBO' | 'CANAL';
  summary: string;
  measurements?: string;
  nerveSupply?: string;
  bloodSupply?: string;
  clinicalSignificance: string;
  relatedIds: string[];
  keywords: string[];
}

export type PerforationType =
  | 'none'
  | 'central_anterior'
  | 'central_posterior'
  | 'subtotal'
  | 'attic_scutum'
  | 'posterior_marginal'
  | 'traumatic_slit';

export type PneumaticMobility = 'brisk' | 'sluggish' | 'immobile' | 'hypermobile';

export interface OtoscopeVisualSpec {
  drumBaseColor: string;
  drumEdgeColor: string;
  translucency: number; // 0 (opaque) to 1 (translucent)
  coneOfLight: 'normal' | 'diminished' | 'distorted' | 'absent';
  vascularity: 'normal' | 'injected_radial' | 'intense_hyperemia' | 'prominent_vessels';
  retraction: 'none' | 'mild_grade1' | 'grade2_incus' | 'grade3_promontory' | 'grade4_adhesive';
  bulging: boolean;
  perforation: PerforationType;
  effusionColor?: string;
  effusionLevel?: number; // 0-1
  airBubbles?: boolean;
  cholesteatomaDebris?: 'none' | 'attic_pearly' | 'mesotympanic_keratin' | 'congenital_as_pearl' | 'eac_floor';
  retrotympanicMass?: 'none' | 'glomus_rising_sun' | 'high_jugular_bulb' | 'aberrant_ica' | 'schwannoma';
  tympanosclerosisPlaques?: boolean;
  bullae?: boolean;
  granulation?: boolean;
  grommet?: 'none' | 'ai_normal' | 'occluded' | 'extruding';
  canalFinding?:
    | 'normal'
    | 'cerumen'
    | 'foreign_body'
    | 'furuncle'
    | 'diffuse_edema'
    | 'otomycosis_black'
    | 'otomycosis_white'
    | 'exostoses'
    | 'osteoma'
    | 'keratosis_obturans'
    | 'vesicles_ramsay_hunt'
    | 'mastoid_cavity_clean'
    | 'mastoid_cavity_wet';
  mobility: PneumaticMobility;
  calloutMarkers: {
    label: string;
    x: number; // -1 to 1 in otoscope circle
    y: number; // -1 to 1 in otoscope circle
    detail: string;
  }[];
}

export interface EarDisease {
  id: string;
  name: string;
  subtitle: string;
  category: DiseaseCategory;
  severity: 'routine' | 'urgent' | 'surgical' | 'emergency';
  focusLayer: LayerKey;
  cameraPreset: ViewCameraPreset;
  linkedStructureIds: string[];
  summary: string;
  otoscopicFindings: string[];
  symptoms: string[];
  diagnostics: {
    tuningFork: string;
    tympanometry: TympanogramType | 'N/A';
    audiometry: string;
    imagingOrLabs?: string;
  };
  differentialDiagnosis: string[];
  redFlags: string[];
  treatmentProtocol: {
    medical: string[];
    surgical: string[];
    contraindications?: string[];
    followUp: string;
  };
  otoscopeSpec: OtoscopeVisualSpec;
  keywords: string[];
}

export interface ExamModule {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  durationMinutes: number;
  objectives: string[];
  techniqueSteps: {
    step: string;
    detail: string;
    clinicalTip?: string;
  }[];
  normalVsAbnormal: {
    finding: string;
    normal: string;
    abnormal: string;
  }[];
  contraindications?: string[];
}

export interface QuizQuestion {
  id: string;
  category: Exclude<QuizCategory, QuizCategory.ALL>;
  difficulty: 'foundational' | 'clinical' | 'osce_advanced';
  prompt: string;
  linkedDiseaseId?: string;
  linkedStructureId?: string;
  options: string[];
  correctIndex: number;
  rationale: string;
}

export interface StudyReminder {
  id: string;
  label: string;
  timeOfDay: string; // HH:mm
  frequency: 'daily' | 'twice_daily' | 'every_2_days' | 'weekdays';
  focusTopic: string;
  enabled: boolean;
  lastCompletedAt?: string;
  createdAt: string;
}

export interface StudyProgress {
  studiedStructureIds: string[];
  studiedDiseaseIds: string[];
  completedExamIds: string[];
  bookmarkedStructureIds: string[];
  bookmarkedDiseaseIds: string[];
  quizAnswers: Record<string, { selectedIndex: number; isCorrect: boolean; answeredAt: string }>;
}
