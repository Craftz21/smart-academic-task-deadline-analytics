/**
 * AuthContext — Provides current user and login/logout helpers
 * to all components via React context.
 */
import React, { createContext, useContext, useState, useEffect } from 'react'
import type { User } from './api'

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
  isStudent: boolean
  isFaculty: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
  isStudent: false,
  isFaculty: false,
  isAdmin: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('academiQ_user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  const setUser = (u: User | null) => {
    setUserState(u)
    if (u) localStorage.setItem('academiQ_user', JSON.stringify(u))
    else localStorage.removeItem('academiQ_user')
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      logout,
      isStudent: user?.role === 'student',
      isFaculty: user?.role === 'faculty',
      isAdmin:   user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
