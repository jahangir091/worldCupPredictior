import type { Match } from '../types'
import { getTeam } from '../data/teams'
import { predictMatch } from './prediction'
import { resolveMatchResult } from './standings'

/**
 * Predict scores for all unfinished group-stage matches so the bracket
 * can be fully populated before the group stage ends.
 */
export function projectRemainingGroupResults(
  groupMatches: Match[],
  customResults: Record<number, { homeScore: number; awayScore: number }>
): Record<number, { homeScore: number; awayScore: number }> {
  const projected: Record<number, { homeScore: number; awayScore: number }> = {}
  const merged = () => ({ ...customResults, ...projected })

  for (const match of groupMatches) {
    if (customResults[match.id]) continue

    const resolved = resolveMatchResult(match, merged())
    if (resolved.status === 'finished' && resolved.homeScore !== undefined) continue

    const home = getTeam(match.homeId)
    const away = getTeam(match.awayId)
    const prediction = predictMatch(home, away, groupMatches, merged())
    const [homeScore, awayScore] = prediction.predictedScore.split('-').map(Number)

    projected[match.id] = {
      homeScore: Number.isFinite(homeScore) ? homeScore : 1,
      awayScore: Number.isFinite(awayScore) ? awayScore : 0,
    }
  }

  return projected
}

export function mergeProjectedResults(
  customResults: Record<number, { homeScore: number; awayScore: number }>,
  projected: Record<number, { homeScore: number; awayScore: number }>
): Record<number, { homeScore: number; awayScore: number }> {
  return { ...projected, ...customResults }
}
