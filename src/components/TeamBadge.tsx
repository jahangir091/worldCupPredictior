import { getTeam } from '../data/teams'

interface TeamBadgeProps {
  teamId: string
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
}

const sizes = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' }

export function TeamBadge({ teamId, size = 'md', showName = true }: TeamBadgeProps) {
  const team = getTeam(teamId)
  if (!team) return <span className="text-slate-500">{teamId}</span>

  return (
    <span className={`inline-flex items-center gap-1.5 ${sizes[size]}`}>
      <span>{team.flag}</span>
      {showName && <span className="font-medium">{team.name}</span>}
    </span>
  )
}

export function FlagOnly({ teamId }: { teamId: string }) {
  return <span>{getTeam(teamId)?.flag ?? '🏳️'}</span>
}
