import type { BracketMatch } from '../types'
import { CountryFlag } from './CountryFlag'
import { getTeam } from '../data/teams'
import { getChampion } from '../lib/bracket'
import { BRACKET_TREE, getMatchMap } from '../lib/bracketTree'
import { CONNECTOR_WIDTH, SLOT_WIDTH, TREE_HEIGHT, getFinalAlignY } from '../lib/bracketLayout'
import { BracketSidePanel } from './bracket/BracketSidePanel'
import { BracketSingleSlot } from './bracket/BracketSlots'

interface VisualBracketProps {
  bracket: BracketMatch[]
  userWinners: Record<number, string>
  onPick?: (matchId: number, teamId: string) => void
  onClear?: (matchId: number) => void
}

function CenterFinal({
  finalMatch,
  bronzeMatch,
  userWinners,
  onPick,
  onClear,
}: {
  finalMatch?: BracketMatch
  bronzeMatch?: BracketMatch
  userWinners: Record<number, string>
  onPick?: (matchId: number, teamId: string) => void
  onClear?: (matchId: number) => void
}) {
  const alignY = getFinalAlignY()
  const finalWinner = userWinners[104] ?? finalMatch?.winnerId
  const bronzeWinner = userWinners[103] ?? bronzeMatch?.winnerId
  const canPickFinal = !!(finalMatch?.homeTeamId && finalMatch?.awayTeamId)
  const canPickBronze = !!(bronzeMatch?.homeTeamId && bronzeMatch?.awayTeamId)
  const isUserPickFinal = !!userWinners[104]
  const isUserPickBronze = !!userWinners[103]

  const pick = (match: BracketMatch | undefined, teamId?: string) => {
    if (match && teamId && onPick) onPick(match.id, teamId)
  }

  const finalBlockH = 88

  return (
    <div className="relative shrink-0" style={{ width: SLOT_WIDTH + 16, height: TREE_HEIGHT + 24 }}>
      <div className="mb-2 h-4 text-center">
        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-wc-gold">Final</span>
      </div>

      {/* SF → Final horizontal bridge aligned to semi-final center */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: 24 + alignY,
          left: -CONNECTOR_WIDTH,
          right: -CONNECTOR_WIDTH,
          height: 1.5,
          background: 'rgba(148, 163, 184, 0.55)',
        }}
      />

      <div
        className="group absolute left-1/2 -translate-x-1/2"
        style={{ top: 24 + alignY - finalBlockH / 2, width: SLOT_WIDTH }}
      >
        <div className="mb-1.5 flex justify-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-wc-gold/40 bg-wc-gold/10 text-base">
            🏆
          </div>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-wc-gold/25 bg-wc-gold/5 p-1.5">
          <BracketSingleSlot
            teamId={finalMatch?.homeTeamId}
            isWinner={!!finalWinner && finalWinner === finalMatch?.homeTeamId}
            isUserPick={isUserPickFinal && finalWinner === finalMatch?.homeTeamId}
            disabled={!canPickFinal}
            onClick={canPickFinal && onPick ? () => pick(finalMatch, finalMatch?.homeTeamId) : undefined}
          />
          <BracketSingleSlot
            teamId={finalMatch?.awayTeamId}
            isWinner={!!finalWinner && finalWinner === finalMatch?.awayTeamId}
            isUserPick={isUserPickFinal && finalWinner === finalMatch?.awayTeamId}
            disabled={!canPickFinal}
            onClick={canPickFinal && onPick ? () => pick(finalMatch, finalMatch?.awayTeamId) : undefined}
          />
        </div>
        {isUserPickFinal && onClear && finalMatch && (
          <button
            type="button"
            onClick={() => onClear(finalMatch.id)}
            className="mt-1 w-full text-center text-[9px] text-slate-500 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
          >
            Clear pick
          </button>
        )}
      </div>

      <div className="group absolute bottom-4 left-1/2 -translate-x-1/2" style={{ width: SLOT_WIDTH }}>
        <div className="mb-1 text-center text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-500">
          Bronze
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-slate-700/35 bg-slate-900/30 p-1.5">
          <BracketSingleSlot
            teamId={bronzeMatch?.homeTeamId}
            isWinner={!!bronzeWinner && bronzeWinner === bronzeMatch?.homeTeamId}
            isUserPick={isUserPickBronze && bronzeWinner === bronzeMatch?.homeTeamId}
            disabled={!canPickBronze}
            onClick={canPickBronze && onPick ? () => pick(bronzeMatch, bronzeMatch?.homeTeamId) : undefined}
          />
          <BracketSingleSlot
            teamId={bronzeMatch?.awayTeamId}
            isWinner={!!bronzeWinner && bronzeWinner === bronzeMatch?.awayTeamId}
            isUserPick={isUserPickBronze && bronzeWinner === bronzeMatch?.awayTeamId}
            disabled={!canPickBronze}
            onClick={canPickBronze && onPick ? () => pick(bronzeMatch, bronzeMatch?.awayTeamId) : undefined}
          />
        </div>
        {isUserPickBronze && onClear && bronzeMatch && (
          <button
            type="button"
            onClick={() => onClear(bronzeMatch.id)}
            className="mt-1 w-full text-center text-[9px] text-slate-500 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
          >
            Clear pick
          </button>
        )}
      </div>
    </div>
  )
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-3 w-3 rounded border border-wc-gold/60 bg-wc-gold/15" />
        Your pick
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-3 w-3 rounded border border-emerald-500/50 bg-emerald-500/10" />
        AI prediction
      </span>
      <span>Click a team to pick · Hover match to clear</span>
    </div>
  )
}

export function VisualBracket({ bracket, userWinners, onPick, onClear }: VisualBracketProps) {
  const matchMap = getMatchMap(bracket)
  const champion = getChampion(bracket) ?? userWinners[104]
  const finalMatch = matchMap.get(BRACKET_TREE.center.final)
  const bronzeMatch = matchMap.get(BRACKET_TREE.center.third)
  const finalWinner = userWinners[104] ?? finalMatch?.winnerId ?? champion

  return (
    <div className="visual-bracket-shell overflow-visible rounded-2xl border border-slate-700/40 bg-slate-900/40 shadow-xl shadow-black/20">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/40 px-5 py-3">
        <Legend />
        {finalWinner && (
          <div className="flex shrink-0 items-center gap-2 rounded-lg border border-wc-gold/30 bg-wc-gold/10 px-3 py-1.5 text-sm text-wc-gold">
            <span>🏆</span>
            <CountryFlag teamId={finalWinner} size="md" />
            <span className="max-w-[140px] truncate font-semibold">{getTeam(finalWinner).name}</span>
          </div>
        )}
      </div>

      <div className="visual-bracket-fit px-3 py-4">
        <div className="mx-auto flex w-max items-start justify-center overflow-visible">
          <BracketSidePanel
            side="left"
            matchMap={matchMap}
            userWinners={userWinners}
            onPick={onPick}
            onClear={onClear}
          />
          <CenterFinal
            finalMatch={finalMatch}
            bronzeMatch={bronzeMatch}
            userWinners={userWinners}
            onPick={onPick}
            onClear={onClear}
          />
          <BracketSidePanel
            side="right"
            matchMap={matchMap}
            userWinners={userWinners}
            onPick={onPick}
            onClear={onClear}
          />
        </div>
      </div>
    </div>
  )
}
