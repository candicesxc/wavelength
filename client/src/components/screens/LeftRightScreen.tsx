import React from 'react';
import { socket } from '../../lib/socket';
import type { PublicGameState } from '../../types/game';
import { PhaseHeader } from '../ui/PhaseHeader';
import { SpectrumCardDisplay } from '../ui/SpectrumCard';
import { SpectrumDial } from '../dial/SpectrumDial';
import { Button } from '../ui/Button';
import { ScoreBoard } from '../ui/ScoreBoard';

interface LeftRightScreenProps {
  gameState: PublicGameState;
  localPlayerId: string | null;
}

export const LeftRightScreen: React.FC<LeftRightScreenProps> = ({ gameState, localPlayerId }) => {
  const round = gameState.round!;
  const localPlayer = gameState.players.find(p => p.id === localPlayerId);
  const opposingTeam = round.activeTeam === 'A' ? 'B' : 'A';
  const isOpposingTeam = localPlayer?.team === opposingTeam;

  const handleVote = (guess: 'left' | 'right') => {
    socket.emit('round:lock_left_right', { guess });
  };

  const psychic = gameState.players.find(p => p.isPsychic);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 py-8 gap-6">
      <PhaseHeader
        roundNumber={round.roundNumber}
        title={isOpposingTeam ? 'Left or Right? 🤔' : 'Waiting for opposing team...'}
        subtitle={
          isOpposingTeam
            ? `Is the real target to the LEFT or RIGHT of where Team ${round.activeTeam} guessed?`
            : `Team ${opposingTeam} is deciding if the target is left or right of the dial`
        }
      />

      <ScoreBoard scoreA={gameState.scores.A} scoreB={gameState.scores.B} />

      {/* Clues */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-slate-500 uppercase tracking-wider">
          Psychic's Clues ({psychic?.name ?? '?'})
        </span>
        <div className="flex gap-3 flex-wrap justify-center">
          {round.clue1 && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-2">
              <span className="text-amber-300 font-semibold text-lg">{round.clue1}</span>
            </div>
          )}
          {round.clue2 && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-2">
              <span className="text-amber-300 font-semibold text-lg">{round.clue2}</span>
            </div>
          )}
        </div>
      </div>

      {/* Spectrum card */}
      <SpectrumCardDisplay card={round.card} size="md" />

      {/* Dial — shows where team A guessed, target still hidden */}
      <SpectrumDial
        position={round.dialPosition}
        targetPosition={undefined}
        revealed={false}
        isInteractive={false}
        leftLabel={round.card.left}
        rightLabel={round.card.right}
      />

      {/* The needle position label */}
      <p className="text-slate-400 text-sm text-center">
        Team {round.activeTeam} locked their needle here ↑
      </p>

      {/* Voting buttons for opposing team */}
      {isOpposingTeam && !round.leftRightGuess && (
        <div className="flex gap-4">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => handleVote('left')}
            className="flex-1 border-blue-600 hover:bg-blue-900 text-blue-300"
          >
            ← Left
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => handleVote('right')}
            className="flex-1 border-red-600 hover:bg-red-900 text-red-300"
          >
            Right →
          </Button>
        </div>
      )}

      {round.leftRightGuess && (
        <div className="text-center">
          <span className="text-slate-400 text-sm">
            Team {opposingTeam} guessed:{' '}
            <span className="text-white font-bold uppercase">{round.leftRightGuess}</span>
          </span>
        </div>
      )}

      {!isOpposingTeam && (
        <div className="flex gap-2 items-center text-slate-500 text-sm">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Team {opposingTeam} is voting...
        </div>
      )}
    </div>
  );
};
