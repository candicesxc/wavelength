import React from 'react';
import { pointOnArc, positionToAngle } from '../../hooks/useDial';

// SVG arc path helper — draws a thick arc segment from pos1 to pos2
function arcPath(pos1: number, pos2: number, r = 180): string {
  const p1 = pointOnArc(pos1, r);
  const p2 = pointOnArc(pos2, r);
  const a1 = positionToAngle(pos1);
  const a2 = positionToAngle(pos2);
  const largeArc = Math.abs(a1 - a2) > Math.PI ? 1 : 0;
  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${largeArc} 0 ${p2.x} ${p2.y}`;
}

interface TargetZoneProps {
  targetPosition?: number;
  showZones?: boolean;
  revealed?: boolean;
}

// Scoring zone half-widths matching server scoring.ts (HALF_WIDTH = 2)
// bull: ±2, inner: ±2–6, outer: ±6–10
const HW = 2;

// Original game colors from device.js:
//   outer 2pts: #E0AD42  (gold)
//   inner 3pts: #DD5748  (rust red)
//   bull  4pts: #5B8797  (slate blue)
const COLOR_OUTER = '#E0AD42';
const COLOR_INNER = '#DD5748';
const COLOR_BULL  = '#5B8797';
// Cover: dark teal, matches the original "screen overlay" color
const COLOR_COVER = '#1A2744';

export const TargetZone: React.FC<TargetZoneProps> = ({
  targetPosition,
  showZones = false,
  revealed = false,
}) => {
  const shouldShow = showZones || revealed;

  if (!shouldShow || targetPosition === undefined) {
    // Full cover arc — hides the target zone like original's screen overlay
    return (
      <path
        d={arcPath(0, 100)}
        fill="none"
        stroke={COLOR_COVER}
        strokeWidth={44}
        strokeLinecap="round"
      />
    );
  }

  const t = targetPosition;
  const outer1Start = Math.max(0,   t - HW * 5);
  const outer1End   = Math.max(0,   t - HW * 3);
  const inner1Start = Math.max(0,   t - HW * 3);
  const inner1End   = Math.max(0,   t - HW * 1);
  const bullStart   = Math.max(0,   t - HW);
  const bullEnd     = Math.min(100, t + HW);
  const inner2Start = Math.min(100, t + HW * 1);
  const inner2End   = Math.min(100, t + HW * 3);
  const outer2Start = Math.min(100, t + HW * 3);
  const outer2End   = Math.min(100, t + HW * 5);

  return (
    <g style={{ opacity: 1, transition: 'opacity 0.5s ease' }}>
      {/* Background track */}
      <path
        d={arcPath(0, 100)}
        fill="none"
        stroke={COLOR_COVER}
        strokeWidth={44}
        strokeLinecap="round"
      />
      {/* Outer 2pt zones — gold */}
      {outer1Start < outer1End && (
        <path d={arcPath(outer1Start, outer1End)} fill="none" stroke={COLOR_OUTER} strokeWidth={44} />
      )}
      {outer2Start < outer2End && (
        <path d={arcPath(outer2Start, outer2End)} fill="none" stroke={COLOR_OUTER} strokeWidth={44} />
      )}
      {/* Inner 3pt zones — rust red */}
      {inner1Start < inner1End && (
        <path d={arcPath(inner1Start, inner1End)} fill="none" stroke={COLOR_INNER} strokeWidth={44} />
      )}
      {inner2Start < inner2End && (
        <path d={arcPath(inner2Start, inner2End)} fill="none" stroke={COLOR_INNER} strokeWidth={44} />
      )}
      {/* Bull's-eye 4pt zone — slate blue */}
      {bullStart < bullEnd && (
        <path d={arcPath(bullStart, bullEnd)} fill="none" stroke={COLOR_BULL} strokeWidth={44} />
      )}
      {/* Zone score labels */}
      {outer1Start < outer1End && (() => {
        const mid = (outer1Start + outer1End) / 2;
        const p = pointOnArc(mid, 180);
        return <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="middle" fill="#0F1132" fontSize="11" fontWeight="bold" fontFamily="Helvetica, Arial, sans-serif">2</text>;
      })()}
      {outer2Start < outer2End && (() => {
        const mid = (outer2Start + outer2End) / 2;
        const p = pointOnArc(mid, 180);
        return <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="middle" fill="#0F1132" fontSize="11" fontWeight="bold" fontFamily="Helvetica, Arial, sans-serif">2</text>;
      })()}
      {inner1Start < inner1End && (() => {
        const mid = (inner1Start + inner1End) / 2;
        const p = pointOnArc(mid, 180);
        return <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Helvetica, Arial, sans-serif">3</text>;
      })()}
      {inner2Start < inner2End && (() => {
        const mid = (inner2Start + inner2End) / 2;
        const p = pointOnArc(mid, 180);
        return <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Helvetica, Arial, sans-serif">3</text>;
      })()}
      {bullStart < bullEnd && (() => {
        const mid = (bullStart + bullEnd) / 2;
        const p = pointOnArc(mid, 180);
        return <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Helvetica, Arial, sans-serif">4</text>;
      })()}
      {/* Target center tick mark (white line from outer edge inward) */}
      {(() => {
        const cp = pointOnArc(t, 202);
        const ip = pointOnArc(t, 158);
        return (
          <line
            x1={ip.x} y1={ip.y}
            x2={cp.x} y2={cp.y}
            stroke="white"
            strokeWidth={2.5}
            strokeLinecap="round"
            opacity={0.9}
          />
        );
      })()}
    </g>
  );
};
