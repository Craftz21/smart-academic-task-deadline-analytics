import { useState } from 'react'
import { Clock, AlertTriangle, CheckCircle, Circle, Loader, Pencil, Trash2 } from 'lucide-react'
import type { Task } from '../api'
import { updateTask, deleteTask } from '../api'
import { useAuth } from '../AuthContext'

interface TaskCardProps {
  task: Task
  onUpdate?: () => void
  compact?: boolean
}

const PRIORITY_CLASS: Record<string, string> = {
  high:   'badge-high',
  medium: 'badge-medium',
  low:    'badge-low',
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  pending:     <Circle size={14} className="text-amber-400" />,
  in_progress: <Loader  size={14} className="text-blue-400 animate-spin" />,
  completed:   <CheckCircle size={14} className="text-emerald-400" />,
}

const STATUS_LABEL: Record<string, string> = {
  pending:     'Pending',
  in_progress: 'In Progress',
  completed:   'Completed',
}

export default function TaskCard({ task, onUpdate, compact = false }: TaskCardProps) {
  const { user, isFaculty, isAdmin } = useAuth()
  const [loading, setLoading] = useState(false)

  const canEdit = isFaculty || isAdmin

  const handleStatusChange = async (newStatus: Task['status']) => {
    if (!canEdit) return
    setLoading(true)
    try {
      await updateTask(task.id, { status: newStatus })
      onUpdate?.()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${task.title}"?`)) return
    setLoading(true)
    try {
      await deleteTask(task.id)
      onUpdate?.()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const isOverdue = task.is_overdue
  const daysLeft  = task.days_until_deadline

  const urgencyBanner = isOverdue
    ? 'border-l-4 border-l-red-500'
    : daysLeft !== undefined && daysLeft <= 3 && task.status !== 'completed'
    ? 'border-l-4 border-l-amber-500'
    : ''

  return (
    <div className={`card hover:border-slate-600 transition-all duration-200 ${urgencyBanner} ${loading ? 'opacity-60' : ''}`}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-white leading-tight ${compact ? 'text-sm' : 'text-base'} truncate`}>
            {task.title}
          </h3>
          {task.course_name && (
            <p className="text-xs text-slate-400 mt-0.5">
              {task.course_code} · {task.course_name}
            </p>
          )}
        </div>
        <span className={PRIORITY_CLASS[task.priority]}>{task.priority}</span>
      </div>

      {/* Description */}
      {!compact && task.description && (
        <p className="text-sm text-slate-400 mb-3 line-clamp-2">{task.description}</p>
      )}

      {/* Deadline */}
      <div className={`flex items-center gap-1.5 text-xs mb-3 ${
        isOverdue ? 'text-red-400' :
        daysLeft !== undefined && daysLeft <= 3 ? 'text-amber-400' :
        'text-slate-400'
      }`}>
        {isOverdue ? <AlertTriangle size={13} /> : <Clock size={13} />}
        {isOverdue
          ? `Overdue by ${Math.abs(daysLeft ?? 0)} day(s)`
          : daysLeft === 0
          ? 'Due today!'
          : daysLeft === 1
          ? 'Due tomorrow'
          : `Due ${task.deadline} (${daysLeft} days)`}
      </div>

      {/* Footer: status + actions */}
      <div className="flex items-center justify-between mt-auto">
        {/* Status selector for faculty/admin */}
        {canEdit ? (
          <select
            value={task.status}
            onChange={e => handleStatusChange(e.target.value as Task['status'])}
            disabled={loading}
            className="text-xs bg-slate-900 border border-slate-600 rounded px-2 py-1 text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        ) : (
          <span className={`status-${task.status} flex items-center gap-1`}>
            {STATUS_ICON[task.status]}
            {STATUS_LABEL[task.status]}
          </span>
        )}

        {/* Edit / Delete buttons */}
        {canEdit && (
          <div className="flex gap-1">
            <a href={`/tasks/${task.id}/edit`}
               className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded transition-colors">
              <Pencil size={14} />
            </a>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
