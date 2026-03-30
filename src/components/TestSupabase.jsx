// src/components/TestSupabase.jsx
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export const TestSupabase = () => {
  const [status, setStatus] = useState('testing...')

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test auth
        const { data: { session } } = await supabase.auth.getSession()
        setStatus(`Auth: ${session?.user?.email || 'no session'}`)
        
        // Test query with timeout
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Query timeout')), 5000)
        })
        
        const queryPromise = supabase.from('user_profiles').select('count').limit(1)
        
        const { error } = await Promise.race([queryPromise, timeoutPromise])
        
        if (error) {
          setStatus(`Query error: ${error.message}`)
        } else {
          setStatus(`Connected - User: ${session?.user?.email || 'none'}`)
        }
      } catch (error) {
        setStatus(`Error: ${error.message}`)
      }
    }
    
    testConnection()
  }, [])

  return (
    <div className="fixed bottom-4 left-4 bg-black text-white text-xs p-2 rounded z-50">
      Supabase: {status}
    </div>
  )
}