import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getSequentialCheckLimit } from '../config'
import { useI18n } from '../i18n/I18nContext'
import { useBoxTooltipPreference } from '../preferences/BoxTooltipPreferenceContext'
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

/** Kratší prodlevy při větším počtu vyplněných polí, aby kontrola netrvala nepřiměřeně dlouho. */
function getSequentialStepDelays(cellCount: number): {
  pulseMs: number
  gapMs: number
} {
  if (cellCount <= 5) {
    return { pulseMs: 400, gapMs: 140 }
  }
  const extra = cellCount - 5
  return {
    pulseMs: Math.max(155, 400 - extra * 22),
    gapMs: Math.max(26, 140 - extra * 10),
  }
}

/** Číslice 1–9, které ještě v daném 3×3 bloku nejsou (podle aktuálních hodnot). */
function getMissingDigitsInBox(values: number[][], r: number, c: number): number[] {
  const br = Math.floor(r / 3) * 3
  const bc = Math.floor(c / 3) * 3
  const present = new Set<number>()
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const v = values[br + i][bc + j]
      if (v !== 0) present.add(v)
    }
  }
  const missing: number[] = []
  for (let d = 1; d <= 9; d++) {
    if (!present.has(d)) missing.push(d)
  }
  return missing
}

type SeqHint = 'ok' | 'bad'

