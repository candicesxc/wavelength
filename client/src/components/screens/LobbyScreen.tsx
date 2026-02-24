import React from 'react';
import { socket } from '../../lib/socket';
import type { PublicGameState, TeamId } from '../../types/game';
import { getCustomCards } from '../../lib/localStorage';
import { RoomCode } from '../ui/RoomCode';
import { TeamPanel } from '../ui/TeamPanel';
import { Button } from '../ui/Button';

interface LobbyScreenProps {
  gameState: PublicGameState;
  localPlayerId: string | null;
  onOpenCardEditor: () => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  gameState,
  localPlayerId,
  onOpenCardEditor,
}) => {
  const localPlayer = gameState.players.find(p => p.id === localPlayerId);
  const isHost = localPlayer?.isHost ?? false;

  const handleJoinTeam = (team: TeamId) => {
    socket.emit('player:assign_team', { team });
  };

  const handleStartGame = () => {
    const customCards = getCustomCards();
    socket.emit('game:start', { customCards });
  };

  const teamA = gameState.players.filter(p => p.team === 'A');
  const teamB = gameState.players.filter(p => p.team === 'B');
  const canStart = isHost && teamA.length >= 1 && teamB.length >= 1;
  const unassigned = gameState.players.filter(p => p.team === null);

  const boardStyle: React.CSSProperties = {
    background: '#3F6F8E',
    border: '3px solid #174766',
    borderRadius: 20,
    padding: '32px 24px',
    width: '100%',
    maxWidth: 480,
    boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 gap-6"
      style={{ background: '#0F1132' }}
    >
      {/* Game board container */}
      <div style={boardStyle}>
        {/* Title */}
        <div className="text-center mb-6">
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#F1ECC2', margin: 0, lineHeight: 1.1 }}>
            Wavelength
          </h1>
          <div style={{ width: 50, height: 3, background: '#E0AD42', borderRadius: 2, margin: '8px auto 4px' }} />
          <p style={{ color: '#80AAB2', fontSize: 13, margin: 0 }}>Waiting for players...</p>
        </div>

        {/* Room code */}
        <div className="mb-6">
          <RoomCode code={gameState.roomCode} />
        </div>

        {/* Unassigned players */}
        {unassigned.length > 0 && (
          <div className="mb-4 text-center">
            <span style={{ fontSize: 11, color: '#80AAB2', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
              Unassigned
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 6 }}>
              {unassigned.map(p => (
                <span
                  key={p.id}
                  style={{
                    background: '#2D2F50',
                    color: '#97BDC9',
                    padding: '4px 12px',
                    borderRadius: 20,
                    fontSize: 13,
                    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                  }}
                >
                  {p.name}{p.id === localPlayerId && ' (you)'}{p.isHost && ' 👑'}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Team panels */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <TeamPanel team="A" players={gameState.players} localPlayerId={localPlayerId} onJoinTeam={handleJoinTeam} />
          <TeamPanel team="B" players={gameState.players} localPlayerId={localPlayerId} onJoinTeam={handleJoinTeam} />
        </div>

        {/* Host controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          {isHost && (
            <>
              <Button variant="primary" size="lg" className="w-full" disabled={!canStart} onClick={handleStartGame}>
                {canStart ? '🚀 Start Game' : 'Need 1 player per team'}
              </Button>
              {!canStart && (
                <p style={{ color: '#80AAB2', fontSize: 12, textAlign: 'center', margin: 0 }}>
                  Assign at least one player to each team to begin
                </p>
              )}
            </>
          )}
          {!isHost && (
            <p style={{ color: '#80AAB2', fontSize: 13, textAlign: 'center' }}>
              Waiting for the host to start the game...
            </p>
          )}
          <Button variant="ghost" size="sm" onClick={onOpenCardEditor}>
            ✏️ Custom Cards
          </Button>
        </div>
      </div>
    </div>
  );
};
