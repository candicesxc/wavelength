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
  const canInteract = isActiveTeam && !isPsychic;

  const handleDialChange = (position: number) => {
    socket.emit('round:update_dial', { position });
  };
  const handleLockGuess = () => {
    socket.emit('round:lock_guess');
  };

  const psychic = gameState.players.find(p => p.isPsychic);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 gap-5"
      style={{ background: '#0F1132' }}>

      <PhaseHeader
        roundNumber={round.roundNumber}
        title={isPsychic ? 'Your team is guessing' : isActiveTeam ? 'Move the dial! 🎯' : 'Other team is guessing'}
        subtitle={
          isPsychic
            ? 'Stay silent while your team discusses'
            : isActiveTeam
            ? 'Discuss with your team and move the needle'
            : `Team ${round.activeTeam} is guessing based on the clues`
        }
      />

      <ScoreBoard scoreA={gameState.scores.A} scoreB={gameState.scores.B} />

      {/* Clue boxes */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: '#80AAB2', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
          Psychic's Clues ({psychic?.name ?? '?'})
        </span>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {round.clue1 && (
            <div style={{ background: '#2D2F50', border: '2px solid #E0AD42', borderRadius: 12, padding: '8px 18px' }}>
              <span style={{ color: '#E0AD42', fontWeight: 700, fontSize: 16, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                {round.clue1}
              </span>
            </div>
          )}
          {round.clue2 && (
            <div style={{ background: '#2D2F50', border: '2px solid #E0AD42', borderRadius: 12, padding: '8px 18px' }}>
              <span style={{ color: '#E0AD42', fontWeight: 700, fontSize: 16, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                {round.clue2}
              </span>
            </div>
          )}
        </div>
      </div>

      <SpectrumCardDisplay card={round.card} size="md" />

      <div style={{ width: '100%', maxWidth: 460 }}>
        <SpectrumDial
          position={round.dialPosition}
          targetPosition={undefined}
          revealed={false}
          isInteractive={canInteract}
          onPositionChange={canInteract ? handleDialChange : undefined}
          leftLabel={round.card.left}
          rightLabel={round.card.right}
        />
      </div>

      {canInteract && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <Button variant="primary" size="lg" onClick={handleLockGuess}>
            🔒 Lock In Guess
          </Button>
          <p style={{ color: '#80AAB2', fontSize: 12, margin: 0, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
            Make sure your team agrees before locking in!
          </p>
        </div>
      )}

      {isPsychic && (
        <div style={{ color: '#80AAB2', fontSize: 14, fontStyle: 'italic', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
          🤫 Stay quiet — let your team discuss
        </div>
      )}

      {!isActiveTeam && !isPsychic && (
        <div style={{ color: '#80AAB2', fontSize: 14, textAlign: 'center', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
          Watching Team {round.activeTeam} guess... Get ready to vote Left or Right!
        </div>
      )}
    </div>
  );
};
