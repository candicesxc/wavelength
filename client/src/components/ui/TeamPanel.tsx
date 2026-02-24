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

const TEAM_STYLES = {
  A: {
    border: '#2A5A7A',
    bg: 'rgba(42,90,122,0.35)',
    labelColor: '#97BDC9',
    dotColor: '#97BDC9',
    label: 'Left Brain',
  },
  B: {
    border: '#7A3522',
    bg: 'rgba(122,53,34,0.35)',
    labelColor: '#DF6B50',
    dotColor: '#DF6B50',
    label: 'Right Brain',
  },
};

export const TeamPanel: React.FC<TeamPanelProps> = ({
  team,
  players,
  localPlayerId,
  onJoinTeam,
  disabled = false,
}) => {
  const teamPlayers = players.filter(p => p.team === team);
  const localInTeam = teamPlayers.some(p => p.id === localPlayerId);
  const ts = TEAM_STYLES[team];

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: 16,
        borderRadius: 16,
        border: `2px solid ${ts.border}`,
        background: ts.bg,
        minHeight: 160,
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: ts.dotColor }} />
          <span style={{ fontWeight: 700, fontSize: 16, color: ts.labelColor }}>{ts.label}</span>
        </div>
        <span style={{ fontSize: 11, color: '#80AAB2' }}>
          {teamPlayers.length} player{teamPlayers.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Players */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {teamPlayers.length === 0 ? (
          <span style={{ color: '#4A6E8A', fontSize: 13, fontStyle: 'italic' }}>No players yet</span>
        ) : (
          teamPlayers.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: ts.dotColor, opacity: 0.6 }} />
              <span
                style={{
                  fontSize: 13,
                  color: p.id === localPlayerId ? '#F1ECC2' : '#97BDC9',
                  fontWeight: p.id === localPlayerId ? 700 : 400,
                }}
              >
                {p.name}
                {p.id === localPlayerId && ' (you)'}
                {p.isHost && ' 👑'}
              </span>
            </div>
          ))
        )}
      </div>

      {!localInTeam && !disabled && (
        <Button
          variant={team === 'A' ? 'team-a' : 'team-b'}
          size="sm"
          onClick={() => onJoinTeam(team)}
          className="w-full mt-auto"
        >
          Join {ts.label}
        </Button>
      )}
    </div>
  );
};
