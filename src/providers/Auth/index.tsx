// providers/Auth/index.tsx
'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSession, signIn, signOut } from 'next-auth/react'
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
  sendOTP: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>
  verifyOTP: (
    email: string,
    otp: string,
  ) => Promise<{ success: boolean; message?: string; error?: string }>
  loginWithGoogle: () => Promise<void>
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
  const { data: session, status } = useSession()

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
    if (status === 'loading') {
      setLoading(true)
      return
    }

    if (session?.user) {
      // User is authenticated via NextAuth (Google OAuth)
      // Fetch the corresponding Payload user
      const fetchPayloadUser = async () => {
        try {
          const data = await apiClient(`users?where[email][equals]=${session.user.email}`)
          if (data.docs && data.docs.length > 0) {
            setUser(data.docs[0])
          }
        } catch (error) {
          console.error('Error fetching Payload user:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchPayloadUser()
    } else {
      // Check for Payload token in localStorage
      const storedToken = localStorage.getItem('payload-token')
      if (storedToken) {
        setToken(storedToken)
        fetchMe(storedToken)
      } else {
        setLoading(false)
      }
    }
  }, [session, status])

  const login = async (email: string, password: string) => {
    // 🟢 Simplified Fetch: No need for manual headers/JSON parsing
    const data = await apiClient('users/login', {
      method: 'POST',
      body: { email, password },
    })

    updateAuth(data.user, data.token)
  }

  const register = async (userData: any) => {
    try {
      // 🟢 Prepare data for Payload - combine firstName and lastName into name
      const payloadData = {
        ...userData,
        name: `${userData.firstName} ${userData.lastName}`, // Combine names for required name field
        role: 'customer', // Enforce customer role
      }

      // 🟢 Simplified Fetch
      const data = await apiClient('users', {
        method: 'POST',
        body: payloadData,
      })

      // Check if we have a response with doc or user
      const user = data.doc || data.user

      // Check if user object exists
      if (!user) {
        return {
          success: false,
          error: 'User creation failed - no user data returned',
        }
      }

      // Check if user needs verification (default to true if _verified field doesn't exist or is false)
      const isVerified = user._verified === true

      if (!isVerified) {
        return {
          success: true,
          needsVerification: true,
          message: 'Please check your email to verify your account before logging in.',
          user: user,
        }
      }

      // Only update auth if user is already verified and we have a token
      if (data.token) {
        updateAuth(user, data.token)
      }

      return { success: true, needsVerification: false }
    } catch (error: any) {
      console.error('Registration error:', error)

      // Handle duplicate email error
      if (error.message && error.message.includes('email is already registered')) {
        return {
          success: false,
          error: 'A user with this email is already registered. Please login instead.',
        }
      }

      // Handle Payload validation errors
      if (error.data?.errors) {
        const emailError = error.data.errors.find((err: any) => err.path === 'email')
        if (emailError) {
          return {
            success: false,
            error: 'A user with this email is already registered. Please login instead.',
          }
        }
      }

      return {
        success: false,
        error: error.message || 'Registration failed',
      }
    }
  }

  const logout = () => {
    // 🟢 Simplified Logout
    clearAuth()
    // Show toast to confirm logout
    toast.success('Logged out successfully')
    // Also sign out from NextAuth if user is signed in via Google
    if (session) {
      signOut({ callbackUrl: '/' })
    }
    // Note: No need to hit a logout endpoint in Payload for JWTs, clearing the token is enough
  }

  const loginWithGoogle = async () => {
    await signIn('google', { callbackUrl: '/' })
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

  const sendOTP = async (email: string) => {
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true, message: data.message }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  const verifyOTP = async (email: string, otp: string) => {
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (response.ok) {
        // Just set the user data since we don't have a token from OTP verification
        setUser(data.user)
        return { success: true, message: data.message }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
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
    sendOTP,
    verifyOTP,
    loginWithGoogle,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
