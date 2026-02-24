import React from 'react';
import { socket } from '../../lib/socket';
import type { PublicGameState } from '../../types/game';
import { PhaseHeader } from '../ui/PhaseHeader';
import { SpectrumCardDisplay } from '../ui/SpectrumCard';
import { SpectrumDial } from '../dial/SpectrumDial';
import { ScoreBoard } from '../ui/ScoreBoard';
import { Button } from '../ui/Button';

interface GuessingScreenProps {
  gameState: PublicGameState;
  localPlayerId: string | null;
}

export const GuessingScreen: React.FC<GuessingScreenProps> = ({ gameState, localPlayerId }) => {
  const round = gameState.round!;
  const localPlayer = gameState.players.find(p => p.id === localPlayerId);
  const isActiveTeam = localPlayer?.team === round.activeTeam;
  const isPsychic = localPlayer?.isPsychic ?? false;
  // Psychic can't move the dial; only active team non-psychics can
  const canInteract = isActiveTeam && !isPsychic;

  const handleDialChange = (position: number) => {
    socket.emit('round:update_dial', { position });
  };

  const handleLockGuess = () => {
    socket.emit('round:lock_guess');
  };

  const psychic = gameState.players.find(p => p.isPsychic);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 py-8 gap-6">
      <PhaseHeader
        roundNumber={round.roundNumber}
        title={
          isPsychic
            ? 'Your team is guessing'
            : isActiveTeam
            ? 'Move the dial! 🎯'
            : 'Other team is guessing'
        }
        subtitle={
          isPsychic
            ? 'Stay silent while your team discusses'
            : isActiveTeam
            ? 'Discuss with your team and move the needle to where you think the target is'
            : `Team ${round.activeTeam} is guessing based on the clues`
        }
      />

      <ScoreBoard scoreA={gameState.scores.A} scoreB={gameState.scores.B} />

      {/* Clues */}
      <div className="flex flex-col items-center gap-2 w-full max-w-sm">
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

      {/* Dial — target zone hidden */}
      <SpectrumDial
        position={round.dialPosition}
        targetPosition={undefined}
        revealed={false}
        isInteractive={canInteract}
        onPositionChange={canInteract ? handleDialChange : undefined}
        leftLabel={round.card.left}
        rightLabel={round.card.right}
      />

      {/* Lock in button — only for active team, non-psychic */}
      {canInteract && (
        <div className="flex flex-col items-center gap-2">
          <Button variant="primary" size="lg" onClick={handleLockGuess}>
            🔒 Lock In Guess
          </Button>
          <p className="text-slate-500 text-xs">Make sure your team agrees before locking in!</p>
        </div>
      )}

      {isPsychic && (
        <div className="text-center text-slate-500 text-sm italic">
          🤫 Stay quiet — let your team discuss
        </div>
      )}

      {!isActiveTeam && !isPsychic && (
        <div className="text-center text-slate-500 text-sm">
          Watching Team {round.activeTeam} guess... Get ready to vote Left or Right!
        </div>
      )}
    </div>
  );
};
