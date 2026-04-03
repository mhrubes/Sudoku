import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getSequentialCheckLimit } from '../config'
import { useI18n } from '../i18n/I18nContext'
import {
  type Difficulty,
  generatePuzzle,
  isBoardComplete,
  matchesSolution,
  parseDifficulty,
} from '../lib/sudoku'

function copyGrid(g: number[][]): number[][] {
  return g.map((row) => [...row])
}

function formatElapsed(totalSec: number): string {
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

type SeqHint = 'ok' | 'bad'

function GameSessionView({ difficulty }: { difficulty: Difficulty }) {
  const { t } = useI18n()
  const { solution, puzzle } = useMemo(() => generatePuzzle(difficulty), [difficulty])
  const fixed = useMemo(
    () => puzzle.map((row) => row.map((cell) => cell !== 0)),
    [puzzle],
  )

  const [values, setValues] = useState(() => copyGrid(puzzle))
  const [selected, setSelected] = useState<[number, number] | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [isSolved, setIsSolved] = useState(false)

  const [seqHints, setSeqHints] = useState<Record<string, SeqHint>>({})
  const [activePulse, setActivePulse] = useState<string | null>(null)
  const [sequentialRunning, setSequentialRunning] = useState(false)
  const [sequentialUsesLeft, setSequentialUsesLeft] = useState(() =>
    getSequentialCheckLimit(difficulty),
  )
  const [elapsedSec, setElapsedSec] = useState(0)
  const seqTimersRef = useRef<number[]>([])

  useEffect(() => {
    if (isSolved) return
    const id = window.setInterval(() => {
      setElapsedSec((sec) => sec + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [isSolved])

  const clearSeqTimers = useCallback(() => {
    seqTimersRef.current.forEach((id) => clearTimeout(id))
    seqTimersRef.current = []
  }, [])

  useEffect(() => () => clearSeqTimers(), [clearSeqTimers])

  const locked = isValidating || isSolved || sequentialRunning

  const clearSeqHints = useCallback(() => {
    setSeqHints({})
    setActivePulse(null)
  }, [])

  const handleCellClick = useCallback(
    (r: number, c: number) => {
      if (locked) return
      if (fixed[r][c]) return
      setSelected([r, c])
    },
    [fixed, locked],
  )

  useEffect(() => {
    if (locked || !selected) return

    const onKey = (e: KeyboardEvent) => {
      const [r, c] = selected
      if (fixed[r][c]) return

      if (e.key >= '1' && e.key <= '9') {
        const n = Number(e.key)
        setValues((prev) => {
          const next = copyGrid(prev)
          next[r][c] = n
          return next
        })
        clearSeqHints()
        e.preventDefault()
        return
      }
      if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        setValues((prev) => {
          const next = copyGrid(prev)
          next[r][c] = 0
          return next
        })
        clearSeqHints()
        e.preventDefault()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [clearSeqHints, fixed, locked, selected])

  const userFilledCount = useMemo(() => {
    let n = 0
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (!fixed[r][c] && values[r][c] !== 0) n++
      }
    }
    return n
  }, [fixed, values])

  const handleCheck = useCallback(async () => {
    if (locked) return
    if (!isBoardComplete(values)) {
      toast.error(t('toast.fillAll'), { position: 'top-center' })
      return
    }

    setIsValidating(true)
    await new Promise((resolve) => setTimeout(resolve, 150))

    const ok = matchesSolution(values, solution)
    setIsValidating(false)

    if (ok) {
      setIsSolved(true)
      toast.success(t('toast.solved'), {
        position: 'top-center',
        autoClose: 4000,
      })
    } else {
      toast.error(t('toast.wrong'), { position: 'top-center' })
    }
  }, [locked, solution, t, values])

  const handleSequentialCheck = useCallback(() => {
    if (locked) return

    if (sequentialUsesLeft <= 0) {
      toast.warning(t('toast.sequentialExhausted'), { position: 'top-center' })
      return
    }

    const cells: [number, number][] = []
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (!fixed[r][c] && values[r][c] !== 0) {
          cells.push([r, c])
        }
      }
    }

    if (cells.length === 0) {
      toast.info(t('toast.sequentialNeedCells'), {
        position: 'top-center',
      })
      return
    }

    setSequentialUsesLeft((n) => Math.max(0, n - 1))

    clearSeqTimers()
    clearSeqHints()
    setSequentialRunning(true)

    const schedule = (index: number) => {
      if (index >= cells.length) {
        setSequentialRunning(false)
        setActivePulse(null)
        return
      }

      const [r, c] = cells[index]
      const key = `${r}-${c}`
      const ok = values[r][c] === solution[r][c]

      setActivePulse(key)
      setSeqHints((prev) => ({ ...prev, [key]: ok ? 'ok' : 'bad' }))

      const t1 = window.setTimeout(() => {
        setActivePulse(null)
        const t2 = window.setTimeout(() => schedule(index + 1), 140)
        seqTimersRef.current.push(t2)
      }, 400)
      seqTimersRef.current.push(t1)
    }

    schedule(0)
  }, [
    clearSeqHints,
    clearSeqTimers,
    fixed,
    locked,
    sequentialUsesLeft,
    solution,
    t,
    values,
  ])

  const cellClass = useMemo(() => {
    return (r: number, c: number) => {
      const base = 'sudoku-cell d-flex align-items-center justify-content-center user-select-none'
      const boxBorderR = (c + 1) % 3 === 0 && c < 8 ? ' sudoku-thick-right' : ''
      const boxBorderB = (r + 1) % 3 === 0 && r < 8 ? ' sudoku-thick-bottom' : ''
      const sel =
        selected && selected[0] === r && selected[1] === c ? ' sudoku-selected' : ''
      return base + boxBorderR + boxBorderB + sel
    }
  }, [selected])

  const hintClassFor = useCallback(
    (r: number, c: number) => {
      const key = `${r}-${c}`
      const h = seqHints[key]
      if (!h) return ''
      const pulse = activePulse === key ? ' sudoku-seq-pulse' : ''
      return h === 'ok' ? ` sudoku-seq-ok${pulse}` : ` sudoku-seq-bad${pulse}`
    },
    [activePulse, seqHints],
  )

  const diffLabel = t(`difficulty.${difficulty}`)

  return (
    <div className="py-2 py-md-4">
      <div className="container-fluid px-2 px-sm-3 mx-auto" style={{ maxWidth: 520 }}>
        <div className="game-toolbar mb-3">
          <Link
            to="/"
            className="btn btn-outline-secondary btn-sm game-toolbar__back"
          >
            {t('game.back')}
          </Link>
          <div
            className="game-toolbar__timer font-monospace tabular-nums"
            role="timer"
            aria-live="polite"
            aria-label={t('game.timerAria')}
          >
            {formatElapsed(elapsedSec)}
          </div>
          <span className="text-muted small game-toolbar__level">
            {t('game.level')} {diffLabel}
          </span>
        </div>

        <div className="sudoku-board mx-auto mb-3 mb-md-4" role="grid" aria-label={t('game.grid')}>
          {values.flatMap((row, r) =>
            row.map((cell, c) => {
              const isFixed = fixed[r][c]
              const show = cell !== 0 ? String(cell) : ''
              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  role="gridcell"
                  disabled={locked || isFixed}
                  className={`${cellClass(r, c)} ${isFixed ? 'sudoku-given' : 'sudoku-editable'}${hintClassFor(r, c)}`}
                  onClick={() => handleCellClick(r, c)}
                >
                  {show}
                </button>
              )
            }),
          )}
        </div>

        <div className="game-actions">
          <button
            type="button"
            className="btn btn-outline-primary text-wrap"
            disabled={
              locked ||
              isSolved ||
              userFilledCount === 0 ||
              sequentialUsesLeft <= 0
            }
            onClick={handleSequentialCheck}
          >
            {sequentialRunning
              ? t('game.checking')
              : `${t('game.sequential')} (${sequentialUsesLeft})`}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={locked || isSolved}
            onClick={handleCheck}
          >
            {isValidating ? t('game.checking') : t('game.finish')}
          </button>
        </div>

        <p className="text-center text-muted small mt-3 mb-0 px-1 lh-sm game-help">
          {t('game.help')}
        </p>
      </div>
    </div>
  )
}

export function Game() {
  const { difficulty: diffParam } = useParams<{ difficulty: string }>()
  const difficulty = parseDifficulty(diffParam)
  const location = useLocation()

  if (!difficulty) {
    return <Navigate to="/" replace />
  }

  return <GameSessionView key={location.key} difficulty={difficulty} />
}
