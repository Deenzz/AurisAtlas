import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Layers,
  Tag,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { ANATOMY_STRUCTURES, LAYER_LABELS } from '../data/anatomyData';
import { NORMAL_OTOSCOPE_SPEC } from '../data/diseasesData';
import { applyPathologyTo3DModel, buildEarModel, EarModelHandles } from '../three/buildEarModel';
import {
  AnatomicalStructure,
  LayerKey,
  LayerVisibility,
  OtoscopeVisualSpec,
  ViewCameraPreset,
} from '../types/ear';

interface EarScene3DProps {
  darkMode: boolean;
  layerVisibility: LayerVisibility;
  onToggleLayer: (layer: LayerKey) => void;
  explodeAmount: number;
  onExplodeChange: (val: number) => void;
  cameraPreset: ViewCameraPreset;
  onCameraPresetChange: (preset: ViewCameraPreset) => void;
  selectedStructureId: string | null;
  onSelectStructure: (id: string) => void;
  activeOtoscopeSpec?: OtoscopeVisualSpec;
  activeDiseaseName?: string;
}

const CAMERA_PRESETS: Record<
  ViewCameraPreset,
  { label: string; pos: [number, number, number]; target: [number, number, number] }
> = {
  [ViewCameraPreset.OVERVIEW]: {
    label: 'Full Ear',
    pos: [-0.85, 1.35, 7.45],
    target: [-0.35, 0.0, 0.0],
  },
  [ViewCameraPreset.OTOSCOPE]: {
    label: 'Otoscope',
    pos: [-4.15, 0.14, 1.1],
    target: [-0.55, 0.0, 0.0],
  },
  [ViewCameraPreset.MIDDLE_EAR]: {
    label: 'Middle Ear',
    pos: [0.15, 0.75, 3.1],
    target: [0.05, 0.1, -0.05],
  },
  [ViewCameraPreset.INNER_EAR]: {
    label: 'Inner Ear',
    pos: [1.35, 0.95, 3.35],
    target: [1.3, 0.15, -0.15],
  },
  [ViewCameraPreset.NERVES]: {
    label: 'Nerves & Vessels',
    pos: [0.95, -0.25, 3.85],
    target: [0.95, -0.15, -0.15],
  },
};

const _scratchPos = new THREE.Vector3();
const _targetCameraPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();

