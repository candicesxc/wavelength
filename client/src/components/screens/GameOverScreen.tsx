import React from 'react';
import { socket } from '../../lib/socket';
import type { PublicGameState } from '../../types/game';
import { ScoreBoard } from '../ui/ScoreBoard';
import { Button } from '../ui/Button';
import { getCustomCards } from '../../lib/localStorage';

interface GameOverScreenProps {
  gameState: PublicGameState;
  localPlayerId: string | null;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ gameState, localPlayerId }) => {
  const winnerTeam =
    gameState.scores.A >= 10 ? 'A' : gameState.scores.B >= 10 ? 'B' : null;

  const localPlayer = gameState.players.find(p => p.id === localPlayerId);
  const localTeam = localPlayer?.team ?? null;
  const isHost = localPlayer?.isHost ?? false;
  const didWin = localTeam === winnerTeam;

  const handlePlayAgain = () => {
    const customCards = getCustomCards();
    socket.emit('game:start', { customCards });
  };

  const TEAM_STYLES: Record<string, { border: string; bg: string; textColor: string; label: string }> = {
    A: { border: '#2A5A7A', bg: 'rgba(42,90,122,0.35)', textColor: '#97BDC9', label: 'Left Brain' },
    B: { border: '#7A3522', bg: 'rgba(122,53,34,0.35)', textColor: '#DF6B50', label: 'Right Brain' },
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 gap-6"
      style={{ background: '#0F1132' }}
    >
      {/* Win/lose announcement */}
      <div
        style={{
          background: '#3F6F8E',
          border: '3px solid #174766',
          borderRadius: 20,
          padding: '32px 40px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ fontSize: 64, lineHeight: 1, marginBottom: 12 }}>
          {didWin ? '🏆' : '🌊'}
        </div>
        <h1 style={{
          fontSize: 36,
          fontWeight: 900,
          color: '#F1ECC2',
          margin: '0 0 8px',
          fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        }}>
          {winnerTeam
            ? `${TEAM_STYLES[winnerTeam]?.label ?? `Team ${winnerTeam}`} Wins!`
            : 'Game Over'}
        </h1>
        {localTeam && (
          <p style={{
            fontSize: 18,
            fontWeight: 700,
            color: didWin ? '#E0AD42' : '#80AAB2',
            margin: 0,
            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
          }}>
            {didWin ? 'Your team won! 🎉' : 'Better luck next time!'}
          </p>
        )}
      </div>

      {/* Final scores */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: '#80AAB2', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
          Final Score
        </span>
        <ScoreBoard scoreA={gameState.scores.A} scoreB={gameState.scores.B} />
      </div>

      {/* Team players */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        {(['A', 'B'] as const).map(team => {
          const teamPlayers = gameState.players.filter(p => p.team === team);
          const isWinner = winnerTeam === team;
          const ts = TEAM_STYLES[team];
          return (
            <div
              key={team}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                padding: '16px 24px', borderRadius: 16,
                border: `2px solid ${isWinner ? ts.border : '#2D2F50'}`,
                background: isWinner ? ts.bg : 'rgba(45,47,80,0.3)',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 15, color: isWinner ? ts.textColor : '#80AAB2', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                {isWinner && '🏆 '}{ts.label}
              </span>
              {teamPlayers.map(p => (
                <span key={p.id} style={{ color: '#97BDC9', fontSize: 13, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                  {p.name}
                </span>
              ))}
            </div>
          );
        })}
      </div>

      {isHost && (
        <Button variant="primary" size="lg" onClick={handlePlayAgain}>
          🔄 Play Again
        </Button>
      )}
      {!isHost && (
        <p style={{ color: '#80AAB2', fontSize: 13, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
          Waiting for the host to start a new game...
        </p>
      )}
    </div>
  );
};
