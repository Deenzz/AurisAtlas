import { QuizCategory, QuizQuestion } from '../types/ear';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    category: QuizCategory.ANATOMY,
    difficulty: 'foundational',
    prompt:
      'Which portion of the tympanic membrane lacks the middle fibrous collagenous layer, making it vulnerable to retraction pockets and primary acquired cholesteatoma?',
    linkedStructureId: 'pars-flaccida',
    options: [
      'Pars tensa anteroinferior quadrant',
      'Pars flaccida (Shrapnell membrane)',
      'Fibrocartilaginous annulus',
      'Umbo',
    ],
    correctIndex: 1,
    rationale:
      'Pars flaccida (Shrapnell membrane) above the malleolar folds contains only outer epithelium and inner mucosa without the fibrous lamina propria, predisposing Prussak space to retraction and cholesteatoma.',
  },
  {
    id: 'q2',
    category: QuizCategory.OTOSCOPY,
    difficulty: 'foundational',
    prompt:
      'During otoscopy of a healthy right ear, in which quadrant and clock position does the cone of light normally appear?',
    linkedStructureId: 'cone-of-light',
    options: [
      'Posterosuperior quadrant at 2 o’clock',
      'Anterosuperior quadrant at 10 o’clock',
      'Anteroinferior quadrant at 5 o’clock',
      'Posteroinferior quadrant at 7 o’clock',
    ],
    correctIndex: 2,
    rationale:
      'Because the tympanic membrane tilts 55° anteroinferiorly, light reflects off the anteroinferior quadrant at 5 o’clock in the right ear (and 7 o’clock in the left ear).',
  },
  {
    id: 'q3',
    category: QuizCategory.CLINICAL,
    difficulty: 'clinical',
    prompt:
      'A 56-year-old man presents with unilateral right-sided glue ear (OME) with amber fluid behind a retracted drum and a flat Type B tympanogram. What mandatory next diagnostic step is required?',
    linkedDiseaseId: 'otitis-media-effusion',
    options: [
      'Immediate ear syringing with warm water',
      'Nasopharyngeal endoscopy and biopsy of the Fossa of Rosenmüller',
      'Oral acyclovir and prednisolone',
      'Epley canalith repositioning maneuver',
    ],
    correctIndex: 1,
    rationale:
      'Unilateral adult OME is a red flag for nasopharyngeal carcinoma obstructing the Eustachian tube orifice in the Fossa of Rosenmüller—nasendoscopy (and biopsy if suspicious) is mandatory.',
  },
  {
    id: 'q4',
    category: QuizCategory.TREATMENT,
    difficulty: 'clinical',
    prompt:
      'When performing myringotomy and grommet insertion for refractory OME, which quadrant is safest and why?',
    linkedStructureId: 'tympanic-membrane',
    options: [
      'Posterosuperior quadrant, to avoid the Eustachian orifice',
      'Anteroinferior quadrant, to avoid injuring the incudostapedial joint and chorda tympani',
      'Pars flaccida, because it lacks fibrous resistance',
      'Posteroinferior quadrant directly over the jugular bulb',
    ],
    correctIndex: 1,
    rationale:
      'The posterosuperior quadrant overlies the long process of the incus, stapes, and chorda tympani. A radial incision in the anteroinferior quadrant protects these structures.',
  },
  {
    id: 'q5',
    category: QuizCategory.OTOSCOPY,
    difficulty: 'clinical',
    prompt:
      'Otoscopy reveals a pulsing, reddish-bordeaux retrotympanic mass rising from the floor of the middle ear ("rising sun" sign) in a patient with pulsatile tinnitus. What must you NEVER do in the clinic?',
    linkedDiseaseId: 'glomus-tympanicum-jugulare',
    options: [
      'Order contrast CT and MRI of the temporal bone',
      'Perform an in-office transcanal punch biopsy',
      'Test cranial nerves IX–XII',
      'Refer for preoperative angiography and embolization',
    ],
    correctIndex: 1,
    rationale:
      'Glomus tympanicum/jugulare (and aberrant ICA) are highly vascular lesions. Clinic biopsy causes catastrophic hemorrhage. Always image with HRCT/MRI before any intervention.',
  },
  {
    id: 'q6',
    category: QuizCategory.CLINICAL,
    difficulty: 'clinical',
    prompt:
      'A patient has right Rinne NEGATIVE (BC > AC), left Rinne POSITIVE (AC > BC), and Weber lateralizing to the RIGHT ear. Tympanometry shows a shallow Type As curve on the right with absent stapedial reflexes and Carhart notch at 2000 Hz. What is the diagnosis?',
    linkedDiseaseId: 'otosclerosis',
    options: [
      'Right sensorineural hearing loss',
      'Right otosclerosis (stapes footplate fixation)',
      'Right ossicular discontinuity',
      'Left acute otitis media',
    ],
    correctIndex: 1,
    rationale:
      'Right BC > AC + Weber to right confirms right conductive hearing loss. Type As (stiff system), absent stapedial reflexes, and 2000 Hz Carhart bone-conduction notch are classic for otosclerosis.',
  },
  {
    id: 'q7',
    category: QuizCategory.ANATOMY,
    difficulty: 'osce_advanced',
    prompt:
      'Which deep retrotympanic recess lies medial to the vertical facial nerve between the ponticulus and subiculum, representing the most common site of residual cholesteatoma?',
    linkedStructureId: 'sinus-tympani-facial-recess',
    options: [
      'Prussak space',
      'Facial recess (suprapyramidal recess)',
      'Sinus tympani (infrapyramidal recess)',
      'Supratubal recess',
    ],
    correctIndex: 2,
    rationale:
      'Sinus tympani lies medial to the facial nerve and pyramidal eminence between the ponticulus above and subiculum below, making direct microscope visualization difficult without angled endoscopes.',
  },
  {
    id: 'q8',
    category: QuizCategory.CLINICAL,
    difficulty: 'clinical',
    prompt:
      'During examination of a patient with foul-smelling otorrhea and an attic retraction filled with white keratin debris, pressing on the tragus provokes sudden vertigo and nystagmus. What has occurred?',
    linkedDiseaseId: 'acquired-cholesteatoma',
    options: [
      'Positive Dix-Hallpike sign from BPPV',
      'Positive Fistula Test indicating lateral semicircular canal erosion',
      'Arnold nerve vasovagal reflex',
      'Tullio phenomenon from otosclerosis',
    ],
    correctIndex: 1,
    rationale:
      'A positive fistula test in chronic atticoantral cholesteatoma indicates bone erosion into the lateral (horizontal) semicircular canal—requiring urgent HRCT and surgical exploration.',
  },
  {
    id: 'q9',
    category: QuizCategory.OTOSCOPY,
    difficulty: 'clinical',
    prompt:
      'Otoscopy shows fluffy debris dotted with black pinhead spores ("wet newspaper with coal dust") in the ear canal of a swimmer with intense itching. Which organism and treatment match best?',
    linkedDiseaseId: 'otomycosis',
    options: [
      'Pseudomonas aeruginosa — oral ciprofloxacin',
      'Aspergillus niger — thorough aural toilet + topical antifungal (e.g., clotrimazole / 2% salicylic/boric acid)',
      'Staphylococcus aureus — oral flucloxacillin',
      'Herpes zoster — valacyclovir',
    ],
    correctIndex: 1,
    rationale:
      'Black spores / conidiophores are pathognomonic for Aspergillus niger otomycosis (white cheese-like plaques = Candida). Meticulous dry suction toilet plus topical antifungal drops cures it.',
  },
  {
    id: 'q10',
    category: QuizCategory.TREATMENT,
    difficulty: 'clinical',
    prompt:
      'A 74-year-old man with poorly controlled diabetes has severe nocturnal deep ear pain, granulation tissue at the bony-cartilaginous junction of the EAC, and new CN VII palsy. What is the diagnosis and primary therapy?',
    linkedDiseaseId: 'malignant-otitis-externa',
    options: [
      'Furunculosis — ichthyol glycerine wick',
      'Malignant (necrotizing) otitis externa — prolonged systemic anti-pseudomonal antibiotics (e.g., ciprofloxacin/ceftazidime) + glycemic control',
      'Keratosis obturans — ear syringing',
      'Bell palsy — oral prednisolone alone',
    ],
    correctIndex: 1,
    rationale:
      'Elderly diabetic + relentless nocturnal otalgia + EAC granulation at the bony-cartilaginous junction + cranial neuropathy defines Malignant Otitis Externa (Pseudomonas skull base osteomyelitis).',
  },
  {
    id: 'q11',
    category: QuizCategory.ANATOMY,
    difficulty: 'foundational',
    prompt:
      'Coughing or gagging triggered when cleaning the posterior-inferior ear canal wall is mediated by which cranial nerve?',
    linkedStructureId: 'eac-bony',
    options: [
      'Auriculotemporal nerve (CN V3)',
      'Arnold nerve (auricular branch of CN X)',
      'Jacobson nerve (CN IX)',
      'Greater auricular nerve (C2–C3)',
    ],
    correctIndex: 1,
    rationale:
      'Arnold nerve (auricular branch of the vagus nerve, CN X) innervates the posterior-inferior EAC and posterior TM, mediating the ear-cough / vasovagal reflex.',
  },
  {
    id: 'q12',
    category: QuizCategory.CLINICAL,
    difficulty: 'clinical',
    prompt:
      'A 32-year-old presents with brief (<30 s) spinning vertigo triggered strictly when rolling over in bed or looking up. Dix-Hallpike reproduces geotropic torsional nystagmus after a 4-second latency. What is the definitive treatment?',
    linkedDiseaseId: 'bppv',
    options: [
      'Intratympanic gentamicin',
      'Epley canalith repositioning maneuver',
      'Low-salt diet and thiazide diuretic',
      'Urgent canal wall down mastoidectomy',
    ],
    correctIndex: 1,
    rationale:
      'Posterior canal BPPV caused by free-floating otoconia is diagnosed via Dix-Hallpike and cured immediately in most patients by the Epley canalith repositioning maneuver.',
  },
  {
    id: 'q13',
    category: QuizCategory.OTOSCOPY,
    difficulty: 'clinical',
    prompt:
      'Which otoscopic & clinical pairing correctly distinguishes aural Exostosis from an Osteoma of the bony EAC?',
    linkedDiseaseId: 'exostosis-osteoma',
    options: [
      'Exostosis is solitary and pedunculated; Osteoma is bilateral and cold-water induced',
      'Exostoses are multiple, bilateral, broad-based lesions from cold-water exposure; Osteoma is a solitary, unilateral, pedunculated benign tumor',
      'Both are malignant squamous lesions requiring temporal bone resection',
      'Both arise only in the outer cartilaginous canal',
    ],
    correctIndex: 1,
    rationale:
      'Surfer’s ear exostoses are multiple, bilateral, sessile/broad-based bony outgrowths near the TM from cold-water periostitis; an osteoma is a solitary, unilateral, pedunculated neoplasm typically at the tympanosquamous/tympanomastoid suture.',
  },
  {
    id: 'q14',
    category: QuizCategory.CLINICAL,
    difficulty: 'osce_advanced',
    prompt:
      'A patient presents with a totally deaf left ear (profound left SNHL) and normal right hearing. What will the 512 Hz tuning fork exam show?',
    options: [
      'Left Rinne positive, Weber to left',
      'Left Rinne false-negative (BC > AC due to skull cross-hearing to right cochlea), Weber lateralizes to right',
      'Left Rinne negative, Weber to left',
      'Bilateral Rinne positive, Weber central',
    ],
    correctIndex: 1,
    rationale:
      'A dead ear fails to hear AC on the left, while BC vibrates across the cranium to stimulate the healthy right cochlea (False-Negative Rinne). Weber lateralizes cleanly to the healthy right ear.',
  },
  {
    id: 'q15',
    category: QuizCategory.TREATMENT,
    difficulty: 'clinical',
    prompt:
      'A patient sustained a small slit-shaped central TM perforation with a fresh blood clot at the margin after a slap injury 24 hours ago. What is the optimal initial management?',
    linkedDiseaseId: 'posttraumatic-perforation',
    options: [
      'Immediate ear syringing to remove the blood clot',
      'Prescribe neomycin ear drops 4 times daily',
      'Keep the ear strictly dry, avoid nose-blowing/drops, and observe (~90% heal spontaneously within 2 months)',
      'Emergency overlay myringoplasty',
    ],
    correctIndex: 2,
    rationale:
      'Over 90% of uncomplicated traumatic perforations heal spontaneously. Ear drops, syringing, and Valsalva maneuver carry infection into the middle ear and disrupt the natural blood-clot scaffold.',
  },
  {
    id: 'q16',
    category: QuizCategory.OTOSCOPY,
    difficulty: 'clinical',
    prompt:
      'A 5-year-old boy with no prior otorrhea or ear surgery has a white, smooth retrotympanic pearl visible behind an intact tympanic membrane in the anterosuperior quadrant. What is the diagnosis?',
    linkedDiseaseId: 'congenital-cholesteatoma',
    options: [
      'Tympanosclerosis',
      'Congenital cholesteatoma of the middle ear (Type A1)',
      'Cholesterol granuloma',
      'High-riding jugular bulb',
    ],
    correctIndex: 1,
    rationale:
      'A pearly white mass behind an intact TM with zero history of perforation, otorrhea, or surgery is congenital cholesteatoma (embryonic epithelial rest, most commonly anterosuperior / premalleolar).',
  },
  {
    id: 'q17',
    category: QuizCategory.TREATMENT,
    difficulty: 'clinical',
    prompt:
      'In which situation is ear syringing absolutely CONTRAINDICATED, favoring microsuction or dry hook removal instead?',
    options: [
      'Soft brown cerumen in an intact adult ear',
      'A dried pea/bean wedged in the bony canal OR history of a tympanic membrane perforation',
      'Mild bilateral presbycusis with wax',
      'Wax pre-treated with olive oil for 5 days',
    ],
    correctIndex: 1,
    rationale:
      'Hygroscopic vegetable foreign bodies (peas, beans, seeds) swell rapidly with water and wedge tightly against the isthmus; perforations risk middle ear contamination and severe caloric vertigo.',
  },
  {
    id: 'q18',
    category: QuizCategory.CLINICAL,
    difficulty: 'clinical',
    prompt:
      'A child with a swollen, tender, erythematous pinna after cartilage piercing shows fluctuation over the helix while sparing the lobule. Which pathogen must empiric therapy cover urgently?',
    linkedDiseaseId: 'auricular-perichondritis',
    options: [
      'Candida albicans',
      'Pseudomonas aeruginosa',
      'Streptococcus pneumoniae',
      'Haemophilus influenzae',
    ],
    correctIndex: 1,
    rationale:
      'Auricular perichondritis (especially post-piercing or post-hematoma) spares the non-cartilaginous lobule and is classically caused by Pseudomonas aeruginosa, requiring prompt ciprofloxacin + drainage.',
  },
];
