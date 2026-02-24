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
  const psychic = gameState.players.find(p => p.isPsychic);

  const handleVote = (guess: 'left' | 'right') => {
    socket.emit('round:lock_left_right', { guess });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 gap-5"
      style={{ background: '#0F1132' }}>

      <PhaseHeader
        roundNumber={round.roundNumber}
        title={isOpposingTeam ? 'Left or Right? 🤔' : 'Waiting for opposing team...'}
        subtitle={
          isOpposingTeam
            ? `Is the real target to the LEFT or RIGHT of where Team ${round.activeTeam} guessed?`
            : `Team ${opposingTeam} is deciding left or right`
        }
      />

      <ScoreBoard scoreA={gameState.scores.A} scoreB={gameState.scores.B} />

      {/* Clues */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: '#80AAB2', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
          Psychic's Clues ({psychic?.name ?? '?'})
        </span>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {round.clue1 && (
            <div style={{ background: '#2D2F50', border: '2px solid #E0AD42', borderRadius: 12, padding: '8px 18px' }}>
              <span style={{ color: '#E0AD42', fontWeight: 700, fontSize: 16, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>{round.clue1}</span>
            </div>
          )}
          {round.clue2 && (
            <div style={{ background: '#2D2F50', border: '2px solid #E0AD42', borderRadius: 12, padding: '8px 18px' }}>
              <span style={{ color: '#E0AD42', fontWeight: 700, fontSize: 16, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>{round.clue2}</span>
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
          isInteractive={false}
          leftLabel={round.card.left}
          rightLabel={round.card.right}
        />
      </div>

      <p style={{ color: '#97BDC9', fontSize: 13, textAlign: 'center', margin: 0, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
        Team {round.activeTeam} locked their needle here ↑
      </p>

      {isOpposingTeam && !round.leftRightGuess && (
        <div style={{ display: 'flex', gap: 12 }}>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => handleVote('left')}
            style={{ border: '2px solid #97BDC9', color: '#97BDC9' }}
          >
            ← Left
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => handleVote('right')}
            style={{ border: '2px solid #DF6B50', color: '#DF6B50' }}
          >
            Right →
          </Button>
        </div>
      )}

      {round.leftRightGuess && (
        <div style={{ textAlign: 'center' }}>
          <span style={{ color: '#97BDC9', fontSize: 14, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
            Team {opposingTeam} guessed:{' '}
            <span style={{ color: '#F1ECC2', fontWeight: 700, textTransform: 'uppercase' }}>{round.leftRightGuess}</span>
          </span>
        </div>
      )}

      {!isOpposingTeam && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#80AAB2', fontSize: 14, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E0AD42', animation: 'pulse 1.5s infinite' }} />
          Team {opposingTeam} is voting...
        </div>
      )}
    </div>
  );
};
