import type { BracketMatch, KnockoutRound } from '../types'
import { KNOCKOUT_FEEDERS } from './bracket'

/** SF 101 = left half of draw; SF 102 = right half (both feed Final 104) */
const LEFT_SF = 101
const RIGHT_SF = 102

/**
 * Build visual tree order by walking the official feeder graph.
 * Adjacent pairs at each level share a parent (required for connector geometry).
 */
function buildSideTree(sfMatchId: number) {
  const qfIds = KNOCKOUT_FEEDERS[sfMatchId]
  const r16: number[] = []
  const r32: number[] = []

  for (const qfId of qfIds) {
    const [r16a, r16b] = KNOCKOUT_FEEDERS[qfId]
    r16.push(r16a, r16b)
    for (const r16Id of [r16a, r16b]) {
      r32.push(...KNOCKOUT_FEEDERS[r16Id])
    }
  }

  return {
    r32: r32 as readonly number[],
    r16: r16 as readonly number[],
    qf: qfIds as readonly number[],
    sf: [sfMatchId] as readonly number[],
  }
}

/** Visual bracket layout derived from official knockout feeder paths */
export const BRACKET_TREE = {
  left: buildSideTree(LEFT_SF),
  right: buildSideTree(RIGHT_SF),
  center: {
    final: 104,
    third: 103,
  },
} as const

export const ROUND_LABELS: Record<KnockoutRound, string> = {
  r32: 'R32',
  r16: 'R16',
  qf: 'QF',
  sf: 'SF',
  third: 'BRONZE',
  final: 'FINAL',
}

export function getMatchMap(bracket: BracketMatch[]): Map<number, BracketMatch> {
  return new Map(bracket.map((m) => [m.id, m]))
}

export function getWinnerTeamId(
  match: BracketMatch | undefined,
  userWinner?: string
): string | undefined {
  if (!match) return undefined
  return userWinner ?? match.winnerId
}

export function getBronzeTeams(
  bracket: BracketMatch[],
  userWinners: Record<number, string>
): [string | undefined, string | undefined] {
  const map = getMatchMap(bracket)
  const sf1 = map.get(LEFT_SF)
  const sf2 = map.get(RIGHT_SF)
  const w101 = getWinnerTeamId(sf1, userWinners[LEFT_SF])
  const w102 = getWinnerTeamId(sf2, userWinners[RIGHT_SF])

  if (!sf1 || !sf2 || !w101 || !w102) return [undefined, undefined]

  const sf1Feeders = [map.get(97), map.get(98)]
  const sf2Feeders = [map.get(99), map.get(100)]

  const loser1 = sf1Feeders.find((m) => m && getWinnerTeamId(m, userWinners[m.id]) !== w101)
  const loser2 = sf2Feeders.find((m) => m && getWinnerTeamId(m, userWinners[m.id]) !== w102)

  const id1 = loser1 ? getWinnerTeamId(loser1, userWinners[loser1.id]) : undefined
  const id2 = loser2 ? getWinnerTeamId(loser2, userWinners[loser2.id]) : undefined

  if (id1 && id2) return [id1, id2]

  const third = map.get(103)
  return [third?.homeTeamId, third?.awayTeamId]
}

/** Which visual half a knockout match belongs to */
export function getMatchSide(matchId: number): 'left' | 'right' | 'center' {
  if (matchId === 103 || matchId === 104) return 'center'
  if (matchId === LEFT_SF || BRACKET_TREE.left.qf.includes(matchId)) return 'left'
  if (BRACKET_TREE.left.r16.includes(matchId)) return 'left'
  if (BRACKET_TREE.left.r32.includes(matchId)) return 'left'
  if (matchId === RIGHT_SF || BRACKET_TREE.right.qf.includes(matchId)) return 'right'
  if (BRACKET_TREE.right.r16.includes(matchId)) return 'right'
  if (BRACKET_TREE.right.r32.includes(matchId)) return 'right'
  return 'center'
}
