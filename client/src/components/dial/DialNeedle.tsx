import React from 'react';
import { pointOnArc } from '../../hooks/useDial';

interface DialNeedleProps {
  position: number; // 0–100
  isDraggable?: boolean;
}

const CX = 200;
const CY = 200;

export const DialNeedle: React.FC<DialNeedleProps> = ({ position, isDraggable = false }) => {
  const tip = pointOnArc(position, 185);
  const base = pointOnArc(position, 20);

  return (
    <g style={{ cursor: isDraggable ? 'grab' : 'default' }}>
      {/* Needle line */}
      <line
        x1={CX}
        y1={CY}
        x2={tip.x}
        y2={tip.y}
        stroke="#B9373B"
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* Center hub */}
      <circle cx={CX} cy={CY} r={10} fill="#B9373B" />
      <circle cx={CX} cy={CY} r={5} fill="#F1ECC2" />
      {/* Needle base line (cosmetic) */}
      <line
        x1={CX}
        y1={CY}
        x2={base.x}
        y2={base.y}
        stroke="#B9373B"
        strokeWidth={3}
        strokeLinecap="round"
        opacity={0.4}
      />
      {/* Drag handle at tip */}
      {isDraggable && (
        <circle
          cx={tip.x}
          cy={tip.y}
          r={8}
          fill="#B9373B"
          stroke="#F1ECC2"
          strokeWidth={2}
          style={{ cursor: 'grab' }}
        />
      )}
    </g>
  );
};
