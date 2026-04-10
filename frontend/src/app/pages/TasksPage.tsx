import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter } from 'lucide-react'
import { getTasks } from '../api'
import type { Task } from '../api'
import { useAuth } from '../AuthContext'
import TaskCard from '../components/TaskCard'

export default function TasksPage() {
  const { isFaculty, isAdmin } = useAuth()
  const [tasks,   setTasks]   = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [status,  setStatus]  = useState('')
  const [priority,setPriority]= useState('')

  const load = async () => {
    setLoading(true)
    try {
      const params: Record<string,string> = {}
      if (status)   params.status   = status
      if (priority) params.priority = priority
      setTasks(await getTasks(params))
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [status, priority])

  const filtered = tasks.filter(t =>
    !search || t.title.toLowerCase().includes(search.toLowerCase()) ||
    (t.course_name ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input pl-9" placeholder="Search tasks or courses…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input w-auto" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select className="input w-auto" value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        {(isFaculty || isAdmin) && (
          <Link to="/tasks/new" className="btn-primary flex items-center gap-2 whitespace-nowrap">
            <Plus size={16} /> Add Task
          </Link>
        )}
      </div>

      {/* Count */}
      <p className="text-sm text-slate-400">{filtered.length} task{filtered.length !== 1 ? 's' : ''}</p>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48 text-slate-400">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16 text-slate-400">
          <Filter size={32} className="mx-auto mb-3 opacity-40" />
          <p>No tasks match your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(t => <TaskCard key={t.id} task={t} onUpdate={load} />)}
        </div>
      )}
    </div>
  )
}
