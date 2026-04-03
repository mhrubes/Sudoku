import type { Difficulty } from './lib/sudoku'

/** Výchozí počet postupných kontrol na hru, pokud chybí nebo je neplatná hodnota v .env */
const DEFAULT_SEQUENTIAL_CHECKS = 5

function parseSequentialLimit(raw: string | undefined): number {
  if (raw === undefined || String(raw).trim() === '') {
    return DEFAULT_SEQUENTIAL_CHECKS
  }
  const n = Number.parseInt(String(raw).trim(), 10)
  if (!Number.isFinite(n) || n < 0) {
    return DEFAULT_SEQUENTIAL_CHECKS
  }
  return Math.min(n, 9999)
}

/**
 * Limity načtené z .env (Vite vyžaduje prefix VITE_).
 * Soubor .env v kořeni projektu, viz .env.example
 */
export const sequentialCheckLimits: Record<Difficulty, number> = {
  easy: parseSequentialLimit(import.meta.env.VITE_SEQUENTIAL_CHECK_EASY),
  medium: parseSequentialLimit(import.meta.env.VITE_SEQUENTIAL_CHECK_MEDIUM),
  hard: parseSequentialLimit(import.meta.env.VITE_SEQUENTIAL_CHECK_HARD),
}

export function getSequentialCheckLimit(difficulty: Difficulty): number {
  return sequentialCheckLimits[difficulty]
}
