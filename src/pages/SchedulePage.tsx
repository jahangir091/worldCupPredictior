import { useState } from 'react'
import { Card } from '../components/Card'
import { TeamBadge } from '../components/TeamBadge'
import { getStadium } from '../data/stadiums'
import { useSimulation } from '../context/SimulationContext'
import { resolveMatchResult } from '../lib/standings'
import { predictMatch } from '../lib/prediction'
import { getTeam } from '../data/teams'

export function SchedulePage() {
  const { state, setCustomResult, clearCustomResult, groupMatches } = useSimulation()
  const [filter, setFilter] = useState<'all' | 'finished' | 'upcoming'>('all')

  const matches = groupMatches.map((m) => resolveMatchResult(m, state.customResults))
    .filter((m) => {
      if (filter === 'finished') return m.status === 'finished'
      if (filter === 'upcoming') return m.status !== 'finished'
      return true
    })

  const byDate = matches.reduce<Record<string, typeof matches>>((acc, m) => {
    (acc[m.date] ??= []).push(m)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Match Schedule</h1>
          <p className="text-slate-400 text-sm">72 group stage matches across 16 stadiums</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'finished', 'upcoming'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-sm capitalize ${
                filter === f ? 'bg-wc-gold/20 text-wc-gold' : 'bg-wc-card text-slate-400 border border-wc-border'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(byDate).map(([date, dayMatches]) => (
          <div key={date}>
            <h2 className="text-sm font-semibold text-wc-gold mb-3 sticky top-28 bg-wc-navy/95 py-1 z-10">
              {new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h2>
            <div className="space-y-2">
              {dayMatches.map((match) => {
                const stadium = getStadium(match.stadiumId)
                const custom = state.customResults[match.id]
                const prediction = predictMatch(getTeam(match.homeId), getTeam(match.awayId), groupMatches, state.customResults)
                const finished = match.status === 'finished'

                return (
                  <Card key={match.id} className="!p-0">
                    <div className="p-4 flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-xs text-slate-500 w-20">
                          <div>{match.time}</div>
                          <div>Grp {match.group}</div>
                        </div>
                        <div className="flex items-center gap-3 flex-1 justify-center">
                          <TeamBadge teamId={match.homeId} />
                          {finished ? (
                            <span className="font-mono text-xl font-bold px-4">
                              {match.homeScore} - {match.awayScore}
                            </span>
                          ) : (
                            <div className="text-center px-4">
                              <div className="text-slate-500 text-sm">vs</div>
                              <div className="text-xs text-slate-500 mt-1">
                                AI: {prediction.predictedScore} ({prediction.homeWin}% / {prediction.draw}% / {prediction.awayWin}%)
                              </div>
                            </div>
                          )}
                          <TeamBadge teamId={match.awayId} />
                        </div>
                        <div className="text-xs text-slate-400 text-right hidden md:block w-40">
                          <div>{stadium.name}</div>
                          <div>{stadium.city}, {stadium.country}</div>
                        </div>
                      </div>

                      {!finished && (
                        <div className="flex items-center gap-2 shrink-0">
                          <input type="number" min={0} max={15} placeholder="H" defaultValue={custom?.homeScore ?? ''} className="w-12 bg-wc-navy border border-wc-border rounded px-2 py-1 text-center text-sm" id={`sh-${match.id}`} />
                          <span className="text-slate-500">-</span>
                          <input type="number" min={0} max={15} placeholder="A" defaultValue={custom?.awayScore ?? ''} className="w-12 bg-wc-navy border border-wc-border rounded px-2 py-1 text-center text-sm" id={`sa-${match.id}`} />
                          <button
                            type="button"
                            className="px-3 py-1 bg-wc-green/20 text-wc-green rounded text-sm hover:bg-wc-green/30"
                            onClick={() => {
                              const h = Number((document.getElementById(`sh-${match.id}`) as HTMLInputElement).value)
                              const a = Number((document.getElementById(`sa-${match.id}`) as HTMLInputElement).value)
                              if (!Number.isNaN(h) && !Number.isNaN(a)) setCustomResult(match.id, h, a)
                            }}
                          >
                            Simulate
                          </button>
                          {custom && (
                            <button type="button" className="text-slate-500 text-sm" onClick={() => clearCustomResult(match.id)}>Reset</button>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
