export type GamePhase = 'LOBBY' | 'CLUE_GIVING' | 'GUESSING' | 'LEFT_RIGHT' | 'SCORING' | 'GAME_OVER';
export type TeamId = 'A' | 'B';

export interface Player {
  id: string;         // socket.id
  name: string;
  team: TeamId | null;
  isPsychic: boolean;
  isHost: boolean;
}

export interface SpectrumCard {
  id: string;
  left: string;
  right: string;
  isCustom?: boolean;
}

export interface RoundState {
  roundNumber: number;
  activeTeam: TeamId;
  card: SpectrumCard;
  clue1: string | null;
  clue2: string | null;
  dialPosition: number;        // 0–100
  leftRightGuess: 'left' | 'right' | null;
  pointsAwarded: { activeTeam: number; opposingTeam: number };
}

export interface PublicGameState {
  roomCode: string;
  phase: GamePhase;
  players: Player[];
  scores: { A: number; B: number };
  round: RoundState | null;
  revealedTargetPosition?: number;  // ONLY populated during SCORING phase
}
