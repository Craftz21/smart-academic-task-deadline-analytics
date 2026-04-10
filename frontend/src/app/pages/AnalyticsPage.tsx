import { useEffect, useState } from 'react'
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  CartesianGrid
} from 'recharts'
import { getAnalytics } from '../api'
import type { Analytics } from '../api'
import WorkloadMeter from '../components/WorkloadMeter'

const COLORS = ['#22c55e', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-xs shadow-xl">
      {label && <p className="text-slate-300 font-medium mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color ?? p.fill }}>{p.name}: {p.value}</p>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const [data, setData]     = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnalytics().then(setData).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-400">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!data) return <div className="text-slate-400 text-center py-20">Failed to load analytics</div>

  const { summary, status_distribution, priority_distribution, tasks_per_week, course_breakdown } = data

  return (
    <div className="space-y-6">
      {/* Summary row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks',      value: summary.total,          color: '#3b82f6' },
          { label: 'Completion Rate',  value: `${summary.completion_pct}%`, color: '#22c55e' },
          { label: 'Overdue Tasks',    value: summary.overdue,        color: '#ef4444' },
          { label: 'Due This Week',    value: summary.upcoming_7days, color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <p className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks per week bar chart */}
        <div className="card lg:col-span-2">
          <h3 className="text-sm font-semibold text-white mb-4">Tasks Due Per Week</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={tasks_per_week} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Tasks" fill="#3b82f6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Workload meter */}
        <WorkloadMeter score={data.workload_score} />
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status pie */}
        <div className="card">
          <h3 className="text-sm font-semibold text-white mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={status_distribution} dataKey="value" nameKey="name"
                cx="50%" cy="50%" outerRadius={80} innerRadius={50} paddingAngle={3}>
                {status_distribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
                iconType="circle" iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Priority pie */}
        <div className="card">
          <h3 className="text-sm font-semibold text-white mb-4">Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={priority_distribution} dataKey="value" nameKey="name"
                cx="50%" cy="50%" outerRadius={80} innerRadius={50} paddingAngle={3}>
                {priority_distribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
                iconType="circle" iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Course breakdown table */}
      <div className="card">
        <h3 className="text-sm font-semibold text-white mb-4">Course Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-slate-700">
                <th className="pb-2 font-medium">Course</th>
                <th className="pb-2 font-medium text-right">Total</th>
                <th className="pb-2 font-medium text-right">Completed</th>
                <th className="pb-2 font-medium text-right">In Progress</th>
                <th className="pb-2 font-medium text-right">Pending</th>
                <th className="pb-2 font-medium text-right">Progress</th>
              </tr>
            </thead>
            <tbody>
              {course_breakdown.map((c, i) => {
                const pct = c.total > 0 ? Math.round((c.completed / c.total) * 100) : 0
                return (
                  <tr key={i} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30 transition-colors">
                    <td className="py-2.5 text-slate-200 font-medium">{c.course}</td>
                    <td className="py-2.5 text-right text-slate-300 font-mono">{c.total}</td>
                    <td className="py-2.5 text-right text-emerald-400 font-mono">{c.completed}</td>
                    <td className="py-2.5 text-right text-blue-400 font-mono">{c.in_progress}</td>
                    <td className="py-2.5 text-right text-amber-400 font-mono">{c.pending}</td>
                    <td className="py-2.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-slate-400 font-mono w-8 text-right">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
