import React from 'react';
import { pointOnArc } from '../../hooks/useDial';

interface DialNeedleProps {
  position: number; // 0–100
  isDraggable?: boolean;
}

const CX = 200;
const CY = 200;

export const DialNeedle: React.FC<DialNeedleProps> = ({ position, isDraggable = false }) => {
  const tip  = pointOnArc(position, 178);
  const base = pointOnArc(position, 25);

  // Needle colors matching original device.js (#B9373B)
  const needleColor = '#B9373B';

  const color = needleColor;

  return (
    <g style={{ cursor: isDraggable ? 'grab' : 'default' }}>
      {/* Drop shadow line (offset slightly) */}
      <line
        x1={CX + 1} y1={CY + 1}
        x2={tip.x + 1} y2={tip.y + 1}
        stroke="rgba(0,0,0,0.3)"
        strokeWidth={5}
        strokeLinecap="round"
      />
      {/* Main needle line */}
      <line
        x1={CX} y1={CY}
        x2={tip.x} y2={tip.y}
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
      />
      {/* Backside needle stub */}
      <line
        x1={CX} y1={CY}
        x2={base.x} y2={base.y}
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        opacity={0.5}
      />
      {/* Center hub — dark red circle with cream center dot */}
      <circle cx={CX} cy={CY} r={16} fill={color} />
      {/* Gloss arc on hub */}
      <path
        d={`M ${CX - 7} ${CY - 10} A 10 10 0 0 1 ${CX + 7} ${CY - 10}`}
        fill="none" stroke="rgba(200,200,200,0.35)" strokeWidth={2} strokeLinecap="round"
      />
      <circle cx={CX} cy={CY} r={5} fill="#F1ECC2" />
      {/* Drag handle circle at tip */}
      {isDraggable && (
        <>
          <circle
            cx={tip.x}
            cy={tip.y}
            r={12}
            fill={color}
            stroke="#F1ECC2"
            strokeWidth={2.5}
            style={{ cursor: 'grab' }}
          />
          {/* Gloss on handle */}
          <path
            d={`M ${tip.x - 4} ${tip.y - 7} A 6 6 0 0 1 ${tip.x + 4} ${tip.y - 7}`}
            fill="none" stroke="rgba(200,200,200,0.35)" strokeWidth={1.5} strokeLinecap="round"
          />
        </>
      )}
      {!isDraggable && (
        /* Just a small dot at the tip when not draggable */
        <circle cx={tip.x} cy={tip.y} r={4} fill={color} opacity={0.7} />
      )}
    </g>
  );
};
