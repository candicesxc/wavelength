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

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 py-8 gap-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-white mb-1">🌊 Wavelength</h1>
        <p className="text-slate-400">Waiting for players...</p>
      </div>

      {/* Room code */}
      <RoomCode code={gameState.roomCode} />

      {/* Unassigned players */}
      {unassigned.length > 0 && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-slate-500 uppercase tracking-wider">Unassigned</span>
          <div className="flex flex-wrap gap-2 justify-center">
            {unassigned.map(p => (
              <span
                key={p.id}
                className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm"
              >
                {p.name}
                {p.id === localPlayerId && ' (you)'}
                {p.isHost && ' 👑'}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Team panels */}
      <div className="flex gap-4 w-full max-w-lg">
        <TeamPanel
          team="A"
          players={gameState.players}
          localPlayerId={localPlayerId}
          onJoinTeam={handleJoinTeam}
        />
        <TeamPanel
          team="B"
          players={gameState.players}
          localPlayerId={localPlayerId}
          onJoinTeam={handleJoinTeam}
        />
      </div>

      {/* Host controls */}
      <div className="flex flex-col items-center gap-3 w-full max-w-sm">
        {isHost && (
          <>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              disabled={!canStart}
              onClick={handleStartGame}
            >
              {canStart ? '🚀 Start Game' : 'Need 1 player per team'}
            </Button>
            {!canStart && (
              <p className="text-slate-500 text-xs text-center">
                Assign at least one player to each team to begin
              </p>
            )}
          </>
        )}
        {!isHost && (
          <p className="text-slate-500 text-sm text-center">
            Waiting for the host to start the game...
          </p>
        )}
        <Button variant="ghost" size="sm" onClick={onOpenCardEditor}>
          ✏️ Custom Cards
        </Button>
      </div>
    </div>
  );
};
