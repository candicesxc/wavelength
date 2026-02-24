import React from 'react';
import type { Player, TeamId } from '../../types/game';
import { Button } from './Button';

interface TeamPanelProps {
  team: TeamId;
  players: Player[];
  localPlayerId: string | null;
  onJoinTeam: (team: TeamId) => void;
  disabled?: boolean;
}

export const TeamPanel: React.FC<TeamPanelProps> = ({
  team,
  players,
  localPlayerId,
  onJoinTeam,
  disabled = false,
}) => {
  const teamPlayers = players.filter(p => p.team === team);
  const localInTeam = teamPlayers.some(p => p.id === localPlayerId);
  const isTeamA = team === 'A';

  return (
    <div
      className={`flex flex-col gap-3 p-4 rounded-2xl border ${
        isTeamA
          ? 'bg-blue-950/30 border-blue-800/40'
          : 'bg-red-950/30 border-red-800/40'
      } min-h-[160px] flex-1`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isTeamA ? 'bg-blue-500' : 'bg-red-500'}`} />
          <span className={`font-bold text-lg ${isTeamA ? 'text-blue-400' : 'text-red-400'}`}>
            Team {team}
          </span>
        </div>
        <span className="text-xs text-slate-500">{teamPlayers.length} player{teamPlayers.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="flex flex-col gap-1.5 flex-1">
        {teamPlayers.length === 0 ? (
          <span className="text-slate-600 text-sm italic">No players yet</span>
        ) : (
          teamPlayers.map(p => (
            <div key={p.id} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isTeamA ? 'bg-blue-400' : 'bg-red-400'}`} />
              <span className={`text-sm ${p.id === localPlayerId ? 'text-white font-semibold' : 'text-slate-300'}`}>
                {p.name}
                {p.id === localPlayerId && ' (you)'}
                {p.isHost && <span className="ml-1 text-amber-400 text-xs">👑</span>}
              </span>
            </div>
          ))
        )}
      </div>

      {!localInTeam && !disabled && (
        <Button
          variant={isTeamA ? 'team-a' : 'team-b'}
          size="sm"
          onClick={() => onJoinTeam(team)}
          className="w-full mt-auto"
        >
          Join Team {team}
        </Button>
      )}
    </div>
  );
};
