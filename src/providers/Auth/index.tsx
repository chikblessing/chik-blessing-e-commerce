// providers/Auth/index.tsx
'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@/payload-types' 
import { apiClient } from './apiClient' 


type AuthContextType = {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<any>
  logout: () => void
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, password: string) => Promise<void>
  verifyEmail: (token: string) => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}



export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // 🟢 Improvement: Use a persistent function reference
  const updateAuth = (userData: User, authToken: string) => {
    setUser(userData)
    setToken(authToken)
    // ⚠️ Security Note: localStorage is used for convenience but HTTP-only cookies are safer
    localStorage.setItem('payload-token', authToken)
  }

  const clearAuth = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('payload-token')
  }

  const fetchMe = async (authToken: string) => {
    try {
      // 🟢 API Abstraction: Use apiClient to handle headers and fetch
      const data = await apiClient('users/me', { token: authToken })

      if (data.user) {
        setUser(data.user)
      } else {
        clearAuth()
      }
    } catch (error) {
      // If /me fails (e.g., 401 JWT expired), clear the token
      clearAuth()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem('payload-token')
    if (storedToken) {
      setToken(storedToken)
      fetchMe(storedToken)
    } else {
      setLoading(false)
    }
  }, []) // Empty dependency array ensures this runs only once on mount

  

  const login = async (email: string, password: string) => {
    // 🟢 Simplified Fetch: No need for manual headers/JSON parsing
    const data = await apiClient('users/login', {
      method: 'POST',
      body: { email, password },
    })

    updateAuth(data.user, data.token)
  }

  const register = async (userData: any) => {
    // 🟢 Simplified Fetch
    const data = await apiClient('users', {
      method: 'POST',
      body: { ...userData, role: 'customer' }, // Enforce customer role
    })

    if (!(data.user as any)._verified) {
      return {
        success: true,
        needsVerification: true,
        message: 'Please check your email to verify your account before logging in.',
      }
    }

    updateAuth(data.user, data.token)
    return { success: true, needsVerification: false }
  }

  const logout = () => {
    // 🟢 Simplified Logout
    clearAuth()
    // Note: No need to hit a logout endpoint in Payload for JWTs, clearing the token is enough
  }

  const forgotPassword = async (email: string) => {
    // 🟢 Simplified Fetch
    await apiClient('users/forgot-password', {
      method: 'POST',
      body: { email },
    })
  }

  const resetPassword = async (resetToken: string, password: string) => {
    // 🟢 Simplified Fetch
    const data = await apiClient('users/reset-password', {
      method: 'POST',
      body: { token: resetToken, password },
    })

    updateAuth(data.user, data.token)
  }

  const verifyEmail = async (verifyToken: string) => {
    // 🟢 Simplified Fetch
    const data = await apiClient(`users/verify/${verifyToken}`, {
      method: 'POST',
    })

    if (data.token) {
      updateAuth(data.user, data.token)
    }
  }

  const value = {
    user,
    token,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
