/**
 * api.ts — Central API client
 * All backend calls go through here. Reads the stored user from localStorage
 * and injects the X-User-Id header so Flask knows who's calling.
 */

const BASE_URL = 'http://localhost:5000'

function getHeaders(): HeadersInit {
  const raw = localStorage.getItem('academiQ_user')
  const user = raw ? JSON.parse(raw) : null
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (user?.id) headers['X-User-Id'] = String(user.id)
  return headers
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: getHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data as T
}

// ── Auth ───────────────────────────────────────────────────────────────────────
export const login = (username: string, password: string) =>
  request<{ user: User }>('POST', '/login', { username, password })

// ── Tasks ─────────────────────────────────────────────────────────────────────
export const getTasks = (params?: Record<string, string>) => {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return request<Task[]>('GET', `/tasks${qs}`)
}
export const getTask   = (id: number)          => request<Task>('GET', `/tasks/${id}`)
export const createTask = (data: Partial<Task>) => request<Task>('POST', '/tasks', data)
export const updateTask = (id: number, data: Partial<Task>) => request<Task>('PUT', `/tasks/${id}`, data)
export const deleteTask = (id: number)          => request<{ message: string }>('DELETE', `/tasks/${id}`)

// ── Analytics ─────────────────────────────────────────────────────────────────
export const getAnalytics = () => request<Analytics>('GET', '/analytics')

// ── Courses ───────────────────────────────────────────────────────────────────
export const getCourses    = ()                      => request<Course[]>('GET', '/courses')
export const createCourse  = (data: Partial<Course>) => request<Course>('POST', '/courses', data)
export const updateCourse  = (id: number, data: Partial<Course>) => request<Course>('PUT', `/courses/${id}`, data)
export const deleteCourse  = (id: number)            => request<{ message: string }>('DELETE', `/courses/${id}`)

// ── Users ─────────────────────────────────────────────────────────────────────
export const getUsers    = (role?: string)          => request<User[]>('GET', `/users${role ? `?role=${role}` : ''}`)
export const createUser  = (data: Partial<User> & { password: string }) => request<User>('POST', '/users', data)
export const updateUser  = (id: number, data: Partial<User>) => request<User>('PUT', `/users/${id}`, data)
export const deleteUser  = (id: number)             => request<{ message: string }>('DELETE', `/users/${id}`)

// ── Types ─────────────────────────────────────────────────────────────────────
export interface User {
  id: number
  username: string
  role: 'student' | 'faculty' | 'admin'
  full_name: string
  email?: string
  created_at?: string
  password?: string
}

export interface Task {
  id: number
  title: string
  description?: string
  course_id: number
  course_name?: string
  course_code?: string
  deadline: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed'
  created_by?: number
  created_by_name?: string
  created_at?: string
  is_overdue?: boolean
  days_until_deadline?: number
}

export interface Course {
  id: number
  name: string
  code: string
  faculty_id?: number
  faculty_name?: string
  created_at?: string
}

export interface Analytics {
  summary: {
    total: number
    completed: number
    pending: number
    in_progress: number
    overdue: number
    upcoming_7days: number
    completion_pct: number
  }
  status_distribution: Array<{ name: string; value: number; color: string }>
  priority_distribution: Array<{ name: string; value: number; color: string }>
  tasks_per_week: Array<{ week: string; count: number }>
  course_breakdown: Array<{ course: string; total: number; completed: number; pending: number; in_progress: number }>
  overdue_tasks: Task[]
  upcoming_deadlines: Task[]
  workload_score: number
}
