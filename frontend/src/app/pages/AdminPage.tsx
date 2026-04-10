import { useEffect, useState } from 'react'
import { Users, BookOpen, Plus, Trash2, X } from 'lucide-react'
import { getUsers, getCourses, createUser, deleteUser, createCourse, deleteCourse } from '../api'
import type { User, Course } from '../api'

type Tab = 'users' | 'courses'

export default function AdminPage() {
  const [tab,      setTab]      = useState<Tab>('users')
  const [users,    setUsers]    = useState<User[]>([])
  const [courses,  setCourses]  = useState<Course[]>([])
  const [loading,  setLoading]  = useState(true)
  const [showUserModal,   setShowUserModal]   = useState(false)
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [error, setError] = useState('')

  const [newUser, setNewUser]     = useState({ username:'', password:'', full_name:'', email:'', role:'student' as User['role'] })
  const [newCourse, setNewCourse] = useState({ name:'', code:'', faculty_id:'' })

  const loadAll = async () => {
    setLoading(true)
    try {
      const [u, c] = await Promise.all([getUsers(), getCourses()])
      setUsers(u); setCourses(c)
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }
  useEffect(() => { loadAll() }, [])

  const facultyList = users.filter(u => u.role === 'faculty')

  const handleCreateUser = async () => {
    setError('')
    try {
      await createUser(newUser)
      setShowUserModal(false)
      setNewUser({ username:'', password:'', full_name:'', email:'', role:'student' })
      loadAll()
    } catch(e: any) { setError(e.message) }
  }

  const handleDeleteUser = async (id: number, name: string) => {
    if (!confirm(`Delete user "${name}"?`)) return
    await deleteUser(id); loadAll()
  }

  const handleCreateCourse = async () => {
    setError('')
    try {
      await createCourse({ ...newCourse, faculty_id: newCourse.faculty_id ? Number(newCourse.faculty_id) : undefined })
      setShowCourseModal(false)
      setNewCourse({ name:'', code:'', faculty_id:'' })
      loadAll()
    } catch(e: any) { setError(e.message) }
  }

  const handleDeleteCourse = async (id: number, name: string) => {
    if (!confirm(`Delete course "${name}"?`)) return
    await deleteCourse(id); loadAll()
  }

  const ROLE_BADGE: Record<string, string> = {
    admin:   'bg-purple-900/50 text-purple-300 border border-purple-700/50',
    faculty: 'bg-blue-900/50   text-blue-300   border border-blue-700/50',
    student: 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50',
  }

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700 pb-0">
        {(['users','courses'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors capitalize flex items-center gap-2 ${
              tab === t ? 'bg-slate-800 text-white border border-b-0 border-slate-700' : 'text-slate-400 hover:text-white'
            }`}>
            {t === 'users' ? <Users size={15} /> : <BookOpen size={15} />}
            {t} <span className="text-xs bg-slate-700 px-1.5 py-0.5 rounded-full">{t === 'users' ? users.length : courses.length}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center h-48 items-center text-slate-400">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tab === 'users' ? (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-white">All Users ({users.length})</h3>
            <button onClick={() => setShowUserModal(true)} className="btn-primary flex items-center gap-1.5 text-sm py-1.5">
              <Plus size={15} /> Add User
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400 border-b border-slate-700">
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium">Username</th>
                  <th className="pb-2 font-medium">Email</th>
                  <th className="pb-2 font-medium">Role</th>
                  <th className="pb-2 font-medium">Joined</th>
                  <th className="pb-2 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-slate-700/40 last:border-0 hover:bg-slate-700/20 transition-colors">
                    <td className="py-2.5 text-slate-200 font-medium">{u.full_name}</td>
                    <td className="py-2.5 text-slate-400 font-mono text-xs">{u.username}</td>
                    <td className="py-2.5 text-slate-400 text-xs">{u.email || '—'}</td>
                    <td className="py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${ROLE_BADGE[u.role]}`}>{u.role}</span>
                    </td>
                    <td className="py-2.5 text-slate-400 text-xs">{u.created_at?.slice(0, 10)}</td>
                    <td className="py-2.5 text-right">
                      <button onClick={() => handleDeleteUser(u.id, u.full_name)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-white">All Courses ({courses.length})</h3>
            <button onClick={() => setShowCourseModal(true)} className="btn-primary flex items-center gap-1.5 text-sm py-1.5">
              <Plus size={15} /> Add Course
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {courses.map(c => (
              <div key={c.id} className="bg-slate-700/40 border border-slate-600 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-white text-sm">{c.name}</p>
                    <p className="text-xs text-blue-400 font-mono mt-0.5">{c.code}</p>
                    <p className="text-xs text-slate-400 mt-1">👤 {c.faculty_name ?? 'Unassigned'}</p>
                  </div>
                  <button onClick={() => handleDeleteCourse(c.id, c.name)}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded transition-colors flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-white">Add New User</h3>
              <button onClick={() => { setShowUserModal(false); setError('') }}
                className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div><label className="label">Full Name</label>
                <input className="input" value={newUser.full_name} onChange={e => setNewUser(u=>({...u,full_name:e.target.value}))} /></div>
              <div><label className="label">Username</label>
                <input className="input" value={newUser.username} onChange={e => setNewUser(u=>({...u,username:e.target.value}))} /></div>
              <div><label className="label">Password</label>
                <input type="password" className="input" value={newUser.password} onChange={e => setNewUser(u=>({...u,password:e.target.value}))} /></div>
              <div><label className="label">Email</label>
                <input type="email" className="input" value={newUser.email} onChange={e => setNewUser(u=>({...u,email:e.target.value}))} /></div>
              <div><label className="label">Role</label>
                <select className="input" value={newUser.role} onChange={e => setNewUser(u=>({...u,role:e.target.value as User['role']}))}>
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select></div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowUserModal(false); setError('') }} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleCreateUser} className="btn-primary flex-1">Create User</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-white">Add New Course</h3>
              <button onClick={() => { setShowCourseModal(false); setError('') }}
                className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div><label className="label">Course Name</label>
                <input className="input" placeholder="e.g., Data Structures" value={newCourse.name} onChange={e => setNewCourse(c=>({...c,name:e.target.value}))} /></div>
              <div><label className="label">Course Code</label>
                <input className="input" placeholder="e.g., CS201" value={newCourse.code} onChange={e => setNewCourse(c=>({...c,code:e.target.value}))} /></div>
              <div><label className="label">Assign Faculty</label>
                <select className="input" value={newCourse.faculty_id} onChange={e => setNewCourse(c=>({...c,faculty_id:e.target.value}))}>
                  <option value="">Unassigned</option>
                  {facultyList.map(f => <option key={f.id} value={f.id}>{f.full_name}</option>)}
                </select></div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowCourseModal(false); setError('') }} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleCreateCourse} className="btn-primary flex-1">Create Course</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
