import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import {
  LayoutDashboard, ClipboardList, PlusCircle,
  CalendarClock, BarChart3, ShieldCheck, LogOut,
  GraduationCap
} from 'lucide-react'

interface NavItem {
  label: string
  to: string
  icon: React.ReactNode
  roles?: string[]
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',  to: '/',           icon: <LayoutDashboard size={18} /> },
  { label: 'Tasks',      to: '/tasks',       icon: <ClipboardList size={18} /> },
  { label: 'Add Task',   to: '/tasks/new',   icon: <PlusCircle size={18} />,  roles: ['faculty', 'admin'] },
  { label: 'Deadlines',  to: '/deadlines',   icon: <CalendarClock size={18} /> },
  { label: 'Analytics',  to: '/analytics',   icon: <BarChart3 size={18} /> },
  { label: 'Admin',      to: '/admin',        icon: <ShieldCheck size={18} />,  roles: ['admin'] },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const visibleNav = NAV_ITEMS.filter(
    item => !item.roles || (user && item.roles.includes(user.role))
  )

  return (
    <aside className="w-56 flex-shrink-0 bg-slate-800 border-r border-slate-700 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-700">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <GraduationCap size={16} className="text-white" />
        </div>
        <span className="font-bold text-white text-lg tracking-tight">AcademiQ</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {visibleNav.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="px-3 pb-4 border-t border-slate-700 pt-3">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium text-slate-200 truncate">{user?.full_name}</p>
          <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-all duration-150"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  )
}
