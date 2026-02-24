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

const inputStyle: React.CSSProperties = {
  background: '#2D2F50',
  border: '2px solid #414364',
  borderRadius: 10,
  padding: '10px 14px',
  color: '#F1ECC2',
  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
  fontSize: 15,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#80AAB2',
  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
  marginBottom: 5,
  display: 'block',
};

export const ClueGivingScreen: React.FC<ClueGivingScreenProps> = ({
  gameState,
  localPlayerId,
  psychicTarget,
}) => {
  const [clue1, setClue1] = useState('');
  const [clue2, setClue2] = useState('');
  const [focused, setFocused] = useState<string | null>(null);

  const round = gameState.round!;
  const localPlayer = gameState.players.find(p => p.id === localPlayerId);
  const isLocalPsychic = localPlayer?.isPsychic ?? false;
  const psychic = gameState.players.find(p => p.isPsychic);

  const handleSubmit = () => {
    if (!clue1.trim() || !clue2.trim()) return;
    socket.emit('round:submit_clues', { clue1: clue1.trim(), clue2: clue2.trim() });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 gap-5"
      style={{ background: '#0F1132' }}>

      <PhaseHeader
        roundNumber={round.roundNumber}
        title={isLocalPsychic ? "You're the Psychic! 🔮" : "Psychic is thinking..."}
        subtitle={
          isLocalPsychic
            ? `Look at the dial — give 2 clues that hint at the target zone`
            : `${psychic?.name ?? 'The Psychic'} is preparing their clues`
        }
      />

      <ScoreBoard scoreA={gameState.scores.A} scoreB={gameState.scores.B} />

      {/* Card display */}
      <SpectrumCardDisplay card={round.card} size="md" />

      {/* Dial */}
      <div style={{ width: '100%', maxWidth: 460 }}>
        <SpectrumDial
          position={50}
          targetPosition={isLocalPsychic && psychicTarget !== null ? psychicTarget : undefined}
          revealed={false}
          isInteractive={false}
          leftLabel={round.card.left}
          rightLabel={round.card.right}
        />
      </div>

      {isLocalPsychic ? (
        <div
          style={{
            width: '100%',
            maxWidth: 380,
            background: '#3F6F8E',
            border: '2px solid #174766',
            borderRadius: 16,
            padding: '20px 20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          <p style={{ color: '#97BDC9', fontSize: 13, textAlign: 'center', margin: '0 0 14px', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
            The colored zone is the target. Give 2 clues to help your team.
          </p>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Clue 1</label>
            <input
              type="text"
              value={clue1}
              onChange={e => setClue1(e.target.value)}
              onFocus={() => setFocused('c1')}
              onBlur={() => setFocused(null)}
              placeholder="First clue..."
              maxLength={60}
              style={{ ...inputStyle, borderColor: focused === 'c1' ? '#E0AD42' : '#414364' }}
              autoFocus
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Clue 2</label>
            <input
              type="text"
              value={clue2}
              onChange={e => setClue2(e.target.value)}
              onFocus={() => setFocused('c2')}
              onBlur={() => setFocused(null)}
              onKeyDown={e => { if (e.key === 'Enter' && clue1.trim() && clue2.trim()) handleSubmit(); }}
              placeholder="Second clue..."
              maxLength={60}
              style={{ ...inputStyle, borderColor: focused === 'c2' ? '#E0AD42' : '#414364' }}
            />
          </div>
          <Button variant="primary" size="lg" className="w-full" disabled={!clue1.trim() || !clue2.trim()} onClick={handleSubmit}>
            Submit Clues →
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E0AD42', animation: 'pulse 1.5s infinite' }} />
            <span style={{ color: '#97BDC9', fontSize: 14, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
              Waiting for clues...
            </span>
          </div>
          <p style={{ color: '#4A6E8A', fontSize: 12, textAlign: 'center', maxWidth: 280, margin: 0, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
            Only the Psychic can see the target zone right now.
          </p>
        </div>
      )}
    </div>
  );
};
