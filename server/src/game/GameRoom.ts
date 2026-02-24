import { GamePhase, Player, PublicGameState, RoundState, SpectrumCard, TeamId } from '../types/game';
import { BUILT_IN_CARDS } from '../constants/cards';
import { calcBonusPoint, calcGuessPoints } from './scoring';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export class GameRoom {
  private players: Player[] = [];
  private phase: GamePhase = 'LOBBY';
  private scores: { A: number; B: number } = { A: 0, B: 0 };
  private round: RoundState | null = null;
  private privateTarget: number | null = null;
  private deck: SpectrumCard[] = [];
  private deckIndex = 0;
  private roundNumber = 0;
  // Track psychic indices per team (rotate within team)
  private psychicIndices: { A: number; B: number } = { A: 0, B: 0 };
  // Which team goes first this round (alternates each round)
  private activeTeam: TeamId = 'A';

  constructor(public readonly roomCode: string) {}

  // ─── Players ───────────────────────────────────────────────────────────────

  addPlayer(id: string, name: string, isHost: boolean): Player {
    const player: Player = { id, name, team: null, isPsychic: false, isHost };
    this.players.push(player);
    return player;
  }

  removePlayer(id: string): void {
    this.players = this.players.filter(p => p.id !== id);
  }

  assignTeam(playerId: string, team: TeamId): void {
    const p = this.players.find(p => p.id === playerId);
    if (p) p.team = team;
  }

  getPlayer(id: string): Player | undefined {
    return this.players.find(p => p.id === id);
  }

  getPlayerCount(): number {
    return this.players.length;
  }

  // ─── Game Start ────────────────────────────────────────────────────────────

  startGame(customCards: SpectrumCard[]): void {
    const allCards = [...BUILT_IN_CARDS, ...customCards];
    this.deck = shuffle(allCards);
    this.deckIndex = 0;
    this.scores = { A: 0, B: 0 };
    this.roundNumber = 0;
    this.activeTeam = 'A';
    this.psychicIndices = { A: 0, B: 0 };
    this.phase = 'CLUE_GIVING';
    this._beginRound();
  }

  // ─── Round Lifecycle ───────────────────────────────────────────────────────

  private _beginRound(): void {
    this.roundNumber++;
    if (this.deckIndex >= this.deck.length) {
      this.deck = shuffle(this.deck);
      this.deckIndex = 0;
    }
    const card = this.deck[this.deckIndex++];
    this.privateTarget = Math.floor(Math.random() * 101); // 0-100 inclusive

    // Clear psychic flags then set the new psychic
    this.players.forEach(p => (p.isPsychic = false));
    const psychic = this._pickPsychic(this.activeTeam);
    if (psychic) psychic.isPsychic = true;

    this.round = {
      roundNumber: this.roundNumber,
      activeTeam: this.activeTeam,
      card,
      clue1: null,
      clue2: null,
      dialPosition: 50,
      leftRightGuess: null,
      pointsAwarded: { activeTeam: 0, opposingTeam: 0 },
    };
  }

  private _pickPsychic(team: TeamId): Player | undefined {
    const teamPlayers = this.players.filter(p => p.team === team);
    if (teamPlayers.length === 0) return undefined;
    const idx = this.psychicIndices[team] % teamPlayers.length;
    return teamPlayers[idx];
  }

  private _advancePsychicIndex(): void {
    if (!this.round) return;
    const team = this.round.activeTeam;
    this.psychicIndices[team]++;
  }

  // ─── Phase Actions ─────────────────────────────────────────────────────────

  submitClues(playerId: string, clue1: string, clue2: string): void {
    if (this.phase !== 'CLUE_GIVING') throw new Error('Not in CLUE_GIVING phase');
    const player = this.getPlayer(playerId);
    if (!player?.isPsychic) throw new Error('Only the Psychic can submit clues');
    if (!this.round) throw new Error('No active round');
    this.round.clue1 = clue1.trim();
    this.round.clue2 = clue2.trim();
    this.phase = 'GUESSING';
  }

  updateDial(playerId: string, position: number): void {
    if (this.phase !== 'GUESSING') return;
    if (!this.round) return;
    const player = this.getPlayer(playerId);
    if (!player) return;
    // Only active team (non-psychic) can move the dial
    if (player.team !== this.round.activeTeam) return;
    if (player.isPsychic) return;
    this.round.dialPosition = Math.max(0, Math.min(100, position));
  }

  lockGuess(playerId: string): void {
    if (this.phase !== 'GUESSING') throw new Error('Not in GUESSING phase');
    const player = this.getPlayer(playerId);
    if (!player) throw new Error('Unknown player');
    if (!this.round) throw new Error('No active round');
    if (player.team !== this.round.activeTeam) throw new Error('Not on active team');
    // Skip LEFT_RIGHT in 2-player mode
    if (this.players.length <= 2) {
      this._resolveScoring();
    } else {
      this.phase = 'LEFT_RIGHT';
    }
  }

  lockLeftRight(playerId: string, guess: 'left' | 'right'): void {
    if (this.phase !== 'LEFT_RIGHT') throw new Error('Not in LEFT_RIGHT phase');
    const player = this.getPlayer(playerId);
    if (!player) throw new Error('Unknown player');
    if (!this.round) throw new Error('No active round');
    // Only opposing team votes
    const opposingTeam: TeamId = this.round.activeTeam === 'A' ? 'B' : 'A';
    if (player.team !== opposingTeam) throw new Error('Not on opposing team');
    this.round.leftRightGuess = guess;
    this._resolveScoring();
  }

  private _resolveScoring(): void {
    if (!this.round || this.privateTarget === null) return;
    const { points: guessPoints } = calcGuessPoints(this.privateTarget, this.round.dialPosition);
    const bonusPoint = calcBonusPoint(
      this.privateTarget,
      this.round.dialPosition,
      this.round.leftRightGuess,
      guessPoints
    );
    this.round.pointsAwarded = { activeTeam: guessPoints, opposingTeam: bonusPoint };
    this.scores[this.round.activeTeam] += guessPoints;
    const opposingTeam: TeamId = this.round.activeTeam === 'A' ? 'B' : 'A';
    this.scores[opposingTeam] += bonusPoint;
    this.phase = 'SCORING';
  }

  nextRound(): void {
    if (this.phase !== 'SCORING') throw new Error('Not in SCORING phase');
    // Check win condition
    if (this.scores.A >= 10 || this.scores.B >= 10) {
      this.phase = 'GAME_OVER';
      return;
    }
    // Advance psychic rotation and switch active team
    this._advancePsychicIndex();
    this.activeTeam = this.activeTeam === 'A' ? 'B' : 'A';
    this.phase = 'CLUE_GIVING';
    this._beginRound();
  }

  // ─── State Accessors ───────────────────────────────────────────────────────

  getPrivateTarget(): number | null {
    return this.privateTarget;
  }

  getPsychicId(): string | null {
    return this.players.find(p => p.isPsychic)?.id ?? null;
  }

  getPublicState(): PublicGameState {
    const state: PublicGameState = {
      roomCode: this.roomCode,
      phase: this.phase,
      players: this.players.map(p => ({ ...p })),
      scores: { ...this.scores },
      round: this.round ? { ...this.round } : null,
    };
    // Only reveal target during SCORING phase
    if (this.phase === 'SCORING' && this.privateTarget !== null) {
      state.revealedTargetPosition = this.privateTarget;
    }
    return state;
  }

  canStart(): boolean {
    const teamA = this.players.filter(p => p.team === 'A');
    const teamB = this.players.filter(p => p.team === 'B');
    return teamA.length >= 1 && teamB.length >= 1 && this.players.length >= 2;
  }
}
