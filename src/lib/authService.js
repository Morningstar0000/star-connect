// src/lib/authService.js
import { supabase } from './supabaseClient'

// Store session manually
let currentSession = null
let currentUser = null

export const authService = {
  // Get current session
  getSession: async () => {
    if (currentSession) return currentSession
    
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      currentSession = session
      currentUser = session.user
    }
    return session
  },

  // Get current user
  getUser: async () => {
    if (currentUser) return currentUser
    
    const session = await authService.getSession()
    return session?.user || null
  },

  // Sign in
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: String(password)
    })
    
    if (!error && data.session) {
      currentSession = data.session
      currentUser = data.session.user
    }
    
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    currentSession = null
    currentUser = null
    return { error }
  },

  // Refresh session
  refreshSession: async () => {
    const { data, error } = await supabase.auth.refreshSession()
    if (!error && data.session) {
      currentSession = data.session
      currentUser = data.session.user
    }
    return { data, error }
  },

  // Clear session (for recovery)
  clearSession: () => {
    currentSession = null
    currentUser = null
  }
}