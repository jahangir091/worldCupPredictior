import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  subtitle?: string
  children: ReactNode
  className?: string
  action?: ReactNode
}

export function Card({ title, subtitle, children, className = '', action }: CardProps) {
  return (
    <div className={`bg-wc-card border border-wc-border rounded-xl overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="px-4 py-3 border-b border-wc-border flex items-center justify-between gap-2">
          <div>
            {title && <h2 className="font-semibold text-slate-100">{title}</h2>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  )
}

export function StatBar({ label, value, max = 100, color = 'bg-wc-gold' }: {
  label: string
  value: number
  max?: number
  color?: string
}) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-200">{typeof value === 'number' && value % 1 !== 0 ? value.toFixed(1) : value}</span>
      </div>
      <div className="h-1.5 bg-wc-border rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
