import React from 'react';

interface PhaseHeaderProps {
  roundNumber?: number;
  title: string;
  subtitle?: string;
}

export const PhaseHeader: React.FC<PhaseHeaderProps> = ({ roundNumber, title, subtitle }) => (
  <div className="flex flex-col items-center gap-1 text-center">
    {roundNumber !== undefined && (
      <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
        Round {roundNumber}
      </span>
    )}
    <h2 className="text-2xl font-bold text-white">{title}</h2>
    {subtitle && <p className="text-slate-400 text-sm max-w-sm">{subtitle}</p>}
  </div>
);
