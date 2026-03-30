// src/lib/auth.js
import { supabase } from './supabaseClient'

// Store token in memory only (not in localStorage)
let currentSession = null
let currentUser = null

export const auth = {
  // Initialize auth - check for existing session on page load
  init: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        currentSession = session
        currentUser = session.user
        return session
      }
      return null
    } catch (error) {
      console.error('Auth init error:', error)
      return null
    }
  },

  // Get current user
  getUser: () => currentUser,

  // Get current session
  getSession: () => currentSession,

  // Login
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: String(password)
    })
    
    if (error) throw error
    
    if (data.session) {
      currentSession = data.session
      currentUser = data.session.user
    }
    
    return data
  },

  // Logout
  logout: async () => {
    await supabase.auth.signOut()
    currentSession = null
    currentUser = null
  },

  // Refresh token
  refreshSession: async () => {
    const { data, error } = await supabase.auth.refreshSession()
    if (!error && data.session) {
      currentSession = data.session
      currentUser = data.session.user
    }
    return data
  },

  // Check if authenticated
  isAuthenticated: () => !!currentUser
}