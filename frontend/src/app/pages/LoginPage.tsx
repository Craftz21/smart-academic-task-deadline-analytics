import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { login } from '../api'
import { useAuth } from '../AuthContext'

const DEMO = [
  { label: 'Admin',   username: 'admin',     password: 'admin123' },
  { label: 'Faculty', username: 'prof_alex', password: 'prof123' },
  { label: 'Student', username: 'student1',  password: 'student123' },
]

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const { setUser } = useAuth()
  const navigate    = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const { user } = await login(username, password)
      setUser(user); navigate('/')
    } catch (err: any) { setError(err.message || 'Login failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-900/40">
            <GraduationCap size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">AcademiQ</h1>
          <p className="text-slate-400 mt-1 text-sm">Smart Academic Task & Deadline System</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-6">Sign in to your account</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Username</label>
              <input type="text" className="input" placeholder="Enter username" value={username}
                onChange={e => setUsername(e.target.value)} required autoFocus />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} className="input pr-10"
                  placeholder="Enter password" value={password}
                  onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 bg-red-900/30 border border-red-700/50 rounded-lg px-3 py-2.5 text-sm text-red-400">
                <AlertCircle size={15} />{error}
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 text-base">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <div className="mt-6 pt-5 border-t border-slate-700">
            <p className="text-xs text-slate-500 mb-3 text-center">Quick demo login — click to fill</p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO.map(a => (
                <button key={a.username} onClick={() => { setUsername(a.username); setPassword(a.password); setError('') }}
                  className="flex flex-col items-center py-2.5 px-2 bg-slate-700/60 hover:bg-slate-700 border border-slate-600 rounded-lg transition-colors">
                  <span className="text-xs font-semibold text-slate-200">{a.label}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">{a.username}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
