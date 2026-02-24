// Scoring logic ported from dansarno/wavelength-game device.js checkScore()
// Scale: 0–100. Source used 0–10 with targetWidth=0.4.
// We use 0–100 scale, effective half-width = 2 units (= 0.2 * 10).

const HALF_WIDTH = 2; // half of targetWidth=4 on 0-100 scale

export type ScoreZone = 'bullseye' | 'inner' | 'outer' | 'miss';

export function calcGuessPoints(
  target: number,
  dial: number
): { points: 0 | 2 | 3 | 4; zone: ScoreZone } {
  const d = Math.abs(target - dial);
  if (d <= HALF_WIDTH * 1) return { points: 4, zone: 'bullseye' };
  if (d <= HALF_WIDTH * 3) return { points: 3, zone: 'inner' };
  if (d <= HALF_WIDTH * 5) return { points: 2, zone: 'outer' };
  return { points: 0, zone: 'miss' };
}

// Bonus 1pt for opposing team if they guessed the correct side,
// BUT only if the active team did NOT score a bull's-eye (4pts).
// Ported from game.js makeGuess() meta-guess logic.
export function calcBonusPoint(
  target: number,
  dial: number,
  guess: 'left' | 'right' | null,
  guessPoints: number
): number {
  if (guessPoints === 4 || guess === null) return 0;
  // "left" means target is to the LEFT of where the dial landed
  const correct: 'left' | 'right' = target < dial ? 'left' : 'right';
  return guess === correct ? 1 : 0;
}
