import { useEffect, useState } from 'react'
import { AlertTriangle, Clock, CheckCircle, CalendarDays } from 'lucide-react'
import { getTasks } from '../api'
import type { Task } from '../api'

interface Bucket { label: string; tasks: Task[]; color: string; icon: React.ReactNode }

export default function DeadlinesPage() {
  const [tasks, setTasks]   = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTasks().then(setTasks).catch(console.error).finally(() => setLoading(false))
  }, [])

  const today = new Date(); today.setHours(0,0,0,0)

  const buckets: Bucket[] = [
    {
      label: 'Overdue', color: 'border-red-500 bg-red-900/10',
      icon: <AlertTriangle size={16} className="text-red-400" />,
      tasks: tasks.filter(t => {
        const d = new Date(t.deadline); d.setHours(0,0,0,0)
        return d < today && t.status !== 'completed'
      }),
    },
    {
      label: 'Due Today', color: 'border-amber-500 bg-amber-900/10',
      icon: <Clock size={16} className="text-amber-400" />,
      tasks: tasks.filter(t => {
        const d = new Date(t.deadline); d.setHours(0,0,0,0)
        return d.getTime() === today.getTime() && t.status !== 'completed'
      }),
    },
    {
      label: 'This Week', color: 'border-blue-500 bg-blue-900/10',
      icon: <CalendarDays size={16} className="text-blue-400" />,
      tasks: tasks.filter(t => {
        const d = new Date(t.deadline); d.setHours(0,0,0,0)
        const diff = (d.getTime() - today.getTime()) / 86400000
        return diff > 0 && diff <= 7 && t.status !== 'completed'
      }),
    },
    {
      label: 'Upcoming', color: 'border-slate-600 bg-slate-800',
      icon: <CalendarDays size={16} className="text-slate-400" />,
      tasks: tasks.filter(t => {
        const d = new Date(t.deadline); d.setHours(0,0,0,0)
        return (d.getTime() - today.getTime()) / 86400000 > 7 && t.status !== 'completed'
      }),
    },
    {
      label: 'Completed', color: 'border-emerald-700 bg-emerald-900/10',
      icon: <CheckCircle size={16} className="text-emerald-400" />,
      tasks: tasks.filter(t => t.status === 'completed'),
    },
  ]

  if (loading) return (
    <div className="flex items-center justify-center h-48 text-slate-400">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      {buckets.map(b => b.tasks.length > 0 && (
        <div key={b.label}>
          <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-3">
            {b.icon} {b.label}
            <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">{b.tasks.length}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {b.tasks.map(t => (
              <div key={t.id} className={`card border-l-2 ${b.color}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{t.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{t.course_name} · {t.course_code}</p>
                  </div>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium
                    ${t.priority==='high' ? 'text-red-400 bg-red-900/40' :
                      t.priority==='medium' ? 'text-amber-400 bg-amber-900/40' :
                      'text-emerald-400 bg-emerald-900/40'}`}>
                    {t.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-slate-400 font-mono">{t.deadline}</span>
                  <span className={`status-${t.status} text-xs`}>{t.status.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {tasks.length === 0 && (
        <div className="card text-center py-16 text-slate-400">
          <CalendarDays size={36} className="mx-auto mb-3 opacity-40" />
          No tasks found
        </div>
      )}
    </div>
  )
}
