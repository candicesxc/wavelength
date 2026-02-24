import React, { useRef } from 'react';
import { useDial } from '../../hooks/useDial';
import { TargetZone } from './TargetZone';
import { DialNeedle } from './DialNeedle';

interface SpectrumDialProps {
  position: number;
  targetPosition?: number;
  revealed?: boolean;
  isInteractive?: boolean;
  onPositionChange?: (pos: number) => void;
  leftLabel?: string;
  rightLabel?: string;
}

// SVG viewport matches the plan: 400×220, arc center (200,200), radius 180
const CX = 200;
const CY = 200;
const R  = 180;

export const SpectrumDial: React.FC<SpectrumDialProps> = ({
  position,
  targetPosition,
  revealed = false,
  isInteractive = false,
  onPositionChange,
  leftLabel,
  rightLabel,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const { position: localPos, handlePointerDown, handlePointerMove, handlePointerUp } = useDial({
    svgRef,
    initialPosition: position,
    onPositionChange,
    enabled: isInteractive,
    throttleMs: 50,
  });

  const displayPos = isInteractive ? localPos : position;
  // showZones = psychic's view (target defined but not yet in scoring)
  const showZones = targetPosition !== undefined && !revealed;

  return (
    <div className="flex flex-col items-center gap-0 w-full">
      <svg
        ref={svgRef}
        viewBox="0 0 400 220"
        className="w-full max-w-lg select-none"
        style={{ cursor: isInteractive ? 'crosshair' : 'default', touchAction: 'none' }}
        onPointerDown={isInteractive ? handlePointerDown : undefined}
        onPointerMove={isInteractive ? handlePointerMove : undefined}
        onPointerUp={isInteractive ? handlePointerUp : undefined}
        onPointerLeave={isInteractive ? handlePointerUp : undefined}
      >
        {/* ── Housing base stand (trapezoid) ── */}
        <polygon
          points="138,200 262,200 275,218 125,218"
          fill="#0F1132"
        />

        {/* ── Outer housing arc — wide dark navy ring ── */}
        <path
          d={`M ${CX - R - 22} ${CY} A ${R + 22} ${R + 22} 0 0 1 ${CX + R + 22} ${CY}`}
          fill="none"
          stroke="#0F1132"
          strokeWidth={50}
          strokeLinecap="round"
        />

        {/* ── Cream playing surface — the actual dial wheel ── */}
        <path
          d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
          fill="#F1ECC2"
          stroke="#E8E3D8"
          strokeWidth={1}
        />

        {/* ── Scoring zones (hidden / psychic / revealed) ── */}
        <TargetZone
          targetPosition={targetPosition}
          showZones={showZones}
          revealed={revealed}
        />

        {/* ── Housing glossy reflection arcs ── */}
        <path
          d={`M ${CX - R - 32} ${CY - 8} A ${R + 36} ${R + 36} 0 0 1 ${CX - R - 10} ${CY - 32}`}
          fill="none" stroke="#C8C8C8" strokeWidth={1.5} opacity={0.4} strokeLinecap="round"
        />
        <path
          d={`M ${CX + R + 10} ${CY - 32} A ${R + 36} ${R + 36} 0 0 1 ${CX + R + 32} ${CY - 8}`}
          fill="none" stroke="#C8C8C8" strokeWidth={1.5} opacity={0.4} strokeLinecap="round"
        />

        {/* ── Left base guard ── */}
        <polygon
          points={`${CX - R - 22},${CY} ${CX - R + 30},${CY} ${CX - R - 4},218`}
          fill="#0F1132"
        />
        {/* ── Right base guard ── */}
        <polygon
          points={`${CX + R + 22},${CY} ${CX + R - 30},${CY} ${CX + R + 4},218`}
          fill="#0F1132"
        />

        {/* ── Needle ── */}
        <DialNeedle position={displayPos} isDraggable={isInteractive} />

        {/* ── Left concept label on arc edge ── */}
        <circle cx={CX - R - 2} cy={CY} r={5} fill="#E0AD42" opacity={0.9} />
        {/* ── Right concept label on arc edge ── */}
        <circle cx={CX + R + 2} cy={CY} r={5} fill="#E0AD42" opacity={0.9} />
      </svg>

      {/* Concept labels below the dial */}
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between w-full max-w-lg px-2 -mt-1">
          <span
            className="text-sm font-bold uppercase tracking-wider px-3 py-1 rounded-lg"
            style={{ color: '#F1ECC2', background: '#0F1132', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            {leftLabel}
          </span>
          <span
            className="text-sm font-bold uppercase tracking-wider px-3 py-1 rounded-lg"
            style={{ color: '#F1ECC2', background: '#0F1132', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            {rightLabel}
          </span>
        </div>
      )}
    </div>
  );
};
