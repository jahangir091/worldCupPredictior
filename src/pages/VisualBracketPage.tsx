import { Link } from 'react-router-dom'
import { CountryFlag } from '../components/CountryFlag'
import { VisualBracket } from '../components/VisualBracket'
import { useSimulation } from '../context/SimulationContext'
import { getChampion } from '../lib/bracket'
import { getTeam } from '../data/teams'

export function VisualBracketPage() {
  const {
    bracket,
    state,
    setKnockoutWinner,
    clearKnockoutWinner,
    setUseAlgorithm,
    resetSimulation,
  } = useSimulation()
  const champion = getChampion(bracket)

  return (
    <div className="bracket-tree-page">
      <div className="page-toolbar flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Knockout Bracket Tree</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            {champion ? (
              <>
                Predicted winner{' '}
                <span className="inline-flex items-center gap-1.5 font-medium text-wc-gold">
                  <CountryFlag teamId={champion} size="sm" />
                  {getTeam(champion).name}
                </span>
              </>
            ) : (
              'Pick winners in the tree or use AI predictions'
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/40 px-3 py-1.5 text-xs text-slate-300">
            <input
              type="checkbox"
              checked={state.useAlgorithm}
              onChange={(e) => setUseAlgorithm(e.target.checked)}
              className="rounded border-wc-border"
            />
            Auto-predict
          </label>
          <button
            type="button"
            onClick={resetSimulation}
            className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10"
          >
            Reset
          </button>
          <Link
            to="/bracket"
            className="rounded-lg border border-slate-700/50 px-3 py-1.5 text-xs text-wc-gold hover:bg-slate-800/40"
          >
            List view
          </Link>
        </div>
      </div>

      <VisualBracket
        bracket={bracket}
        userWinners={state.knockoutWinners}
        onPick={setKnockoutWinner}
        onClear={clearKnockoutWinner}
      />
    </div>
  )
}
