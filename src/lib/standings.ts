import type { GroupStanding } from '../types'
import type { Match } from '../types'
import { GROUPS } from '../data/teams'

export function resolveMatchResult(
  match: Match,
  customResults: Record<number, { homeScore: number; awayScore: number }>
): Match {
  const custom = customResults[match.id]
  if (custom) {
    return {
      ...match,
      homeScore: custom.homeScore,
      awayScore: custom.awayScore,
      status: 'finished',
    }
  }
  return match
}

export function computeGroupStandings(
  group: string,
  matches: Match[],
  customResults: Record<number, { homeScore: number; awayScore: number }>
): GroupStanding[] {
  const groupMatches = matches
    .filter((m) => m.group === group)
    .map((m) => resolveMatchResult(m, customResults))
    .filter((m) => m.status === 'finished' && m.homeScore !== undefined && m.awayScore !== undefined)

  const stats: Record<string, Omit<GroupStanding, 'position' | 'qualified'>> = {}

  for (const match of groupMatches) {
    for (const teamId of [match.homeId, match.awayId]) {
      if (!stats[teamId]) {
        stats[teamId] = { teamId, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 }
      }
    }
    const home = stats[match.homeId]
    const away = stats[match.awayId]
    const hs = match.homeScore!
    const as = match.awayScore!

    home.played++
    away.played++
    home.gf += hs
    home.ga += as
    away.gf += as
    away.ga += hs

    if (hs > as) {
      home.won++
      home.points += 3
      away.lost++
    } else if (hs < as) {
      away.won++
      away.points += 3
      home.lost++
    } else {
      home.drawn++
      away.drawn++
      home.points++
      away.points++
    }
  }

  // Fix typo - away.ga was set wrong above, recalculate
  for (const teamId of Object.keys(stats)) {
    const s = stats[teamId]
    s.gd = s.gf - s.ga
  }

  const standings = Object.values(stats).sort(compareStandingsRaw)
  return standings.map((s, i) => ({ ...s, position: i + 1 }))
}

function compareStandingsRaw(
  a: Omit<GroupStanding, 'position' | 'qualified'>,
  b: Omit<GroupStanding, 'position' | 'qualified'>
): number {
  if (b.points !== a.points) return b.points - a.points
  if (b.gd !== a.gd) return b.gd - a.gd
  if (b.gf !== a.gf) return b.gf - a.gf
  return a.teamId.localeCompare(b.teamId)
}

export function computeAllStandings(
  matches: Match[],
  customResults: Record<number, { homeScore: number; awayScore: number }>
): Record<string, GroupStanding[]> {
  const result: Record<string, GroupStanding[]> = {}
  for (const group of GROUPS) {
    result[group] = computeGroupStandings(group, matches, customResults)
  }
  return result
}

export interface ThirdPlaceCandidate extends GroupStanding {
  group: string
}

export function getThirdPlaceCandidates(
  allStandings: Record<string, GroupStanding[]>
): ThirdPlaceCandidate[] {
  const candidates: ThirdPlaceCandidate[] = []
  for (const [group, standings] of Object.entries(allStandings)) {
    if (standings.length >= 3) {
      candidates.push({ ...standings[2], group })
    }
  }
  return candidates.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.gd !== a.gd) return b.gd - a.gd
    if (b.gf !== a.gf) return b.gf - a.gf
    return a.teamId.localeCompare(b.teamId)
  })
}

export function getQualifiedTeams(
  allStandings: Record<string, GroupStanding[]>,
  groupComplete: Record<string, boolean>
): { winners: Record<string, string>; runners: Record<string, string>; thirds: ThirdPlaceCandidate[] } {
  const winners: Record<string, string> = {}
  const runners: Record<string, string> = {}
  const thirdCandidates: ThirdPlaceCandidate[] = []

  for (const [group, standings] of Object.entries(allStandings)) {
    if (standings.length >= 1 && groupComplete[group]) {
      winners[group] = standings[0].teamId
      if (standings.length >= 2) runners[group] = standings[1].teamId
      if (standings.length >= 3) thirdCandidates.push({ ...standings[2], group })
    } else if (standings.length >= 1) {
      // Provisional based on current standings
      winners[group] = standings[0].teamId
      if (standings.length >= 2) runners[group] = standings[1].teamId
      if (standings.length >= 3) thirdCandidates.push({ ...standings[2], group })
    }
  }

  const thirds = thirdCandidates.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.gd !== a.gd) return b.gd - a.gd
    if (b.gf !== a.gf) return b.gf - a.gf
    return a.teamId.localeCompare(b.teamId)
  }).slice(0, 8)

  return { winners, runners, thirds }
}

export function isGroupComplete(
  group: string,
  matches: Match[],
  customResults: Record<number, { homeScore: number; awayScore: number }>
): boolean {
  const groupMatches = matches.filter((m) => m.group === group)
  return groupMatches.every((m) => {
    const resolved = resolveMatchResult(m, customResults)
    return resolved.status === 'finished'
  })
}

export function getTournamentForm(
  teamId: string,
  matches: Match[],
  customResults: Record<number, { homeScore: number; awayScore: number }>
): { points: number; gd: number; gf: number; played: number } {
  let points = 0
  let gf = 0
  let ga = 0
  let played = 0

  for (const match of matches) {
    const resolved = resolveMatchResult(match, customResults)
    if (resolved.status !== 'finished' || resolved.homeScore === undefined) continue
    if (resolved.homeId !== teamId && resolved.awayId !== teamId) continue

    played++
    const isHome = resolved.homeId === teamId
    const scored = isHome ? resolved.homeScore : resolved.awayScore!
    const conceded = isHome ? resolved.awayScore! : resolved.homeScore

    gf += scored
    ga += conceded
    if (scored > conceded) points += 3
    else if (scored === conceded) points += 1
  }

  return { points, gd: gf - ga, gf, played }
}
