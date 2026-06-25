import { getTeam } from '../data/teams'
import { CountryFlag } from './CountryFlag'

interface TeamBadgeProps {
  teamId: string
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
}

const textSizes = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' }
const flagSizes = { sm: 'sm' as const, md: 'md' as const, lg: 'lg' as const }

export function TeamBadge({ teamId, size = 'md', showName = true }: TeamBadgeProps) {
  const team = getTeam(teamId)
  if (!team) return <span className="text-slate-500">{teamId}</span>

  return (
    <span className={`inline-flex items-center gap-1.5 ${textSizes[size]}`}>
      <CountryFlag teamId={teamId} size={flagSizes[size]} />
      {showName && <span className="font-medium">{team.name}</span>}
    </span>
  )
}

export function FlagOnly({ teamId }: { teamId: string }) {
  return <CountryFlag teamId={teamId} size="sm" />
}
