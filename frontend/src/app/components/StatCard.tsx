interface StatCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  color?: string
  sub?: string
}

export default function StatCard({ label, value, icon, color = 'text-blue-400', sub }: StatCardProps) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`${color} bg-slate-700 rounded-xl p-3 flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-white font-mono">{value}</p>
        <p className="text-sm text-slate-400">{label}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
