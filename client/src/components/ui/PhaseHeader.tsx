import React from 'react';

interface PhaseHeaderProps {
  roundNumber?: number;
  title: string;
  subtitle?: string;
}

export const PhaseHeader: React.FC<PhaseHeaderProps> = ({ roundNumber, title, subtitle }) => (
  <div className="flex flex-col items-center gap-1 text-center">
    {roundNumber !== undefined && (
      <span
        className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
        style={{ background: '#2D2F50', color: '#E0AD42', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
      >
        Round {roundNumber}
      </span>
    )}
    <h2
      className="text-2xl font-bold mt-1"
      style={{ color: '#F1ECC2', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
    >
      {title}
    </h2>
    {subtitle && (
      <p
        className="text-sm max-w-sm"
        style={{ color: '#97BDC9', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
      >
        {subtitle}
      </p>
    )}
  </div>
);
