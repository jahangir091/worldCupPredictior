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

function tryAssign(
  slotIndex: number,
  ranked: ThirdPlaceCandidate[],
  available: Set<string>,
  result: Record<number, string>
): boolean {
  if (slotIndex >= THIRD_PLACE_SLOTS.length) return true

  const slot = THIRD_PLACE_SLOTS[slotIndex]
  const candidates = ranked.filter(
    (t) => slot.allowedGroups.includes(t.group) && available.has(t.teamId)
  )

  for (const pick of candidates) {
    result[slot.matchId] = pick.teamId
    available.delete(pick.teamId)
    if (tryAssign(slotIndex + 1, ranked, available, result)) return true
    available.add(pick.teamId)
    delete result[slot.matchId]
  }

  return false
}

/**
 * Assign each qualifying third-place team to exactly one R32 slot using
 * backtracking so all 8 slots are filled without duplicates.
 */
export function assignThirdPlaceTeams(
  qualifyingThirds: ThirdPlaceCandidate[]
): Record<number, string> {
  const ranked = rankThirds(qualifyingThirds)
  const top8 = ranked.slice(0, 8)
  const result: Record<number, string> = {}
  const available = new Set(top8.map((t) => t.teamId))

  if (!tryAssign(0, top8, available, result)) {
    // Fallback: greedy fill any remaining empty slots
    const assigned = new Set(Object.values(result))
    for (const slot of THIRD_PLACE_SLOTS) {
      if (result[slot.matchId]) continue
      const pick = ranked.find(
        (t) => slot.allowedGroups.includes(t.group) && !assigned.has(t.teamId)
      )
      if (pick) {
        result[slot.matchId] = pick.teamId
        assigned.add(pick.teamId)
      }
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
