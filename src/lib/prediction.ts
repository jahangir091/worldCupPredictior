import type { MatchPrediction, PredictionBreakdown, Team } from '../types'
import { HOSTS } from '../data/teams'
import { getTournamentForm } from './standings'
import type { Match as MatchType } from '../types'

const WEIGHTS = {
  fifaRank: 0.22,
  currentForm: 0.18,
  historical: 0.15,
  tournamentForm: 0.20,
  attackDefense: 0.15,
  homeAdvantage: 0.05,
  injury: 0.05,
}

function rankScore(rank: number): number {
  return Math.max(0, (50 - rank) / 50)
}

function historicalScore(team: Team): number {
  const titleBonus = team.historical.worldCupTitles * 0.08
  const knockoutBonus = team.historical.knockoutRate * 0.4
  const appearanceBonus = Math.min(team.historical.appearances / 20, 1) * 0.2
  const groupBonus = (team.historical.avgGroupPoints / 6) * 0.32
  return Math.min(1, titleBonus + knockoutBonus + appearanceBonus + groupBonus)
}

function injuryPenalty(team: Team): number {
  return team.injuries.reduce((sum, inj) => sum + inj.impact, 0)
}

function attackDefenseScore(team: Team): number {
  return (team.current.attackRating + team.current.defenseRating) / 200
}

export function computeTeamStrength(
  team: Team,
  matches: MatchType[],
  customResults: Record<number, { homeScore: number; awayScore: number }>,
  isHome = false
): PredictionBreakdown {
  const tournament = getTournamentForm(team.id, matches, customResults)
  const maxTournamentPoints = Math.max(tournament.played * 3, 1)
  const tournamentFormScore = tournament.played > 0
    ? (tournament.points / maxTournamentPoints) * 0.6 + (Math.max(tournament.gd, -3) + 3) / 6 * 0.4
    : team.current.formScore / 100 * 0.5

  const injuries = injuryPenalty(team)
  const homeAdvantage = isHome && HOSTS.has(team.id) ? 0.08 : isHome ? 0.03 : 0

  const breakdown: PredictionBreakdown = {
    fifaRankScore: rankScore(team.fifaRank) * WEIGHTS.fifaRank,
    formScore: (team.current.formScore / 100) * WEIGHTS.currentForm,
    historicalScore: historicalScore(team) * WEIGHTS.historical,
    tournamentFormScore: tournamentFormScore * WEIGHTS.tournamentForm,
    injuryPenalty: -injuries * WEIGHTS.injury,
    homeAdvantage: homeAdvantage,
    total: 0,
    winProbability: 0,
  }

  breakdown.total =
    breakdown.fifaRankScore +
    breakdown.formScore +
    breakdown.historicalScore +
    breakdown.tournamentFormScore +
    breakdown.injuryPenalty +
    breakdown.homeAdvantage +
    attackDefenseScore(team) * WEIGHTS.attackDefense

  return breakdown
}

export function predictMatch(
  home: Team,
  away: Team,
  matches: MatchType[],
  customResults: Record<number, { homeScore: number; awayScore: number }>
): MatchPrediction {
  const homeBreakdown = computeTeamStrength(home, matches, customResults, true)
  const awayBreakdown = computeTeamStrength(away, matches, customResults, false)

  const homeStrength = Math.max(0.05, homeBreakdown.total)
  const awayStrength = Math.max(0.05, awayBreakdown.total)
  const drawBase = 0.22 - Math.abs(homeStrength - awayStrength) * 0.3

  const total = homeStrength + awayStrength + Math.max(0.12, drawBase)
  const homeWin = homeStrength / total
  const awayWin = awayStrength / total
  const draw = Math.max(0.12, drawBase) / total

  homeBreakdown.winProbability = homeWin
  awayBreakdown.winProbability = awayWin

  const expectedHomeGoals = 0.8 + homeStrength * 2.2 + (home.current.attackRating - away.current.defenseRating) / 100
  const expectedAwayGoals = 0.6 + awayStrength * 1.8 + (away.current.attackRating - home.current.defenseRating) / 100

  return {
    homeWin: Math.round(homeWin * 100),
    draw: Math.round(draw * 100),
    awayWin: Math.round(awayWin * 100),
    predictedScore: `${Math.round(expectedHomeGoals)}-${Math.round(expectedAwayGoals)}`,
    homeBreakdown,
    awayBreakdown,
  }
}

export function pickWinnerByAlgorithm(
  home: Team,
  away: Team,
  matches: MatchType[],
  customResults: Record<number, { homeScore: number; awayScore: number }>
): string {
  const prediction = predictMatch(home, away, matches, customResults)
  if (prediction.homeWin >= prediction.awayWin) return home.id
  return away.id
}

export function compareTeams(home: Team, away: Team) {
  return {
    fifaRank: { home: home.fifaRank, away: away.fifaRank, better: home.fifaRank < away.fifaRank ? 'home' : 'away' },
    titles: { home: home.historical.worldCupTitles, away: away.historical.worldCupTitles },
    knockoutRate: { home: home.historical.knockoutRate, away: away.historical.knockoutRate },
    form: { home: home.current.formScore, away: away.current.formScore },
    attack: { home: home.current.attackRating, away: away.current.attackRating },
    defense: { home: home.current.defenseRating, away: away.current.defenseRating },
    injuries: {
      home: home.injuries.length,
      away: away.injuries.length,
      homeImpact: home.injuries.reduce((s, i) => s + i.impact, 0),
      awayImpact: away.injuries.reduce((s, i) => s + i.impact, 0),
    },
  }
}
