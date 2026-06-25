import { TEAM_FLAG_ISO } from './flagUrls'
import manifest from './flagManifest.json'

const BASE = import.meta.env.BASE_URL

/** Local flag asset path for a FIFA team code */
export function getTeamFlagSrc(teamId: string): string {
  const iso = manifest[teamId as keyof typeof manifest] ?? TEAM_FLAG_ISO[teamId]
  if (!iso) return ''
  return `${BASE}flags/${iso}.webp`
}
