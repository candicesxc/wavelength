import React from 'react';
import { pointOnArc, positionToAngle } from '../../hooks/useDial';

// SVG arc path helper — draws a thick arc segment from pos1 to pos2
// Uses a 40px wide stroke on the arc track
function arcPath(pos1: number, pos2: number, r = 180): string {
  const p1 = pointOnArc(pos1, r);
  const p2 = pointOnArc(pos2, r);
  const a1 = positionToAngle(pos1);
  const a2 = positionToAngle(pos2);
  // large-arc-flag = 1 if arc spans > 180°
  const largeArc = Math.abs(a1 - a2) > Math.PI ? 1 : 0;
  // sweep-flag = 0 (counter-clockwise in SVG coords)
  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${largeArc} 0 ${p2.x} ${p2.y}`;
}

interface TargetZoneProps {
  /** Target position 0–100 — undefined means hidden (render cover) */
  targetPosition?: number;
  /** When true, always show the zones (Psychic's view) */
  showZones?: boolean;
  /** When true, animate the reveal */
  revealed?: boolean;
}

// Scoring zone half-widths (matching server scoring.ts)
// HALF_WIDTH = 2, so zones: ±2 bullseye, ±6 inner, ±10 outer
const HW = 2;

export const TargetZone: React.FC<TargetZoneProps> = ({
  targetPosition,
  showZones = false,
  revealed = false,
}) => {
  const shouldShow = showZones || revealed;

  if (!shouldShow || targetPosition === undefined) {
    // Full cover arc — hides the target zone
    return (
      <path
        d={arcPath(0, 100)}
        fill="none"
        stroke="#1E293B"
        strokeWidth={40}
        strokeLinecap="round"
      />
    );
  }

  const t = targetPosition;
  const outer1Start = Math.max(0, t - HW * 5);
  const outer1End   = Math.max(0, t - HW * 3);
  const inner1Start = Math.max(0, t - HW * 3);
  const inner1End   = Math.max(0, t - HW * 1);
  const bullStart   = Math.max(0, t - HW);
  const bullEnd     = Math.min(100, t + HW);
  const inner2Start = Math.min(100, t + HW * 1);
  const inner2End   = Math.min(100, t + HW * 3);
  const outer2Start = Math.min(100, t + HW * 3);
  const outer2End   = Math.min(100, t + HW * 5);

  return (
    <g
      className={shouldShow ? 'transition-opacity duration-500' : ''}
      style={{ opacity: shouldShow ? 1 : 0 }}
    >
      {/* Background track */}
      <path
        d={arcPath(0, 100)}
        fill="none"
        stroke="#1E293B"
        strokeWidth={40}
        strokeLinecap="round"
      />
      {/* 2pt outer zones (orange) */}
      {outer1Start < outer1End && (
        <path d={arcPath(outer1Start, outer1End)} fill="none" stroke="#F97316" strokeWidth={40} />
      )}
      {outer2Start < outer2End && (
        <path d={arcPath(outer2Start, outer2End)} fill="none" stroke="#F97316" strokeWidth={40} />
      )}
      {/* 3pt inner zones (yellow) */}
      {inner1Start < inner1End && (
        <path d={arcPath(inner1Start, inner1End)} fill="none" stroke="#EAB308" strokeWidth={40} />
      )}
      {inner2Start < inner2End && (
        <path d={arcPath(inner2Start, inner2End)} fill="none" stroke="#EAB308" strokeWidth={40} />
      )}
      {/* 4pt bull's-eye zone (green) */}
      {bullStart < bullEnd && (
        <path d={arcPath(bullStart, bullEnd)} fill="none" stroke="#22C55E" strokeWidth={40} />
      )}
      {/* Target center tick mark */}
      {(() => {
        const cp = pointOnArc(t, 180);
        const ip = pointOnArc(t, 155);
        return (
          <line
            x1={ip.x} y1={ip.y}
            x2={cp.x} y2={cp.y}
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.8}
          />
        );
      })()}
    </g>
  );
};
