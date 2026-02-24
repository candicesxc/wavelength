import React from 'react';
import { socket } from '../../lib/socket';
import type { PublicGameState } from '../../types/game';
import { PhaseHeader } from '../ui/PhaseHeader';
import { SpectrumCardDisplay } from '../ui/SpectrumCard';
import { SpectrumDial } from '../dial/SpectrumDial';
import { ScoreBoard } from '../ui/ScoreBoard';
import { Button } from '../ui/Button';

interface ScoringScreenProps {
  gameState: PublicGameState;
  localPlayerId: string | null;
}

const ZONE_LABELS: Record<string, string> = {
  bullseye: "🎯 Bull's-eye!",
  inner: '🟡 Inner Ring',
  outer: '🟠 Outer Ring',
  miss: '❌ Miss',
};

// Original zone colors
const ZONE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  bullseye: { bg: 'rgba(91,135,151,0.15)', border: '#5B8797', text: '#97BDC9' },
  inner:    { bg: 'rgba(221,87,72,0.15)',  border: '#DD5748', text: '#F0907E' },
  outer:    { bg: 'rgba(224,173,66,0.15)', border: '#E0AD42', text: '#E0AD42' },
  miss:     { bg: 'rgba(74,110,138,0.1)',  border: '#2D2F50', text: '#80AAB2' },
};

function getZone(target: number, dial: number): string {
  const d = Math.abs(target - dial);
  if (d <= 2)  return 'bullseye';
  if (d <= 6)  return 'inner';
  if (d <= 10) return 'outer';
  return 'miss';
}

export const ScoringScreen: React.FC<ScoringScreenProps> = ({ gameState, localPlayerId }) => {
  const round = gameState.round!;
  const target = gameState.revealedTargetPosition!;
  const zone = getZone(target, round.dialPosition);
  const points = round.pointsAwarded;
  const localPlayer = gameState.players.find(p => p.id === localPlayerId);
  const psychic = gameState.players.find(p => p.isPsychic);
  const opposingTeam = round.activeTeam === 'A' ? 'B' : 'A';
  const zc = ZONE_COLORS[zone];

  const handleNext = () => socket.emit('round:next');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 gap-5"
      style={{ background: '#0F1132' }}>

      <PhaseHeader roundNumber={round.roundNumber} title="Result! 🎉" subtitle="The target zone is now revealed" />

      {/* Score result banner */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        border: `2px solid ${zc.border}`, borderRadius: 18,
        padding: '16px 32px', background: zc.bg,
      }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: zc.text, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
          {ZONE_LABELS[zone]}
        </span>
        <span style={{ fontSize: 40, fontWeight: 900, color: zc.text, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', lineHeight: 1 }}>
          +{points.activeTeam} pts
        </span>
        <span style={{ fontSize: 13, color: '#80AAB2', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
          Team {round.activeTeam}
        </span>
      </div>

      {/* Bonus point for opposing team */}
      {round.leftRightGuess && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ color: '#97BDC9', fontSize: 13, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
            Team {opposingTeam} guessed:{' '}
            <span style={{ color: '#F1ECC2', fontWeight: 700, textTransform: 'uppercase' }}>{round.leftRightGuess}</span>
          </span>
          {points.opposingTeam > 0 ? (
            <span style={{ color: '#E0AD42', fontWeight: 700, fontSize: 14, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
              ✓ Correct! +1 bonus point
            </span>
          ) : (
            <span style={{ color: '#4A6E8A', fontSize: 13, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
              ✗ Incorrect (or bull's-eye blocks bonus)
            </span>
          )}
        </div>
      )}

      <ScoreBoard scoreA={gameState.scores.A} scoreB={gameState.scores.B} />

      <SpectrumCardDisplay card={round.card} size="md" />

      {/* Clue boxes */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        {round.clue1 && (
          <div style={{ background: '#2D2F50', border: '2px solid #E0AD42', borderRadius: 12, padding: '8px 16px' }}>
            <span style={{ fontSize: 11, color: '#80AAB2', display: 'block', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
              Clue 1 ({psychic?.name})
            </span>
            <span style={{ color: '#E0AD42', fontWeight: 700, fontSize: 15, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
              {round.clue1}
            </span>
          </div>
        )}
        {round.clue2 && (
          <div style={{ background: '#2D2F50', border: '2px solid #E0AD42', borderRadius: 12, padding: '8px 16px' }}>
            <span style={{ fontSize: 11, color: '#80AAB2', display: 'block', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>Clue 2</span>
            <span style={{ color: '#E0AD42', fontWeight: 700, fontSize: 15, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>{round.clue2}</span>
          </div>
        )}
      </div>

      <div style={{ width: '100%', maxWidth: 460 }}>
        <SpectrumDial
          position={round.dialPosition}
          targetPosition={target}
          revealed={true}
          isInteractive={false}
          leftLabel={round.card.left}
          rightLabel={round.card.right}
        />
      </div>

      <Button variant="primary" size="lg" onClick={handleNext}>
        Next Round →
      </Button>

      {localPlayer && (
        <p style={{ color: '#4A6E8A', fontSize: 12, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', textAlign: 'center' }}>
          Playing as <span style={{ color: '#80AAB2' }}>{localPlayer.name}</span> on Team {localPlayer.team}
        </p>
      )}
    </div>
  );
};
