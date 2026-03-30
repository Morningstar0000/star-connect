// src/admin/AdminLoginPage.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Lock, Mail, AlertCircle, Shield } from 'lucide-react'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { login, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const trimmedEmail = email.trim()
      console.log('Attempting admin login with:', trimmedEmail)
      
      await login(trimmedEmail, password)
      
      console.log('Admin login successful, redirecting to /admin')
      navigate('/admin', { replace: true })
    } catch (err) {
      console.error('Admin login error:', err)
      setError(err.message || 'Invalid admin credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-secondary/20 via-background to-primary/20 flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-card border-2 border-secondary/20 rounded-xl p-8 shadow-xl">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center">
              <Shield className="w-10 h-10 text-primary" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">Admin Login</h1>
            <p className="text-foreground/60 mt-2">Secure access for administrators only</p>
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
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="admin@starconnect.com"
                  required
                  disabled={loading || authLoading}
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
                  disabled={loading || authLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || authLoading}
              className="w-full py-3 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition font-semibold disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Access Admin Panel'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-foreground/60 hover:text-secondary transition">
              ← Back to User Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}