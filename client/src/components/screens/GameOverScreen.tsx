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
    gameState.scores.A >= 10
      ? 'A'
      : gameState.scores.B >= 10
      ? 'B'
      : null;

  const localPlayer = gameState.players.find(p => p.id === localPlayerId);
  const localTeam = localPlayer?.team ?? null;
  const isHost = localPlayer?.isHost ?? false;
  const didWin = localTeam === winnerTeam;

  const handlePlayAgain = () => {
    const customCards = getCustomCards();
    socket.emit('game:start', { customCards });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 py-8 gap-8">
      {/* Result */}
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="text-6xl">{didWin ? '🏆' : '🌊'}</span>
        <h1 className="text-4xl font-extrabold text-white">
          {winnerTeam ? `Team ${winnerTeam} Wins!` : 'Game Over'}
        </h1>
        {localTeam && (
          <p className={`text-xl font-semibold ${didWin ? 'text-amber-400' : 'text-slate-400'}`}>
            {didWin ? 'Your team won! 🎉' : 'Better luck next time!'}
          </p>
        )}
      </div>

      {/* Final scores */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm text-slate-500 uppercase tracking-wider">Final Score</span>
        <ScoreBoard scoreA={gameState.scores.A} scoreB={gameState.scores.B} />
      </div>

      {/* Players */}
      <div className="flex gap-6 flex-wrap justify-center">
        {(['A', 'B'] as const).map(team => {
          const teamPlayers = gameState.players.filter(p => p.team === team);
          const isWinner = winnerTeam === team;
          return (
            <div
              key={team}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${
                isWinner
                  ? team === 'A'
                    ? 'bg-blue-950/50 border-blue-500'
                    : 'bg-red-950/50 border-red-500'
                  : 'bg-slate-800 border-slate-700'
              }`}
            >
              <span
                className={`font-bold text-lg ${
                  isWinner ? (team === 'A' ? 'text-blue-400' : 'text-red-400') : 'text-slate-400'
                }`}
              >
                {isWinner && '🏆 '}Team {team}
              </span>
              {teamPlayers.map(p => (
                <span key={p.id} className="text-slate-300 text-sm">
                  {p.name}
                </span>
              ))}
            </div>
          );
        })}
      </div>

      {/* Play again — only host */}
      {isHost && (
        <Button variant="primary" size="lg" onClick={handlePlayAgain}>
          🔄 Play Again
        </Button>
      )}
      {!isHost && (
        <p className="text-slate-500 text-sm">Waiting for the host to start a new game...</p>
      )}
    </div>
  );
};
