// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { auth } from '@/lib/auth'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
      
      if (error) return null
      return data
    } catch (error) {
      return null
    }
  }

  const checkIfAdmin = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
      
      if (error) return null
      return data
    } catch (error) {
      return null
    }
  }

  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      try {
        // Initialize auth service
        const session = await auth.init()
        
        if (session?.user) {
          // First check if user is admin
          const adminData = await checkIfAdmin(session.user.id)
          
          if (adminData) {
            // User is admin
            setIsAdmin(true)
            setUser({
              ...session.user,
              ...adminData,
              role: 'admin'
            })
            setUserProfile(null)
          } else {
            // Regular user
            const profile = await fetchUserProfile(session.user.id)
            setIsAdmin(false)
            setUser({
              ...session.user,
              ...profile,
              full_name: profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0]
            })
            setUserProfile(profile)
          }
        }
      } catch (error) {
        console.error('Auth init error:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    initAuth()

    return () => {
      mounted = false
    }
  }, [])

  const login = async (email, password) => {
    const data = await auth.login(email, password)
    
    if (data.session?.user) {
      // Check if user is admin
      const adminData = await checkIfAdmin(data.session.user.id)
      
      if (adminData) {
        // Admin user
        setIsAdmin(true)
        setUser({
          ...data.session.user,
          ...adminData,
          role: 'admin'
        })
        setUserProfile(null)
      } else {
        // Regular user
        let profile = await fetchUserProfile(data.session.user.id)
        
        if (!profile) {
          await supabase
            .from('user_profiles')
            .insert([{
              id: data.session.user.id,
              email: data.session.user.email,
              full_name: data.session.user.user_metadata?.full_name || data.session.user.email?.split('@')[0],
              created_at: new Date().toISOString()
            }])
          profile = await fetchUserProfile(data.session.user.id)
        }
        
        setIsAdmin(false)
        setUser({
          ...data.session.user,
          ...profile,
          full_name: profile?.full_name || data.session.user.email?.split('@')[0]
        })
        setUserProfile(profile)
      }
    }
    
    return data
  }

  const logout = async () => {
    await auth.logout()
    setUser(null)
    setUserProfile(null)
    setIsAdmin(false)
    window.location.href = '/'
  }

  const currentUser = user ? {
    ...user,
    full_name: userProfile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0],
    ...userProfile
  } : null

  return (
    <AuthContext.Provider value={{ 
      user: currentUser, 
      userProfile,
      isAdmin,
      loading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}