// Storage utilities for local offline persistence of stars & achievements

const STARS_STORAGE_KEY = 'belajar_pintar_anak_bintang_v1';

export function getLocalStars(): number {
  if (typeof window === 'undefined') return 5;
  try {
    const saved = localStorage.getItem(STARS_STORAGE_KEY);
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      return isNaN(parsed) || parsed < 0 ? 0 : parsed;
    }
    // Default starter reward for the child: 5 stars to make them feel proud immediately
    localStorage.setItem(STARS_STORAGE_KEY, '5');
    return 5;
  } catch {
    return 5;
  }
}

export function saveLocalStars(count: number): void {
  if (typeof window === 'undefined') return;
  try {
    const safeCount = Math.max(0, Math.floor(count));
    localStorage.setItem(STARS_STORAGE_KEY, safeCount.toString());
  } catch (e) {
    console.error('Failed to save stars locally', e);
  }
}

export function incrementStars(amount: number = 1): number {
  const current = getLocalStars();
  const safeAmount = Math.max(0, amount);
  const next = Math.max(0, current + safeAmount);
  saveLocalStars(next);
  return next;
}

export function resetStarsToDefault(): number {
  saveLocalStars(0);
  return 0;
}

