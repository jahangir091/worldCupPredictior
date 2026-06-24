export type Confederation = 'UEFA' | 'CONMEBOL' | 'CONCACAF' | 'CAF' | 'AFC' | 'OFC'

export type MatchStatus = 'scheduled' | 'live' | 'finished'

export type KnockoutRound =
  | 'r32'
  | 'r16'
  | 'qf'
  | 'sf'
  | 'third'
  | 'final'

export interface Team {
  id: string
  name: string
  flag: string
  confederation: Confederation
  group: string
  fifaRank: number
  historical: {
    worldCupTitles: number
    bestFinish: string
    appearances: number
    avgGroupPoints: number
    knockoutRate: number
  }
  current: {
    formScore: number
    attackRating: number
    defenseRating: number
    squadDepth: number
  }
  injuries: Injury[]
}

export interface Injury {
  player: string
  role: string
  severity: 'minor' | 'moderate' | 'major'
  impact: number
}

export interface Stadium {
  id: string
  name: string
  city: string
  country: 'USA' | 'Mexico' | 'Canada'
  capacity: number
}

export interface Match {
  id: number
  date: string
  time: string
  group?: string
  round?: KnockoutRound
  homeId: string
  awayId: string
  homeScore?: number
  awayScore?: number
  status: MatchStatus
  stadiumId: string
  bracketLabel?: string
}

export interface GroupStanding {
  teamId: string
  played: number
  won: number
  drawn: number
  lost: number
  gf: number
  ga: number
  gd: number
  points: number
  position: number
  qualified?: 'winner' | 'runner' | 'third' | 'eliminated'
}

export interface PredictionBreakdown {
  fifaRankScore: number
  formScore: number
  historicalScore: number
  injuryPenalty: number
  tournamentFormScore: number
  homeAdvantage: number
  total: number
  winProbability: number
}

export interface MatchPrediction {
  homeWin: number
  draw: number
  awayWin: number
  predictedScore: string
  homeBreakdown: PredictionBreakdown
  awayBreakdown: PredictionBreakdown
}

export interface BracketMatch {
  id: number
  round: KnockoutRound
  label: string
  homeSlot: string
  awaySlot: string
  homeTeamId?: string
  awayTeamId?: string
  winnerId?: string
  date: string
  stadiumId: string
}

export interface SimulationState {
  customResults: Record<number, { homeScore: number; awayScore: number }>
  groupPositions: Record<string, Record<string, number>>
  knockoutWinners: Record<number, string>
  useAlgorithm: boolean
}
