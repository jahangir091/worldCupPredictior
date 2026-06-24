import type { BracketMatch, Match } from '../types'
import { KNOCKOUT_TEMPLATE } from '../data/matches'
import { getTeam } from '../data/teams'
import { computeAllStandings, getQualifiedTeams } from './standings'
import { pickWinnerByAlgorithm } from './prediction'
import { assignThirdPlaceTeams, getThirdForMatch } from './thirdPlace'
import { mergeProjectedResults, projectRemainingGroupResults } from './groupProjection'

interface BracketContext {
  customResults: Record<number, { homeScore: number; awayScore: number }>
  knockoutWinners: Record<number, string>
  useAlgorithm: boolean
}

function resolveSlot(
  slot: string,
  matchId: number,
  winners: Record<string, string>,
  runners: Record<string, string>,
  thirdPlaceByMatch: Record<number, string>
): string | undefined {
  const winnerMatch = slot.match(/^1([A-L])$/)
  if (winnerMatch) return winners[winnerMatch[1]]

  const runnerMatch = slot.match(/^2([A-L])$/)
  if (runnerMatch) return runners[runnerMatch[1]]

  if (slot.startsWith('3rd (')) {
    return getThirdForMatch(matchId, thirdPlaceByMatch)
  }

  return undefined
}

const R32_SLOTS: Record<number, [string, string]> = {
  73: ['2A', '2B'],
  74: ['1E', '3rd (A/B/C/D/F)'],
  75: ['1F', '2C'],
  76: ['1C', '2F'],
  77: ['1I', '3rd (C/D/F/G/H)'],
  78: ['2E', '2I'],
  79: ['1A', '3rd (C/E/F/H/I)'],
  80: ['1L', '3rd (E/H/I/J/K)'],
  81: ['1D', '3rd (B/E/F/I/J)'],
  82: ['1G', '3rd (A/E/H/I/J)'],
  83: ['2K', '2L'],
  84: ['1H', '2J'],
  85: ['1B', '3rd (E/F/G/I/J)'],
  86: ['1J', '2H'],
  87: ['1K', '3rd (D/E/I/J/L)'],
  88: ['2D', '2G'],
}

const KNOCKOUT_FEEDERS: Record<number, [number, number]> = {
  89: [74, 77],
  90: [73, 75],
  91: [76, 78],
  92: [79, 80],
  93: [83, 84],
  94: [81, 82],
  95: [86, 88],
  96: [85, 87],
  97: [89, 90],
  98: [93, 94],
  99: [91, 92],
  100: [95, 96],
  101: [97, 98],
  102: [99, 100],
  103: [101, 102],
  104: [101, 102],
}

export function buildBracket(ctx: BracketContext, groupMatches: Match[]): BracketMatch[] {
  const projected = ctx.useAlgorithm
    ? projectRemainingGroupResults(groupMatches, ctx.customResults)
    : {}
  const effectiveResults = mergeProjectedResults(ctx.customResults, projected)

  const allStandings = computeAllStandings(groupMatches, effectiveResults)
  const groupComplete: Record<string, boolean> = {}
  for (const group of Object.keys(allStandings)) {
    groupComplete[group] = allStandings[group]?.length >= 3
  }

  const { winners, runners, thirds } = getQualifiedTeams(allStandings, groupComplete)

  // Include all 12 third-place teams for assignment, then take top 8 qualifiers
  const allThirds: typeof thirds = []
  for (const [group, standings] of Object.entries(allStandings)) {
    if (standings.length >= 3) {
      allThirds.push({ ...standings[2], group })
    }
  }
  allThirds.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.gd !== a.gd) return b.gd - a.gd
    if (b.gf !== a.gf) return b.gf - a.gf
    return a.teamId.localeCompare(b.teamId)
  })
  const qualifyingThirds = allThirds.slice(0, 8)

  const thirdPlaceByMatch = assignThirdPlaceTeams(qualifyingThirds)
  const winnerMap: Record<number, string> = { ...ctx.knockoutWinners }

  const bracket: BracketMatch[] = []

  for (const template of KNOCKOUT_TEMPLATE) {
    let homeTeamId: string | undefined
    let awayTeamId: string | undefined

    if (template.id <= 88) {
      const slots = R32_SLOTS[template.id]
      if (slots) {
        homeTeamId = resolveSlot(slots[0], template.id, winners, runners, thirdPlaceByMatch)
        awayTeamId = resolveSlot(slots[1], template.id, winners, runners, thirdPlaceByMatch)
      }
    } else if (template.id === 103) {
      const semi1 = KNOCKOUT_FEEDERS[101]
      const semi2 = KNOCKOUT_FEEDERS[102]
      const s1w = winnerMap[101]
      const s2w = winnerMap[102]
      if (s1w && winnerMap[semi1[0]] && winnerMap[semi1[1]]) {
        homeTeamId = winnerMap[semi1[0]] === s1w ? winnerMap[semi1[1]] : winnerMap[semi1[0]]
      }
      if (s2w && winnerMap[semi2[0]] && winnerMap[semi2[1]]) {
        awayTeamId = winnerMap[semi2[0]] === s2w ? winnerMap[semi2[1]] : winnerMap[semi2[0]]
      }
    } else {
      const feeders = KNOCKOUT_FEEDERS[template.id]
      if (feeders) {
        homeTeamId = winnerMap[feeders[0]]
        awayTeamId = winnerMap[feeders[1]]
      }
    }

    const userPick = ctx.knockoutWinners[template.id]
    if (userPick) {
      winnerMap[template.id] = userPick
    } else if (homeTeamId && awayTeamId && ctx.useAlgorithm) {
      winnerMap[template.id] = pickWinnerByAlgorithm(
        getTeam(homeTeamId),
        getTeam(awayTeamId),
        groupMatches,
        effectiveResults
      )
    }

    bracket.push({
      id: template.id,
      round: template.round!,
      label: template.bracketLabel ?? `Match ${template.id}`,
      homeSlot: template.id <= 88 ? R32_SLOTS[template.id]?.[0] ?? '' : `W${KNOCKOUT_FEEDERS[template.id]?.[0]}`,
      awaySlot: template.id <= 88 ? R32_SLOTS[template.id]?.[1] ?? '' : `W${KNOCKOUT_FEEDERS[template.id]?.[1]}`,
      homeTeamId,
      awayTeamId,
      winnerId: winnerMap[template.id],
      date: template.date,
      stadiumId: template.stadiumId,
    })
  }

  return bracket
}

export function getChampion(bracket: BracketMatch[]): string | undefined {
  return bracket.find((m) => m.round === 'final')?.winnerId
}

export function bracketToMatches(bracket: BracketMatch[]): Match[] {
  return bracket
    .filter((m) => m.homeTeamId && m.awayTeamId)
    .map((m) => ({
      id: m.id,
      date: m.date,
      time: '20:00',
      round: m.round,
      homeId: m.homeTeamId!,
      awayId: m.awayTeamId!,
      status: m.winnerId ? 'finished' as const : 'scheduled' as const,
      stadiumId: m.stadiumId,
      bracketLabel: m.label,
      homeScore: m.winnerId === m.homeTeamId ? 2 : m.winnerId ? 0 : undefined,
      awayScore: m.winnerId === m.awayTeamId ? 2 : m.winnerId ? 0 : undefined,
    }))
}
