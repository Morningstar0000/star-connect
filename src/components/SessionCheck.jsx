// src/components/SessionCheck.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '@/lib/auth'

export const SessionCheck = ({ children }) => {
  const [checking, setChecking] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const check = async () => {
      const session = auth.getSession()
      if (!session) {
        // Try to refresh
        await auth.refreshSession()
      }
      
      if (!auth.isAuthenticated()) {
        navigate('/login')
      }
      setChecking(false)
    }
    
    check()
  }, [navigate])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    )
  }

  return children
}