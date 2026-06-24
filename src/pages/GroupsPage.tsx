import { Card } from '../components/Card'
import { TeamBadge } from '../components/TeamBadge'
import { GROUPS, getTeamsByGroup } from '../data/teams'
import { useSimulation } from '../context/SimulationContext'
import { resolveMatchResult } from '../lib/standings'
import type { Match } from '../types'

export function GroupsPage() {
  const { state, standings, setCustomResult, clearCustomResult, groupMatches } = useSimulation()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Group Standings</h1>
        <p className="text-slate-400 text-sm mt-1">
          Live tables from actual results. Simulate remaining fixtures by entering scores below.
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {GROUPS.map((group) => {
          const rows = standings[group] ?? []
          const teams = getTeamsByGroup(group)
          const pending = groupMatches.filter(
            (m) => m.group === group && resolveMatchResult(m, state.customResults).status !== 'finished'
          )

          return (
            <Card key={group} title={`Group ${group}`}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-500 border-b border-wc-border">
                    <th className="text-left py-2">#</th>
                    <th className="text-left py-2">Team</th>
                    <th className="text-center py-2">P</th>
                    <th className="text-center py-2">GD</th>
                    <th className="text-center py-2 font-bold">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team) => {
                    const row = rows.find((r) => r.teamId === team.id)
                    const pos = row?.position ?? '-'
                    const qualified = pos === 1 || pos === 2
                    const third = pos === 3

                    return (
                      <tr
                        key={team.id}
                        className={`border-b border-wc-border/30 ${
                          qualified ? 'bg-wc-green/5' : third ? 'bg-wc-gold/5' : ''
                        }`}
                      >
                        <td className="py-2 text-slate-400">{row ? pos : '—'}</td>
                        <td className="py-2"><TeamBadge teamId={team.id} size="sm" /></td>
                        <td className="py-2 text-center text-slate-300">{row?.played ?? 0}</td>
                        <td className="py-2 text-center text-slate-300">{row?.gd ?? 0}</td>
                        <td className="py-2 text-center font-bold text-wc-gold">{row?.points ?? 0}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {pending.length > 0 && (
                <div className="mt-4 pt-3 border-t border-wc-border">
                  <p className="text-xs text-slate-400 mb-2">Simulate remaining matches</p>
                  <div className="space-y-2">
                    {pending.slice(0, 3).map((match) => (
                      <SimulateMatch
                        key={match.id}
                        match={match}
                        custom={state.customResults[match.id]}
                        onSave={setCustomResult}
                        onClear={() => clearCustomResult(match.id)}
                      />
                    ))}
                    {pending.length > 3 && (
                      <p className="text-xs text-slate-500">+{pending.length - 3} more on Schedule page</p>
                    )}
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function SimulateMatch({
  match,
  custom,
  onSave,
  onClear,
}: {
  match: Match
  custom?: { homeScore: number; awayScore: number }
  onSave: (id: number, h: number, a: number) => void
  onClear: () => void
}) {
  return (
    <div className="flex items-center gap-2 text-xs flex-wrap">
      <TeamBadge teamId={match.homeId} size="sm" showName={false} />
      <input
        type="number"
        min={0}
        max={15}
        defaultValue={custom?.homeScore ?? ''}
        placeholder="0"
        className="w-10 bg-wc-navy border border-wc-border rounded px-1 py-0.5 text-center"
        id={`h-${match.id}`}
      />
      <span>-</span>
      <input
        type="number"
        min={0}
        max={15}
        defaultValue={custom?.awayScore ?? ''}
        placeholder="0"
        className="w-10 bg-wc-navy border border-wc-border rounded px-1 py-0.5 text-center"
        id={`a-${match.id}`}
      />
      <TeamBadge teamId={match.awayId} size="sm" showName={false} />
      <button
        type="button"
        className="px-2 py-0.5 bg-wc-gold/20 text-wc-gold rounded hover:bg-wc-gold/30"
        onClick={() => {
          const h = Number((document.getElementById(`h-${match.id}`) as HTMLInputElement).value)
          const a = Number((document.getElementById(`a-${match.id}`) as HTMLInputElement).value)
          if (!Number.isNaN(h) && !Number.isNaN(a)) onSave(match.id, h, a)
        }}
      >
        Set
      </button>
      {custom && (
        <button type="button" className="text-slate-500 hover:text-red-400" onClick={onClear}>
          ✕
        </button>
      )}
    </div>
  )
}
