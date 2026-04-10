import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, CheckCircle, AlertTriangle, Clock, TrendingUp, Plus } from 'lucide-react'
import { getAnalytics, getTasks } from '../api'
import type { Analytics, Task } from '../api'
import { useAuth } from '../AuthContext'
import StatCard from '../components/StatCard'
import TaskCard from '../components/TaskCard'
import WorkloadMeter from '../components/WorkloadMeter'

export default function DashboardPage() {
  const { isFaculty, isAdmin } = useAuth()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [recentTasks, setRecentTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const [a, t] = await Promise.all([getAnalytics(), getTasks()])
      setAnalytics(a)
      setRecentTasks(t.slice(0, 6))
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-400">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading dashboard…
      </div>
    </div>
  )

  const s = analytics?.summary

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tasks"   value={s?.total ?? 0}     icon={<ClipboardList size={20} />} color="text-blue-400" />
        <StatCard label="Completed"     value={s?.completed ?? 0}  icon={<CheckCircle size={20} />}  color="text-emerald-400" sub={`${s?.completion_pct ?? 0}% done`} />
        <StatCard label="Overdue"       value={s?.overdue ?? 0}    icon={<AlertTriangle size={20} />} color="text-red-400" />
        <StatCard label="Due This Week" value={s?.upcoming_7days ?? 0} icon={<Clock size={20} />}   color="text-amber-400" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Recent Tasks</h2>
            <div className="flex gap-2">
              {(isFaculty || isAdmin) && (
                <Link to="/tasks/new" className="btn-primary flex items-center gap-1.5 text-sm py-1.5">
                  <Plus size={15} /> Add Task
                </Link>
              )}
              <Link to="/tasks" className="btn-secondary text-sm py-1.5">View All</Link>
            </div>
          </div>
          {recentTasks.length === 0 ? (
            <div className="card text-center text-slate-400 py-12">No tasks yet</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentTasks.map(t => (
                <TaskCard key={t.id} task={t} onUpdate={load} compact />
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <WorkloadMeter score={analytics?.workload_score ?? 0} />

          {/* Upcoming deadlines */}
          <div className="card">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Clock size={15} className="text-amber-400" /> Upcoming (7 days)
            </h3>
            {(analytics?.upcoming_deadlines ?? []).length === 0 ? (
              <p className="text-xs text-slate-500">No deadlines this week 🎉</p>
            ) : (
              <div className="space-y-2">
                {analytics!.upcoming_deadlines.map(t => (
                  <div key={t.id} className="flex items-center justify-between py-1.5 border-b border-slate-700 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 truncate">{t.title}</p>
                      <p className="text-xs text-slate-500">{t.course_name}</p>
                    </div>
                    <span className={`text-xs font-mono ml-2 flex-shrink-0 ${
                      (t as any).days_left === 0 ? 'text-red-400' :
                      (t as any).days_left <= 2  ? 'text-amber-400' : 'text-slate-400'
                    }`}>
                      {(t as any).days_left === 0 ? 'Today' :
                       (t as any).days_left === 1 ? '1d'    :
                       `${(t as any).days_left}d`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Overdue alert */}
          {(analytics?.overdue_tasks ?? []).length > 0 && (
            <div className="card border-red-700/50 bg-red-900/10">
              <h3 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                <AlertTriangle size={15} /> Overdue Tasks
              </h3>
              {analytics!.overdue_tasks.slice(0, 3).map(t => (
                <div key={t.id} className="py-1.5 border-b border-slate-700/50 last:border-0">
                  <p className="text-sm text-slate-300 truncate">{t.title}</p>
                  <p className="text-xs text-red-400">{(t as any).days_overdue}d overdue</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
