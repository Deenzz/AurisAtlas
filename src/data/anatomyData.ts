import {
  AnatomicalStructure,
  EarRegion,
  LayerKey,
  ViewCameraPreset,
} from '../types/ear';

export const REGION_LABELS: Record<EarRegion, string> = {
  [EarRegion.OUTER_EAR]: 'External Ear (Pinna & EAC)',
  [EarRegion.TYMPANIC_MEMBRANE]: 'Tympanic Membrane',
  [EarRegion.MIDDLE_EAR]: 'Middle Ear & Ossicles',
  [EarRegion.MASTOID_EUSTACHIAN]: 'Mastoid & Eustachian Tube',
  [EarRegion.INNER_EAR]: 'Inner Ear (Labyrinth)',
  [EarRegion.NERVES_VESSELS]: 'Cranial Nerves & Vessels',
};

export const LAYER_LABELS: Record<LayerKey, string> = {
  [LayerKey.PINNA]: 'Pinna (Auricle)',
  [LayerKey.CANAL]: 'Auditory Canal',
  [LayerKey.TYMPANIC_MEMBRANE]: 'Tympanic Membrane',
  [LayerKey.OSSICLES]: 'Ossicular Chain',
  [LayerKey.MIDDLE_CAVITY]: 'Tympanic Cavity & ET',
  [LayerKey.INNER_LABYRINTH]: 'Inner Labyrinth',
  [LayerKey.NERVES_VESSELS]: 'Nerves & Vessels',
};

