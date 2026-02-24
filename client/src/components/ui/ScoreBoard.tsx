import React from 'react';

interface ScoreBoardProps {
  scoreA: number;
  scoreB: number;
  winScore?: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ scoreA, scoreB, winScore = 10 }) => {
  const pctA = Math.min(100, (scoreA / winScore) * 100);
  const pctB = Math.min(100, (scoreB / winScore) * 100);

  return (
    <div className="flex gap-4 w-full max-w-sm">
      {/* Team A */}
      <div className="flex-1 flex flex-col items-center gap-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-sm text-slate-400 font-semibold">Team A</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${pctA}%` }}
          />
        </div>
        <span className="text-2xl font-bold text-blue-400 font-mono">{scoreA}</span>
      </div>

      <div className="flex items-center text-slate-600 font-bold text-lg self-center pt-2">
        vs
      </div>

      {/* Team B */}
      <div className="flex-1 flex flex-col items-center gap-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-sm text-slate-400 font-semibold">Team B</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-red-500 rounded-full transition-all duration-500"
            style={{ width: `${pctB}%` }}
          />
        </div>
        <span className="text-2xl font-bold text-red-400 font-mono">{scoreB}</span>
      </div>
    </div>
  );
};
