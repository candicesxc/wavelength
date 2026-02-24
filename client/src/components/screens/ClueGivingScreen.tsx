import React, { useState } from 'react';
import { socket } from '../../lib/socket';
import type { PublicGameState } from '../../types/game';
import { PhaseHeader } from '../ui/PhaseHeader';
import { SpectrumCardDisplay } from '../ui/SpectrumCard';
import { SpectrumDial } from '../dial/SpectrumDial';
import { ScoreBoard } from '../ui/ScoreBoard';
import { Button } from '../ui/Button';

interface ClueGivingScreenProps {
  gameState: PublicGameState;
  localPlayerId: string | null;
  psychicTarget: number | null;
}

export const ClueGivingScreen: React.FC<ClueGivingScreenProps> = ({
  gameState,
  localPlayerId,
  psychicTarget,
}) => {
  const [clue1, setClue1] = useState('');
  const [clue2, setClue2] = useState('');

  const round = gameState.round!;
  const localPlayer = gameState.players.find(p => p.id === localPlayerId);
  const isLocalPsychic = localPlayer?.isPsychic ?? false;
  const psychic = gameState.players.find(p => p.isPsychic);

  const handleSubmit = () => {
    if (!clue1.trim() || !clue2.trim()) return;
    socket.emit('round:submit_clues', {
      clue1: clue1.trim(),
      clue2: clue2.trim(),
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 py-8 gap-6">
      <PhaseHeader
        roundNumber={round.roundNumber}
        title={isLocalPsychic ? "You're the Psychic! 🔮" : "Psychic is thinking..."}
        subtitle={
          isLocalPsychic
            ? "Look at the dial, then give 2 clues that hint at the target zone"
            : `${psychic?.name ?? 'The Psychic'} is preparing their clues`
        }
      />

      <ScoreBoard scoreA={gameState.scores.A} scoreB={gameState.scores.B} />

      {/* Spectrum card */}
      <SpectrumCardDisplay card={round.card} size="md" />

      {/* Dial — Psychic sees the target zone, others see nothing */}
      <SpectrumDial
        position={50}
        targetPosition={isLocalPsychic && psychicTarget !== null ? psychicTarget : undefined}
        revealed={false}
        isInteractive={false}
        leftLabel={round.card.left}
        rightLabel={round.card.right}
      />

      {isLocalPsychic ? (
        <div className="w-full max-w-sm flex flex-col gap-4">
          <p className="text-slate-400 text-sm text-center">
            The colored zone is the target. Give 2 clues that help your team guess where it is.
          </p>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Clue 1
            </label>
            <input
              type="text"
              value={clue1}
              onChange={e => setClue1(e.target.value)}
              placeholder="First clue..."
              maxLength={60}
              className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Clue 2
            </label>
            <input
              type="text"
              value={clue2}
              onChange={e => setClue2(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && clue1.trim() && clue2.trim()) handleSubmit();
              }}
              placeholder="Second clue..."
              maxLength={60}
              className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            disabled={!clue1.trim() || !clue2.trim()}
            onClick={handleSubmit}
          >
            Submit Clues →
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-slate-400 text-sm">Waiting for clues...</span>
          </div>
          <p className="text-slate-600 text-xs text-center max-w-xs">
            The psychic is studying the dial. Only they can see the target zone right now.
          </p>
        </div>
      )}
    </div>
  );
};
