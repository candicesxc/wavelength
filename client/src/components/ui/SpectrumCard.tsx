import React, { useMemo } from 'react';
import type { SpectrumCard as SpectrumCardType } from '../../types/game';

interface SpectrumCardProps {
  card: SpectrumCardType;
  size?: 'sm' | 'md' | 'lg';
}

// Original colours.csv palette — 6 colors for card backgrounds
const CARD_COLORS = [
  '#E2AC43', // warm gold
  '#97BDC9', // soft blue
  '#478E7C', // muted green
  '#DFD9D0', // off-white/cream
  '#E5BAC2', // blush pink
  '#DF6B50', // coral/burnt red
];

// Deterministic color selection based on card id
function getCardColors(id: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  const leftIdx  = hash % CARD_COLORS.length;
  const rightIdx = (leftIdx + 2) % CARD_COLORS.length;
  return [CARD_COLORS[leftIdx], CARD_COLORS[rightIdx]];
}

// Determine if text should be dark or light based on background
function isDark(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // Luminance
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

const sizeConfig = {
  sm: { cardW: 110, cardH: 90,  fontSize: 13, arrowSize: 14 },
  md: { cardW: 140, cardH: 110, fontSize: 16, arrowSize: 18 },
  lg: { cardW: 170, cardH: 130, fontSize: 19, arrowSize: 22 },
};

export const SpectrumCardDisplay: React.FC<SpectrumCardProps> = ({ card, size = 'md' }) => {
  const [leftColor, rightColor] = useMemo(() => getCardColors(card.id), [card.id]);
  const cfg = sizeConfig[size];
  const totalW = cfg.cardW * 2 + 12; // 12px gap between cards
  const svgH = cfg.cardH + 16;       // a little breathing room

  const leftTextColor  = isDark(leftColor)  ? '#0F1132' : '#F1ECC2';
  const rightTextColor = isDark(rightColor) ? '#0F1132' : '#F1ECC2';

  const lx = 0;
  const rx = cfg.cardW + 12;

  return (
    <div className="flex flex-col items-center" style={{ maxWidth: totalW + 24 }}>
      {card.isCustom && (
        <span className="text-xs bg-game-gold/20 text-game-gold px-2 py-0.5 rounded-full mb-1 font-semibold">
          Custom
        </span>
      )}
      <svg
        viewBox={`0 0 ${totalW} ${svgH}`}
        width={totalW}
        height={svgH}
        style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', overflow: 'visible' }}
      >
        {/* Left card shadow */}
        <rect x={lx + 4} y={8} width={cfg.cardW} height={cfg.cardH} rx={8} fill={leftColor} opacity={0.35} />
        {/* Left card */}
        <rect x={lx} y={4} width={cfg.cardW} height={cfg.cardH} rx={8} fill={leftColor} />
        {/* Left label */}
        <text
          x={lx + cfg.cardW / 2}
          y={4 + cfg.cardH / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={leftTextColor}
          fontSize={cfg.fontSize}
          fontWeight="bold"
          style={{ userSelect: 'none' }}
        >
          {card.left}
        </text>
        {/* Left arrow → pointing right, at bottom-right of left card */}
        <g transform={`translate(${lx + cfg.cardW * 0.7}, ${4 + cfg.cardH * 0.78})`}>
          <line x1={0} y1={0} x2={cfg.arrowSize} y2={0} stroke={leftTextColor} strokeWidth={2} strokeLinecap="round" opacity={0.7} />
          <polygon points={`${cfg.arrowSize},${-4} ${cfg.arrowSize + 6},0 ${cfg.arrowSize},4`} fill={leftTextColor} opacity={0.7} />
        </g>

        {/* Right card shadow */}
        <rect x={rx + 4} y={8} width={cfg.cardW} height={cfg.cardH} rx={8} fill={rightColor} opacity={0.35} />
        {/* Right card */}
        <rect x={rx} y={4} width={cfg.cardW} height={cfg.cardH} rx={8} fill={rightColor} />
        {/* Right label */}
        <text
          x={rx + cfg.cardW / 2}
          y={4 + cfg.cardH / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={rightTextColor}
          fontSize={cfg.fontSize}
          fontWeight="bold"
          style={{ userSelect: 'none' }}
        >
          {card.right}
        </text>
        {/* Right arrow ← pointing left, at bottom-left of right card */}
        <g transform={`translate(${rx + cfg.cardW * 0.3}, ${4 + cfg.cardH * 0.78})`}>
          <line x1={0} y1={0} x2={-cfg.arrowSize} y2={0} stroke={rightTextColor} strokeWidth={2} strokeLinecap="round" opacity={0.7} />
          <polygon points={`${-cfg.arrowSize},${-4} ${-cfg.arrowSize - 6},0 ${-cfg.arrowSize},4`} fill={rightTextColor} opacity={0.7} />
        </g>
      </svg>
    </div>
  );
};