export const EarScene3D: React.FC<EarScene3DProps> = ({
  darkMode,
  layerVisibility,
  onToggleLayer,
  explodeAmount,
  onExplodeChange,
  cameraPreset,
  onCameraPresetChange,
  selectedStructureId,
  onSelectStructure,
  activeOtoscopeSpec,
  activeDiseaseName,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const pinContainerRef = useRef<HTMLDivElement | null>(null);

  const [dockOpen, setDockOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [soundWaveActive, setSoundWaveActive] = useState(false);
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [contextLost, setContextLost] = useState(false);

  // Mutable refs so state updates never tear down WebGL
  const onSelectRef = useRef(onSelectStructure);
  onSelectRef.current = onSelectStructure;
  const selectedStructureIdRef = useRef(selectedStructureId);
  selectedStructureIdRef.current = selectedStructureId;
  const explodeTargetRef = useRef(explodeAmount);
  explodeTargetRef.current = explodeAmount;
  const soundWaveRef = useRef(soundWaveActive);
  soundWaveRef.current = soundWaveActive;
  const showAnnotationsRef = useRef(showAnnotations);
  showAnnotationsRef.current = showAnnotations;
  const layerVisibilityRef = useRef(layerVisibility);
  layerVisibilityRef.current = layerVisibility;

  const sceneRefs = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    model: EarModelHandles;
    requestRender: () => void;
    cameraAnimating: boolean;
    targetCamPos: THREE.Vector3;
    targetLook: THREE.Vector3;
    explodeCurrent: number;
    setThemeBackground: (dark: boolean) => void;
    updatePinPositions: () => void;
  } | null>(null);

  const visiblePinStructures = useMemo<AnatomicalStructure[]>(() => {
    return ANATOMY_STRUCTURES.filter((s) => layerVisibility[s.layer]);
  }, [layerVisibility]);
  const visiblePinsRef = useRef(visiblePinStructures);
  visiblePinsRef.current = visiblePinStructures;

  // Keyboard shortcut 'H' to toggle bottom control dock
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === 'h' &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        setDockOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Initialize Three.js WebGL scene once
  useEffect(() => {
    const container = containerRef.current;
    const mount = canvasMountRef.current;
    if (!container || !mount) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 320);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const setThemeBackground = (dark: boolean) => {
      const col = dark ? 0x0b1120 : 0xf1f5f9;
      scene.background = new THREE.Color(col);
      scene.fog = new THREE.Fog(col, 10, 22);
    };
    setThemeBackground(darkMode);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 60);
    const initPreset = CAMERA_PRESETS[cameraPreset];
    camera.position.set(...initPreset.pos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...initPreset.target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 1.4;
    controls.maxDistance = 13;
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.update();

    // Three-point warm/cool clinical studio lighting
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x334155, 0.65);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff5eb, 1.45);
    keyLight.position.set(-3.5, 5.5, 4.5);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.left = -5;
      keyLight.shadow.camera.right = 5;
      keyLight.shadow.camera.top = 4;
      keyLight.shadow.camera.bottom = -4;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x7dd3fc, 0.7);
    rimLight.position.set(4.5, 2.0, -4.5);
    scene.add(rimLight);

    // Build Ear Model
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const model = buildEarModel(maxAniso);
    applyPathologyTo3DModel(model, activeOtoscopeSpec ?? NORMAL_OTOSCOPE_SPEC);
    scene.add(model.root);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Update 2D projected annotation pins with collision de-confliction so labels never pile up
    const updatePinPositions = () => {
      const pinRoot = pinContainerRef.current;
      if (!pinRoot || !showAnnotationsRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const buttons = Array.from(
        pinRoot.querySelectorAll<HTMLButtonElement>('[data-structure-id]')
      );

      // Prioritize currently selected structure first so it always remains visible
      const activeId = selectedStructureIdRef.current;
      buttons.sort((a, b) => {
        if (a.dataset.structureId === activeId) return -1;
        if (b.dataset.structureId === activeId) return 1;
        return 0;
      });

      const placed: { x: number; y: number }[] = [];
      for (const btn of buttons) {
        const sid = btn.dataset.structureId;
        const struct = visiblePinsRef.current.find((s) => s.id === sid);
        if (!struct) {
          btn.style.display = 'none';
          continue;
        }
        const layerGroup = model.layers[struct.layer];
        _scratchPos.set(...struct.anchor);
        _scratchPos.add(layerGroup.position);
        _scratchPos.project(camera);
        if (_scratchPos.z > 1 || _scratchPos.z < -1) {
          btn.style.display = 'none';
          continue;
        }
        const sx = ((_scratchPos.x + 1) / 2) * w;
        const sy = ((-_scratchPos.y + 1) / 2) * h;
        if (sx < 60 || sx > w - 60 || sy < 48 || sy > h - 125) {
          btn.style.display = 'none';
          continue;
        }

        const collides = placed.some(
          (p) => Math.abs(p.x - sx) < 128 && Math.abs(p.y - sy) < 30
        );
        if (collides && placed.length > 0) {
          btn.style.display = 'none';
          continue;
        }

        placed.push({ x: sx, y: sy });
        btn.style.display = 'inline-flex';
        btn.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) translate(-50%, -50%)`;
      }
    };

    // Render loop & software-WebGL pacing
    let frameId = 0;
    let disposed = false;
    let renderBusy = false;
    let renderDirty = false;
    let lastTime = performance.now();
    let explodeCurrent = explodeTargetRef.current;
    let cameraAnimating = false;
    const targetCamPos = new THREE.Vector3(...initPreset.pos);
    const targetLook = new THREE.Vector3(...initPreset.target);

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync?.(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      gl.flush();
      const poll = () => {
        if (disposed) {
          gl.deleteSync(sync);
          return;
        }
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const advanceTransitions = (dt: number, elapsedSec: number): boolean => {
      let needsMoreFrames = false;

      // Exploded layer smooth damping
      const expTarget = explodeTargetRef.current;
      if (Math.abs(explodeCurrent - expTarget) > 0.002) {
        explodeCurrent = THREE.MathUtils.damp(explodeCurrent, expTarget, 9, dt);
        needsMoreFrames = true;
      } else {
        explodeCurrent = expTarget;
      }
      (Object.keys(model.layers) as LayerKey[]).forEach((k) => {
        const g = model.layers[k];
        g.visible = layerVisibilityRef.current[k];
        g.position.copy(model.baseOffsets[k]).addScaledVector(model.explodeOffsets[k], explodeCurrent);
      });

      // Camera preset damping
      if (cameraAnimating) {
        const alpha = 1 - Math.exp(-8 * dt);
        camera.position.lerp(targetCamPos, alpha);
        controls.target.lerp(targetLook, alpha);
        if (
          camera.position.distanceTo(targetCamPos) < 0.015 &&
          controls.target.distanceTo(targetLook) < 0.015
        ) {
          camera.position.copy(targetCamPos);
          controls.target.copy(targetLook);
          cameraAnimating = false;
          if (sceneRefs.current) sceneRefs.current.cameraAnimating = false;
        } else {
          needsMoreFrames = true;
        }
      }

      // Sound-wave oscillation
      if (soundWaveRef.current) {
        model.soundWavesGroup.visible = true;
        model.soundWavesGroup.children.forEach((c) => {
          const phase = ((elapsedSec * 1.4 + (c.userData.phase as number)) % 1);
          c.position.x = -3.3 + phase * 2.7;
          const scale = 1 - phase * 0.28;
          c.scale.setScalar(scale);
          ((c as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = (1 - phase) * 0.85;
        });
        const vib = Math.sin(elapsedSec * 22) * 0.025;
        model.ossiclesGroup.rotation.z = vib;
        model.tmMesh.scale.setScalar(1 + vib * 0.35);
        needsMoreFrames = true;
      } else {
        model.soundWavesGroup.visible = false;
        model.ossiclesGroup.rotation.z = 0;
        model.tmMesh.scale.setScalar(1);
      }

      controls.update();
      updatePinPositions();
      return needsMoreFrames;
    };

    const requestRender = () => {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame((now) => {
        if (disposed) return;
        renderDirty = false;
        const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
        lastTime = now;

        if (sceneRefs.current) {
          cameraAnimating = sceneRefs.current.cameraAnimating;
          targetCamPos.copy(sceneRefs.current.targetCamPos);
          targetLook.copy(sceneRefs.current.targetLook);
        }

        const keepGoing = advanceTransitions(dt, now / 1000);
        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (!disposed && (renderDirty || keepGoing || soundWaveRef.current)) {
            requestRender();
          }
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    };

    sceneRefs.current = {
      renderer,
      scene,
      camera,
      controls,
      model,
      requestRender,
      cameraAnimating: false,
      targetCamPos,
      targetLook,
      explodeCurrent,
      setThemeBackground,
      updatePinPositions,
    };

    const onControlStart = () => {
      if (sceneRefs.current) {
        sceneRefs.current.cameraAnimating = false;
      }
    };
    const onControlChange = () => requestRender();
    controls.addEventListener('start', onControlStart);
    controls.addEventListener('change', onControlChange);

    // Raycasting for hover and structure click
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };
    let lastHoverTime = 0;

    const getStructureHit = (clientX: number, clientY: number): string | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(model.interactables, true);
      for (const hit of hits) {
        let obj: THREE.Object3D | null = hit.object;
        while (obj) {
          if (!obj.visible) break;
          if (obj.userData.structureId) return obj.userData.structureId as string;
          obj = obj.parent;
        }
      }
      return null;
    };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };
    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist > 6) return; // user orbited
      const hitId = getStructureHit(e.clientX, e.clientY);
      if (hitId) {
        onSelectRef.current(hitId);
      }
    };
    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastHoverTime < 65) return;
      lastHoverTime = now;
      const hitId = getStructureHit(e.clientX, e.clientY);
      if (hitId) {
        const s = ANATOMY_STRUCTURES.find((item) => item.id === hitId);
        setHoveredName(s ? s.name : null);
        renderer.domElement.style.cursor = 'pointer';
      } else {
        setHoveredName(null);
        renderer.domElement.style.cursor = 'grab';
      }
    };

    const canvas = renderer.domElement;
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointermove', onPointerMove);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
      requestRender();
    };
    canvas.addEventListener('webglcontextlost', onContextLost);
    canvas.addEventListener('webglcontextrestored', onContextRestored);

    const ro = new ResizeObserver(() => {
      const cw = Math.max(container.clientWidth, 260);
      const ch = Math.max(container.clientHeight, 260);
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
      renderer.setSize(cw, ch);
      requestRender();
    });
    ro.observe(container);

    requestRender();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      ro.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('change', onControlChange);
      controls.dispose();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      model.dispose();
      renderer.dispose();
      sceneRefs.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync theme background without recreating renderer
  useEffect(() => {
    const refs = sceneRefs.current;
    if (!refs) return;
    refs.setThemeBackground(darkMode);
    refs.requestRender();
  }, [darkMode]);

  // Sync layer visibility, selected pin priority, & exploded slider
  useEffect(() => {
    const refs = sceneRefs.current;
    if (!refs) return;
    refs.requestRender();
  }, [layerVisibility, explodeAmount, showAnnotations, soundWaveActive, selectedStructureId]);

  // Sync camera preset
  useEffect(() => {
    const refs = sceneRefs.current;
    if (!refs) return;
    const preset = CAMERA_PRESETS[cameraPreset];
    _targetCameraPos.set(...preset.pos);
    _targetLookAt.set(...preset.target);
    refs.targetCamPos.copy(_targetCameraPos);
    refs.targetLook.copy(_targetLookAt);
    refs.cameraAnimating = true;
    refs.model.otoscopeSpeculum.visible = cameraPreset === ViewCameraPreset.OTOSCOPE;
    refs.requestRender();
  }, [cameraPreset]);

  // Sync active disease pathology onto 3D Tympanic Membrane & Canal
  useEffect(() => {
    const refs = sceneRefs.current;
    if (!refs) return;
    applyPathologyTo3DModel(refs.model, activeOtoscopeSpec ?? NORMAL_OTOSCOPE_SPEC);
    refs.requestRender();
  }, [activeOtoscopeSpec]);

  return (
    <div
      ref={containerRef}
      className="relative h-full min-h-[420px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950"
    >
      {/* Dedicated Empty WebGL Mount */}
      <div ref={canvasMountRef} className="h-full w-full" />

      {contextLost && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/90 p-6 text-center text-white">
          <p className="text-sm font-medium">WebGL rendering paused — restoring 3D ear context…</p>
        </div>
      )}

      {/* Minimal Top-Left Context Label (no backdrop-filter over WebGL!) */}
      <div className="pointer-events-none absolute top-3 left-3 z-10 flex flex-col gap-1">
        <div className="rounded-lg border border-slate-200/90 bg-white/95 px-3 py-1.5 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/95">
          <p className="text-[11px] font-semibold tracking-wide text-sky-700 uppercase dark:text-sky-400">
            {activeDiseaseName ? `Pathology View · ${activeDiseaseName}` : 'Normal Right Ear · 3D Atlas'}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {hoveredName ? `Inspect: ${hoveredName}` : 'Drag to orbit · Scroll to zoom · Click structure'}
          </p>
        </div>
      </div>

      {/* Projected 3D Annotation Pins */}
      {showAnnotations && (
        <div ref={pinContainerRef} className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
          {visiblePinStructures.map((s) => {
            const isSelected = s.id === selectedStructureId;
            return (
              <button
                key={s.id}
                type="button"
                data-structure-id={s.id}
                onClick={() => onSelectStructure(s.id)}
                style={{ display: 'none' }}
                className={`pointer-events-auto absolute top-0 left-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium shadow-sm transition-colors ${
                  isSelected
                    ? 'border-sky-600 bg-sky-600 text-white'
                    : 'border-slate-300 bg-white/95 text-slate-800 hover:border-sky-500 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200 dark:hover:border-sky-400'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isSelected ? 'bg-white' : 'bg-sky-500'
                  }`}
                />
                <span className="max-w-[130px] truncate">{s.name.split(' (')[0]}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Collapsible Bottom Control Dock (Zero Center Occlusion) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex flex-col items-center px-3">
        <button
          type="button"
          onClick={() => setDockOpen((o) => !o)}
          className="pointer-events-auto mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {dockOpen ? (
            <>
              <ChevronDown className="h-3.5 w-3.5" />
              Hide 3D Controls
            </>
          ) : (
            <>
              <ChevronUp className="h-3.5 w-3.5" />
              Show 3D Controls
            </>
          )}
        </button>

        {dockOpen && (
          <div className="atlas-scroll pointer-events-auto max-h-[210px] w-full max-w-[820px] overflow-y-auto rounded-xl border border-slate-200 bg-white/95 p-2.5 shadow-lg md:max-h-none md:overflow-visible dark:border-slate-700/90 dark:bg-slate-900/95">
            {/* Row 1: Camera Presets + Exploded View Slider + Sound / Labels */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
              <div className="flex flex-wrap items-center gap-1">
                {(Object.keys(CAMERA_PRESETS) as ViewCameraPreset[]).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => onCameraPresetChange(preset)}
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                      cameraPreset === preset
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {preset === ViewCameraPreset.OTOSCOPE && <Eye className="h-3.5 w-3.5" />}
                    {CAMERA_PRESETS[preset].label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <span>Explode</span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={explodeAmount}
                    onChange={(e) => onExplodeChange(Number(e.target.value))}
                    className="h-1.5 w-24 accent-sky-600"
                    aria-label="Exploded anatomical layers slider"
                  />
                  <span className="w-8 font-mono text-[11px] tabular-nums">
                    {Math.round(explodeAmount * 100)}%
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => setSoundWaveActive((s) => !s)}
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                    soundWaveActive
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {soundWaveActive ? (
                    <Volume2 className="h-3.5 w-3.5" />
                  ) : (
                    <VolumeX className="h-3.5 w-3.5" />
                  )}
                  Sound Wave
                </button>

                <button
                  type="button"
                  onClick={() => setShowAnnotations((a) => !a)}
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                    showAnnotations
                      ? 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  <Tag className="h-3.5 w-3.5" />
                  Labels
                </button>
              </div>
            </div>

            {/* Row 2: Anatomical Layer Visibility Toggles */}
            <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-200 pt-2 dark:border-slate-800">
              <span className="mr-1 inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 uppercase dark:text-slate-400">
                <Layers className="h-3 w-3" />
                Layers
              </span>
              {(Object.keys(LAYER_LABELS) as LayerKey[]).map((lk) => {
                const active = layerVisibility[lk];
                return (
                  <button
                    key={lk}
                    type="button"
                    onClick={() => onToggleLayer(lk)}
                    className={`rounded-md border px-2 py-1 text-[11px] font-medium transition-colors ${
                      active
                        ? 'border-sky-500/40 bg-sky-50 text-sky-800 dark:border-sky-500/30 dark:bg-sky-950/60 dark:text-sky-200'
                        : 'border-slate-200 bg-transparent text-slate-400 line-through dark:border-slate-800 dark:text-slate-600'
                    }`}
                  >
                    {LAYER_LABELS[lk]}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