function GameSessionView({ difficulty }: { difficulty: Difficulty }) {
  const { t } = useI18n()
  const { boxTooltipEnabled } = useBoxTooltipPreference()
  const { solution, puzzle } = useMemo(() => generatePuzzle(difficulty), [difficulty])
  const fixed = useMemo(
    () => puzzle.map((row) => row.map((cell) => cell !== 0)),
    [puzzle],
  )

  /** Buňky označené jako správné po dokončení postupné kontroly — chovají se jako zadaná pole. */
  const [verifiedGiven, setVerifiedGiven] = useState<Record<string, true>>({})

  const isImmutable = useMemo(() => {
    const g: boolean[][] = Array.from({ length: 9 }, () => Array(9).fill(false))
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        g[r][c] = fixed[r][c] || Boolean(verifiedGiven[`${r}-${c}`])
      }
    }
    return g
  }, [fixed, verifiedGiven])

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
  const selectedBtnRef = useRef<HTMLButtonElement | null>(null)
  const playSurfaceRef = useRef<HTMLDivElement | null>(null)
  const [boxTooltipPos, setBoxTooltipPos] = useState<{
    top: number
    left: number
    transform: string
  } | null>(null)

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

  const applyDigitToSelection = useCallback(
    (digit: number) => {
      if (locked || !selected) return
      const [r, c] = selected
      if (isImmutable[r][c]) return
      setValues((prev) => {
        const next = copyGrid(prev)
        next[r][c] = digit
        return next
      })
      clearSeqHints()
    },
    [clearSeqHints, isImmutable, locked, selected],
  )

  const clearSelectedCell = useCallback(() => {
    if (locked || !selected) return
    const [r, c] = selected
    if (isImmutable[r][c]) return
    setValues((prev) => {
      const next = copyGrid(prev)
      next[r][c] = 0
      return next
    })
    clearSeqHints()
  }, [clearSeqHints, isImmutable, locked, selected])

  const handleCellClick = useCallback(
    (r: number, c: number) => {
      if (locked) return
      if (isImmutable[r][c]) return
      setSelected([r, c])
    },
    [isImmutable, locked],
  )

  const [showNumpad, setShowNumpad] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px), (pointer: coarse)')
    const sync = () => setShowNumpad(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (locked || !selected) return

    const onKey = (e: KeyboardEvent) => {
      const [r, c] = selected
      if (isImmutable[r][c]) return

      if (e.key >= '1' && e.key <= '9') {
        applyDigitToSelection(Number(e.key))
        e.preventDefault()
        return
      }
      if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        clearSelectedCell()
        e.preventDefault()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [
    applyDigitToSelection,
    clearSelectedCell,
    isImmutable,
    locked,
    selected,
  ])

  const userFilledCount = useMemo(() => {
    let n = 0
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (!isImmutable[r][c] && values[r][c] !== 0) n++
      }
    }
    return n
  }, [isImmutable, values])

  const missingInBox = useMemo(() => {
    if (!selected) return []
    return getMissingDigitsInBox(values, selected[0], selected[1])
  }, [selected, values])

  const showBoxTooltip =
    boxTooltipEnabled &&
    selected !== null &&
    !locked &&
    !isImmutable[selected[0]][selected[1]]

  useLayoutEffect(() => {
    if (!showBoxTooltip || missingInBox.length === 0) {
      setBoxTooltipPos(null)
      return
    }
    const btn = selectedBtnRef.current
    if (!btn) {
      setBoxTooltipPos(null)
      return
    }
    const update = () => {
      const el = selectedBtnRef.current
      if (!el) return
      const br = el.getBoundingClientRect()
      const estH = 48
      const margin = 8
      const placeAbove = br.top >= estH + margin + 24
      const top = placeAbove ? br.top - margin : br.bottom + margin
      const transform = placeAbove ? 'translate(-50%, -100%)' : 'translate(-50%, 0)'
      let left = br.left + br.width / 2
      left = Math.max(40, Math.min(window.innerWidth - 40, left))
      setBoxTooltipPos({ top, left, transform })
    }
    update()
    const raf = requestAnimationFrame(update)
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [boxTooltipEnabled, showBoxTooltip, selected, values, missingInBox])

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (selected === null || locked) return
      const root = playSurfaceRef.current
      if (!root) return
      const target = e.target
      if (target instanceof Node && root.contains(target)) return
      setSelected(null)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [locked, selected])

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
        if (!isImmutable[r][c] && values[r][c] !== 0) {
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

    const { pulseMs, gapMs } = getSequentialStepDelays(cells.length)

    const schedule = (index: number) => {
      if (index >= cells.length) {
        setVerifiedGiven((prev) => {
          const next = { ...prev }
          for (const [r, c] of cells) {
            if (values[r][c] === solution[r][c]) {
              next[`${r}-${c}`] = true
            }
          }
          return next
        })
        setSeqHints({})
        setActivePulse(null)
        setSequentialRunning(false)
        setSelected((sel) => {
          if (!sel) return null
          const [sr, sc] = sel
          const wasInRun = cells.some(([r, c]) => r === sr && c === sc)
          if (wasInRun && values[sr][sc] === solution[sr][sc]) {
            return null
          }
          return sel
        })
        return
      }

      const [r, c] = cells[index]
      const key = `${r}-${c}`
      const ok = values[r][c] === solution[r][c]

      setActivePulse(key)
      setSeqHints((prev) => ({ ...prev, [key]: ok ? 'ok' : 'bad' }))

      const t1 = window.setTimeout(() => {
        setActivePulse(null)
        const t2 = window.setTimeout(() => schedule(index + 1), gapMs)
        seqTimersRef.current.push(t2)
      }, pulseMs)
      seqTimersRef.current.push(t1)
    }

    schedule(0)
  }, [
    clearSeqHints,
    clearSeqTimers,
    isImmutable,
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

        <div ref={playSurfaceRef} className="game-play-surface">
        <div className="sudoku-board mx-auto mb-3 mb-md-4" role="grid" aria-label={t('game.grid')}>
          {values.flatMap((row, r) =>
            row.map((cell, c) => {
              const isLocked = isImmutable[r][c]
              const kindClass = fixed[r][c]
                ? 'sudoku-given'
                : verifiedGiven[`${r}-${c}`]
                  ? 'sudoku-verified'
                  : 'sudoku-editable'
              const show = cell !== 0 ? String(cell) : ''
              const isSel = selected?.[0] === r && selected?.[1] === c
              return (
                <button
                  key={`${r}-${c}`}
                  ref={isSel ? selectedBtnRef : undefined}
                  type="button"
                  role="gridcell"
                  disabled={locked || isLocked}
                  className={`${cellClass(r, c)} ${kindClass}${hintClassFor(r, c)}`}
                  aria-describedby={
                    showBoxTooltip &&
                    isSel &&
                    missingInBox.length > 0
                      ? 'sudoku-box-tooltip'
                      : undefined
                  }
                  onClick={() => handleCellClick(r, c)}
                >
                  {show}
                </button>
              )
            }),
          )}
        </div>

        {showBoxTooltip &&
          boxTooltipPos &&
          missingInBox.length > 0 &&
          createPortal(
            <div
              id="sudoku-box-tooltip"
              className="sudoku-box-tooltip"
              role="tooltip"
              aria-label={`${t('game.boxTooltipAria')} ${missingInBox.join(', ')}`}
              style={{
                position: 'fixed',
                top: boxTooltipPos.top,
                left: boxTooltipPos.left,
                transform: boxTooltipPos.transform,
                zIndex: 1060,
              }}
            >
              <span className="sudoku-box-tooltip__digits" aria-hidden>
                {missingInBox.join(' · ')}
              </span>
            </div>,
            document.body,
          )}

        {showNumpad && (
          <div
            className="sudoku-numpad mx-auto mb-3"
            role="group"
            aria-label={t('game.numpadAria')}
          >
            <div className="sudoku-numpad__grid">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
                <button
                  key={d}
                  type="button"
                  className="btn btn-outline-primary sudoku-numpad__digit"
                  disabled={
                    locked ||
                    !selected ||
                    (selected !== null &&
                      isImmutable[selected[0]][selected[1]])
                  }
                  onClick={() => applyDigitToSelection(d)}
                >
                  {d}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-outline-secondary w-100 sudoku-numpad__clear"
              disabled={
                locked ||
                !selected ||
                (selected !== null &&
                  isImmutable[selected[0]][selected[1]])
              }
              onClick={clearSelectedCell}
            >
              {t('game.clearCell')}
            </button>
          </div>
        )}

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
