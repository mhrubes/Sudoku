import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const STORAGE_KEY = 'sudoku-box-tooltip-hint'

function readStored(): boolean {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === '0') return false
    if (v === '1') return true
  } catch {
    /* ignore */
  }
  return true
}

type BoxTooltipPreferenceValue = {
  boxTooltipEnabled: boolean
  setBoxTooltipEnabled: (value: boolean) => void
  toggleBoxTooltip: () => void
}

const BoxTooltipPreferenceContext =
  createContext<BoxTooltipPreferenceValue | null>(null)

export function BoxTooltipPreferenceProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [boxTooltipEnabled, setBoxTooltipEnabledState] = useState(readStored)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, boxTooltipEnabled ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [boxTooltipEnabled])

  const setBoxTooltipEnabled = useCallback((value: boolean) => {
    setBoxTooltipEnabledState(value)
  }, [])

  const toggleBoxTooltip = useCallback(() => {
    setBoxTooltipEnabledState((v) => !v)
  }, [])

  const value = useMemo(
    () => ({
      boxTooltipEnabled,
      setBoxTooltipEnabled,
      toggleBoxTooltip,
    }),
    [boxTooltipEnabled, setBoxTooltipEnabled, toggleBoxTooltip],
  )

  return (
    <BoxTooltipPreferenceContext.Provider value={value}>
      {children}
    </BoxTooltipPreferenceContext.Provider>
  )
}

export function useBoxTooltipPreference(): BoxTooltipPreferenceValue {
  const ctx = useContext(BoxTooltipPreferenceContext)
  if (!ctx) {
    throw new Error(
      'useBoxTooltipPreference must be used within BoxTooltipPreferenceProvider',
    )
  }
  return ctx
}
