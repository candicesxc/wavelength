import type { SpectrumCard } from '../types/game';

const CUSTOM_CARDS_KEY = 'wavelength_custom_cards';

export function getCustomCards(): SpectrumCard[] {
  try {
    const raw = localStorage.getItem(CUSTOM_CARDS_KEY);
    return raw ? (JSON.parse(raw) as SpectrumCard[]) : [];
  } catch {
    return [];
  }
}

export function saveCustomCard(card: SpectrumCard): void {
  const existing = getCustomCards();
  localStorage.setItem(CUSTOM_CARDS_KEY, JSON.stringify([...existing, card]));
}

export function deleteCustomCard(id: string): void {
  const existing = getCustomCards();
  localStorage.setItem(
    CUSTOM_CARDS_KEY,
    JSON.stringify(existing.filter(c => c.id !== id))
  );
}

export function clearCustomCards(): void {
  localStorage.removeItem(CUSTOM_CARDS_KEY);
}
