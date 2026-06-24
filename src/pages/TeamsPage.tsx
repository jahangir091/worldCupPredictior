import { useMemo, useState } from 'react'
import { Card, StatBar } from '../components/Card'
import { getAllTeams, GROUPS } from '../data/teams'
import type { Confederation } from '../types'

type SortKey = 'fifaRank' | 'formScore' | 'attackRating' | 'defenseRating'

export function TeamsPage() {
  const [groupFilter, setGroupFilter] = useState<string>('all')
  const [confFilter, setConfFilter] = useState<Confederation | 'all'>('all')
  const [sortBy, setSortBy] = useState<SortKey>('fifaRank')
  const [selectedId, setSelectedId] = useState<string>('ARG')

  const teams = useMemo(() => {
    let list = getAllTeams()
    if (groupFilter !== 'all') list = list.filter((t) => t.group === groupFilter)
    if (confFilter !== 'all') list = list.filter((t) => t.confederation === confFilter)

    return list.sort((a, b) => {
      if (sortBy === 'fifaRank') return a.fifaRank - b.fifaRank
      return b.current[sortBy] - a.current[sortBy]
    })
  }, [groupFilter, confFilter, sortBy])

  const selected = teams.find((t) => t.id === selectedId) ?? teams[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Team Rankings</h1>
        <p className="text-slate-400 text-sm">Browse all 48 teams by FIFA rank, form, and performance metrics</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          className="bg-wc-card border border-wc-border rounded-lg px-3 py-1.5 text-sm"
        >
          <option value="all">All Groups</option>
          {GROUPS.map((g) => (
            <option key={g} value={g}>Group {g}</option>
          ))}
        </select>
        <select
          value={confFilter}
          onChange={(e) => setConfFilter(e.target.value as Confederation | 'all')}
          className="bg-wc-card border border-wc-border rounded-lg px-3 py-1.5 text-sm"
        >
          <option value="all">All Confederations</option>
          {(['UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC', 'OFC'] as const).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="bg-wc-card border border-wc-border rounded-lg px-3 py-1.5 text-sm"
        >
          <option value="fifaRank">FIFA Ranking</option>
          <option value="formScore">Current Form</option>
          <option value="attackRating">Attack</option>
          <option value="defenseRating">Defense</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card title="Teams" className="lg:col-span-1 max-h-[600px] overflow-y-auto !p-0">
          <div className="divide-y divide-wc-border">
            {teams.map((team, i) => (
              <button
                key={team.id}
                type="button"
                onClick={() => setSelectedId(team.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-wc-border/30 transition-colors ${
                  selected?.id === team.id ? 'bg-wc-gold/10 border-l-2 border-wc-gold' : ''
                }`}
              >
                <span className="text-xs text-slate-500 w-6">{sortBy === 'fifaRank' ? team.fifaRank : i + 1}</span>
                <span className="text-lg">{team.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{team.name}</div>
                  <div className="text-xs text-slate-500">Group {team.group} · {team.confederation}</div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {selected && (
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <div className="flex items-center gap-4">
                <span className="text-5xl">{selected.flag}</span>
                <div>
                  <h2 className="text-2xl font-bold">{selected.name}</h2>
                  <p className="text-slate-400">
                    FIFA #{selected.fifaRank} · Group {selected.group} · {selected.confederation}
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card title="Current Performance">
                <div className="space-y-3">
                  <StatBar label="Form Score" value={selected.current.formScore} color="bg-wc-green" />
                  <StatBar label="Attack" value={selected.current.attackRating} color="bg-red-500" />
                  <StatBar label="Defense" value={selected.current.defenseRating} color="bg-blue-500" />
                  <StatBar label="Squad Depth" value={selected.current.squadDepth} color="bg-purple-500" />
                </div>
              </Card>

              <Card title="World Cup History">
                <dl className="space-y-2 text-sm">
                  <Row label="Titles" value={selected.historical.worldCupTitles} />
                  <Row label="Best Finish" value={selected.historical.bestFinish} />
                  <Row label="Appearances" value={selected.historical.appearances} />
                  <Row label="Avg Group Pts" value={selected.historical.avgGroupPoints.toFixed(1)} />
                  <Row label="Knockout Rate" value={`${(selected.historical.knockoutRate * 100).toFixed(0)}%`} />
                </dl>
              </Card>
            </div>

            <Card title="Injury Report" subtitle="Impact on prediction algorithm">
              {selected.injuries.length === 0 ? (
                <p className="text-sm text-wc-green">No significant injuries reported</p>
              ) : (
                <div className="space-y-2">
                  {selected.injuries.map((inj) => (
                    <div key={inj.player} className="flex items-center justify-between text-sm bg-wc-navy/50 rounded-lg px-3 py-2">
                      <div>
                        <span className="font-medium">{inj.player}</span>
                        <span className="text-slate-500 ml-2">{inj.role}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        inj.severity === 'major' ? 'bg-red-500/20 text-red-400' :
                        inj.severity === 'moderate' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {inj.severity} (−{(inj.impact * 100).toFixed(0)}%)
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between">
      <dt className="text-slate-400">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  )
}
