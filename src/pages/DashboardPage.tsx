import { Link } from 'react-router-dom'
import { Card } from '../components/Card'
import { TeamBadge } from '../components/TeamBadge'
import { getStadium } from '../data/stadiums'
import { useSimulation } from '../context/SimulationContext'
import { resolveMatchResult } from '../lib/standings'
import { getChampion } from '../lib/bracket'

export function DashboardPage() {
  const { state, standings, bracket, groupMatches, lastUpdated } = useSimulation()
  const today = lastUpdated.toISOString().slice(0, 10)

  const resolved = groupMatches.map((m) => resolveMatchResult(m, state.customResults))
  const finished = resolved.filter((m) => m.status === 'finished')
  const todayMatches = resolved.filter((m) => m.date === today)
  const upcoming = resolved.filter((m) => m.status === 'scheduled').slice(0, 6)
  const champion = getChampion(bracket)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Matches Played', value: finished.length, sub: 'of 72 group games' },
          { label: 'Goals Scored', value: finished.reduce((s, m) => s + (m.homeScore ?? 0) + (m.awayScore ?? 0), 0), sub: 'group stage' },
          { label: 'Teams', value: 48, sub: '12 groups of 4' },
          { label: 'Sim Champion', value: champion ? '' : '—', sub: champion ? '' : 'Set bracket picks', teamId: champion },
        ].map((stat) => (
          <Card key={stat.label} className="!p-0">
            <div className="p-4">
              <p className="text-xs text-slate-400">{stat.label}</p>
              <p className="text-2xl font-bold text-wc-gold mt-1">
                {'teamId' in stat && stat.teamId ? <TeamBadge teamId={stat.teamId} /> : stat.value}
              </p>
              <p className="text-xs text-slate-500 mt-1">{stat.sub}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Today's Results" subtitle={new Date(today).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}>
          <div className="space-y-3">
            {todayMatches.length === 0 && <p className="text-slate-400 text-sm">No matches today.</p>}
            {todayMatches.map((match) => (
              <MatchRow key={match.id} match={match} />
            ))}
          </div>
        </Card>

        <Card title="Knockout Qualifiers (confirmed)" subtitle="Based on results through Matchday 2">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-wc-green">✓</span>
              <TeamBadge teamId="FRA" /> — Group I (6 pts)
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-wc-green">✓</span>
              <TeamBadge teamId="NOR" /> — Group I (6 pts)
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-wc-green">✓</span>
              <TeamBadge teamId="ARG" /> — Group J (6 pts)
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="text-red-400">✗</span>
              <TeamBadge teamId="JOR" /> — Eliminated
            </div>
          </div>
        </Card>
      </div>

      <Card
        title="Group Leaders"
        subtitle="Current table toppers after Matchday 2"
        action={<Link to="/groups" className="text-xs text-wc-gold hover:underline">View all →</Link>}
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {Object.entries(standings).map(([group, rows]) => (
            rows[0] && (
              <div key={group} className="bg-wc-navy/50 rounded-lg p-3 border border-wc-border/50">
                <span className="text-xs font-bold text-wc-gold">Group {group}</span>
                <div className="mt-2 flex items-center justify-between">
                  <TeamBadge teamId={rows[0].teamId} size="sm" />
                  <span className="text-sm font-mono text-slate-300">{rows[0].points} pts</span>
                </div>
              </div>
            )
          ))}
        </div>
      </Card>

      <Card title="Upcoming Fixtures" action={<Link to="/schedule" className="text-xs text-wc-gold hover:underline">Full schedule →</Link>}>
        <div className="space-y-2">
          {upcoming.map((match) => (
            <MatchRow key={match.id} match={match} compact />
          ))}
        </div>
      </Card>
    </div>
  )
}

function MatchRow({ match, compact = false }: { match: ReturnType<typeof resolveMatchResult>; compact?: boolean }) {
  const stadium = getStadium(match.stadiumId)
  const isFinished = match.status === 'finished'

  return (
    <div className={`flex items-center gap-3 ${compact ? 'py-2' : 'py-3 border-b border-wc-border/50 last:border-0'}`}>
      <div className="text-xs text-slate-500 w-16 shrink-0">{match.group ? `Grp ${match.group}` : match.round?.toUpperCase()}</div>
      <div className="flex-1 flex items-center justify-center gap-3">
        <TeamBadge teamId={match.homeId} size="sm" showName={!compact} />
        <div className="font-mono font-bold text-center min-w-[4rem]">
          {isFinished ? (
            <span>{match.homeScore} - {match.awayScore}</span>
          ) : (
            <span className="text-slate-500 text-sm">vs</span>
          )}
        </div>
        <TeamBadge teamId={match.awayId} size="sm" showName={!compact} />
      </div>
      {!compact && (
        <div className="text-xs text-slate-500 text-right hidden md:block w-32">
          {stadium.city}
        </div>
      )}
    </div>
  )
}
