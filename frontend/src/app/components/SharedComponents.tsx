import { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

// ── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: string | number
  icon: ReactNode
  color?: string        // tailwind text color class
  bgColor?: string      // tailwind bg color class
  trend?: number        // positive = up, negative = down
  subtitle?: string
}

export function StatCard({ label, value, icon, color = 'text-blue-400', bgColor = 'bg-blue-500/10', trend, subtitle }: StatCardProps) {
  return (
    <div className="card p-5 flex flex-col gap-3 fade-in">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center ${color}`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-white tabular-nums">{value}</p>
        <p className="text-slate-400 text-sm mt-0.5">{label}</p>
        {subtitle && <p className="text-slate-500 text-xs mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

// ── Status Badge ─────────────────────────────────────────────────────────────

type Status = 'pending' | 'completed' | 'in_progress'
type Priority = 'high' | 'medium' | 'low'

export function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { label: string; cls: string }> = {
    pending:     { label: 'Pending',     cls: 'badge-pending' },
    completed:   { label: 'Completed',   cls: 'badge-completed' },
    in_progress: { label: 'In Progress', cls: 'badge-in_progress' },
  }
  const { label, cls } = map[status] || { label: status, cls: 'badge-pending' }
  return <span className={cls}>{label}</span>
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const map: Record<Priority, string> = {
    high:   'badge-high',
    medium: 'badge-medium',
    low:    'badge-low',
  }
  return (
    <span className={map[priority] || 'badge-low capitalize'}>
      {priority}
    </span>
  )
}

// ── Loading Spinner ───────────────────────────────────────────────────────────

export function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center p-8">
      <svg
        className="animate-spin text-blue-500"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────

export function EmptyState({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <div className="text-slate-600 w-12 h-12 flex items-center justify-center">{icon}</div>
      <p className="text-slate-400 font-medium">{title}</p>
      {subtitle && <p className="text-slate-500 text-sm max-w-xs">{subtitle}</p>}
    </div>
  )
}

// ── Page Header ───────────────────────────────────────────────────────────────

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-slate-400 text-sm mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

// ── Workload Gauge ────────────────────────────────────────────────────────────

export function WorkloadGauge({ score }: { score: number }) {
  const color =
    score >= 75 ? '#ef4444' :
    score >= 50 ? '#f59e0b' :
    '#22c55e'

  const label =
    score >= 75 ? 'Heavy' :
    score >= 50 ? 'Moderate' :
    'Light'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="12" />
          <circle
            cx="50" cy="50" r="40"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 251.2} 251.2`}
            style={{ transition: 'stroke-dasharray 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
          <p className="text-2xl font-bold text-white tabular-nums">{score}</p>
          <p className="text-xs text-slate-400">/100</p>
        </div>
      </div>
      <p className="text-sm font-medium" style={{ color }}>{label} Load</p>
    </div>
  )
}
