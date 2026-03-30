// src/context/AdminAuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

const AdminAuthContext = createContext({})

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  // Memory storage for admin session
  let adminSession = null
  let adminUser = null

  const fetchAdminData = async (userId) => {
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

    const initAdminAuth = async () => {
      try {
        console.log('AdminAuth: Getting session...')
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          console.log('AdminAuth: Session found for:', session.user.email)
          const adminData = await fetchAdminData(session.user.id)
          if (adminData) {
            console.log('AdminAuth: Admin data found, setting admin')
            adminSession = session
            adminUser = session.user
            setAdmin({
              ...session.user,
              ...adminData,
              role: 'admin'
            })
          } else {
            console.log('AdminAuth: User is not an admin')
            setAdmin(null)
          }
        } else {
          console.log('AdminAuth: No session found')
          setAdmin(null)
        }
      } catch (error) {
        console.error('Admin auth init error:', error)
        setAdmin(null)
      } finally {
        if (mounted) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    initAdminAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AdminAuth: Auth event:', event)
      if (!mounted) return
      
      if (event === 'SIGNED_OUT') {
        adminSession = null
        adminUser = null
        setAdmin(null)
      } else if (event === 'SIGNED_IN' && session?.user) {
        const adminData = await fetchAdminData(session.user.id)
        if (adminData) {
          adminSession = session
          adminUser = session.user
          setAdmin({
            ...session.user,
            ...adminData,
            role: 'admin'
          })
        } else {
          setAdmin(null)
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const adminLogin = async (email, password) => {
    console.log('AdminAuth: Attempting login for:', email)
    
    // Clear any existing session first
    adminSession = null
    adminUser = null
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: String(password)
    })
    
    if (error) throw error
    
    if (data.session?.user) {
      const adminData = await fetchAdminData(data.session.user.id)
      if (!adminData) {
        await supabase.auth.signOut()
        throw new Error('Not an admin user')
      }
      
      console.log('AdminAuth: Admin login successful')
      adminSession = data.session
      adminUser = data.session.user
      setAdmin({
        ...data.session.user,
        ...adminData,
        role: 'admin'
      })
    }
    
    return data
  }

  const adminLogout = async () => {
    console.log('AdminAuth: Logging out')
    adminSession = null
    adminUser = null
    setAdmin(null)
    await supabase.auth.signOut()
    window.location.href = '/admin-login'
  }

  const value = {
    admin,
    loading: loading || !initialized,
    adminLogin,
    adminLogout,
    isAdmin: !!admin
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}