import { useLocation } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { Bell } from 'lucide-react'

const PAGE_TITLES: Record<string, string> = {
  '/':           'Dashboard',
  '/tasks':      'All Tasks',
  '/tasks/new':  'Add New Task',
  '/deadlines':  'Deadline Overview',
  '/analytics':  'Analytics',
  '/admin':      'Admin Panel',
}

export default function Topbar() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] ?? 'AcademiQ'

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <header className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h1 className="text-base font-semibold text-white">{title}</h1>
        <p className="text-xs text-slate-400">{greeting}, {user?.full_name?.split(' ')[0]}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize
          ${user?.role === 'admin'   ? 'bg-purple-900/50 text-purple-300 border border-purple-700/50' :
            user?.role === 'faculty' ? 'bg-blue-900/50   text-blue-300   border border-blue-700/50' :
                                       'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50'}`}>
          {user?.role}
        </span>
      </div>
    </header>
  )
}
