import React, { useRef } from 'react';
import { useDial } from '../../hooks/useDial';
import { TargetZone } from './TargetZone';
import { DialNeedle } from './DialNeedle';

interface SpectrumDialProps {
  /** Current needle position 0–100 (from server state) */
  position: number;
  /** Target position — defined only for Psychic view or SCORING phase */
  targetPosition?: number;
  /** Whether the scoring zones are revealed (SCORING phase) */
  revealed?: boolean;
  /** Whether this client can drag the needle */
  isInteractive?: boolean;
  /** Called with the new position whenever the user drags */
  onPositionChange?: (pos: number) => void;
  /** Left concept label */
  leftLabel?: string;
  /** Right concept label */
  rightLabel?: string;
}

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
  const showZones = targetPosition !== undefined && !revealed;
  // showZones means Psychic view (target defined, not yet scoring phase)
  // revealed means SCORING phase (also has targetPosition defined)

  return (
    <div className="flex flex-col items-center gap-2 w-full">
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
        {/* Outer housing arc (dark navy, decorative) */}
        <path
          d="M 10 200 A 190 190 0 0 1 390 200"
          fill="none"
          stroke="#0F1132"
          strokeWidth={55}
          strokeLinecap="round"
        />

        {/* Target/scoring zones (hidden, psychic, or revealed) */}
        <TargetZone
          targetPosition={targetPosition}
          showZones={showZones}
          revealed={revealed}
        />

        {/* Needle */}
        <DialNeedle position={displayPos} isDraggable={isInteractive} />

        {/* Arc edge tick marks */}
        <circle cx={20} cy={200} r={4} fill="#E0AD42" opacity={0.7} />
        <circle cx={380} cy={200} r={4} fill="#E0AD42" opacity={0.7} />
      </svg>

      {/* Spectrum labels */}
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between w-full max-w-lg px-2">
          <span className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            {leftLabel}
          </span>
          <span className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            {rightLabel}
          </span>
        </div>
      )}
    </div>
  );
};
