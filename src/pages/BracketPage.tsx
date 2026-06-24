import { Card } from '../components/Card'
import { TeamBadge } from '../components/TeamBadge'
import { useSimulation } from '../context/SimulationContext'
import { getChampion } from '../lib/bracket'
import { getStadium } from '../data/stadiums'
import type { BracketMatch, KnockoutRound } from '../types'

const ROUND_LABELS: Record<KnockoutRound, string> = {
  r32: 'Round of 32',
  r16: 'Round of 16',
  qf: 'Quarter-finals',
  sf: 'Semi-finals',
  third: 'Third Place',
  final: 'Final',
}

export function BracketPage() {
  const { state, bracket, setKnockoutWinner, clearKnockoutWinner, setUseAlgorithm, resetSimulation } = useSimulation()
  const champion = getChampion(bracket)

  const byRound = bracket.reduce<Record<KnockoutRound, BracketMatch[]>>((acc, m) => {
    (acc[m.round] ??= []).push(m)
    return acc
  }, {} as Record<KnockoutRound, BracketMatch[]>)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Knockout Bracket</h1>
          <p className="text-slate-400 text-sm mt-1">
            Full bracket filled via data analysis — remaining group games projected, then each knockout winner predicted.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={state.useAlgorithm}
              onChange={(e) => setUseAlgorithm(e.target.checked)}
              className="rounded border-wc-border"
            />
            Auto-predict unset matches
          </label>
          <button
            type="button"
            onClick={resetSimulation}
            className="px-3 py-1.5 text-sm border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10"
          >
            Reset simulation
          </button>
        </div>
      </div>

      {champion && (
        <Card className="border-wc-gold/50 bg-gradient-to-r from-wc-gold/10 to-transparent">
          <div className="flex items-center gap-4">
            <span className="text-4xl">🏆</span>
            <div>
              <p className="text-sm text-slate-400">Your predicted champion</p>
              <p className="text-2xl font-bold"><TeamBadge teamId={champion} size="lg" /></p>
            </div>
          </div>
        </Card>
      )}

      {(Object.keys(ROUND_LABELS) as KnockoutRound[]).map((round) => {
        const matches = byRound[round]
        if (!matches?.length) return null

        return (
          <Card key={round} title={ROUND_LABELS[round]} subtitle={`${matches.length} matches`}>
            <div className="grid md:grid-cols-2 gap-3">
              {matches.map((match) => (
                <BracketMatchCard
                  key={match.id}
                  match={match}
                  userPick={state.knockoutWinners[match.id]}
                  onPick={setKnockoutWinner}
                  onClear={() => clearKnockoutWinner(match.id)}
                />
              ))}
            </div>
          </Card>
        )
      })}
    </div>
  )
}

function BracketMatchCard({
  match,
  userPick,
  onPick,
  onClear,
}: {
  match: BracketMatch
  userPick?: string
  onPick: (matchId: number, teamId: string) => void
  onClear: () => void
}) {
  const stadium = getStadium(match.stadiumId)
  const winner = userPick ?? match.winnerId
  const canPick = match.homeTeamId && match.awayTeamId
  const isAiPick = !userPick && !!match.winnerId

  return (
    <div className="bg-wc-navy/50 border border-wc-border rounded-lg p-3">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs text-slate-500">{match.label}</span>
        <div className="text-right">
          {isAiPick && <span className="text-xs text-wc-gold block">AI pick</span>}
          <span className="text-xs text-slate-500">{new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {!canPick ? (
        <div className="text-sm text-slate-500 py-4 text-center">
          <div>
            {match.homeTeamId ? <TeamBadge teamId={match.homeTeamId} size="sm" /> : match.homeSlot || 'TBD'}
            {' vs '}
            {match.awayTeamId ? <TeamBadge teamId={match.awayTeamId} size="sm" /> : match.awaySlot || 'TBD'}
          </div>
          <div className="text-xs mt-1">Awaiting group stage</div>
        </div>
      ) : (
        <div className="space-y-2">
          {[match.homeTeamId!, match.awayTeamId!].map((teamId) => {
            const isWinner = winner === teamId
            return (
              <button
                key={teamId}
                type="button"
                onClick={() => onPick(match.id, teamId)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-colors ${
                  isWinner
                    ? 'border-wc-gold bg-wc-gold/15 text-wc-gold'
                    : 'border-wc-border hover:border-slate-500 hover:bg-wc-border/30'
                }`}
              >
                <TeamBadge teamId={teamId} size="sm" />
                {isWinner && <span className="text-xs">✓ Winner</span>}
              </button>
            )
          })}
        </div>
      )}

      <div className="mt-2 text-xs text-slate-500">{stadium.city}</div>
      {userPick && (
        <button type="button" className="text-xs text-slate-500 hover:text-red-400 mt-1" onClick={onClear}>
          Clear pick
        </button>
      )}
    </div>
  )
}
