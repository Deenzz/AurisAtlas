import React, { useState } from 'react';
import { Eye, Layers, Wind, ZoomIn, ZoomOut } from 'lucide-react';
import { OtoscopeVisualSpec } from '../types/ear';

interface OtoscopeVisualizerProps {
  title: string;
  spec: OtoscopeVisualSpec;
  onSelectLandmark?: (structureId: string) => void;
}

export const OtoscopeVisualizer: React.FC<OtoscopeVisualizerProps> = ({
  title,
  spec,
  onSelectLandmark,
}) => {
  const [mode, setMode] = useState<'otoscope' | 'cross_section'>('otoscope');
  const [showQuadrants, setShowQuadrants] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [insufflating, setInsufflating] = useState(false);
  const [activeCallout, setActiveCallout] = useState<string | null>(null);

  const handleInsufflate = () => {
    setInsufflating(true);
    window.setTimeout(() => setInsufflating(false), 900);
  };

  const mobilityScale =
    !insufflating
      ? 1
      : spec.mobility === 'immobile'
        ? 1
        : spec.mobility === 'sluggish'
          ? 0.985
          : spec.mobility === 'hypermobile'
            ? 0.92
            : 0.96;

  const mobilityLabel =
    spec.mobility === 'brisk'
      ? 'Brisk normal excursion'
      : spec.mobility === 'sluggish'
        ? 'Sluggish / damped excursion'
        : spec.mobility === 'hypermobile'
          ? 'Hypermobile flaccid excursion'
          : 'Immobile (effusion / perforation / fixed)';

  return (
    <div className="flex flex-col gap-3">
      {/* Mode & Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5 dark:border-slate-800">
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setMode('otoscope')}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
              mode === 'otoscope'
                ? 'bg-white text-sky-700 shadow-xs dark:bg-slate-900 dark:text-sky-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Otoscope View
          </button>
          <button
            type="button"
            onClick={() => setMode('cross_section')}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
              mode === 'cross_section'
                ? 'bg-white text-sky-700 shadow-xs dark:bg-slate-900 dark:text-sky-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Layer Diagram
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {mode === 'otoscope' && (
            <>
              <button
                type="button"
                onClick={() => setShowQuadrants((v) => !v)}
                className={`rounded-md border px-2 py-1 text-xs font-medium transition-colors ${
                  showQuadrants
                    ? 'border-sky-500/40 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-950/50 dark:text-sky-300'
                    : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400'
                }`}
              >
                Quadrants
              </button>
              <button
                type="button"
                onClick={handleInsufflate}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                title="Simulate pneumatic otoscopy bulb squeeze"
              >
                <Wind className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                Pneumatic
              </button>
            </>
          )}
          <div className="flex items-center rounded-md border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(1, Number((z - 0.25).toFixed(2))))}
              aria-label="Zoom out diagram"
              className="p-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px] tabular-nums text-slate-600 dark:text-slate-300">
              {zoom.toFixed(1)}x
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(2.25, Number((z + 0.25).toFixed(2))))}
              aria-label="Zoom in diagram"
              className="p-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Visual Stage */}
      {mode === 'otoscope' ? (
        <div className="relative flex flex-col items-center">
          <div className="relative aspect-square w-full max-w-[290px] overflow-hidden rounded-full border-4 border-slate-800 bg-slate-950 shadow-inner dark:border-slate-700">
            <svg
              viewBox="-115 -115 230 230"
              className="h-full w-full transition-transform duration-300"
              style={{ transform: `scale(${zoom})` }}
              role="img"
              aria-label={`Right ear otoscopic view: ${title}`}
            >
              <defs>
                <radialGradient id="canalTunnel" cx="50%" cy="50%" r="55%">
                  <stop offset="55%" stopColor="#854d3d" />
                  <stop offset="88%" stopColor="#3b1f18" />
                  <stop offset="100%" stopColor="#090d16" />
                </radialGradient>
                <radialGradient id="drumGrad" cx="48%" cy="46%" r="54%">
                  <stop offset="0%" stopColor={spec.drumBaseColor} />
                  <stop offset="82%" stopColor={spec.drumBaseColor} />
                  <stop offset="100%" stopColor={spec.drumEdgeColor} />
                </radialGradient>
                <clipPath id="drumClip">
                  <ellipse cx="0" cy="4" rx="68" ry="74" />
                </clipPath>
              </defs>

              {/* Speculum Canal Shadow */}
              <circle cx="0" cy="0" r="114" fill="url(#canalTunnel)" />

              {/* Tympanic Membrane Base Group with Pneumatic Motion */}
              <g
                style={{
                  transform: `scale(${mobilityScale})`,
                  transformOrigin: 'center',
                  transition: 'transform 280ms ease-in-out',
                }}
              >
                {/* Annulus Ring */}
                <ellipse
                  cx="0"
                  cy="4"
                  rx="73"
                  ry="79"
                  fill="none"
                  stroke={spec.drumEdgeColor}
                  strokeWidth="6"
                  opacity="0.85"
                />

                {/* Pars Tensa */}
                <ellipse
                  cx="0"
                  cy="4"
                  rx="68"
                  ry="74"
                  fill="url(#drumGrad)"
                  opacity={Math.max(0.65, 1 - spec.translucency * 0.25)}
                />

                {/* Middle Ear Silhouettes through Translucent TM */}
                {spec.translucency > 0.4 && (
                  <g clipPath="url(#drumClip)" opacity={spec.translucency * 0.55}>
                    {/* Long process of incus (PS) */}
                    <path
                      d="M -28,-38 L -24,0 L -15,6"
                      stroke="#f8fafc"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                    {/* Promontory glow (central-inferior) */}
                    <ellipse cx="-14" cy="18" rx="22" ry="18" fill="#fca5a5" opacity="0.35" />
                    {/* Round window shadow (PI) */}
                    <circle cx="-32" cy="36" r="8" fill="#334155" opacity="0.45" />
                  </g>
                )}

                {/* Retrotympanic Masses */}
                {spec.retrotympanicMass === 'glomus_rising_sun' && (
                  <g clipPath="url(#drumClip)">
                    <path
                      d="M -68,78 C -48,18 48,18 68,78 Z"
                      fill={insufflating ? '#f87171' : '#991b1b'}
                      opacity="0.9"
                    />
                  </g>
                )}
                {spec.retrotympanicMass === 'high_jugular_bulb' && (
                  <g clipPath="url(#drumClip)">
                    <ellipse cx="-26" cy="44" rx="28" ry="26" fill="#1e40af" opacity="0.85" />
                  </g>
                )}

                {/* Effusion Fluid & Meniscus / Bubbles */}
                {spec.effusionColor && (spec.effusionLevel ?? 0) > 0 && (
                  <g clipPath="url(#drumClip)">
                    <rect
                      x="-70"
                      y={78 - 148 * (spec.effusionLevel ?? 0.6)}
                      width="140"
                      height="150"
                      fill={spec.effusionColor}
                      opacity="0.58"
                    />
                    {(spec.effusionLevel ?? 0) < 0.92 && (
                      <path
                        d={`M -68,${78 - 148 * (spec.effusionLevel ?? 0.6)} Q 0,${
                          86 - 148 * (spec.effusionLevel ?? 0.6)
                        } 68,${78 - 148 * (spec.effusionLevel ?? 0.6)}`}
                        stroke="#fef3c7"
                        strokeWidth="2.5"
                        fill="none"
                      />
                    )}
                    {spec.airBubbles && (
                      <g stroke="#fffbeb" strokeWidth="1.5" fill="rgba(255,255,255,0.2)">
                        <circle cx="22" cy="24" r="6" />
                        <circle cx="-18" cy="34" r="5" />
                        <circle cx="34" cy="10" r="4" />
                        <circle cx="4" cy="46" r="4.5" />
                      </g>
                    )}
                  </g>
                )}

                {/* Tympanosclerosis Chalk Plaques */}
                {spec.tympanosclerosisPlaques && (
                  <g clipPath="url(#drumClip)" fill="#f8fafc" opacity="0.92">
                    <ellipse cx="32" cy="10" rx="16" ry="26" transform="rotate(14 32 10)" />
                    <ellipse cx="-28" cy="22" rx="11" ry="18" transform="rotate(-15 -28 22)" />
                  </g>
                )}

                {/* Vascular Injection */}
                {(spec.vascularity === 'injected_radial' ||
                  spec.vascularity === 'intense_hyperemia') && (
                  <g
                    clipPath="url(#drumClip)"
                    stroke={spec.vascularity === 'intense_hyperemia' ? '#7f1d1d' : '#dc2626'}
                    strokeWidth={spec.vascularity === 'intense_hyperemia' ? '2.2' : '1.4'}
                    opacity="0.85"
                  >
                    {[-55, -35, -15, 15, 35, 55].map((x, idx) => (
                      <line key={idx} x1={x} y1="-68" x2={x * 0.35} y2="-10" />
                    ))}
                    {[-50, -25, 0, 25, 50].map((x, idx) => (
                      <line key={`b-${idx}`} x1={x} y1="74" x2={x * 0.4} y2="20" />
                    ))}
                  </g>
                )}

                {/* Bullae */}
                {spec.bullae && (
                  <g>
                    <circle cx="24" cy="22" r="18" fill="#7f1d1d" stroke="#fca5a5" strokeWidth="1.5" />
                    <circle cx="19" cy="16" r="5" fill="#fecaca" opacity="0.6" />
                    <circle cx="-24" cy="28" r="13" fill="#991b1b" opacity="0.85" />
                  </g>
                )}

                {/* Perforations */}
                {spec.perforation === 'central_anterior' && (
                  <ellipse
                    cx="26"
                    cy="24"
                    rx="18"
                    ry="24"
                    fill="#7f1d1d"
                    stroke="#f1f5f9"
                    strokeWidth="2"
                  />
                )}
                {spec.perforation === 'central_posterior' && (
                  <ellipse
                    cx="-26"
                    cy="22"
                    rx="16"
                    ry="22"
                    fill="#7f1d1d"
                    stroke="#f1f5f9"
                    strokeWidth="2"
                  />
                )}
                {spec.perforation === 'subtotal' && (
                  <circle cx="0" cy="10" r="48" fill="#7f1d1d" stroke="#f1f5f9" strokeWidth="2" />
                )}
                {spec.perforation === 'attic_scutum' && (
                  <path
                    d="M -26,-56 Q 0,-82 26,-56 Q 12,-42 -12,-42 Z"
                    fill="#1e293b"
                    stroke="#f8fafc"
                    strokeWidth="2"
                  />
                )}
                {spec.perforation === 'traumatic_slit' && (
                  <ellipse
                    cx="-22"
                    cy="24"
                    rx="6"
                    ry="23"
                    transform="rotate(22 -22 24)"
                    fill="#450a0a"
                    stroke="#ef4444"
                    strokeWidth="2.5"
                  />
                )}

                {/* Cholesteatoma Debris */}
                {spec.cholesteatomaDebris === 'attic_pearly' && (
                  <g>
                    <ellipse cx="-2" cy="-58" rx="22" ry="13" fill="#f8fafc" />
                    <ellipse cx="-8" cy="-58" rx="10" ry="7" fill="#e2e8f0" />
                  </g>
                )}
                {spec.cholesteatomaDebris === 'congenital_as_pearl' && (
                  <circle
                    cx="30"
                    cy="-22"
                    r="16"
                    fill="#f8fafc"
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                  />
                )}

                {/* Granulations */}
                {spec.granulation && (
                  <g fill="#dc2626" opacity="0.9">
                    <circle cx="-18" cy="36" r="8" />
                    <circle cx="-8" cy="42" r="7" />
                    <circle cx="-26" cy="44" r="6" />
                  </g>
                )}

                {/* Grommet Ventilation Tube (AI) */}
                {spec.grommet && spec.grommet !== 'none' && (
                  <g transform="translate(32, 32)">
                    <circle r="11" fill="#0284c7" stroke="#e0f2fe" strokeWidth="2" />
                    <circle r="4.5" fill="#0f172a" />
                  </g>
                )}

                {/* Malleus Lateral Process & Handle */}
                <path
                  d={
                    spec.retraction !== 'none'
                      ? 'M -8,-32 L 2,-2'
                      : 'M -8,-38 L 0,2'
                  }
                  stroke={spec.vascularity === 'intense_hyperemia' ? '#fecaca' : '#f8fafc'}
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <circle
                  cx="-8"
                  cy={spec.retraction !== 'none' ? -32 : -38}
                  r="4.5"
                  fill="#ffffff"
                />

                {/* Cone of Light (5 o'clock right ear) */}
                {spec.coneOfLight !== 'absent' && (
                  <polygon
                    points="0,3 25,58 55,40"
                    fill="#fefce8"
                    opacity={spec.coneOfLight === 'normal' ? 0.6 : 0.25}
                  />
                )}
              </g>

              {/* Canal Findings (overlay on tunnel periphery) */}
              {spec.canalFinding === 'cerumen' && (
                <path
                  d="M -78,-30 C -40,-45 30,-20 55,35 C 35,88 -55,95 -88,45 Z"
                  fill="#78350f"
                  opacity="0.94"
                />
              )}
              {spec.canalFinding === 'foreign_body' && (
                <circle cx="18" cy="14" r="32" fill="#0284c7" stroke="#bae6fd" strokeWidth="2" />
              )}
              {spec.canalFinding === 'furuncle' && (
                <path d="M -108,-15 Q -35,0 -55,88 L -110,88 Z" fill="#b91c1c" />
              )}
              {spec.canalFinding === 'diffuse_edema' && (
                <circle
                  cx="0"
                  cy="0"
                  r="95"
                  fill="none"
                  stroke="#b91c1c"
                  strokeWidth="36"
                  opacity="0.72"
                />
              )}
              {spec.canalFinding === 'otomycosis_black' && (
                <g>
                  <path
                    d="M -75,15 Q -15,5 45,55 Q -25,95 -85,65 Z"
                    fill="#cbd5e1"
                    opacity="0.88"
                  />
                  {[
                    [-48, 35],
                    [-24, 26],
                    [-8, 45],
                    [15, 52],
                    [-36, 56],
                    [-62, 48],
                  ].map(([sx, sy], i) => (
                    <circle key={i} cx={sx} cy={sy} r="3.5" fill="#0f172a" />
                  ))}
                </g>
              )}
              {spec.canalFinding === 'exostoses' && (
                <g fill="#f1e5d1" opacity="0.96">
                  <path d="M -112,-28 Q -42,-5 -112,26 Z" />
                  <path d="M 112,-22 Q 48,4 112,32 Z" />
                </g>
              )}
              {spec.canalFinding === 'keratosis_obturans' && (
                <circle cx="-4" cy="10" r="64" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="4" />
              )}
              {spec.canalFinding === 'vesicles_ramsay_hunt' && (
                <g fill="#fde047" stroke="#dc2626" strokeWidth="2">
                  <circle cx="-68" cy="36" r="8" />
                  <circle cx="-54" cy="48" r="7" />
                  <circle cx="-74" cy="52" r="6" />
                </g>
              )}

              {/* Optional 4-Quadrant Overlay */}
              {showQuadrants && (
                <g stroke="rgba(255,255,255,0.42)" strokeWidth="1" strokeDasharray="3 3">
                  <line x1="-10" y1="-80" x2="10" y2="85" />
                  <line x1="-80" y1="2" x2="80" y2="2" />
                  <text x="40" y="-44" fill="#e2e8f0" fontSize="9" fontWeight="600" stroke="none">
                    AS
                  </text>
                  <text x="40" y="54" fill="#e2e8f0" fontSize="9" fontWeight="600" stroke="none">
                    AI
                  </text>
                  <text x="-56" y="-44" fill="#e2e8f0" fontSize="9" fontWeight="600" stroke="none">
                    PS
                  </text>
                  <text x="-56" y="54" fill="#e2e8f0" fontSize="9" fontWeight="600" stroke="none">
                    PI
                  </text>
                </g>
              )}

              {/* Interactive Callout Pins inside Otoscope Circle */}
              {spec.calloutMarkers.map((m) => (
                <g
                  key={m.label}
                  className="cursor-pointer"
                  onClick={() => setActiveCallout((prev) => (prev === m.label ? null : m.label))}
                >
                  <circle
                    cx={m.x * 78}
                    cy={m.y * 78}
                    r="6"
                    fill={activeCallout === m.label ? '#0ea5e9' : 'rgba(15,23,42,0.75)'}
                    stroke="#ffffff"
                    strokeWidth="1.6"
                  />
                  <circle cx={m.x * 78} cy={m.y * 78} r="2" fill="#ffffff" />
                </g>
              ))}
            </svg>
          </div>

          <div className="mt-2 flex w-full items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Right Ear Orientation</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">{mobilityLabel}</span>
          </div>

          {activeCallout && (
            <div className="mt-2 w-full rounded-lg border border-sky-200 bg-sky-50/70 px-3 py-2 text-xs dark:border-sky-800 dark:bg-sky-950/40">
              <p className="font-semibold text-sky-900 dark:text-sky-200">{activeCallout}</p>
              <p className="mt-0.5 text-sky-800 dark:text-sky-300">
                {spec.calloutMarkers.find((c) => c.label === activeCallout)?.detail}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Annotated Cross-Section Layer Diagram */
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-900">
          <svg
            viewBox="0 0 420 210"
            className="h-auto w-full transition-transform duration-300"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
            role="img"
            aria-label="Annotated outer, middle, and inner ear cross-section"
          >
            {/* Anatomical Zones */}
            <rect x="10" y="14" width="122" height="176" rx="8" fill="rgba(245, 158, 11, 0.08)" />
            <rect x="136" y="14" width="120" height="176" rx="8" fill="rgba(14, 165, 233, 0.08)" />
            <rect x="260" y="14" width="150" height="176" rx="8" fill="rgba(16, 185, 129, 0.08)" />

            <text x="71" y="30" textAnchor="middle" fontSize="9" fontWeight="700" fill="#b45309">
              OUTER EAR (24 mm)
            </text>
            <text x="196" y="30" textAnchor="middle" fontSize="9" fontWeight="700" fill="#0369a1">
              MIDDLE EAR CLEFT
            </text>
            <text x="335" y="30" textAnchor="middle" fontSize="9" fontWeight="700" fill="#047857">
              INNER EAR & NERVES
            </text>

            {/* Pinna & EAC */}
            <path
              d="M 24,52 Q 10,85 22,128 Q 34,148 44,128 L 44,104 L 136,96 L 136,74 L 44,68 Z"
              fill="#e6b89c"
              stroke="#b45309"
              strokeWidth="1.5"
              className="cursor-pointer"
              onClick={() => onSelectLandmark?.('eac-cartilaginous')}
            />
            <rect
              x="44"
              y="72"
              width="92"
              height="24"
              fill="#fde68a"
              opacity="0.45"
              className="cursor-pointer"
              onClick={() => onSelectLandmark?.('eac-bony')}
            />

            {/* Tympanic Membrane */}
            <line
              x1="138"
              y1="62"
              x2="148"
              y2="108"
              stroke="#0284c7"
              strokeWidth="4"
              className="cursor-pointer"
              onClick={() => onSelectLandmark?.('tympanic-membrane')}
            />

            {/* Ossicles */}
            <path
              d="M 143,82 L 154,58 L 180,62 L 184,84 L 222,82"
              fill="none"
              stroke="#475569"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="cursor-pointer"
              onClick={() => onSelectLandmark?.('incus')}
            />

            {/* Eustachian Tube */}
            <path
              d="M 176,120 L 236,178"
              stroke="#e11d48"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.55"
              className="cursor-pointer"
              onClick={() => onSelectLandmark?.('eustachian-tube')}
            />

            {/* Semicircular Canals & Cochlea */}
            <g
              className="cursor-pointer"
              onClick={() => onSelectLandmark?.('posterior-superior-scc')}
            >
              <circle cx="290" cy="64" r="18" fill="none" stroke="#0d9488" strokeWidth="4" />
              <circle cx="278" cy="72" r="12" fill="none" stroke="#0d9488" strokeWidth="3.5" />
            </g>
            <path
              d="M 326,95 C 350,74 378,94 366,118 C 354,136 332,126 338,108 C 344,96 356,100 352,110"
              fill="none"
              stroke="#0d9488"
              strokeWidth="6"
              strokeLinecap="round"
              className="cursor-pointer"
              onClick={() => onSelectLandmark?.('cochlea')}
            />

            {/* CN VII & CN VIII */}
            <path
              d="M 398,74 L 310,74 L 245,92 L 245,172"
              fill="none"
              stroke="#eab308"
              strokeWidth="3.5"
              className="cursor-pointer"
              onClick={() => onSelectLandmark?.('facial-nerve-tympanic')}
            />
            <line
              x1="358"
              y1="100"
              x2="404"
              y2="100"
              stroke="#facc15"
              strokeWidth="4.5"
              className="cursor-pointer"
              onClick={() => onSelectLandmark?.('cn-viii')}
            />

            {/* Clickable Callout Labels */}
            <g fontSize="8.5" fill="currentColor" className="text-slate-700 dark:text-slate-300">
              <text x="64" y="114">1/3 Cartilage · 2/3 Bone</text>
              <text x="142" y="52">TM (55°)</text>
              <text x="170" y="52">Malleus · Incus · Stapes</text>
              <text x="160" y="168">Eustachian Tube (45°)</text>
              <text x="275" y="42">SCCs</text>
              <text x="340" y="146">Cochlea (2.75 turns)</text>
              <text x="372" y="68">CN VII</text>
              <text x="372" y="114">CN VIII</text>
            </g>
          </svg>
        </div>
      )}
    </div>
  );
};
