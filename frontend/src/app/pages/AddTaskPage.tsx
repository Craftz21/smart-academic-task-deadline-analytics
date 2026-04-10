import { useState, useEffect, FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { createTask, updateTask, getTask, getCourses } from '../api'
import type { Course, Task } from '../api'
import { useAuth } from '../AuthContext'

export default function AddTaskPage() {
  const { id } = useParams()
  const isEdit  = Boolean(id)
  const navigate = useNavigate()
  const { user } = useAuth()

  const [courses,     setCourses]     = useState<Course[]>([])
  const [loading,     setLoading]     = useState(false)
  const [saving,      setSaving]      = useState(false)
  const [error,       setError]       = useState('')

  const [form, setForm] = useState({
    title: '', description: '', course_id: '',
    deadline: '', priority: 'medium', status: 'pending',
  })

  useEffect(() => {
    getCourses().then(setCourses).catch(console.error)
    if (isEdit) {
      setLoading(true)
      getTask(Number(id)).then(t => {
        setForm({
          title:       t.title,
          description: t.description ?? '',
          course_id:   String(t.course_id),
          deadline:    t.deadline,
          priority:    t.priority,
          status:      t.status,
        })
      }).catch(console.error).finally(() => setLoading(false))
    }
  }, [id])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setSaving(true); setError('')
    try {
      const payload = {
        ...form,
        course_id: Number(form.course_id),
        priority: form.priority as 'low' | 'medium' | 'high',
        status: form.status as 'pending' | 'in_progress' | 'completed',
      }
      if (isEdit) await updateTask(Number(id), payload)
      else        await createTask(payload)
      navigate('/tasks')
    } catch(err: any) { setError(err.message) }
    finally { setSaving(false) }
  }

  if (loading) return <div className="flex justify-center items-center h-48 text-slate-400">Loading…</div>

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-6">{isEdit ? 'Edit Task' : 'Create New Task'}</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Task Title *</label>
            <input className="input" placeholder="e.g., Binary Tree Assignment"
              value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input resize-none" rows={3} placeholder="Optional details…"
              value={form.description} onChange={e => set('description', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Course *</label>
              <select className="input" value={form.course_id} onChange={e => set('course_id', e.target.value)} required>
                <option value="">Select course…</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Deadline *</label>
              <input type="date" className="input" value={form.deadline}
                onChange={e => set('deadline', e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Priority *</label>
              <select className="input" value={form.priority} onChange={e => set('priority', e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          {error && <p className="text-sm text-red-400 bg-red-900/20 border border-red-700/50 rounded-lg px-3 py-2">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              <Save size={16} /> {saving ? 'Saving…' : isEdit ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
