import { ExamModule } from '../types/ear';

export const EXAM_MODULES: ExamModule[] = [
  {
    id: 'otoscope-technique',
    title: 'Otoscope Handling, Speculum Sizing & Pinna Traction',
    subtitle: 'Safe, comfortable visualization of the canal and tympanic membrane',
    category: 'Physical Examination',
    durationMinutes: 8,
    objectives: [
      'Select the widest speculum that enters the cartilaginous canal comfortably (5 mm adult, 4 mm child, 2.5–3 mm infant).',
      'Adopt the pencil grip braced against the patient’s cheek/temple so sudden head movement never traumatizes the canal.',
      'Apply age-appropriate pinna traction to align the S-shaped canal.',
    ],
    techniqueSteps: [
      {
        step: '1. Inspect Pinna & Postauricular Sulcus First',
        detail:
          'Before inserting the speculum, inspect for scars, swelling, preauricular sinus, erythema, vesicles (Ramsay Hunt), mastoid tenderness, and tragal pain.',
        clinicalTip: 'Always examine the asymptomatic/normal ear first to establish a patient baseline.',
      },
      {
        step: '2. Choose Grip & Safety Brace',
        detail:
          'Hold the otoscope like a pen/pencil with the ulnar border of your hand (or pinky/ring finger) firmly resting against the patient’s cheek or zygoma. Avoid the unbraced pistol grip in restless children.',
        clinicalTip: 'Never advance the speculum blindly; keep your eye on the eyepiece as you enter.',
      },
      {
        step: '3. Straighten the External Canal',
        detail:
          'In adults and older children, pull the pinna UPWARD, BACKWARD, and slightly LATERALLY. In infants (<1–2 years), pull gently DOWNWARD and BACKWARD because the bony EAC is undeveloped and the TM lies nearly horizontal.',
      },
      {
        step: '4. Systematic 4-Quadrant Sweep',
        detail:
          'Inspect canal walls (cartilaginous outer 1/3 vs bony inner 2/3), then sweep systematically: Lateral process of malleus -> Pars flaccida (attic) -> Malleus handle -> Umbo -> Cone of light (AI) -> AS, AI, PI, PS quadrants -> Annulus periphery.',
      },
    ],
    normalVsAbnormal: [
      {
        finding: 'Tragal / Pinna Traction Pain',
        normal: 'Painless manipulation',
        abnormal: 'Sharp pain strongly indicates Acute Otitis Externa or Furunculosis',
      },
      {
        finding: 'Tympanic Membrane Color & Sheen',
        normal: 'Pearly-gray, translucent, crisp anteroinferior cone of light',
        abnormal: 'Erythema (AOM), amber/blue (OME/cholesterol granuloma), chalk plaques (tympanosclerosis)',
      },
      {
        finding: 'Malleus Handle Position',
        normal: 'Oblique downward-posterior tilt; visible lateral process',
        abnormal: 'Foreshortened/horizontal appearance with prominent lateral process (retraction)',
      },
    ],
    contraindications: [
      'Do not force a speculum past severe canal edema or a furuncle in the outer cartilaginous third.',
      'Avoid deep insertion beyond the cartilaginous-bony junction (inner 2/3 skin is exquisitely sensitive and causes Arnold nerve cough/vasovagal reflex).',
    ],
  },
  {
    id: 'pneumatic-otoscopy',
    title: 'Pneumatic Otoscopy & Tympanic Mobility Assessment',
    subtitle: 'Gold-standard bedside test to detect middle ear effusion',
    category: 'Otoscopy Skills',
    durationMinutes: 6,
    objectives: [
      'Achieve an airtight seal in the cartilaginous canal using a soft-tipped speculum.',
      'Distinguish normal brisk excursion from negative-pressure retraction, effusion immobility, and perforation.',
    ],
    techniqueSteps: [
      {
        step: '1. Achieve Airtight Seal',
        detail:
          'Select a slightly larger speculum (or silicone-tipped pneumatic speculum) seated snugly at the cartilaginous meatus without entering the bony canal.',
      },
      {
        step: '2. Observe Resting Position & Apply Positive Pressure',
        detail:
          'Gently squeeze the insufflator bulb while watching the pars tensa (especially the posterosuperior quadrant and light reflex). Normal TM moves crisply inward (medially).',
      },
      {
        step: '3. Release Bulb for Negative Pressure',
        detail:
          'Release the bulb and observe outward rebound. If the drum is already maximally retracted, only negative pressure (releasing an initially compressed bulb) may show outward flicker.',
        clinicalTip: 'Hypermobile flaccid dimeric membrane in healed perforation or ossicular discontinuity exaggerates excursion.',
      },
    ],
    normalVsAbnormal: [
      {
        finding: 'Excursion Amplitude',
        normal: 'Brisk inward & outward movement on gentle bulb squeeze/release',
        abnormal: 'Immobile drum = OME, perforation, or tympanosclerosis; Sluggish = early ETD/thick fluid; Hypermobile = monomeric scar or ossicular disruption',
      },
      {
        finding: 'Fluid & Bubbles',
        normal: 'Air-filled translucent middle ear; promontory/incus faintly visible',
        abnormal: 'Air-fluid meniscus or bubbles shifting with insufflation confirms serous OME',
      },
    ],
  },
  {
    id: 'tuning-fork-tests',
    title: 'Tuning Fork Tests (512 Hz Rinne, Weber & Bing)',
    subtitle: 'Differentiating conductive vs. sensorineural hearing loss',
    category: 'Audiology & OSCE',
    durationMinutes: 10,
    objectives: [
      'Perform 512 Hz Rinne and Weber tests with proper mastoid/forehead placement.',
      'Recognize False-Negative Rinne in severe unilateral sensorineural deafness.',
    ],
    techniqueSteps: [
      {
        step: '1. Strike & Standardize 512 Hz Fork',
        detail:
          'Strike the prongs gently against your elbow or rubber pad (avoid metallic clang producing overtones). 512 Hz is optimal—256 Hz causes tactile vibration confusion; 1024 Hz decays too rapidly.',
      },
      {
        step: '2. Rinne Test (Air vs Bone Conduction)',
        detail:
          'Place vibrating base firmly on mastoid process just posterior to the canal (BC), then hold prongs 2 cm parallel to the external meatus (AC). Ask which is louder or use threshold decay timing.',
        clinicalTip: 'Rinne turns negative (BC > AC) once conductive air-bone gap reaches ~15–20 dB.',
      },
      {
        step: '3. Weber Test (Midline Bone Conduction)',
        detail:
          'Place vibrating base squarely on the midline forehead, vertex, or upper central incisors. Ask whether sound is heard centrally or louder in one ear.',
      },
      {
        step: '4. Cross-Check for False-Negative Rinne',
        detail:
          'If a patient has profound unilateral SNHL ("dead ear"), bone conduction from the deaf mastoid travels across the skull to the healthy contralateral cochlea—giving an apparent BC > AC ("false-negative Rinne"), while Weber lateralizes to the GOOD ear.',
      },
    ],
    normalVsAbnormal: [
      {
        finding: 'Rinne Test',
        normal: 'Positive (AC > BC) bilaterally',
        abnormal: 'Negative (BC >= AC) indicates >=15–20 dB conductive loss in that ear (or False-Negative in dead ear)',
      },
      {
        finding: 'Weber Test',
        normal: 'Heard centrally / equally in both ears',
        abnormal: 'Lateralizes TOWARD conductive loss (occlusion effect) or AWAY from sensorineural loss',
      },
    ],
  },
  {
    id: 'tympanometry-audiometry',
    title: 'Impedance Tympanometry & Pure-Tone Audiometry',
    subtitle: 'Interpreting Jerger curves (A, As, Ad, B, C) & air-bone gaps',
    category: 'Audiology & OSCE',
    durationMinutes: 9,
    objectives: [
      'Correlate Jerger tympanogram shapes with middle ear mechanics.',
      'Identify Carhart notch (otosclerosis) and high-frequency noise notches on audiograms.',
    ],
    techniqueSteps: [
      {
        step: '1. Inspect Ear Canal Before Probe Placement',
        detail:
          'Confirm patency—impacted wax can falsely mimic a flat Type B curve with low ear canal volume (ECV < 0.3 mL).',
      },
      {
        step: '2. Read Peak Pressure & Static Compliance',
        detail:
          'Type A peaks near 0 daPa (−100 to +50 daPa) with normal compliance (0.3–1.6 mL). Type C peaks negative (< −100 daPa, Eustachian dysfunction). Type B is flat without a peak.',
      },
      {
        step: '3. Check Equivalent Ear Canal Volume (ECV) for Type B',
        detail:
          'Flat Type B + normal ECV (0.6–1.5 mL) = Middle ear effusion (OME). Flat Type B + large ECV (> 2.0–2.5 mL) = Tympanic perforation or patent grommet!',
      },
      {
        step: '4. Read Audiogram Air vs Bone Thresholds',
        detail:
          'Conductive loss shows normal bone conduction (<20 dB HL) with elevated air thresholds (air-bone gap >=15 dB). Sensorineural loss shows depressed AC and BC moving together without a gap. Look for 2000 Hz BC dip (Carhart notch) in otosclerosis.',
      },
    ],
    normalVsAbnormal: [
      {
        finding: 'Type As vs Type Ad',
        normal: 'Type A: normal peak near 0 daPa',
        abnormal: 'Type As (shallow/stiff) = Otosclerosis/tympanosclerosis; Type Ad (hypercompliant/tall) = Ossicular discontinuity or monomeric TM',
      },
      {
        finding: 'Type B + ECV',
        normal: 'Peaked curve',
        abnormal: 'Flat + normal ECV = OME; Flat + high ECV = Perforation/patent VT; Flat + tiny ECV = Wax occlusion',
      },
    ],
  },
  {
    id: 'syringing-microsuction',
    title: 'Aural Toilet, Ear Syringing & Foreign Body Removal',
    subtitle: 'Safe cerumen management and absolute contraindications',
    category: 'Clinical Procedures',
    durationMinutes: 7,
    objectives: [
      'Screen every patient for syringing contraindications before irrigation.',
      'Direct lukewarm 37°C water stream safely along the posterosuperior canal wall.',
    ],
    techniqueSteps: [
      {
        step: '1. Screen Contraindications Mandatory Checklist',
        detail:
          'Ask about prior ear surgery, grommets, past/present TM perforation, active otitis externa, only-hearing ear, or vegetable/organic foreign body (peas/beans swell!).',
      },
      {
        step: '2. Soften Cerumen Pre-Procedure',
        detail:
          'Prescribe olive oil, sodium bicarbonate 5%, or docusate drops 3–5 days before irrigation if wax is hard and impacted.',
      },
      {
        step: '3. Position & Irrigate Along Roof Wall',
        detail:
          'Use strictly body-temperature water (37°C; cold/hot water triggers caloric vertigo). Pull pinna up and back, aim nozzle toward the posterosuperior canal wall so return flow flushes behind the wax—never straight at the eardrum.',
      },
      {
        step: '4. Re-Inspect & Dry',
        detail:
          'Always perform post-irrigation otoscopy to verify an intact TM and exclude residual debris or canal trauma.',
      },
    ],
    normalVsAbnormal: [
      {
        finding: 'Post-Syringing Otoscopy',
        normal: 'Clear canal, intact pearly-gray TM (mild transient erythema from warmth)',
        abnormal: 'Vertigo (non-37°C water or unscreened perforation), coughing (Arnold nerve vagal reflex), bleeding',
      },
    ],
    contraindications: [
      'Known or suspected tympanic membrane perforation or patent ventilation tube.',
      'Vegetable/hygroscopic foreign body (beans, peas, seeds—water causes rapid swelling and impaction).',
      'Active otitis externa or acute otitis media.',
      'Only-hearing ear or history of mastoid cavity surgery (prefer microsuction under microscope).',
    ],
  },
  {
    id: 'vestibular-cn-exam',
    title: 'Vestibular, Fistula & Cranial Nerve VII/VIII Exam',
    subtitle: 'Dix-Hallpike, Epley, Fistula Test & Facial Nerve Topodiagnosis',
    category: 'Neuro-Otology & OSCE',
    durationMinutes: 10,
    objectives: [
      'Execute and interpret Dix-Hallpike maneuver for posterior canal BPPV.',
      'Recognize positive fistula sign as an urgent complication of cholesteatoma.',
      'Localize CN VII lesions using topodiagnostic landmarks.',
    ],
    techniqueSteps: [
      {
        step: '1. Fistula Test (Cholesteatoma Emergency Check)',
        detail:
          'Press repeatedly on the tragus (or squeeze pneumatic otoscope bulb) to raise canal pressure. Positive test = induced conjugate eye deviation/nystagmus + vertigo, signaling erosion of the lateral semicircular canal.',
      },
      {
        step: '2. Dix-Hallpike Positional Test',
        detail:
          'Turn seated patient’s head 45° toward the tested ear, rapidly recline supine with head extended 20–30° below horizontal. Watch eyes for 30s: posterior canal BPPV causes upbeating torsional nystagmus toward the dependent ear after 2–10s latency, fatigable on repeat.',
      },
      {
        step: '3. Epley Canalith Repositioning Maneuver',
        detail:
          'From positive Dix-Hallpike position (30s) -> rotate head 90° to opposite side (30s) -> roll patient onto opposite shoulder so nose points 45° downward (30s) -> sit patient upright.',
      },
      {
        step: '4. CN VII Examination & Otoscopy Screen',
        detail:
          'Assess forehead wrinkling (spared in UMN, lost in LMN Bell palsy), eye closure, smile, plus mandatory otoscopy for vesicles (Ramsay Hunt) or attic cholesteatoma before diagnosing idiopathic Bell palsy.',
      },
    ],
    normalVsAbnormal: [
      {
        finding: 'Fistula Test',
        normal: 'No vertigo or nystagmus on tragal compression',
        abnormal: 'Induced vertigo/nystagmus = Lateral SCC fistula (urgent surgical HRCT)',
      },
      {
        finding: 'Forehead Wrinkling in Facial Palsy',
        normal: 'Symmetrical brow elevation',
        abnormal: 'Lost = Lower Motor Neuron (Bell palsy, Ramsay Hunt, cholesteatoma); Spared = Upper Motor Neuron (stroke)',
      },
    ],
  },
];
