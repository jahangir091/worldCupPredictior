import { useState } from 'react'
import { getTeam } from '../data/teams'
import { getTeamFlagSrc } from '../data/teamFlags'

const sizes = {
  xs: 'h-3.5 w-5',
  sm: 'h-4 w-6',
  md: 'h-5 w-7',
  lg: 'h-6 w-9',
} as const

interface CountryFlagProps {
  teamId: string
  size?: keyof typeof sizes
  className?: string
}

export function CountryFlag({ teamId, size = 'sm', className = '' }: CountryFlagProps) {
  const team = getTeam(teamId)
  const src = getTeamFlagSrc(teamId)
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center text-base leading-none ${sizes[size]} ${className}`}
        aria-hidden
      >
        {team.flag}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt={`${team.name} flag`}
      className={`inline-block shrink-0 rounded-sm object-cover shadow-sm ring-1 ring-black/10 ${sizes[size]} ${className}`}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}
