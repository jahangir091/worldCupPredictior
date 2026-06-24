import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Match, SimulationState } from '../types'
import { SNAPSHOT_DATE } from '../data/matches'
import { buildBracket } from '../lib/bracket'
import { computeAllStandings } from '../lib/standings'
import { getInitialMatches, refreshTournamentData } from '../lib/dataRefresh'

const STORAGE_KEY = 'wc2026-simulation'

const defaultState: SimulationState = {
  customResults: {},
  groupPositions: {},
  knockoutWinners: {},
  useAlgorithm: true,
}

function loadState(): SimulationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...defaultState, ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return defaultState
}

interface SimulationContextValue {
  state: SimulationState
  groupMatches: Match[]
  lastUpdated: Date
  isRefreshing: boolean
  refreshError: string | null
  refreshData: () => Promise<void>
  setCustomResult: (matchId: number, homeScore: number, awayScore: number) => void
  clearCustomResult: (matchId: number) => void
  setKnockoutWinner: (matchId: number, teamId: string) => void
  clearKnockoutWinner: (matchId: number) => void
  setUseAlgorithm: (value: boolean) => void
  resetSimulation: () => void
  standings: ReturnType<typeof computeAllStandings>
  bracket: ReturnType<typeof buildBracket>
}

const SimulationContext = createContext<SimulationContextValue | null>(null)

export function SimulationProvider({ children }: { children: ReactNode }) {
  const initial = getInitialMatches()
  const [state, setState] = useState<SimulationState>(loadState)
  const [groupMatches, setGroupMatches] = useState<Match[]>(initial.matches)
  const [lastUpdated, setLastUpdated] = useState<Date>(initial.lastUpdated)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshError, setRefreshError] = useState<string | null>(null)

  const persist = (next: SimulationState) => {
    setState(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const refreshData = useCallback(async () => {
    setIsRefreshing(true)
    setRefreshError(null)
    try {
      const cache = await refreshTournamentData(new Date())
      setGroupMatches(cache.matches)
      setLastUpdated(new Date(cache.lastUpdated))
    } catch (err) {
      setRefreshError(err instanceof Error ? err.message : 'Failed to refresh data')
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  const setCustomResult = (matchId: number, homeScore: number, awayScore: number) => {
    persist({
      ...state,
      customResults: { ...state.customResults, [matchId]: { homeScore, awayScore } },
    })
  }

  const clearCustomResult = (matchId: number) => {
    const { [matchId]: _, ...rest } = state.customResults
    persist({ ...state, customResults: rest })
  }

  const setKnockoutWinner = (matchId: number, teamId: string) => {
    persist({
      ...state,
      knockoutWinners: { ...state.knockoutWinners, [matchId]: teamId },
    })
  }

  const clearKnockoutWinner = (matchId: number) => {
    const { [matchId]: _, ...rest } = state.knockoutWinners
    persist({ ...state, knockoutWinners: rest })
  }

  const setUseAlgorithm = (value: boolean) => persist({ ...state, useAlgorithm: value })

  const resetSimulation = () => {
    localStorage.removeItem(STORAGE_KEY)
    setState(defaultState)
  }

  const standings = useMemo(
    () => computeAllStandings(groupMatches, state.customResults),
    [groupMatches, state.customResults]
  )

  const bracket = useMemo(
    () => buildBracket(state, groupMatches),
    [state, groupMatches]
  )

  const value: SimulationContextValue = {
    state,
    groupMatches,
    lastUpdated,
    isRefreshing,
    refreshError,
    refreshData,
    setCustomResult,
    clearCustomResult,
    setKnockoutWinner,
    clearKnockoutWinner,
    setUseAlgorithm,
    resetSimulation,
    standings,
    bracket,
  }

  return (
    <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>
  )
}

export function useSimulation() {
  const ctx = useContext(SimulationContext)
  if (!ctx) throw new Error('useSimulation must be used within SimulationProvider')
  return ctx
}

export function useLastUpdatedLabel(lastUpdated: Date): string {
  return lastUpdated.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export { SNAPSHOT_DATE }
