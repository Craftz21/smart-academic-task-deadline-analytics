import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import Layout from './components/Layout'
import LoginPage      from './pages/LoginPage'
import DashboardPage  from './pages/DashboardPage'
import TasksPage      from './pages/TasksPage'
import AddTaskPage    from './pages/AddTaskPage'
import DeadlinesPage  from './pages/DeadlinesPage'
import AnalyticsPage  from './pages/AnalyticsPage'
import AdminPage      from './pages/AdminPage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return <>{children}</>
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="tasks"          element={<TasksPage />} />
        <Route path="tasks/new"      element={<AddTaskPage />} />
        <Route path="tasks/:id/edit" element={<AddTaskPage />} />
        <Route path="deadlines"      element={<DeadlinesPage />} />
        <Route path="analytics"      element={<AnalyticsPage />} />
        <Route path="admin"          element={<AdminRoute><AdminPage /></AdminRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
