// context/AuthContext.tsx
'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { createClient as createBrowserClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'


type User = {
  id: string
  email: string
  name?: string
  // subscription and other profile fields removed for now
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name?: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter()
  const supabase = createBrowserClient()

  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // On mount, check if a session exists and set `user`
  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true)
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser()

        if (currentUser) {
          setUser({
            id: currentUser.id,
            email: currentUser.email!,
            name: currentUser.user_metadata?.full_name || undefined,
          })
        } else {
          setUser(null)
        }
      } catch (err: any) {
        console.error('Error fetching user:', err)
        setUser(null)
        setError('Failed to retrieve session')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.full_name || undefined,
        })
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  // Sign in with email & password
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signInError) throw signInError

      const {
        data: { user: currentUser },
        error: getUserError,
      } = await supabase.auth.getUser()
      if (getUserError || !currentUser) throw getUserError || new Error('No user returned')

      setUser({
        id: currentUser.id,
        email: currentUser.email!,
        name: currentUser.user_metadata?.full_name || undefined,
      })
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Sign up with email & password (and optional name)
  const signup = async (email: string, password: string, name?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user: newUser },
        error: signUpError,
      } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name || '' } },
      })
      if (signUpError || !newUser) throw signUpError || new Error('Sign-up failed')

      setUser({
        id: newUser.id,
        email: newUser.email!,
        name: name || undefined,
      })
    } catch (err: any) {
      console.error('Signup error:', err)
      setError(err.message || 'Signup failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Sign out
  const logout = async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
      setUser(null)
      router.push('/login')
    } catch (err) {
      console.error('Logout error:', err)
      setError('Logout failed')
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: Boolean(user),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
