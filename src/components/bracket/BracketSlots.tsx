import type { ReactNode } from 'react'
import { CountryFlag } from '../CountryFlag'
import { getTeam } from '../../data/teams'
import type { BracketMatch } from '../../types'
import { SLOT_WIDTH, TREE_HEIGHT } from '../../lib/bracketLayout'

function TeamLabel({
  teamId,
  align,
}: {
  teamId: string
  align: 'left' | 'right'
}) {
  const team = getTeam(teamId)

  return (
    <span
      className={`flex min-w-0 flex-1 items-center gap-1.5 ${
        align === 'right' ? 'flex-row-reverse text-right' : 'text-left'
      }`}
      title={team.name}
    >
      <CountryFlag teamId={teamId} size="sm" />
      <span className="truncate text-[11px] font-medium leading-tight text-slate-100">{team.name}</span>
    </span>
  )
}

interface BracketTeamSlotProps {
  teamId?: string
  isWinner?: boolean
  isUserPick?: boolean
  align?: 'left' | 'right'
  disabled?: boolean
  onClick?: () => void
}

export function BracketTeamSlot({
  teamId,
  isWinner,
  isUserPick,
  align = 'left',
  disabled,
  onClick,
}: BracketTeamSlotProps) {
  const interactive = !!onClick && !!teamId && !disabled

  const base =
    'flex h-[26px] w-full items-center justify-between gap-1 rounded-md border px-2 transition-colors'

  if (!teamId) {
    return (
      <div className={`${base} border-dashed border-slate-600/40 bg-slate-900/40`}>
        <span className={`text-[10px] text-slate-500 ${align === 'right' ? 'w-full text-right' : ''}`}>TBD</span>
      </div>
    )
  }

  const team = getTeam(teamId)
  const stateClass = isWinner
    ? isUserPick
      ? 'border-wc-gold/60 bg-wc-gold/10'
      : 'border-emerald-500/45 bg-emerald-500/8'
    : 'border-slate-600/50 bg-slate-800/55'

  const hover = interactive && !isWinner ? 'hover:border-slate-400 hover:bg-slate-700/45 cursor-pointer' : ''

  const body = (
    <>
      <TeamLabel teamId={teamId} align={align} />
      {isWinner && (
        <span className={`shrink-0 text-[9px] font-bold ${isUserPick ? 'text-wc-gold' : 'text-emerald-400'}`}>✓</span>
      )}
    </>
  )

  if (interactive) {
    return (
      <button type="button" onClick={onClick} aria-label={`Pick ${team.name}`} className={`${base} ${stateClass} ${hover}`}>
        {body}
      </button>
    )
  }

  return <div className={`${base} ${stateClass} ${disabled ? 'opacity-50' : ''}`}>{body}</div>
}

interface BracketMatchPairProps {
  match?: BracketMatch
  userWinner?: string
  align?: 'left' | 'right'
  onPick?: (matchId: number, teamId: string) => void
  onClear?: (matchId: number) => void
}

export function BracketMatchPair({
  match,
  userWinner,
  align = 'left',
  onPick,
  onClear,
}: BracketMatchPairProps) {
  const winner = userWinner ?? match?.winnerId
  const canPick = !!(match?.homeTeamId && match?.awayTeamId)
  const isUserPick = !!userWinner
  const home = match?.homeTeamId
  const away = match?.awayTeamId

  const pick = (teamId?: string) => {
    if (match && teamId && canPick && onPick) onPick(match.id, teamId)
  }

  return (
    <div className="group relative flex h-full w-full flex-col justify-center gap-1" style={{ width: SLOT_WIDTH }}>
      <BracketTeamSlot
        teamId={home}
        isWinner={!!winner && winner === home}
        isUserPick={isUserPick && winner === home}
        align={align}
        disabled={!canPick}
        onClick={canPick && onPick ? () => pick(home) : undefined}
      />
      <BracketTeamSlot
        teamId={away}
        isWinner={!!winner && winner === away}
        isUserPick={isUserPick && winner === away}
        align={align}
        disabled={!canPick}
        onClick={canPick && onPick ? () => pick(away) : undefined}
      />
      {isUserPick && onClear && match && (
        <button
          type="button"
          onClick={() => onClear(match.id)}
          className={`absolute top-0 ${align === 'right' ? 'left-0' : 'right-0'} z-10 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full border border-slate-600 bg-slate-900 text-[8px] text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-400 ${align === 'right' ? '-translate-x-1/2' : 'translate-x-1/2'}`}
          title="Clear pick"
        >
          ×
        </button>
      )}
    </div>
  )
}

interface BracketSingleSlotProps {
  teamId?: string
  label?: string
  isWinner?: boolean
  isUserPick?: boolean
  disabled?: boolean
  onClick?: () => void
}

export function BracketSingleSlot({
  teamId,
  label,
  isWinner,
  isUserPick,
  disabled,
  onClick,
}: BracketSingleSlotProps) {
  const interactive = !!onClick && !!teamId && !disabled

  if (!teamId) {
    return (
      <div
        className="flex h-[26px] items-center justify-center rounded-md border border-dashed border-slate-600/40 bg-slate-900/40 px-2"
        style={{ width: SLOT_WIDTH }}
      >
        <span className="text-[10px] text-slate-500">{label ?? 'TBD'}</span>
      </div>
    )
  }

  const stateClass = isWinner
    ? isUserPick
      ? 'border-wc-gold/60 bg-wc-gold/10'
      : 'border-emerald-500/45 bg-emerald-500/8'
    : 'border-slate-600/50 bg-slate-800/55'

  const hover = interactive && !isWinner ? 'hover:border-slate-400 cursor-pointer' : ''

  const body = (
    <>
      <TeamLabel teamId={teamId} align="left" />
      {isWinner && (
        <span className={`shrink-0 text-[9px] font-bold ${isUserPick ? 'text-wc-gold' : 'text-emerald-400'}`}>✓</span>
      )}
    </>
  )

  const cls = `flex h-[26px] items-center justify-between gap-1 rounded-md border px-2 transition-colors ${stateClass} ${hover}`

  if (interactive) {
    return (
      <button type="button" onClick={onClick} className={cls} style={{ width: SLOT_WIDTH }}>
        {body}
      </button>
    )
  }

  return (
    <div className={cls} style={{ width: SLOT_WIDTH }}>
      {body}
    </div>
  )
}

export function BracketRoundColumn({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex shrink-0 flex-col">
      <div className="mb-2 h-4 text-center">
        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</span>
      </div>
      <div className="relative" style={{ width: SLOT_WIDTH, height: TREE_HEIGHT }}>
        {children}
      </div>
    </div>
  )
}
