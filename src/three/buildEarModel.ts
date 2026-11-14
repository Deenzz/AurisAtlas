import * as THREE from 'three';
import { LayerKey, OtoscopeVisualSpec } from '../types/ear';

export interface EarModelHandles {
  root: THREE.Group;
  layers: Record<LayerKey, THREE.Group>;
  baseOffsets: Record<LayerKey, THREE.Vector3>;
  explodeOffsets: Record<LayerKey, THREE.Vector3>;
  interactables: THREE.Object3D[];
  tmMesh: THREE.Mesh;
  tmCanvas: HTMLCanvasElement;
  tmCtx: CanvasRenderingContext2D;
  tmTexture: THREE.CanvasTexture;
  effusionMesh: THREE.Mesh;
  cholesteatomaMesh: THREE.Mesh;
  retroMassMesh: THREE.Mesh;
  grommetMesh: THREE.Group;
  canalPathologyGroup: THREE.Group;
  otoscopeSpeculum: THREE.Group;
  soundWavesGroup: THREE.Group;
  ossiclesGroup: THREE.Group;
  dispose: () => void;
}

function createNoiseBumpTexture(size = 128, contrast = 28): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 128 + Math.floor((Math.random() - 0.5) * contrast);
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

export function drawTympanicMembraneCanvas(
  ctx: CanvasRenderingContext2D,
  size: number,
  spec: OtoscopeVisualSpec
) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.45;

  ctx.clearRect(0, 0, size, size);

  // Outer fibrocartilaginous annulus rim
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
  ctx.fillStyle = spec.drumEdgeColor;
  ctx.fill();

  // Main pars tensa gradient
  const grad = ctx.createRadialGradient(cx, cy, r * 0.08, cx, cy, r);
  grad.addColorStop(0, spec.drumBaseColor);
  grad.addColorStop(0.78, spec.drumBaseColor);
  grad.addColorStop(1, spec.drumEdgeColor);

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.globalAlpha = Math.max(0.55, 1 - spec.translucency * 0.35);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Radial collagen fiber sheen
  ctx.strokeStyle = 'rgba(255,255,255,0.16)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 36; i++) {
    const ang = (i / 36) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(ang) * r * 0.14, cy + Math.sin(ang) * r * 0.14);
    ctx.lineTo(cx + Math.cos(ang) * r * 0.96, cy + Math.sin(ang) * r * 0.96);
    ctx.stroke();
  }

  // Effusion tint & meniscus
  if (spec.effusionColor && (spec.effusionLevel ?? 0) > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.96, 0, Math.PI * 2);
    ctx.clip();
    const levelY = cy + r * (1 - 2 * (spec.effusionLevel ?? 0.5));
    ctx.fillStyle = spec.effusionColor;
    ctx.globalAlpha = 0.58;
    ctx.fillRect(cx - r, levelY, r * 2, r * 2);
    ctx.globalAlpha = 0.85;
    ctx.strokeStyle = 'rgba(255,255,255,0.45)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - r, levelY);
    ctx.quadraticCurveTo(cx, levelY + 10, cx + r, levelY);
    ctx.stroke();

    if (spec.airBubbles) {
      const bubbles = [
        [-0.25, 0.25, 11],
        [0.18, 0.32, 14],
        [0.34, 0.12, 8],
        [-0.08, 0.44, 9],
      ];
      for (const [bx, by, br] of bubbles) {
        ctx.beginPath();
        ctx.arc(cx + bx * r, cy + by * r, br, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.75)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // Tympanosclerosis chalky plaques
  if (spec.tympanosclerosisPlaques) {
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(cx + r * 0.32, cy + r * 0.08, r * 0.22, r * 0.34, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.3, cy + r * 0.2, r * 0.14, r * 0.22, -0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Vascularity
  if (spec.vascularity === 'injected_radial' || spec.vascularity === 'intense_hyperemia') {
    ctx.strokeStyle = spec.vascularity === 'intense_hyperemia' ? '#991b1b' : '#dc2626';
    ctx.lineWidth = spec.vascularity === 'intense_hyperemia' ? 3.5 : 2;
    for (let i = 0; i < 14; i++) {
      const ang = (i / 14) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(ang) * r * 0.95, cy + Math.sin(ang) * r * 0.95);
      ctx.lineTo(cx + Math.cos(ang + 0.08) * r * 0.35, cy + Math.sin(ang + 0.08) * r * 0.35);
      ctx.stroke();
    }
  }

  // Bullae
  if (spec.bullae) {
    ctx.fillStyle = 'rgba(127, 29, 29, 0.85)';
    ctx.beginPath();
    ctx.arc(cx + r * 0.24, cy + r * 0.2, r * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(254, 202, 202, 0.45)';
    ctx.beginPath();
    ctx.arc(cx + r * 0.19, cy + r * 0.15, r * 0.06, 0, Math.PI * 2);
    ctx.fill();
  }

  // Malleus handle shadow
  ctx.strokeStyle = spec.vascularity === 'intense_hyperemia' ? '#fecaca' : '#f1f5f9';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.08, cy - r * 0.38);
  ctx.lineTo(cx + r * 0.02, cy + r * 0.02);
  ctx.stroke();

  // Cone of light (anteroinferior ~5 o'clock)
  if (spec.coneOfLight !== 'absent') {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy + 4);
    ctx.lineTo(cx + r * 0.28, cy + r * 0.72);
    ctx.lineTo(cx + r * 0.62, cy + r * 0.48);
    ctx.closePath();
    ctx.fillStyle =
      spec.coneOfLight === 'normal'
        ? 'rgba(255, 255, 240, 0.65)'
        : 'rgba(255, 255, 240, 0.25)';
    ctx.fill();
    ctx.restore();
  }

  // Perforation cutouts
  if (spec.perforation !== 'none') {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    if (spec.perforation === 'central_anterior') {
      ctx.ellipse(cx + r * 0.28, cy + r * 0.26, r * 0.22, r * 0.28, 0.2, 0, Math.PI * 2);
    } else if (spec.perforation === 'central_posterior') {
      ctx.ellipse(cx - r * 0.28, cy + r * 0.22, r * 0.2, r * 0.26, -0.2, 0, Math.PI * 2);
    } else if (spec.perforation === 'subtotal') {
      ctx.arc(cx, cy + r * 0.14, r * 0.65, 0, Math.PI * 2);
    } else if (spec.perforation === 'attic_scutum') {
      ctx.ellipse(cx - r * 0.04, cy - r * 0.64, r * 0.26, r * 0.18, 0, 0, Math.PI * 2);
    } else if (spec.perforation === 'traumatic_slit') {
      ctx.ellipse(cx - r * 0.22, cy + r * 0.25, r * 0.07, r * 0.28, 0.4, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

export function buildEarModel(maxAnisotropy = 4): EarModelHandles {
  const root = new THREE.Group();
  const interactables: THREE.Object3D[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };

  const bumpTex = createNoiseBumpTexture(128, 26);
  bumpTex.repeat.set(3, 3);
  textures.push(bumpTex);

  const registerInteractable = (obj: THREE.Object3D, structureId: string) => {
    obj.userData.structureId = structureId;
    interactables.push(obj);
  };

  // Materials calibrated across distinct roughness bands (>=0.25 separation where adjacent)
  const skinMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xe6b89c,
      roughness: 0.72,
      metalness: 0.02,
      bumpMap: bumpTex,
      bumpScale: 0.015,
    })
  );
  const cartilageMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd9a78b,
      roughness: 0.56,
      metalness: 0.03,
      bumpMap: bumpTex,
      bumpScale: 0.01,
    })
  );
  const boneMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xe5dcc8,
      roughness: 0.74,
      metalness: 0.04,
      bumpMap: bumpTex,
      bumpScale: 0.02,
      transparent: true,
      opacity: 0.34,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  const ossicleMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf7f2e7,
      roughness: 0.32,
      metalness: 0.06,
    })
  );
  const muscleMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xb94a48,
      roughness: 0.55,
      metalness: 0.04,
    })
  );
  const labyrinthMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      roughness: 0.18,
      metalness: 0.08,
      clearcoat: 0.7,
      clearcoatRoughness: 0.15,
      transparent: true,
      opacity: 0.88,
    })
  );
  const nerveMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.34,
      metalness: 0.08,
      emissive: 0x422006,
      emissiveIntensity: 0.18,
    })
  );
  const arteryMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.38,
      metalness: 0.05,
    })
  );
  const veinMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      roughness: 0.36,
      metalness: 0.05,
    })
  );
  const metalSpeculumMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.22,
      metalness: 0.88,
      side: THREE.DoubleSide,
    })
  );

  const layers: Record<LayerKey, THREE.Group> = {
    [LayerKey.PINNA]: new THREE.Group(),
    [LayerKey.CANAL]: new THREE.Group(),
    [LayerKey.TYMPANIC_MEMBRANE]: new THREE.Group(),
    [LayerKey.OSSICLES]: new THREE.Group(),
    [LayerKey.MIDDLE_CAVITY]: new THREE.Group(),
    [LayerKey.INNER_LABYRINTH]: new THREE.Group(),
    [LayerKey.NERVES_VESSELS]: new THREE.Group(),
  };

  const baseOffsets: Record<LayerKey, THREE.Vector3> = {
    [LayerKey.PINNA]: new THREE.Vector3(0, 0, 0),
    [LayerKey.CANAL]: new THREE.Vector3(0, 0, 0),
    [LayerKey.TYMPANIC_MEMBRANE]: new THREE.Vector3(0, 0, 0),
    [LayerKey.OSSICLES]: new THREE.Vector3(0, 0, 0),
    [LayerKey.MIDDLE_CAVITY]: new THREE.Vector3(0, 0, 0),
    [LayerKey.INNER_LABYRINTH]: new THREE.Vector3(0, 0, 0),
    [LayerKey.NERVES_VESSELS]: new THREE.Vector3(0, 0, 0),
  };

  const explodeOffsets: Record<LayerKey, THREE.Vector3> = {
    [LayerKey.PINNA]: new THREE.Vector3(-2.1, 0, 0),
    [LayerKey.CANAL]: new THREE.Vector3(-1.2, 0, 0.2),
    [LayerKey.TYMPANIC_MEMBRANE]: new THREE.Vector3(-0.45, 0, 0),
    [LayerKey.OSSICLES]: new THREE.Vector3(0.05, 0.3, 0.1),
    [LayerKey.MIDDLE_CAVITY]: new THREE.Vector3(0.3, -0.25, -0.2),
    [LayerKey.INNER_LABYRINTH]: new THREE.Vector3(1.15, 0.15, 0),
    [LayerKey.NERVES_VESSELS]: new THREE.Vector3(0.85, -0.45, -0.3),
  };

  Object.values(layers).forEach((g) => root.add(g));

  // 1. PINNA (Composite 6-part outer ear auricle)
  const pinnaGroup = layers[LayerKey.PINNA];
  const auricleShape = new THREE.Shape();
  auricleShape.moveTo(0, -1.25);
  auricleShape.bezierCurveTo(-0.55, -1.35, -0.95, -0.65, -0.92, 0.35);
  auricleShape.bezierCurveTo(-0.88, 1.28, -0.15, 1.55, 0.45, 1.22);
  auricleShape.bezierCurveTo(0.82, 0.98, 0.65, 0.35, 0.35, 0.12);
  auricleShape.bezierCurveTo(0.22, -0.2, 0.45, -0.85, 0.3, -1.18);
  auricleShape.bezierCurveTo(0.18, -1.32, 0.08, -1.28, 0, -1.25);

  const conchaHole = new THREE.Path();
  conchaHole.absellipse(0.02, -0.05, 0.32, 0.44, 0, Math.PI * 2, true, 0);
  auricleShape.holes.push(conchaHole);

  const auricleGeo = trackGeo(
    new THREE.ExtrudeGeometry(auricleShape, {
      depth: 0.18,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.07,
      bevelSegments: 4,
      curveSegments: 24,
    })
  );
  const auricleMesh = new THREE.Mesh(auricleGeo, skinMat);
  auricleMesh.position.set(-3.75, 0.05, 0.05);
  auricleMesh.rotation.y = Math.PI / 2 - 0.18;
  auricleMesh.castShadow = true;
  auricleMesh.receiveShadow = true;
  registerInteractable(auricleMesh, 'pinna-helix');
  pinnaGroup.add(auricleMesh);

  // Helix curved rim
  const helixCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.55, 0.15, 0.2),
    new THREE.Vector3(-3.65, 0.85, 0.35),
    new THREE.Vector3(-3.78, 1.38, -0.15),
    new THREE.Vector3(-3.88, 0.95, -0.78),
    new THREE.Vector3(-3.85, 0.05, -0.88),
    new THREE.Vector3(-3.76, -0.68, -0.58),
  ]);
  const helixMesh = new THREE.Mesh(
    trackGeo(new THREE.TubeGeometry(helixCurve, 32, 0.11, 12, false)),
    cartilageMat
  );
  helixMesh.castShadow = true;
  registerInteractable(helixMesh, 'pinna-helix');
  pinnaGroup.add(helixMesh);

  // Antihelix ridge
  const antihelixCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.68, -0.55, -0.35),
    new THREE.Vector3(-3.7, 0.12, -0.55),
    new THREE.Vector3(-3.66, 0.72, -0.38),
    new THREE.Vector3(-3.6, 1.05, 0.02),
  ]);
  const antihelixMesh = new THREE.Mesh(
    trackGeo(new THREE.TubeGeometry(antihelixCurve, 22, 0.085, 10, false)),
    skinMat
  );
  registerInteractable(antihelixMesh, 'pinna-helix');
  pinnaGroup.add(antihelixMesh);

  // Lobule (fibrofatty inferior ear)
  const lobuleGeo = trackGeo(new THREE.SphereGeometry(0.32, 18, 14));
  lobuleGeo.scale(0.55, 1.1, 0.85);
  const lobuleMesh = new THREE.Mesh(lobuleGeo, skinMat);
  lobuleMesh.position.set(-3.65, -1.05, -0.15);
  registerInteractable(lobuleMesh, 'pinna-helix');
  pinnaGroup.add(lobuleMesh);

  // Tragus
  const tragusGeo = trackGeo(new THREE.ConeGeometry(0.18, 0.36, 12));
  const tragusMesh = new THREE.Mesh(tragusGeo, cartilageMat);
  tragusMesh.position.set(-3.45, -0.16, 0.62);
  tragusMesh.rotation.z = -Math.PI / 2.2;
  tragusMesh.rotation.y = 0.5;
  registerInteractable(tragusMesh, 'tragus');
  pinnaGroup.add(tragusMesh);

  // 2. EXTERNAL AUDITORY CANAL (S-shaped cutaway canal)
  const canalGroup = layers[LayerKey.CANAL];
  // Half-shell canal (posterior & inferior walls intact, anterior upper cutaway so TM & lumen remain viewable!)
  const canalCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.35, -0.02, 0.16),
    new THREE.Vector3(-2.55, 0.12, 0.22),
    new THREE.Vector3(-1.65, 0.04, 0.02),
    new THREE.Vector3(-0.72, -0.02, 0.0),
  ]);

  // Cartilaginous outer 1/3 cutaway shell
  const outerCanalGeo = trackGeo(
    new THREE.CylinderGeometry(0.46, 0.42, 0.95, 24, 1, true, Math.PI * 0.45, Math.PI * 1.25)
  );
  const outerCanalMesh = new THREE.Mesh(
    outerCanalGeo,
    trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xdba98d,
        roughness: 0.68,
        metalness: 0.02,
        side: THREE.DoubleSide,
      })
    )
  );
  outerCanalMesh.rotation.z = Math.PI / 2;
  outerCanalMesh.rotation.y = -0.12;
  outerCanalMesh.position.set(-2.75, 0.05, 0.18);
  registerInteractable(outerCanalMesh, 'eac-cartilaginous');
  canalGroup.add(outerCanalMesh);

  // Bony inner 2/3 cutaway shell (showing osseous isthmus narrowing)
  const innerCanalGeo = trackGeo(
    new THREE.CylinderGeometry(0.42, 0.45, 1.55, 24, 4, true, Math.PI * 0.45, Math.PI * 1.25)
  );
  const innerCanalMesh = new THREE.Mesh(
    innerCanalGeo,
    trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xe6dac5,
        roughness: 0.52,
        metalness: 0.04,
        side: THREE.DoubleSide,
      })
    )
  );
  innerCanalMesh.rotation.z = Math.PI / 2;
  innerCanalMesh.rotation.y = 0.12;
  innerCanalMesh.position.set(-1.5, 0.01, 0.05);
  registerInteractable(innerCanalMesh, 'eac-bony');
  canalGroup.add(innerCanalMesh);

  // Subtle dashed guide curve through canal center
  const canalAxisLine = new THREE.Line(
    trackGeo(new THREE.BufferGeometry().setFromPoints(canalCurve.getPoints(24))),
    trackMat(new THREE.LineBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.35 }))
  );
  canalGroup.add(canalAxisLine);

  const canalPathologyGroup = new THREE.Group();
  canalGroup.add(canalPathologyGroup);

  // 3. TYMPANIC MEMBRANE
  const tmGroup = layers[LayerKey.TYMPANIC_MEMBRANE];
  const tmCanvas = document.createElement('canvas');
  tmCanvas.width = 512;
  tmCanvas.height = 512;
  const tmCtx = tmCanvas.getContext('2d')!;
  const tmTexture = new THREE.CanvasTexture(tmCanvas);
  tmTexture.colorSpace = THREE.SRGBColorSpace;
  tmTexture.anisotropy = maxAnisotropy;
  textures.push(tmTexture);

  const tmMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: tmTexture,
      roughness: 0.24,
      metalness: 0.04,
      transparent: true,
      side: THREE.DoubleSide,
      alphaTest: 0.12,
    })
  );

  // Shallow conical profile oriented 55° to canal floor
  const tmPts = [
    new THREE.Vector2(0.001, -0.14), // inward umbo concavity
    new THREE.Vector2(0.24, -0.05),
    new THREE.Vector2(0.55, 0.01),
    new THREE.Vector2(0.76, 0.02),
  ];
  const tmGeo = trackGeo(new THREE.LatheGeometry(tmPts, 40));
  tmGeo.rotateZ(-Math.PI / 2); // face lateral (-X)
  // Fix UVs planarly across YZ so canvas texture maps naturally onto the oval drum
  const posAttr = tmGeo.attributes.position;
  const uvArr = new Float32Array(posAttr.count * 2);
  for (let i = 0; i < posAttr.count; i++) {
    const y = posAttr.getY(i);
    const z = posAttr.getZ(i);
    uvArr[i * 2] = 0.5 + z / 1.65;
    uvArr[i * 2 + 1] = 0.5 + y / 1.65;
  }
  tmGeo.setAttribute('uv', new THREE.BufferAttribute(uvArr, 2));

  const tmMesh = new THREE.Mesh(tmGeo, tmMat);
  tmMesh.position.set(-0.55, 0, 0);
  tmMesh.rotation.z = 0.42; // 55-deg tilt to floor
  tmMesh.rotation.y = -0.18;
  registerInteractable(tmMesh, 'tympanic-membrane');
  tmGroup.add(tmMesh);

  // Annulus ring
  const annulusGeo = trackGeo(new THREE.TorusGeometry(0.75, 0.045, 12, 36, Math.PI * 1.72));
  const annulusMesh = new THREE.Mesh(
    annulusGeo,
    trackMat(new THREE.MeshStandardMaterial({ color: 0xf1e8dc, roughness: 0.55 }))
  );
  annulusMesh.position.set(-0.56, 0, 0);
  annulusMesh.rotation.y = Math.PI / 2 - 0.18;
  annulusMesh.rotation.x = 0.42;
  annulusMesh.rotation.z = -Math.PI * 0.36;
  registerInteractable(annulusMesh, 'annulus');
  tmGroup.add(annulusMesh);

  // Pars flaccida marker (Shrapnell)
  const pfGeo = trackGeo(new THREE.CircleGeometry(0.19, 16, 0, Math.PI));
  const pfMesh = new THREE.Mesh(
    pfGeo,
    trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf4b6a6,
        roughness: 0.42,
        side: THREE.DoubleSide,
      })
    )
  );
  pfMesh.position.set(-0.68, 0.56, -0.02);
  pfMesh.rotation.y = Math.PI / 2 - 0.18;
  registerInteractable(pfMesh, 'pars-flaccida');
  tmGroup.add(pfMesh);

  // Grommet ventilation tube (hidden unless postsurgical disease active)
  const grommetMesh = new THREE.Group();
  const grommetCollar = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 0.12, 16, 1, true)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.25, side: THREE.DoubleSide }))
  );
  grommetCollar.rotation.z = Math.PI / 2;
  const grommetFlange = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.11, 0.025, 10, 20)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.25 }))
  );
  grommetFlange.rotation.y = Math.PI / 2;
  grommetFlange.position.x = -0.05;
  grommetMesh.add(grommetCollar, grommetFlange);
  grommetMesh.position.set(-0.46, -0.26, 0.24);
  grommetMesh.visible = false;
  tmGroup.add(grommetMesh);

  // 4. OSSICULAR CHAIN (Malleus, Incus, Stapes)
  const ossiclesGroup = layers[LayerKey.OSSICLES];

  // Malleus
  const malleusGroup = new THREE.Group();
  const malleusHead = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.16, 16, 14)), ossicleMat);
  malleusHead.position.set(-0.22, 0.54, 0.04);
  const malleusHandleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.22, 0.54, 0.04),
    new THREE.Vector3(-0.3, 0.28, 0.03),
    new THREE.Vector3(-0.46, -0.04, 0.01),
  ]);
  const malleusHandle = new THREE.Mesh(
    trackGeo(new THREE.TubeGeometry(malleusHandleCurve, 16, 0.042, 10, false)),
    ossicleMat
  );
  const lateralProc = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.045, 0.14, 8)), ossicleMat);
  lateralProc.position.set(-0.36, 0.36, 0.04);
  lateralProc.rotation.z = Math.PI / 2;
  malleusGroup.add(malleusHead, malleusHandle, lateralProc);
  registerInteractable(malleusGroup, 'malleus');
  ossiclesGroup.add(malleusGroup);

  // Incus
  const incusGroup = new THREE.Group();
  const incusBody = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.22, 0.24, 0.18)), ossicleMat);
  incusBody.position.set(-0.04, 0.52, -0.08);
  incusBody.rotation.z = 0.25;
  const incusShort = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.055, 0.26, 10)), ossicleMat);
  incusShort.position.set(0.08, 0.56, -0.25);
  incusShort.rotation.x = -Math.PI / 2.2;
  const incusLongCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.02, 0.44, -0.08),
    new THREE.Vector3(0.04, 0.18, -0.11),
    new THREE.Vector3(0.18, 0.08, -0.08),
  ]);
  const incusLong = new THREE.Mesh(
    trackGeo(new THREE.TubeGeometry(incusLongCurve, 16, 0.036, 10, false)),
    ossicleMat
  );
  incusGroup.add(incusBody, incusShort, incusLong);
  registerInteractable(incusGroup, 'incus');
  ossiclesGroup.add(incusGroup);

  // Stapes
  const stapesGroup = new THREE.Group();
  const stapesHead = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.05, 10, 10)), ossicleMat);
  stapesHead.position.set(0.22, 0.08, -0.07);
  const antCrus = new THREE.Mesh(
    trackGeo(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(0.22, 0.08, -0.07),
          new THREE.Vector3(0.38, 0.08, 0.04),
          new THREE.Vector3(0.54, 0.08, 0.0),
        ]),
        12,
        0.02,
        8,
        false
      )
    ),
    ossicleMat
  );
  const postCrus = new THREE.Mesh(
    trackGeo(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(0.22, 0.08, -0.07),
          new THREE.Vector3(0.38, 0.08, -0.18),
          new THREE.Vector3(0.54, 0.08, -0.12),
        ]),
        12,
        0.02,
        8,
        false
      )
    ),
    ossicleMat
  );
  const footplateGeo = trackGeo(new THREE.CylinderGeometry(0.14, 0.14, 0.035, 16));
  footplateGeo.scale(1, 1, 0.65);
  const footplate = new THREE.Mesh(footplateGeo, ossicleMat);
  footplate.rotation.z = Math.PI / 2;
  footplate.position.set(0.56, 0.08, -0.06);
  stapesGroup.add(stapesHead, antCrus, postCrus, footplate);
  registerInteractable(stapesGroup, 'stapes');
  ossiclesGroup.add(stapesGroup);

  // 5. MIDDLE EAR CAVITY, MUSCLES, EUSTACHIAN TUBE & MASTOID
  const cavityGroup = layers[LayerKey.MIDDLE_CAVITY];

  // Subtle organic temporal cavity vault (non-boxy silhouette so ossicles & promontory read cleanly)
  const cavityVault = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.92, 0.88, 1.55, 24, 1, true)),
    trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xe2d5c3,
        roughness: 0.78,
        metalness: 0.02,
        transparent: true,
        opacity: 0.14,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    )
  );
  cavityVault.position.set(0.08, 0.05, -0.05);
  registerInteractable(cavityVault, 'tegmen-tympani');
  cavityGroup.add(cavityVault);

  // Tegmen tympani curved roof plate
  const tegmenRoof = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.92, 0.92, 0.08, 24)),
    trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd9cbb8,
        roughness: 0.72,
        transparent: true,
        opacity: 0.36,
      })
    )
  );
  tegmenRoof.position.set(0.08, 0.86, -0.05);
  registerInteractable(tegmenRoof, 'tegmen-tympani');
  cavityGroup.add(tegmenRoof);

  // Cochlear promontory bulge on medial wall
  const promontory = new THREE.Mesh(
    trackGeo(new THREE.SphereGeometry(0.36, 20, 16)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0xead8c0, roughness: 0.65 }))
  );
  promontory.scale.set(0.55, 0.9, 1.0);
  promontory.position.set(0.62, -0.18, 0.08);
  registerInteractable(promontory, 'promontory-round-window');
  cavityGroup.add(promontory);

  // Round window niche
  const roundWindow = new THREE.Mesh(
    trackGeo(new THREE.CircleGeometry(0.09, 16)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, side: THREE.DoubleSide }))
  );
  roundWindow.rotation.y = Math.PI / 2;
  roundWindow.position.set(0.6, -0.38, -0.15);
  registerInteractable(roundWindow, 'promontory-round-window');
  cavityGroup.add(roundWindow);

  // Tensor tympani muscle + tendon
  const tensorMuscle = new THREE.Mesh(
    trackGeo(new THREE.CapsuleGeometry(0.075, 0.55, 6, 12)),
    muscleMat
  );
  tensorMuscle.rotation.x = Math.PI / 2.2;
  tensorMuscle.position.set(0.22, 0.25, 0.45);
  registerInteractable(tensorMuscle, 'tensor-tympani');
  cavityGroup.add(tensorMuscle);

  // Stapedius muscle in pyramidal eminence
  const stapediusCone = new THREE.Mesh(
    trackGeo(new THREE.ConeGeometry(0.09, 0.26, 12)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0xdccbb2, roughness: 0.6 }))
  );
  stapediusCone.rotation.x = Math.PI / 2;
  stapediusCone.position.set(0.45, 0.05, -0.45);
  registerInteractable(stapediusCone, 'stapedius');
  cavityGroup.add(stapediusCone);

  // Eustachian Tube (45-deg anteroinferior descent)
  const etCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.18, -0.25, 0.48),
    new THREE.Vector3(0.62, -0.55, 0.85),
    new THREE.Vector3(1.15, -0.95, 1.38),
  ]);
  const etMesh = new THREE.Mesh(
    trackGeo(new THREE.TubeGeometry(etCurve, 22, 0.16, 14, false)),
    trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xe29587,
        roughness: 0.42,
        transparent: true,
        opacity: 0.78,
        side: THREE.DoubleSide,
      })
    )
  );
  registerInteractable(etMesh, 'eustachian-tube');
  cavityGroup.add(etMesh);

  // Mastoid Antrum & air cells posteriorly (-Z)
  const mastoidGroup = new THREE.Group();
  const antrum = new THREE.Mesh(
    trackGeo(new THREE.SphereGeometry(0.42, 16, 14)),
    trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd6c7b2,
        roughness: 0.7,
        transparent: true,
        opacity: 0.42,
      })
    )
  );
  antrum.position.set(0.45, 0.42, -1.18);
  mastoidGroup.add(antrum);
  const cellGeo = trackGeo(new THREE.SphereGeometry(0.13, 10, 10));
  const cellMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xe6dac8, roughness: 0.65, transparent: true, opacity: 0.55 })
  );
  const cellCoords = [
    [0.2, 0.2, -1.55],
    [0.55, 0.05, -1.58],
    [0.75, 0.55, -1.45],
    [0.35, -0.35, -1.38],
    [0.65, -0.65, -1.25],
    [0.12, 0.65, -1.32],
  ];
  for (const [cx, cy, cz] of cellCoords) {
    const c = new THREE.Mesh(cellGeo, cellMat);
    c.position.set(cx, cy, cz);
    mastoidGroup.add(c);
  }
  registerInteractable(mastoidGroup, 'mastoid-antrum');
  cavityGroup.add(mastoidGroup);

  // Middle ear pathology meshes (effusion fluid, cholesteatoma pearl, glomus mass)
  const effusionMesh = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.75, 0.85, 0.95)),
    trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.15,
        transparent: true,
        opacity: 0.62,
      })
    )
  );
  effusionMesh.position.set(0.02, -0.35, 0.0);
  effusionMesh.visible = false;
  cavityGroup.add(effusionMesh);

  const cholesteatomaMesh = new THREE.Mesh(
    trackGeo(new THREE.IcosahedronGeometry(0.28, 2)),
    trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.28,
        metalness: 0.05,
        emissive: 0x94a3b8,
        emissiveIntensity: 0.15,
      })
    )
  );
  cholesteatomaMesh.position.set(-0.28, 0.58, 0.02);
  cholesteatomaMesh.visible = false;
  cavityGroup.add(cholesteatomaMesh);

  const retroMassMesh = new THREE.Mesh(
    trackGeo(new THREE.SphereGeometry(0.32, 18, 16)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.32 }))
  );
  retroMassMesh.position.set(-0.18, -0.32, 0.0);
  retroMassMesh.visible = false;
  cavityGroup.add(retroMassMesh);

  // 6. INNER EAR LABYRINTH (Vestibule, 3 Semicircular Canals, 2.75-turn Cochlea)
  const innerGroup = layers[LayerKey.INNER_LABYRINTH];

  // Vestibule
  const vestibule = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.32, 20, 16)), labyrinthMat);
  vestibule.scale.set(1.0, 0.85, 1.1);
  vestibule.position.set(0.95, 0.1, -0.15);
  registerInteractable(vestibule, 'vestibule');
  innerGroup.add(vestibule);

  // Cochlea (2.75-turn tapering spiral along +X/+Z axis)
  const cochleaPoints: THREE.Vector3[] = [];
  const turns = 2.75;
  const steps = 90;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * Math.PI * 2 * turns;
    const radius = 0.44 * (1 - t * 0.74);
    const x = 1.25 + t * 0.95;
    const y = -0.18 + Math.sin(angle) * radius;
    const z = 0.35 + Math.cos(angle) * radius;
    cochleaPoints.push(new THREE.Vector3(x, y, z));
  }
  const cochleaGeo = trackGeo(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cochleaPoints), 96, 0.09, 12, false)
  );
  const cochleaMesh = new THREE.Mesh(cochleaGeo, labyrinthMat);
  registerInteractable(cochleaMesh, 'cochlea');
  innerGroup.add(cochleaMesh);

  // Lateral (Horizontal) Semicircular Canal (30 deg above horizontal)
  const latScc = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.38, 0.06, 12, 28, Math.PI * 1.45)),
    labyrinthMat
  );
  latScc.position.set(0.98, 0.35, -0.45);
  latScc.rotation.x = Math.PI / 2 - 0.52;
  latScc.rotation.z = 2.4;
  registerInteractable(latScc, 'lateral-scc');
  innerGroup.add(latScc);

  // Superior Semicircular Canal
  const supScc = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.45, 0.06, 12, 28, Math.PI * 1.45)),
    labyrinthMat
  );
  supScc.position.set(1.18, 0.72, -0.35);
  supScc.rotation.y = Math.PI / 4;
  supScc.rotation.z = -0.4;
  registerInteractable(supScc, 'posterior-superior-scc');
  innerGroup.add(supScc);

  // Posterior Semicircular Canal (orthogonal)
  const postScc = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.45, 0.06, 12, 28, Math.PI * 1.45)),
    labyrinthMat
  );
  postScc.position.set(1.12, 0.42, -0.68);
  postScc.rotation.y = -Math.PI / 4;
  postScc.rotation.z = -1.1;
  registerInteractable(postScc, 'posterior-superior-scc');
  innerGroup.add(postScc);

  // 7. CRANIAL NERVES & GREAT VESSELS
  const nervesGroup = layers[LayerKey.NERVES_VESSELS];

  // CN VII (IAC -> Geniculate -> Horizontal Tympanic -> Vertical Mastoid)
  const cn7TympanicCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(2.8, 0.24, -0.02),
    new THREE.Vector3(1.55, 0.42, 0.14),
    new THREE.Vector3(0.68, 0.34, -0.05),
    new THREE.Vector3(0.58, 0.22, -0.46),
  ]);
  const cn7Tympanic = new THREE.Mesh(
    trackGeo(new THREE.TubeGeometry(cn7TympanicCurve, 32, 0.062, 10, false)),
    nerveMat
  );
  registerInteractable(cn7Tympanic, 'facial-nerve-tympanic');
  nervesGroup.add(cn7Tympanic);

  const cn7MastoidCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.58, 0.22, -0.46),
    new THREE.Vector3(0.58, -0.45, -0.58),
    new THREE.Vector3(0.56, -1.35, -0.62),
  ]);
  const cn7Mastoid = new THREE.Mesh(
    trackGeo(new THREE.TubeGeometry(cn7MastoidCurve, 24, 0.068, 10, false)),
    nerveMat
  );
  registerInteractable(cn7Mastoid, 'facial-nerve-mastoid');
  nervesGroup.add(cn7Mastoid);

  // Chorda Tympani
  const chordaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.58, -0.25, -0.54),
    new THREE.Vector3(0.18, 0.06, -0.25),
    new THREE.Vector3(-0.18, 0.22, 0.02),
    new THREE.Vector3(0.05, 0.05, 0.42),
  ]);
  const chordaMesh = new THREE.Mesh(
    trackGeo(new THREE.TubeGeometry(chordaCurve, 24, 0.022, 8, false)),
    nerveMat
  );
  registerInteractable(chordaMesh, 'chorda-tympani');
  nervesGroup.add(chordaMesh);

  // CN VIII
  const cn8Curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(2.95, 0.02, -0.06),
    new THREE.Vector3(2.15, 0.04, -0.02),
    new THREE.Vector3(1.55, 0.06, 0.05),
  ]);
  const cn8Mesh = new THREE.Mesh(
    trackGeo(new THREE.TubeGeometry(cn8Curve, 24, 0.09, 10, false)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.36 }))
  );
  registerInteractable(cn8Mesh, 'cn-viii');
  nervesGroup.add(cn8Mesh);

  // Internal Carotid Artery (anterior wall)
  const icaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.75, -1.45, 0.72),
    new THREE.Vector3(0.88, -0.62, 0.68),
    new THREE.Vector3(1.45, -0.35, 0.92),
  ]);
  const icaMesh = new THREE.Mesh(
    trackGeo(new THREE.TubeGeometry(icaCurve, 24, 0.16, 12, false)),
    arteryMat
  );
  registerInteractable(icaMesh, 'internal-carotid-artery');
  nervesGroup.add(icaMesh);

  // Superior Jugular Bulb (hypotympanic floor)
  const jbMesh = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.36, 18, 16)), veinMat);
  jbMesh.scale.set(0.95, 1.25, 0.95);
  jbMesh.position.set(0.38, -1.08, -0.18);
  registerInteractable(jbMesh, 'internal-jugular-bulb');
  nervesGroup.add(jbMesh);

  // 8. OTOSCOPE SPECULUM (appears in Otoscope view preset)
  const otoscopeSpeculum = new THREE.Group();
  const speculumCone = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.24, 0.42, 1.4, 24, 1, true)),
    metalSpeculumMat
  );
  speculumCone.rotation.z = -Math.PI / 2;
  speculumCone.position.set(-2.55, 0.02, 0.05);
  const speculumHandleRing = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.43, 0.045, 10, 24)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.6 }))
  );
  speculumHandleRing.rotation.y = Math.PI / 2;
  speculumHandleRing.position.set(-3.25, 0.02, 0.05);
  otoscopeSpeculum.add(speculumCone, speculumHandleRing);
  otoscopeSpeculum.visible = false;
  root.add(otoscopeSpeculum);

  // 9. SOUND WAVE RINGS (animated when sound-wave transmission mode active)
  const soundWavesGroup = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const ring = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.26, 0.018, 8, 24)),
      trackMat(
        new THREE.MeshBasicMaterial({
          color: 0x0284c7,
          transparent: true,
          opacity: 0.75,
        })
      )
    );
    ring.rotation.y = Math.PI / 2;
    ring.position.set(-3.1 + i * 0.6, 0.02, 0.06);
    ring.userData.phase = i * 0.25;
    soundWavesGroup.add(ring);
  }
  soundWavesGroup.visible = false;
  root.add(soundWavesGroup);

  // Contact shadow disc under model for crisp studio grounding
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  const sctx = shadowCanvas.getContext('2d')!;
  const sgrad = sctx.createRadialGradient(64, 64, 8, 64, 64, 62);
  sgrad.addColorStop(0, 'rgba(15, 23, 42, 0.34)');
  sgrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
  sctx.fillStyle = sgrad;
  sctx.fillRect(0, 0, 128, 128);
  const shadowTex = new THREE.CanvasTexture(shadowCanvas);
  textures.push(shadowTex);
  const shadowPlane = new THREE.Mesh(
    trackGeo(new THREE.PlaneGeometry(8.5, 5.2)),
    trackMat(
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
      })
    )
  );
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.set(-0.4, -1.68, 0);
  root.add(shadowPlane);

  const handles: EarModelHandles = {
    root,
    layers,
    baseOffsets,
    explodeOffsets,
    interactables,
    tmMesh,
    tmCanvas,
    tmCtx,
    tmTexture,
    effusionMesh,
    cholesteatomaMesh,
    retroMassMesh,
    grommetMesh,
    canalPathologyGroup,
    otoscopeSpeculum,
    soundWavesGroup,
    ossiclesGroup,
    dispose: () => {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
    },
  };

  return handles;
}

