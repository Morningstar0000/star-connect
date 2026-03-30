// src/components/AuthDebug.jsx
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export const AuthDebug = () => {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setLoading(false)
    }
    check()
  }, [])

  if (loading) return null

  return (
    <div className="fixed bottom-4 left-4 bg-black text-white text-xs p-2 rounded z-50">
      Session: {session?.user?.email || 'No session'}
      <br />
      Storage: {session ? 'Cookie' : 'None'}
    </div>
  )
}