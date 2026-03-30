// src/pages/LoginPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { Lock, Mail, AlertCircle, UserX } from 'lucide-react'
import MainLayout from '../components/MainLayout'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showProfileMissing, setShowProfileMissing] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setShowProfileMissing(false)

    try {
      const trimmedEmail = email.trim()
      console.log('User login attempt:', trimmedEmail)

      const data = await login(trimmedEmail, password)
      
      if (!data?.user?.id) {
        throw new Error('No user data returned')
      }

      console.log('Login successful, user ID:', data.user.id)
      
      // Check if user exists in user_profiles
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle()

      if (userError) {
        console.error('User profile check error:', userError)
      }

      if (userData) {
        // User has profile, go to dashboard
        console.log('User has profile, redirecting to dashboard')
        navigate('/dashboard')
      } else {
        // User exists in auth but no profile yet - show message
        console.log('User has no profile')
        setShowProfileMissing(true)
        setLoading(false)
        return
      }
    } catch (err) {
      console.error('Login error:', err)
      
      if (err.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password')
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Please confirm your email address before logging in')
      } else {
        setError('Login failed. Please try again.')
      }
      setLoading(false)
    }
  }

  const handleBackToHome = () => {
    // Sign out the user since they don't have a profile
    supabase.auth.signOut()
    navigate('/')
  }

  if (showProfileMissing) {
    return (
      <MainLayout>
        <main className="min-h-screen bg-background flex items-center justify-center py-12">
          <div className="max-w-md w-full mx-auto px-4">
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserX className="w-10 h-10 text-yellow-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Profile Not Found
              </h2>
              
              <p className="text-foreground/60 mb-6">
                Your account exists but doesn't have a complete profile. 
                Please contact support to set up your profile.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleBackToHome}
                  className="w-full px-6 py-3 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition font-medium"
                >
                  Back to Homepage
                </button>
                
                <button
                  onClick={() => {
                    setShowProfileMissing(false)
                  }}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </main>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <main className="min-h-screen bg-background flex items-center justify-center py-12">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-2">
                <img
                  src="/starconnect-logo.png"
                  alt="StarConnect"
                  className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain"
                />
              </div>
              <p className="text-foreground/60">Login to your account</p>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-secondary"
                    placeholder="user@example.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40 w-5 h-5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-secondary"
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition font-semibold disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </MainLayout>
  )
}