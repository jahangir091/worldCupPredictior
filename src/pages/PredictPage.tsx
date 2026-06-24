import { useState } from 'react'
import { Card, StatBar } from '../components/Card'
import { TeamBadge } from '../components/TeamBadge'
import { getAllTeams, getTeam } from '../data/teams'
import { useSimulation } from '../context/SimulationContext'
import { predictMatch, compareTeams } from '../lib/prediction'
import { getTournamentForm } from '../lib/standings'

export function PredictPage() {
  const { state, groupMatches } = useSimulation()
  const teams = getAllTeams()
  const [homeId, setHomeId] = useState('ENG')
  const [awayId, setAwayId] = useState('GHA')

  const home = getTeam(homeId)
  const away = getTeam(awayId)
  const prediction = predictMatch(home, away, groupMatches, state.customResults)
  const comparison = compareTeams(home, away)
  const homeTournament = getTournamentForm(homeId, groupMatches, state.customResults)
  const awayTournament = getTournamentForm(awayId, groupMatches, state.customResults)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Match Predictor</h1>
        <p className="text-slate-400 text-sm">
          Compare historical pedigree vs current form, injuries, and live tournament stats
        </p>
      </div>

      <Card title="Select Matchup">
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={homeId}
            onChange={(e) => setHomeId(e.target.value)}
            className="flex-1 min-w-[180px] bg-wc-navy border border-wc-border rounded-lg px-3 py-2"
          >
            {teams.map((t) => (
              <option key={t.id} value={t.id}>{t.flag} {t.name}</option>
            ))}
          </select>
          <span className="text-slate-500 font-bold">VS</span>
          <select
            value={awayId}
            onChange={(e) => setAwayId(e.target.value)}
            className="flex-1 min-w-[180px] bg-wc-navy border border-wc-border rounded-lg px-3 py-2"
          >
            {teams.map((t) => (
              <option key={t.id} value={t.id}>{t.flag} {t.name}</option>
            ))}
          </select>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card title="Prediction" className="lg:col-span-1">
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-wc-gold">{prediction.predictedScore}</div>
            <p className="text-sm text-slate-400">Predicted scoreline</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <ProbBlock label={home.name.split(' ')[0]} value={prediction.homeWin} />
              <ProbBlock label="Draw" value={prediction.draw} />
              <ProbBlock label={away.name.split(' ')[0]} value={prediction.awayWin} />
            </div>
            <div className="pt-3 border-t border-wc-border text-left text-xs space-y-1 text-slate-400">
              <p>Algorithm weights: FIFA rank 22% · Form 18% · History 15% · Tournament 20% · Attack/Def 15% · Injuries 5% · Home 5%</p>
            </div>
          </div>
        </Card>

        <Card title="Historical vs Current" className="lg:col-span-2">
          <ComparisonTable
            home={home}
            away={away}
            comparison={comparison}
            homeTournament={homeTournament}
            awayTournament={awayTournament}
          />
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card title={`${home.flag} ${home.name} — Strength Breakdown`}>
          <BreakdownBars breakdown={prediction.homeBreakdown} />
        </Card>
        <Card title={`${away.flag} ${away.name} — Strength Breakdown`}>
          <BreakdownBars breakdown={prediction.awayBreakdown} />
        </Card>
      </div>
    </div>
  )
}

function ProbBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-wc-navy/50 rounded-lg p-2">
      <div className="text-lg font-bold text-wc-gold">{value}%</div>
      <div className="text-xs text-slate-500 truncate">{label}</div>
    </div>
  )
}

function ComparisonTable({
  home,
  away,
  comparison,
  homeTournament,
  awayTournament,
}: {
  home: ReturnType<typeof getTeam>
  away: ReturnType<typeof getTeam>
  comparison: ReturnType<typeof compareTeams>
  homeTournament: ReturnType<typeof getTournamentForm>
  awayTournament: ReturnType<typeof getTournamentForm>
}) {
  const rows = [
    { label: 'FIFA Ranking', home: `#${home.fifaRank}`, away: `#${away.fifaRank}`, better: comparison.fifaRank.better },
    { label: 'World Cup Titles', home: home.historical.worldCupTitles, away: away.historical.worldCupTitles },
    { label: 'Knockout Rate', home: `${(home.historical.knockoutRate * 100).toFixed(0)}%`, away: `${(away.historical.knockoutRate * 100).toFixed(0)}%` },
    { label: 'Current Form', home: home.current.formScore, away: away.current.formScore, better: comparison.form.home > comparison.form.away ? 'home' : 'away' },
    { label: 'Attack Rating', home: home.current.attackRating, away: away.current.attackRating, better: comparison.attack.home > comparison.attack.away ? 'home' : 'away' },
    { label: 'Defense Rating', home: home.current.defenseRating, away: away.current.defenseRating, better: comparison.defense.home > comparison.defense.away ? 'home' : 'away' },
    { label: 'WC 2026 Pts (live)', home: homeTournament.points, away: awayTournament.points, better: homeTournament.points > awayTournament.points ? 'home' : 'away' },
    { label: 'WC 2026 GD', home: homeTournament.gd > 0 ? `+${homeTournament.gd}` : homeTournament.gd, away: awayTournament.gd > 0 ? `+${awayTournament.gd}` : awayTournament.gd },
    { label: 'Injury Impact', home: `−${(comparison.injuries.homeImpact * 100).toFixed(0)}%`, away: `−${(comparison.injuries.awayImpact * 100).toFixed(0)}%` },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-slate-500 border-b border-wc-border">
            <th className="text-left py-2">Metric</th>
            <th className="text-center py-2"><TeamBadge teamId={home.id} size="sm" /></th>
            <th className="text-center py-2"><TeamBadge teamId={away.id} size="sm" /></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-wc-border/30">
              <td className="py-2 text-slate-400">{row.label}</td>
              <td className={`py-2 text-center font-mono ${row.better === 'home' ? 'text-wc-green font-bold' : ''}`}>{row.home}</td>
              <td className={`py-2 text-center font-mono ${row.better === 'away' ? 'text-wc-green font-bold' : ''}`}>{row.away}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function BreakdownBars({ breakdown }: { breakdown: ReturnType<typeof predictMatch>['homeBreakdown'] }) {
  const items = [
    { label: 'FIFA Rank', value: breakdown.fifaRankScore * 100 / 0.22, color: 'bg-blue-500' },
    { label: 'Current Form', value: breakdown.formScore * 100 / 0.18, color: 'bg-wc-green' },
    { label: 'Historical', value: breakdown.historicalScore * 100 / 0.15, color: 'bg-purple-500' },
    { label: 'Tournament Form', value: breakdown.tournamentFormScore * 100 / 0.20, color: 'bg-wc-gold' },
    { label: 'Injuries', value: Math.abs(breakdown.injuryPenalty) * 100 / 0.05, color: 'bg-red-500' },
    { label: 'Home Adv.', value: breakdown.homeAdvantage * 100 / 0.05, color: 'bg-orange-500' },
  ]

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <StatBar key={item.label} label={item.label} value={item.value} color={item.color} />
      ))}
      <div className="pt-2 border-t border-wc-border flex justify-between text-sm">
        <span className="text-slate-400">Total Strength</span>
        <span className="font-bold text-wc-gold">{(breakdown.total * 100).toFixed(1)}</span>
      </div>
    </div>
  )
}
