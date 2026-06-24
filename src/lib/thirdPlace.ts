import type { ThirdPlaceCandidate } from './standings'

/** FIFA Round of 32 slots that receive a third-placed team */
export const THIRD_PLACE_SLOTS: { matchId: number; allowedGroups: string[] }[] = [
  { matchId: 74, allowedGroups: ['A', 'B', 'C', 'D', 'F'] },
  { matchId: 77, allowedGroups: ['C', 'D', 'F', 'G', 'H'] },
  { matchId: 79, allowedGroups: ['C', 'E', 'F', 'H', 'I'] },
  { matchId: 80, allowedGroups: ['E', 'H', 'I', 'J', 'K'] },
  { matchId: 81, allowedGroups: ['B', 'E', 'F', 'I', 'J'] },
  { matchId: 82, allowedGroups: ['A', 'E', 'H', 'I', 'J'] },
  { matchId: 85, allowedGroups: ['E', 'F', 'G', 'I', 'J'] },
  { matchId: 87, allowedGroups: ['D', 'E', 'I', 'J', 'L'] },
]

function rankThirds(thirds: ThirdPlaceCandidate[]): ThirdPlaceCandidate[] {
  return [...thirds].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.gd !== a.gd) return b.gd - a.gd
    if (b.gf !== a.gf) return b.gf - a.gf
    return a.teamId.localeCompare(b.teamId)
  })
}

/**
 * Assign each qualifying third-place team to exactly one R32 slot.
 * Picks the best-ranked eligible unused third for each slot (FIFA-style, no duplicates).
 */
export function assignThirdPlaceTeams(
  qualifyingThirds: ThirdPlaceCandidate[]
): Record<number, string> {
  const ranked = rankThirds(qualifyingThirds)
  const assigned = new Set<string>()
  const result: Record<number, string> = {}

  for (const slot of THIRD_PLACE_SLOTS) {
    const pick = ranked.find(
      (t) => slot.allowedGroups.includes(t.group) && !assigned.has(t.teamId)
    )
    if (pick) {
      result[slot.matchId] = pick.teamId
      assigned.add(pick.teamId)
    }
  }

  return result
}

export function getThirdForMatch(
  matchId: number,
  thirdPlaceByMatch: Record<number, string>
): string | undefined {
  return thirdPlaceByMatch[matchId]
}
