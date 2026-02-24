import React from 'react';
import type { SpectrumCard as SpectrumCardType } from '../../types/game';

interface SpectrumCardProps {
  card: SpectrumCardType;
  size?: 'sm' | 'md' | 'lg';
}

export const SpectrumCardDisplay: React.FC<SpectrumCardProps> = ({ card, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-4 py-3 gap-3',
    md: 'px-6 py-4 gap-4',
    lg: 'px-8 py-6 gap-6',
  };
  const labelSize = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div
      className={`
        flex items-center justify-between w-full max-w-lg
        bg-slate-800 border border-slate-600 rounded-2xl
        ${sizeClasses[size]}
      `}
    >
      {/* Left concept */}
      <div className="flex flex-col items-start">
        <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Left</span>
        <span className={`font-bold text-slate-100 ${labelSize[size]}`}>{card.left}</span>
      </div>

      {/* Arrow / spectrum indicator */}
      <div className="flex items-center gap-1 text-slate-500">
        <span className="text-lg">←</span>
        <span className="text-xs text-slate-600 px-1">spectrum</span>
        <span className="text-lg">→</span>
      </div>

      {/* Right concept */}
      <div className="flex flex-col items-end">
        <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Right</span>
        <span className={`font-bold text-slate-100 ${labelSize[size]}`}>{card.right}</span>
      </div>

      {card.isCustom && (
        <span className="absolute top-2 right-2 text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full">
          Custom
        </span>
      )}
    </div>
  );
};
