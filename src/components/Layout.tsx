import { NavLink, Outlet } from 'react-router-dom'
import { useSimulation, useLastUpdatedLabel } from '../context/SimulationContext'

const nav = [
  { to: '/', label: 'Dashboard', icon: '🏠' },
  { to: '/groups', label: 'Groups', icon: '📊' },
  { to: '/schedule', label: 'Schedule', icon: '📅' },
  { to: '/bracket', label: 'Bracket', icon: '🏆' },
  { to: '/bracket-tree', label: 'Bracket Tree', icon: '🌳' },
  { to: '/teams', label: 'Teams', icon: '⚽' },
  { to: '/predict', label: 'Predict', icon: '🎯' },
]

export function Layout() {
  const { lastUpdated, isRefreshing, refreshError, refreshData } = useSimulation()
  const updatedLabel = useLastUpdatedLabel(lastUpdated)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-wc-border bg-wc-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚽</span>
            <div>
              <h1 className="font-bold text-lg leading-tight text-wc-gold">World Cup 2026</h1>
              <p className="text-xs text-slate-400">Predictor & Simulator</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400 hidden sm:inline">
              Data through {updatedLabel}
            </span>
            <button
              type="button"
              onClick={() => void refreshData()}
              disabled={isRefreshing}
              title="Fetch latest match results"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border border-wc-border bg-wc-navy/60 text-slate-300 hover:text-wc-gold hover:border-wc-gold/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className={isRefreshing ? 'inline-block animate-spin' : ''}>↻</span>
              {isRefreshing ? 'Updating…' : 'Reload'}
            </button>
          </div>
        </div>
        {refreshError && (
          <p className="max-w-7xl mx-auto px-4 pb-2 text-xs text-red-400">{refreshError}</p>
        )}
        <nav className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto pb-2">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-wc-gold/20 text-wc-gold font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-wc-border/50'
                }`
              }
            >
              <span className="mr-1">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="flex-1 w-full px-4 py-6 mx-auto max-w-[100rem]">
        <Outlet />
      </main>
      <footer className="border-t border-wc-border py-4 text-center text-xs text-slate-500">
        FIFA World Cup 2026 — USA · Mexico · Canada · Simulation tool for fan predictions
      </footer>
    </div>
  )
}
