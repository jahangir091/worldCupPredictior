import type { Match, MatchStatus } from '../types'
import { BASE_GROUP_MATCHES, SNAPSHOT_DATE } from '../data/matches'

const WORLDCUP_JSON_URL =
  'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json'

const DATA_CACHE_KEY = 'wc2026-live-data'

export interface LiveDataCache {
  lastUpdated: string
  matches: Match[]
}

interface RemoteMatch {
  date: string
  time?: string
  team1: string
  team2: string
  group?: string
  score?: { ft: [number, number] }
}

const TEAM_NAME_TO_ID: Record<string, string> = {
  Mexico: 'MEX',
  'South Africa': 'RSA',
  'South Korea': 'KOR',
  'Czech Republic': 'CZE',
  Czechia: 'CZE',
  Canada: 'CAN',
  'Bosnia & Herzegovina': 'BIH',
  'Bosnia and Herzegovina': 'BIH',
  Qatar: 'QAT',
  Switzerland: 'SUI',
  Brazil: 'BRA',
  Morocco: 'MAR',
  Haiti: 'HAI',
  Scotland: 'SCO',
  'United States': 'USA',
  USA: 'USA',
  Paraguay: 'PAR',
  Australia: 'AUS',
  Türkiye: 'TUR',
  Turkey: 'TUR',
  Germany: 'GER',
  Curaçao: 'CUW',
  Curacao: 'CUW',
  'Ivory Coast': 'CIV',
  "Côte d'Ivoire": 'CIV',
  Ecuador: 'ECU',
  Netherlands: 'NED',
  Japan: 'JPN',
  Sweden: 'SWE',
  Tunisia: 'TUN',
  Belgium: 'BEL',
  Egypt: 'EGY',
  Iran: 'IRN',
  'IR Iran': 'IRN',
  'New Zealand': 'NZL',
  Spain: 'ESP',
  'Cape Verde': 'CPV',
  'Saudi Arabia': 'KSA',
  Uruguay: 'URU',
  France: 'FRA',
  Senegal: 'SEN',
  Iraq: 'IRQ',
  Norway: 'NOR',
  Argentina: 'ARG',
  Algeria: 'ALG',
  Austria: 'AUT',
  Jordan: 'JOR',
  Portugal: 'POR',
  'DR Congo': 'COD',
  'Congo DR': 'COD',
  Uzbekistan: 'UZB',
  Colombia: 'COL',
  England: 'ENG',
  Croatia: 'CRO',
  Ghana: 'GHA',
  Panama: 'PAN',
}

function teamNameToId(name: string): string | undefined {
  return TEAM_NAME_TO_ID[name]
}

function pairKey(a: string, b: string): string {
  return [a, b].sort().join('|')
}

function groupLetter(group?: string): string | undefined {
  if (!group) return undefined
  const match = group.match(/Group\s+([A-L])/i)
  return match?.[1]
}

function parseKickoffUtc(date: string, time: string): Date | null {
  const match = time.match(/(\d{1,2}):(\d{2})\s*UTC([+-]?\d+)/i)
  if (!match) return new Date(`${date}T12:00:00Z`)
  const hour = Number.parseInt(match[1], 10)
  const minute = Number.parseInt(match[2], 10)
  const offset = Number.parseInt(match[3], 10)
  const utcHour = hour - offset
  const [y, mo, d] = date.split('-').map(Number)
  return new Date(Date.UTC(y, mo - 1, d, utcHour, minute))
}

function mapScoresToHomeAway(
  base: Match,
  team1Id: string,
  team2Id: string,
  ft: [number, number]
): { homeScore: number; awayScore: number } {
  if (team1Id === base.homeId && team2Id === base.awayId) {
    return { homeScore: ft[0], awayScore: ft[1] }
  }
  if (team2Id === base.homeId && team1Id === base.awayId) {
    return { homeScore: ft[1], awayScore: ft[0] }
  }
  return { homeScore: ft[0], awayScore: ft[1] }
}

function inferStatus(base: Match, asOf: Date, hasScore: boolean, remoteTime?: string): MatchStatus {
  if (hasScore) return 'finished'

  const kickoff = parseKickoffUtc(base.date, remoteTime ?? `${base.time} UTC-5`)
  if (!kickoff) return base.status === 'finished' ? 'finished' : 'scheduled'

  const matchEnd = new Date(kickoff.getTime() + 105 * 60 * 1000)

  if (asOf >= kickoff && asOf <= matchEnd) return 'live'
  if (asOf > matchEnd && base.status === 'finished') return 'finished'
  return 'scheduled'
}

function mergeRemoteIntoBase(baseMatches: Match[], remoteMatches: RemoteMatch[], asOf: Date): Match[] {
  const remoteByGroupPair = new Map<string, RemoteMatch>()

  for (const remote of remoteMatches) {
    const group = groupLetter(remote.group)
    const id1 = teamNameToId(remote.team1)
    const id2 = teamNameToId(remote.team2)
    if (!group || !id1 || !id2) continue
    if (remote.group?.startsWith('Round')) continue

    remoteByGroupPair.set(`${group}|${pairKey(id1, id2)}`, remote)
  }

  return baseMatches.map((base) => {
    const remote = remoteByGroupPair.get(`${base.group}|${pairKey(base.homeId, base.awayId)}`)

    if (remote?.score?.ft) {
      const id1 = teamNameToId(remote.team1)!
      const id2 = teamNameToId(remote.team2)!
      const { homeScore, awayScore } = mapScoresToHomeAway(base, id1, id2, remote.score.ft)
      return {
        ...base,
        date: remote.date,
        homeScore,
        awayScore,
        status: 'finished' as const,
      }
    }

    if (remote) {
      const status = inferStatus(base, asOf, false, remote.time)
      return { ...base, date: remote.date, status }
    }

    if (base.status === 'finished' && base.homeScore !== undefined) {
      return base
    }

    const status = inferStatus(base, asOf, false)
    return { ...base, status }
  })
}

export function loadCachedLiveData(): LiveDataCache | null {
  try {
    const raw = localStorage.getItem(DATA_CACHE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as LiveDataCache
  } catch {
    return null
  }
}

export function saveCachedLiveData(cache: LiveDataCache): void {
  localStorage.setItem(DATA_CACHE_KEY, JSON.stringify(cache))
}

export async function refreshTournamentData(asOf: Date = new Date()): Promise<LiveDataCache> {
  let remoteMatches: RemoteMatch[] = []

  try {
    const response = await fetch(WORLDCUP_JSON_URL, { cache: 'no-store' })
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`)
    const data = (await response.json()) as { matches: RemoteMatch[] }
    remoteMatches = data.matches ?? []
  } catch {
    // Offline or CORS failure — still advance snapshot using bundled base data
    remoteMatches = []
  }

  const merged = mergeRemoteIntoBase(BASE_GROUP_MATCHES, remoteMatches, asOf)
  const cache: LiveDataCache = {
    lastUpdated: asOf.toISOString(),
    matches: merged,
  }
  saveCachedLiveData(cache)
  return cache
}

export function getInitialMatches(): { matches: Match[]; lastUpdated: Date } {
  const cached = loadCachedLiveData()
  if (cached) {
    return { matches: cached.matches, lastUpdated: new Date(cached.lastUpdated) }
  }
  return {
    matches: BASE_GROUP_MATCHES,
    lastUpdated: new Date(`${SNAPSHOT_DATE}T12:00:00`),
  }
}
