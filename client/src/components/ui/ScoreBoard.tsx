import React from 'react';

interface ScoreBoardProps {
  scoreA: number;
  scoreB: number;
  winScore?: number;
}

const WIN = 10;
const SLOTS = Array.from({ length: WIN + 1 }, (_, i) => WIN - i); // [10,9,8,...,0]
const SLOT_H = 24; // px per slot

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ scoreA, scoreB }) => {
  return (
    <div
      className="flex items-stretch gap-0 rounded-2xl overflow-hidden shadow-xl"
      style={{
        background: '#3F6F8E',
        border: '3px solid #174766',
        padding: '12px 20px',
        minWidth: 220,
      }}
    >
      {/* Team A column */}
      <TeamScoreColumn
        label="Left Brain"
        score={scoreA}
        tokenSrc="/assets/token_2.png"
        textColor="#F1ECC2"
        activeColor="#E0AD42"
      />

      {/* Divider */}
      <div style={{ width: 2, background: '#174766', margin: '0 16px', borderRadius: 1 }} />

      {/* Team B column */}
      <TeamScoreColumn
        label="Right Brain"
        score={scoreB}
        tokenSrc="/assets/token_1.png"
        textColor="#F1ECC2"
        activeColor="#E0AD42"
      />
    </div>
  );
};

interface TeamColProps {
  label: string;
  score: number;
  tokenSrc: string;
  textColor: string;
  activeColor: string;
}

const TeamScoreColumn: React.FC<TeamColProps> = ({ label, score, tokenSrc, textColor, activeColor }) => {
  return (
    <div className="flex flex-col items-center gap-1" style={{ minWidth: 80 }}>
      {/* Team title */}
      <span
        className="text-xs font-bold uppercase tracking-wider mb-1"
        style={{
          color: textColor,
          fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        }}
      >
        {label}
      </span>

      {/* Score slots */}
      <div className="flex flex-col items-center gap-0.5 relative" style={{ height: SLOTS.length * SLOT_H }}>
        {SLOTS.map(n => {
          const isActive = n === score;
          const isPassed = n < score;
          return (
            <div
              key={n}
              className="flex items-center gap-1"
              style={{ height: SLOT_H, width: 72 }}
            >
              {/* Score number */}
              <span
                style={{
                  width: 22,
                  textAlign: 'right',
                  fontSize: 12,
                  fontWeight: isActive ? 'bold' : 'normal',
                  color: isActive ? activeColor : isPassed ? '#80AAB2' : '#4A6E8A',
                  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                }}
              >
                {n}
              </span>
              {/* Score slot line */}
              <div
                style={{
                  flex: 1,
                  height: isActive ? 4 : 2,
                  borderRadius: 2,
                  background: isActive
                    ? activeColor
                    : isPassed
                    ? '#2A4F6A'
                    : '#00304F',
                  transition: 'all 0.3s ease',
                }}
              />
              {/* Token at current score */}
              {isActive && (
                <img
                  src={tokenSrc}
                  alt="score token"
                  style={{ width: 20, height: 22, objectFit: 'contain', marginLeft: 2 }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Big score number */}
      <span
        className="text-3xl font-extrabold mt-1"
        style={{
          color: activeColor,
          fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
          textShadow: '0 2px 8px rgba(0,0,0,0.4)',
        }}
      >
        {score}
      </span>
    </div>
  );
};
