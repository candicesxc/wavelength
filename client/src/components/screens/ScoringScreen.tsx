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

const ZONE_COLORS: Record<string, string> = {
  bullseye: 'text-green-400 bg-green-400/10 border-green-400/30',
  inner: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  outer: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
  miss: 'text-slate-400 bg-slate-400/10 border-slate-400/30',
};

// Compute zone from dial distance (mirroring server logic)
function getZone(target: number, dial: number): string {
  const d = Math.abs(target - dial);
  if (d <= 2) return 'bullseye';
  if (d <= 6) return 'inner';
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

  const handleNext = () => {
    socket.emit('round:next');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 py-8 gap-6">
      <PhaseHeader
        roundNumber={round.roundNumber}
        title="Result! 🎉"
        subtitle="The target zone is now revealed"
      />

      {/* Score result banner */}
      <div className={`flex flex-col items-center gap-1 border rounded-2xl px-8 py-4 ${ZONE_COLORS[zone]}`}>
        <span className="text-2xl font-bold">{ZONE_LABELS[zone]}</span>
        <span className="text-4xl font-extrabold font-mono">
          +{points.activeTeam} pts
        </span>
        <span className="text-sm opacity-70">
          Team {round.activeTeam}
        </span>
      </div>

      {/* Bonus point for opposing team */}
      {round.leftRightGuess && (
        <div className="flex flex-col items-center gap-1">
          <span className="text-slate-400 text-sm">
            Team {opposingTeam} guessed:{' '}
            <span className="text-white font-bold uppercase">{round.leftRightGuess}</span>
          </span>
          {points.opposingTeam > 0 ? (
            <span className="text-green-400 font-semibold">✓ Correct! +1 bonus point</span>
          ) : (
            <span className="text-slate-500 text-sm">✗ Incorrect (or bull's-eye blocks bonus)</span>
          )}
        </div>
      )}

      {/* Updated scoreboard */}
      <ScoreBoard scoreA={gameState.scores.A} scoreB={gameState.scores.B} />

      {/* Spectrum card */}
      <SpectrumCardDisplay card={round.card} size="md" />

      {/* Psychic clues */}
      <div className="flex gap-3 flex-wrap justify-center">
        {round.clue1 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2">
            <span className="text-xs text-slate-500 block">Clue 1 ({psychic?.name})</span>
            <span className="text-amber-300 font-semibold">{round.clue1}</span>
          </div>
        )}
        {round.clue2 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2">
            <span className="text-xs text-slate-500 block">Clue 2</span>
            <span className="text-amber-300 font-semibold">{round.clue2}</span>
          </div>
        )}
      </div>

      {/* Revealed dial */}
      <SpectrumDial
        position={round.dialPosition}
        targetPosition={target}
        revealed={true}
        isInteractive={false}
        leftLabel={round.card.left}
        rightLabel={round.card.right}
      />

      {/* Anyone can advance */}
      <Button variant="primary" size="lg" onClick={handleNext}>
        Next Round →
      </Button>

      {/* Show which player this is for context */}
      {localPlayer && (
        <p className="text-slate-600 text-xs">
          Playing as <span className="text-slate-400">{localPlayer.name}</span> on Team {localPlayer.team}
        </p>
      )}
    </div>
  );
};