export const ANATOMY_STRUCTURES: AnatomicalStructure[] = [
  // OUTER EAR
  {
    id: 'pinna-helix',
    name: 'Pinna (Helix, Antihelix & Concha)',
    latinName: 'Auricula',
    region: EarRegion.OUTER_EAR,
    layer: LayerKey.PINNA,
    anchor: [-3.65, 0.35, -0.25],
    cameraPreset: ViewCameraPreset.OVERVIEW,
    otoscopicVisible: false,
    summary:
      'Fibroelastic cartilage frame covered by tightly adherent perichondrium and skin (lobule contains only fibrofatty tissue). Collects and funnels sound waves into the external auditory canal while aiding sound localization.',
    measurements: 'Develops from 6 Hillocks of His (1st & 2nd branchial arches) by week 20',
    nerveSupply: 'Auriculotemporal (V3), Greater auricular (C2–C3), Lesser occipital (C2), Arnold nerve (CN X)',
    bloodSupply: 'Posterior auricular & superficial temporal arteries',
    clinicalSignificance:
      'Tight skin-to-perichondrium adherence makes auricular hematoma prone to cartilage necrosis ("cauliflower ear") and Pseudomonas perichondritis. Cymba conchae overlies MacEwen suprameatal triangle (mastoid antrum landmark).',
    relatedIds: ['tragus', 'eac-cartilaginous', 'mastoid-antrum'],
    keywords: ['auricle', 'helix', 'antihelix', 'concha', 'lobule', 'cymba', 'hillocks of his'],
  },
  {
    id: 'tragus',
    name: 'Tragus & Antitragus',
    latinName: 'Tragus',
    region: EarRegion.OUTER_EAR,
    layer: LayerKey.PINNA,
    anchor: [-3.48, -0.18, 0.68],
    cameraPreset: ViewCameraPreset.OVERVIEW,
    otoscopicVisible: false,
    summary:
      'Anterior cartilaginous prominence projecting backward over the external acoustic meatus entrance, separated from the antitragus inferiorly by the intertragic notch.',
    nerveSupply: 'Auriculotemporal nerve (CN V3)',
    clinicalSignificance:
      'Tragal tenderness ("tragal sign") strongly differentiates acute localized/diffuse otitis externa from otitis media. Tragal cartilage + perichondrium are premier autograft materials for tympanoplasty.',
    relatedIds: ['pinna-helix', 'eac-cartilaginous'],
    keywords: ['tragal sign', 'cartilage graft', 'intertragic notch', 'otitis externa'],
  },
  {
    id: 'eac-cartilaginous',
    name: 'Cartilaginous External Auditory Canal',
    latinName: 'Meatus acusticus externus (pars cartilaginea)',
    region: EarRegion.OUTER_EAR,
    layer: LayerKey.CANAL,
    anchor: [-2.65, 0.05, 0.25],
    cameraPreset: ViewCameraPreset.OTOSCOPE,
    otoscopicVisible: true,
    quadrant: 'CANAL',
    summary:
      'Outer one-third of the external auditory canal directed posterosuperiorly. Skin bears hair follicles, sebaceous glands, and modified apocrine ceruminous glands that produce acidic earwax.',
    measurements: '8 mm length (outer 1/3 of 24 mm S-shaped canal)',
    nerveSupply: 'Auriculotemporal (V3) anteriorly; Arnold nerve (CN X) & CN VII posteriorly',
    clinicalSignificance:
      'Contains Fissures of Santorini anteroinferiorly, permitting spread of infection or carcinoma to the parotid gland and skull base. Only this outer third develops furunculosis (hair follicle infection). Pulling pinna upward & backward in adults straightens its S-bend for otoscopy.',
    relatedIds: ['eac-bony', 'tragus', 'pinna-helix'],
    keywords: ['cerumen', 'fissures of santorini', 'furuncle', 'hair follicles', 'outer third'],
  },
  {
    id: 'eac-bony',
    name: 'Bony External Auditory Canal & Isthmus',
    latinName: 'Meatus acusticus externus (pars ossea)',
    region: EarRegion.OUTER_EAR,
    layer: LayerKey.CANAL,
    anchor: [-1.35, -0.02, 0.08],
    cameraPreset: ViewCameraPreset.OTOSCOPE,
    otoscopicVisible: true,
    quadrant: 'CANAL',
    summary:
      'Inner two-thirds formed mainly by the tympanic part of the temporal bone, directed anteroinferiorly. Covered by thin hairless skin tightly bound to periosteum with outward epithelial migration from the umbo.',
    measurements: '16 mm length; osseous isthmus lies ~5 mm lateral to TM',
    nerveSupply: 'Arnold nerve (auricular branch of CN X) posteriorly; V3 anteriorly',
    clinicalSignificance:
      'Extreme sensitivity of thin periosteal skin means instrumentation easily causes pain, bleeding, or Arnold nerve cough/vasovagal reflex. Isthmus traps foreign bodies; cold-water irritation induces bilateral broad-based exostoses ("surfer’s ear").',
    relatedIds: ['eac-cartilaginous', 'tympanic-membrane', 'annulus'],
    keywords: ['isthmus', 'arnold nerve', 'exostosis', 'osteoma', 'epithelial migration', 'foramen of huschke'],
  },

  // TYMPANIC MEMBRANE
  {
    id: 'tympanic-membrane',
    name: 'Pars Tensa (Tympanic Membrane)',
    latinName: 'Membrana tympani (pars tensa)',
    region: EarRegion.TYMPANIC_MEMBRANE,
    layer: LayerKey.TYMPANIC_MEMBRANE,
    anchor: [-0.55, -0.12, 0.08],
    cameraPreset: ViewCameraPreset.OTOSCOPE,
    otoscopicVisible: true,
    quadrant: 'AI',
    summary:
      'Translucent, pearly-gray oval membrane tilted 55° to the canal floor. Comprises three layers: outer stratified squamous epithelium, middle fibrous lamina propria (outer radial & inner circular collagen fibers), and inner mucosal layer.',
    measurements: '9–10 mm vertical × 8–9 mm horizontal; ~0.1 mm thick; 55° obliquity',
    nerveSupply: 'Outer anterior: V3; Outer posterior: CN X (Arnold); Inner mucosal: CN IX (Jacobson)',
    bloodSupply: 'Deep auricular (outer) & anterior tympanic/stylomastoid arteries (inner)',
    clinicalSignificance:
      'Divided into 4 quadrants (AS, AI, PS, PI) relative to the malleus handle and umbo. Central perforations spare the fibrous annulus ("safe" CSOM). Anteroinferior quadrant houses the cone of light and is the safest site for myringotomy & grommet insertion.',
    relatedIds: ['cone-of-light', 'umbo', 'pars-flaccida', 'annulus'],
    keywords: ['eardrum', 'pars tensa', 'pearly gray', 'three layers', 'quadrants', 'myringotomy'],
  },
  {
    id: 'pars-flaccida',
    name: 'Pars Flaccida (Shrapnell Membrane)',
    latinName: 'Membrana tympani (pars flaccida)',
    region: EarRegion.TYMPANIC_MEMBRANE,
    layer: LayerKey.TYMPANIC_MEMBRANE,
    anchor: [-0.56, 0.56, -0.02],
    cameraPreset: ViewCameraPreset.OTOSCOPE,
    otoscopicVisible: true,
    quadrant: 'PF',
    summary:
      'Small triangular superior portion of the eardrum lying above the anterior and posterior malleolar folds within the Notch of Rivinus. Lacks the middle fibrous collagenous lamina propria.',
    clinicalSignificance:
      'Absence of the fibrous layer makes Shrapnell membrane structurally weak and highly susceptible to negative middle-ear pressure retraction pockets, forming Prussak space primary acquired cholesteatoma with adjacent scutum erosion.',
    relatedIds: ['prussaks-space', 'scutum', 'tympanic-membrane'],
    keywords: ['shrapnell', 'attic', 'notch of rivinus', 'retraction pocket', 'cholesteatoma'],
  },
  {
    id: 'umbo',
    name: 'Umbo & Manubrium of Malleus',
    latinName: 'Umbo membranae tympani',
    region: EarRegion.TYMPANIC_MEMBRANE,
    layer: LayerKey.TYMPANIC_MEMBRANE,
    anchor: [-0.54, -0.04, 0.02],
    cameraPreset: ViewCameraPreset.OTOSCOPE,
    otoscopicVisible: true,
    quadrant: 'UMBO',
    summary:
      'Point of maximal inward concavity on the lateral tympanic membrane corresponding to the tip of the malleus handle (manubrium).',
    clinicalSignificance:
      'Key anatomical reference point on otoscopy: radial epithelial migration originates here, and the cone of light radiates anteroinferiorly from the umbo. Foreshortened/horizontal malleus handle indicates drum retraction.',
    relatedIds: ['cone-of-light', 'malleus', 'tympanic-membrane'],
    keywords: ['manubrium', 'concavity', 'lateral process', 'retraction'],
  },
  {
    id: 'cone-of-light',
    name: 'Cone of Light (Politzer Reflex)',
    latinName: 'Trigonum lucidum',
    region: EarRegion.TYMPANIC_MEMBRANE,
    layer: LayerKey.TYMPANIC_MEMBRANE,
    anchor: [-0.54, -0.35, 0.32],
    cameraPreset: ViewCameraPreset.OTOSCOPE,
    otoscopicVisible: true,
    quadrant: 'AI',
    summary:
      'Triangular bright specular reflection projecting from the umbo into the anteroinferior quadrant (5 o’clock in right ear, 7 o’clock in left ear) caused by the 55° concave drum geometry.',
    clinicalSignificance:
      'Loss, distortion, or fragmentation of the light reflex signals bulging (AOM), retraction (ETD/OME), or loss of surface sheen (myringitis). Note: up to 1/3 of healthy ears may have a faint reflex, so always pair with pneumatic mobility.',
    relatedIds: ['umbo', 'tympanic-membrane'],
    keywords: ['light reflex', '5 oclock', '7 oclock', 'anteroinferior', 'ai quadrant'],
  },
  {
    id: 'annulus',
    name: 'Fibrocartilaginous Annulus & Tympanic Sulcus',
    latinName: 'Anulus fibrocartilagineus',
    region: EarRegion.TYMPANIC_MEMBRANE,
    layer: LayerKey.TYMPANIC_MEMBRANE,
    anchor: [-0.58, -0.58, -0.06],
    cameraPreset: ViewCameraPreset.OTOSCOPE,
    otoscopicVisible: true,
    quadrant: 'PI',
    summary:
      'Thickened peripheral fibrous ring anchoring the pars tensa into the bony tympanic sulcus of the temporal bone, deficient superiorly at the Notch of Rivinus.',
    clinicalSignificance:
      'Surgical landmark elevated during tympanomeatal flap creation. Differentiates "safe" central perforations (annulus intact) from "unsafe" marginal perforations (annulus eroded, permitting squamous ingrowth into middle ear).',
    relatedIds: ['tympanic-membrane', 'pars-flaccida'],
    keywords: ['tympanic sulcus', 'marginal perforation', 'gerlach', 'safe vs unsafe'],
  },

  // MIDDLE EAR & OSSICLES
  {
    id: 'malleus',
    name: 'Malleus (Hammer)',
    latinName: 'Malleus',
    region: EarRegion.MIDDLE_EAR,
    layer: LayerKey.OSSICLES,
    anchor: [-0.32, 0.22, 0.02],
    cameraPreset: ViewCameraPreset.MIDDLE_EAR,
    otoscopicVisible: true,
    quadrant: 'AS',
    summary:
      'Largest ossicle (~8–9 mm), comprising head (in epitympanum articulating with incus via saddle joint), neck, anterior & lateral processes, and handle (manubrium) embedded in the TM.',
    measurements: 'Length 8–9 mm; lever arm contributes to 1.3:1 ossicular lever ratio',
    clinicalSignificance:
      'Lateral process forms a crisp white superior otoscopic landmark from which anterior/posterior malleolar folds radiate. Handle receives the tensor tympani tendon medially.',
    relatedIds: ['incus', 'stapes', 'umbo', 'tensor-tympani'],
    keywords: ['hammer', 'manubrium', 'lateral process', 'head', 'ossicle'],
  },
  {
    id: 'incus',
    name: 'Incus (Anvil)',
    latinName: 'Incus',
    region: EarRegion.MIDDLE_EAR,
    layer: LayerKey.OSSICLES,
    anchor: [0.02, 0.36, -0.18],
    cameraPreset: ViewCameraPreset.MIDDLE_EAR,
    otoscopicVisible: true,
    quadrant: 'PS',
    summary:
      'Central ossicle consisting of body (in attic), short process (anchored in fossa incudis), long process descending parallel to malleus handle, and lenticular process articulating with the stapes head.',
    clinicalSignificance:
      'Long process & lenticular process are the most vulnerable ossicular segments to ischemic necrosis in retraction pockets, CSOM, and cholesteatoma due to tenuous end-arterial blood supply. Often faintly visible through a translucent PS quadrant.',
    relatedIds: ['malleus', 'stapes', 'facial-recess'],
    keywords: ['anvil', 'long process', 'lenticular process', 'incudostapedial', 'necrosis'],
  },
  {
    id: 'stapes',
    name: 'Stapes (Stirrup) & Oval Window',
    latinName: 'Stapes / Fenestra vestibuli',
    region: EarRegion.MIDDLE_EAR,
    layer: LayerKey.OSSICLES,
    anchor: [0.38, 0.08, -0.05],
    cameraPreset: ViewCameraPreset.MIDDLE_EAR,
    otoscopicVisible: false,
    quadrant: 'PS',
    summary:
      'Smallest bone in the human body (~3 mm tall), comprising head, neck (stapedius insertion), anterior and posterior crura, and oval footplate secured in the oval window by the annular ligament.',
    measurements: '3.2 × 1.4 mm footplate; TM-to-footplate area ratio ~14:1 (total transformer ~18–22:1)',
    clinicalSignificance:
      'Otosclerotic bone remodeling at the fissula ante fenestram fixes the footplate, causing progressive conductive hearing loss with Carhart notch at 2000 Hz and absent stapedial reflex (treated by stapedotomy piston).',
    relatedIds: ['incus', 'stapedius', 'vestibule', 'facial-nerve-tympanic'],
    keywords: ['stirrup', 'footplate', 'oval window', 'otosclerosis', 'annular ligament'],
  },
  {
    id: 'tensor-tympani',
    name: 'Tensor Tympani Muscle & Processus Cochleariformis',
    latinName: 'Musculus tensor tympani',
    region: EarRegion.MIDDLE_EAR,
    layer: LayerKey.MIDDLE_CAVITY,
    anchor: [0.18, 0.25, 0.42],
    cameraPreset: ViewCameraPreset.MIDDLE_EAR,
    otoscopicVisible: false,
    summary:
      'Muscle housed in a bony semicanal above the Eustachian tube whose tendon hooks 90° laterally around the spoon-like processus cochleariformis to insert onto the medial malleus neck.',
    nerveSupply: 'Mandibular division of trigeminal nerve (CN V3) via medial pterygoid nerve',
    clinicalSignificance:
      'Processus cochleariformis is a critical surgical landmark indicating the immediate superior proximity of the anterior tympanic facial nerve and geniculate ganglion.',
    relatedIds: ['malleus', 'eustachian-tube', 'facial-nerve-tympanic'],
    keywords: ['processus cochleariformis', 'v3', 'malleus neck', 'semicanal'],
  },
  {
    id: 'stapedius',
    name: 'Stapedius Muscle & Pyramidal Eminence',
    latinName: 'Musculus stapedius',
    region: EarRegion.MIDDLE_EAR,
    layer: LayerKey.MIDDLE_CAVITY,
    anchor: [0.46, 0.02, -0.45],
    cameraPreset: ViewCameraPreset.MIDDLE_EAR,
    otoscopicVisible: false,
    summary:
      'Smallest skeletal muscle in the body, arising inside the hollow pyramidal eminence on the posterior tympanic wall and inserting onto the stapes neck to dampen excessive acoustic vibration.',
    nerveSupply: 'Nerve to stapedius from mastoid segment of Facial Nerve (CN VII)',
    clinicalSignificance:
      'Mediates the acoustic stapedial reflex (absent in otosclerosis, OME, and CN VII lesions proximal to mastoid segment, producing hyperacusis).',
    relatedIds: ['stapes', 'facial-nerve-mastoid', 'sinus-tympani'],
    keywords: ['stapedial reflex', 'hyperacusis', 'pyramidal eminence', 'cn vii'],
  },
  {
    id: 'prussaks-space',
    name: "Prussak's Space & Scutum",
    latinName: 'Recessus membranae tympani superior',
    region: EarRegion.MIDDLE_EAR,
    layer: LayerKey.MIDDLE_CAVITY,
    anchor: [-0.38, 0.62, 0.02],
    cameraPreset: ViewCameraPreset.MIDDLE_EAR,
    otoscopicVisible: true,
    quadrant: 'PF',
    summary:
      'Small epitympanic pouch bounded laterally by pars flaccida, medially by malleus neck, inferiorly by lateral process of malleus, and superiorly by lateral malleolar fold. Adjacent outer attic bony lip is the scutum.',
    clinicalSignificance:
      'Primary origin site of acquired attic cholesteatoma. Blunting or erosion of the sharp bony scutum on coronal HRCT or otoscopy is a classic early radiologic/clinical sign of attic cholesteatoma.',
    relatedIds: ['pars-flaccida', 'malleus', 'tegmen-tympani'],
    keywords: ['prussak', 'scutum', 'attic', 'epitympanum', 'primary acquired cholesteatoma'],
  },
  {
    id: 'promontory-round-window',
    name: 'Promontory & Round Window Niche',
    latinName: 'Promontorium / Fenestra cochleae',
    region: EarRegion.MIDDLE_EAR,
    layer: LayerKey.MIDDLE_CAVITY,
    anchor: [0.62, -0.18, 0.08],
    cameraPreset: ViewCameraPreset.MIDDLE_EAR,
    otoscopicVisible: true,
    quadrant: 'PI',
    summary:
      'Rounded prominence on the medial wall formed by the basal turn of the cochlea, grooved by Jacobson nerve (tympanic plexus CN IX). Posteroinferiorly lies the round window niche closed by the secondary tympanic membrane.',
    nerveSupply: 'Jacobson nerve (tympanic branch of CN IX)',
    clinicalSignificance:
      'Round window provides hydraulic pressure relief for incompressible perilymph vibrations entering via the oval window, and serves as the surgical portal for cochlear implant electrode insertion.',
    relatedIds: ['cochlea', 'stapes', 'tympanic-membrane'],
    keywords: ['promontory', 'round window', 'jacobson nerve', 'basal turn', 'cochlear implant'],
  },
  {
    id: 'sinus-tympani-facial-recess',
    name: 'Facial Recess & Sinus Tympani',
    latinName: 'Sinus tympani / Recessus facialis',
    region: EarRegion.MIDDLE_EAR,
    layer: LayerKey.MIDDLE_CAVITY,
    anchor: [0.58, -0.05, -0.62],
    cameraPreset: ViewCameraPreset.MIDDLE_EAR,
    otoscopicVisible: false,
    summary:
      'Two posterior tympanic recesses flanking the pyramidal eminence and vertical facial nerve: Facial recess lies laterally (between CN VII & chorda tympani); Sinus tympani lies medially (between ponticulus & subiculum).',
    clinicalSignificance:
      'Sinus tympani is the deepest, blind-ended retrotympanic space directly medial to the facial nerve—making it the most common site of residual cholesteatoma during mastoid surgery. Facial recess provides posterior tympanotomy access for cochlear implantation.',
    relatedIds: ['stapedius', 'facial-nerve-mastoid', 'chorda-tympani'],
    keywords: ['sinus tympani', 'facial recess', 'posterior tympanotomy', 'ponticulus', 'subiculum', 'residual cholesteatoma'],
  },
  {
    id: 'tegmen-tympani',
    name: 'Tegmen Tympani (Roof of Middle Ear)',
    latinName: 'Tegmen tympani',
    region: EarRegion.MIDDLE_EAR,
    layer: LayerKey.MIDDLE_CAVITY,
    anchor: [0.1, 0.92, -0.1],
    cameraPreset: ViewCameraPreset.MIDDLE_EAR,
    otoscopicVisible: false,
    summary:
      'Thin plate of petrous/squamous temporal bone forming the roof of the epitympanum and mastoid antrum, separating the middle ear cleft from the dura of the middle cranial fossa and temporal lobe.',
    clinicalSignificance:
      'Erosion by cholesteatoma or iatrogenic mastoidectomy breach risks extradural/temporal lobe abscess, meningitis, CSF otorrhea, and meningoencephalic herniation.',
    relatedIds: ['prussaks-space', 'mastoid-antrum'],
    keywords: ['tegmen', 'middle cranial fossa', 'meningoencephalic herniation', 'intracranial complication'],
  },

  // MASTOID & EUSTACHIAN TUBE
  {
    id: 'eustachian-tube',
    name: 'Eustachian (Auditory) Tube',
    latinName: 'Tuba auditiva',
    region: EarRegion.MASTOID_EUSTACHIAN,
    layer: LayerKey.MIDDLE_CAVITY,
    anchor: [0.95, -0.78, 1.15],
    cameraPreset: ViewCameraPreset.OVERVIEW,
    otoscopicVisible: false,
    summary:
      'Osteocartilaginous channel connecting the protympanum to the lateral nasopharynx (torus tubarius). Actively opened by tensor veli palatini during swallowing or yawning to equalize middle ear pressure and clear secretions.',
    measurements: '36 mm in adults (12 mm bony, 24 mm cartilaginous; 45° downward); 13–18 mm & ~10° horizontal in infants',
    clinicalSignificance:
      'Short, horizontal infantile anatomy explains frequent pediatric AOM/OME. In adults, unilateral OME requires endoscopic inspection of the Fossa of Rosenmüller immediately posterior to the torus tubarius to exclude nasopharyngeal carcinoma.',
    relatedIds: ['tympanic-membrane', 'tensor-tympani'],
    keywords: ['pharyngotympanic', 'tensor veli palatini', 'fossa of rosenmuller', 'ome', 'patulous', 'isthmus'],
  },
  {
    id: 'mastoid-antrum',
    name: 'Mastoid Antrum, Aditus & Air Cells',
    latinName: 'Antrum mastoideum',
    region: EarRegion.MASTOID_EUSTACHIAN,
    layer: LayerKey.MIDDLE_CAVITY,
    anchor: [0.55, 0.45, -1.25],
    cameraPreset: ViewCameraPreset.MIDDLE_EAR,
    otoscopicVisible: false,
    summary:
      'Largest constant air-filled chamber in the temporal bone communicating anteriorly with the epitympanum via the aditus ad antrum. Externally projected by MacEwen suprameatal triangle deep to the cymba conchae.',
    measurements: '12–15 mm lateral to external cortex in adults (~2 mm in newborns); Korner septum may divide cells',
    clinicalSignificance:
      'Acts as a pressure-buffer air reservoir for the middle ear. Coalescent mastoiditis erodes intercellular septa, risking subperiosteal abscess, Bezold abscess, or lateral sinus thrombophlebitis.',
    relatedIds: ['tegmen-tympani', 'sinus-tympani-facial-recess', 'lateral-scc'],
    keywords: ['aditus ad antrum', 'macewen triangle', 'korner septum', 'citelli angle', 'mastoiditis'],
  },

  // INNER EAR (LABYRINTH)
  {
    id: 'cochlea',
    name: 'Cochlea & Organ of Corti',
    latinName: 'Cochlea',
    region: EarRegion.INNER_EAR,
    layer: LayerKey.INNER_LABYRINTH,
    anchor: [1.85, -0.15, 0.45],
    cameraPreset: ViewCameraPreset.INNER_EAR,
    otoscopicVisible: false,
    summary:
      'Snail-shaped 2.5–2.75 turn spiral winding around the central bony modiolus. Divided into perilymph-filled scala vestibuli & scala tympani (meeting at helicotrema) and endolymph-filled scala media containing the Organ of Corti.',
    measurements: '35 mm cochlear duct length; ~3,500 inner hair cells & ~12,000 outer hair cells',
    bloodSupply: 'Labyrinthine (internal auditory) artery from AICA (end-artery)',
    clinicalSignificance:
      'Tonotopically organized: high frequencies (20 kHz) resonate at the stiff narrow base; low frequencies (20 Hz) at the wide flexible apex. Endolymphatic hydrops (Ménière disease) initially causes low-frequency fluctuating SNHL.',
    relatedIds: ['vestibule', 'promontory-round-window', 'cn-viii'],
    keywords: ['organ of corti', 'scala media', 'basilar membrane', 'hair cells', 'perilymph', 'endolymph', 'modiolus'],
  },
  {
    id: 'vestibule',
    name: 'Vestibule (Utricle & Saccule)',
    latinName: 'Vestibulum',
    region: EarRegion.INNER_EAR,
    layer: LayerKey.INNER_LABYRINTH,
    anchor: [0.95, 0.12, -0.15],
    cameraPreset: ViewCameraPreset.INNER_EAR,
    otoscopicVisible: false,
    summary:
      'Central ovoid chamber of the bony labyrinth (~5 × 3 mm) lying medial to the oval window. Houses the utricle (horizontal linear acceleration) and saccule (vertical linear acceleration/gravity) with otolith-loaded maculae.',
    clinicalSignificance:
      'Dislodged calcium carbonate otoconia from the utricular macula migrate into the posterior semicircular canal to cause Benign Paroxysmal Positional Vertigo (BPPV).',
    relatedIds: ['stapes', 'cochlea', 'lateral-scc', 'posterior-superior-scc'],
    keywords: ['utricle', 'saccule', 'otoliths', 'otoconia', 'macula', 'bppv'],
  },
  {
    id: 'lateral-scc',
    name: 'Lateral (Horizontal) Semicircular Canal',
    latinName: 'Canalis semicircularis lateralis',
    region: EarRegion.INNER_EAR,
    layer: LayerKey.INNER_LABYRINTH,
    anchor: [0.98, 0.42, -0.62],
    cameraPreset: ViewCameraPreset.INNER_EAR,
    otoscopicVisible: false,
    summary:
      'Shortest of the three semicircular canals, oriented 30° above the horizontal plane and bulging into the medial wall of the aditus ad antrum right above the horizontal facial nerve.',
    clinicalSignificance:
      'Most common site of labyrinthine fistula in cholesteatoma (positive fistula test: tragal pressure induces vertigo & nystagmus). Also stimulated preferentially during caloric testing when patient lies supine with head elevated 30°.',
    relatedIds: ['mastoid-antrum', 'facial-nerve-tympanic', 'posterior-superior-scc'],
    keywords: ['horizontal canal', 'labyrinthine fistula', 'fistula test', 'caloric test', '30 degrees'],
  },
  {
    id: 'posterior-superior-scc',
    name: 'Superior & Posterior Semicircular Canals',
    latinName: 'Canales semicirculares anterior et posterior',
    region: EarRegion.INNER_EAR,
    layer: LayerKey.INNER_LABYRINTH,
    anchor: [1.28, 0.92, -0.68],
    cameraPreset: ViewCameraPreset.INNER_EAR,
    otoscopicVisible: false,
    summary:
      'Orthogonal canals lying 90° to each other and sharing the crus commune medially. Posterior canal is the most inferior/dependent; superior canal forms the arcuate eminence on the middle cranial fossa floor.',
    clinicalSignificance:
      'Posterior canal most commonly traps free-floating otoconia in BPPV (diagnosed by Dix-Hallpike, cured by Epley maneuver). Donaldson line through the lateral canal bisects the posterior canal to locate the endolymphatic sac.',
    relatedIds: ['lateral-scc', 'vestibule', 'cn-viii'],
    keywords: ['superior canal', 'posterior canal', 'crus commune', 'arcuate eminence', 'donaldson line', 'dix hallpike'],
  },

  // CRANIAL NERVES & VESSELS
  {
    id: 'facial-nerve-tympanic',
    name: 'Facial Nerve — Tympanic (Horizontal) Segment',
    latinName: 'Nervus facialis (pars tympanica)',
    region: EarRegion.NERVES_VESSELS,
    layer: LayerKey.NERVES_VESSELS,
    anchor: [0.68, 0.34, -0.05],
    cameraPreset: ViewCameraPreset.NERVES,
    otoscopicVisible: false,
    summary:
      'Runs posteriorly along the medial middle ear wall from the geniculate ganglion, directly superior to the oval window and stapes and inferior to the lateral semicircular canal.',
    clinicalSignificance:
      'Naturally dehiscent bony Fallopian canal occurs in up to 50% of temporal bones here—putting CN VII at high risk during cholesteatoma dissection, stapedotomy, and acute otitis media.',
    relatedIds: ['stapes', 'lateral-scc', 'facial-nerve-mastoid', 'tensor-tympani'],
    keywords: ['cn vii', 'fallopian canal', 'dehiscent', 'geniculate ganglion', 'greater petrosal'],
  },
  {
    id: 'facial-nerve-mastoid',
    name: 'Facial Nerve — Mastoid (Vertical) Segment',
    latinName: 'Nervus facialis (pars mastoidea)',
    region: EarRegion.NERVES_VESSELS,
    layer: LayerKey.NERVES_VESSELS,
    anchor: [0.58, -0.52, -0.58],
    cameraPreset: ViewCameraPreset.NERVES,
    otoscopicVisible: false,
    summary:
      'Descends vertically behind the posterior canal wall from the second genu to exit at the stylomastoid foramen. Gives off the nerve to stapedius and the chorda tympani.',
    clinicalSignificance:
      'Forms the "facial ridge" in Canal Wall Down mastoidectomy—if left too high, the mastoid cavity fails to drain. Topodiagnostic testing (Schirmer lacrimation, stapedial reflex, electrogustometry) localizes CN VII lesions.',
    relatedIds: ['facial-nerve-tympanic', 'chorda-tympani', 'stapedius'],
    keywords: ['vertical segment', 'stylomastoid foramen', 'facial ridge', 'topodiagnosis', 'bell palsy'],
  },
  {
    id: 'chorda-tympani',
    name: 'Chorda Tympani Nerve',
    latinName: 'Chorda tympani',
    region: EarRegion.NERVES_VESSELS,
    layer: LayerKey.NERVES_VESSELS,
    anchor: [-0.08, 0.12, -0.18],
    cameraPreset: ViewCameraPreset.MIDDLE_EAR,
    otoscopicVisible: true,
    quadrant: 'PS',
    summary:
      'Branch of mastoid CN VII that enters the middle ear via the posterior canaliculus, crosses medially between the malleus neck and long process of incus, and exits via the petrotympanic fissure to join the lingual nerve.',
    nerveSupply: 'Taste to anterior 2/3 of tongue + secretomotor to submandibular & sublingual salivary glands',
    clinicalSignificance:
      'Visible in the posterosuperior quadrant behind a thin/retracted TM. Stretching or sectioning during stapedotomy/tympanoplasty produces metallic dysgeusia or ipsilateral taste loss.',
    relatedIds: ['incus', 'malleus', 'facial-nerve-mastoid'],
    keywords: ['taste', 'anterior two thirds', 'submandibular', 'dysgeusia', 'facial recess'],
  },
  {
    id: 'cn-viii',
    name: 'Vestibulocochlear Nerve (CN VIII) & Internal Auditory Canal',
    latinName: 'Nervus vestibulocochlearis',
    region: EarRegion.NERVES_VESSELS,
    layer: LayerKey.NERVES_VESSELS,
    anchor: [2.45, 0.12, -0.05],
    cameraPreset: ViewCameraPreset.NERVES,
    otoscopicVisible: false,
    summary:
      'Courses through the internal auditory canal alongside CN VII and the labyrinthine artery, dividing into cochlear nerve (anteroinferior) and superior/inferior vestibular nerves (posterior).',
    clinicalSignificance:
      'Vestibular schwannoma (acoustic neuroma) typically arises from the Schwann cells of the vestibular division in the IAC/CPA, presenting with unilateral progressive SNHL, tinnitus, and poor speech discrimination.',
    relatedIds: ['cochlea', 'vestibule', 'facial-nerve-tympanic'],
    keywords: ['acoustic neuroma', 'vestibular schwannoma', 'iac', 'cpa', 'bill bar', 'falciform crest'],
  },
  {
    id: 'internal-jugular-bulb',
    name: 'Superior Jugular Bulb (Floor Relation)',
    latinName: 'Bulbus superior venae jugularis',
    region: EarRegion.NERVES_VESSELS,
    layer: LayerKey.NERVES_VESSELS,
    anchor: [0.38, -0.96, -0.18],
    cameraPreset: ViewCameraPreset.MIDDLE_EAR,
    otoscopicVisible: false,
    quadrant: 'PI',
    summary:
      'Dome-shaped dilation at the junction of the sigmoid sinus and internal jugular vein lying directly beneath the thin bony floor of the hypotympanum.',
    clinicalSignificance:
      'A high-riding or dehiscent jugular bulb presents on otoscopy as a bluish non-pulsatile (or subtly compressible) mass in the posteroinferior quadrant—must be differentiated from glomus tumor by CT before any myringotomy!',
    relatedIds: ['promontory-round-window', 'internal-carotid-artery'],
    keywords: ['high jugular bulb', 'hypotympanum', 'bluish mass', 'sigmoid sinus', 'myringotomy hazard'],
  },
  {
    id: 'internal-carotid-artery',
    name: 'Petrous Internal Carotid Artery (Anterior Relation)',
    latinName: 'Arteria carotis interna (pars petrosa)',
    region: EarRegion.NERVES_VESSELS,
    layer: LayerKey.NERVES_VESSELS,
    anchor: [0.92, -0.62, 0.68],
    cameraPreset: ViewCameraPreset.NERVES,
    otoscopicVisible: false,
    quadrant: 'AI',
    summary:
      'Ascends vertically anterior to the cochlea and then turns anteromedially separated from the protympanum and Eustachian tube by a thin bony plate.',
    clinicalSignificance:
      'An ectopic/aberrant internal carotid artery with bony dehiscence mimics a pulsating reddish anteroinferior retrotympanic mass (like glomus tympanicum); biopsy causes catastrophic hemorrhage—always order HRCT first.',
    relatedIds: ['eustachian-tube', 'internal-jugular-bulb'],
    keywords: ['aberrant ica', 'carotid', 'pulsatile mass', 'biopsy contraindication', 'anterior wall'],
  },
];