export function applyPathologyTo3DModel(model: EarModelHandles, spec: OtoscopeVisualSpec) {
  drawTympanicMembraneCanvas(model.tmCtx, model.tmCanvas.width, spec);
  model.tmTexture.needsUpdate = true;

  // TM retraction / bulging displacement along local X
  if (spec.bulging) {
    model.tmMesh.scale.set(1.0, 1.0, 1.0);
    model.tmMesh.position.x = -0.62;
  } else if (spec.retraction !== 'none') {
    model.tmMesh.position.x = -0.46;
  } else {
    model.tmMesh.position.x = -0.55;
  }

  // Middle ear effusion block
  if (spec.effusionColor && (spec.effusionLevel ?? 0) > 0) {
    model.effusionMesh.visible = true;
    (model.effusionMesh.material as THREE.MeshStandardMaterial).color.set(spec.effusionColor);
    const lvl = spec.effusionLevel ?? 0.6;
    model.effusionMesh.scale.y = lvl;
    model.effusionMesh.position.y = -0.45 + (lvl - 0.5) * 0.4;
  } else {
    model.effusionMesh.visible = false;
  }

  // Cholesteatoma mass
  if (spec.cholesteatomaDebris && spec.cholesteatomaDebris !== 'none') {
    model.cholesteatomaMesh.visible = true;
    if (spec.cholesteatomaDebris === 'congenital_as_pearl') {
      model.cholesteatomaMesh.position.set(-0.28, 0.16, 0.34);
      model.cholesteatomaMesh.scale.setScalar(0.75);
    } else {
      model.cholesteatomaMesh.position.set(-0.28, 0.58, 0.02);
      model.cholesteatomaMesh.scale.setScalar(1.0);
    }
  } else {
    model.cholesteatomaMesh.visible = false;
  }

  // Retrotympanic mass
  if (spec.retrotympanicMass && spec.retrotympanicMass !== 'none') {
    model.retroMassMesh.visible = true;
    const mat = model.retroMassMesh.material as THREE.MeshStandardMaterial;
    if (spec.retrotympanicMass === 'high_jugular_bulb') {
      mat.color.set(0x1d4ed8);
      model.retroMassMesh.position.set(-0.14, -0.38, -0.22);
    } else {
      mat.color.set(0xb91c1c);
      model.retroMassMesh.position.set(-0.18, -0.32, 0.0);
    }
  } else {
    model.retroMassMesh.visible = false;
  }

  // Grommet
  model.grommetMesh.visible = Boolean(spec.grommet && spec.grommet !== 'none');

  // Canal findings (rebuild small indicator meshes cleanly)
  while (model.canalPathologyGroup.children.length > 0) {
    const child = model.canalPathologyGroup.children[0] as THREE.Mesh;
    model.canalPathologyGroup.remove(child);
    child.geometry?.dispose();
    (child.material as THREE.Material)?.dispose();
  }

  const cf = spec.canalFinding;
  if (cf === 'cerumen') {
    const wax = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.28, 1),
      new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.85 })
    );
    wax.position.set(-2.05, -0.02, 0.1);
    model.canalPathologyGroup.add(wax);
  } else if (cf === 'foreign_body') {
    const bead = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.2 })
    );
    bead.position.set(-1.32, 0.0, 0.05);
    model.canalPathologyGroup.add(bead);
  } else if (cf === 'furuncle') {
    const boil = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 14, 12),
      new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 })
    );
    boil.position.set(-2.68, -0.24, 0.18);
    model.canalPathologyGroup.add(boil);
  } else if (cf === 'otomycosis_black') {
    const mat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
    const fuzz = new THREE.Mesh(new THREE.DodecahedronGeometry(0.24, 1), mat);
    fuzz.position.set(-1.62, -0.14, 0.08);
    model.canalPathologyGroup.add(fuzz);
  } else if (cf === 'exostoses') {
    const exoMat = new THREE.MeshStandardMaterial({ color: 0xf1e5d1, roughness: 0.45 });
    const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 12), exoMat);
    e1.position.set(-1.12, -0.22, 0.18);
    const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 12), exoMat);
    e2.position.set(-1.05, 0.18, -0.18);
    model.canalPathologyGroup.add(e1, e2);
  } else if (cf === 'keratosis_obturans') {
    const plug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 0.45, 16),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.65 })
    );
    plug.rotation.z = Math.PI / 2;
    plug.position.set(-1.45, 0.0, 0.04);
    model.canalPathologyGroup.add(plug);
  }
}
