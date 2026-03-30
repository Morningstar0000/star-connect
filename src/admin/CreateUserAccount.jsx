import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '@/context/AdminAuthContext'
import { supabase } from '@/lib/supabaseClient'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { CheckCircle, Eye, EyeOff, Copy, Mail, User, Calendar, DollarSign, Star, AlertCircle } from 'lucide-react'

export default function CreateUserAccount() {
  const navigate = useNavigate()
  const { admin, loading: authLoading } = useAdminAuth()
  const [pendingBookings, setPendingBookings] = useState([])
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!authLoading && !admin) {
      navigate('/admin-login')
      return
    }
    if (admin) {
      loadPendingBookings()
    }
  }, [admin, authLoading, navigate])

  const loadPendingBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .is('user_id', null)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setPendingBookings(data || [])
    } catch (error) {
      console.error('Error loading bookings:', error)
      setError('Failed to load pending bookings')
    } finally {
      setLoading(false)
    }
  }

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'
    let generated = ''
    for (let i = 0; i < 10; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(generated)
    setError(null)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCreateAccount = async () => {
    if (!selectedBooking) return
    if (!password) {
      setError('Please generate a password first')
      return
    }

    setCreating(true)
    setError(null)
    
    try {
      console.log('Creating account for:', selectedBooking.guest_email)
      
      // 1. Create auth user using admin API with service role key
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: selectedBooking.guest_email,
        password: password,
        email_confirm: true,
        user_metadata: {
          full_name: selectedBooking.guest_name
        }
      })

      if (authError) {
        console.error('Auth creation error:', authError)
        throw new Error(authError.message)
      }
      
      if (!authData.user) {
        throw new Error('No user data returned from account creation')
      }

      console.log('Auth user created:', authData.user.id)

      // 2. Create profile in user_profiles table
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          id: authData.user.id,
          full_name: selectedBooking.guest_name,
          email: selectedBooking.guest_email,
          phone: selectedBooking.guest_phone || null,
          created_at: new Date().toISOString()
        }])

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Try to clean up the auth user if profile creation fails
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
        throw new Error(`Profile creation failed: ${profileError.message}`)
      }

      console.log('User profile created in user_profiles')

      // 3. Update booking with user_id and confirm status
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ 
          user_id: authData.user.id,
          status: 'confirmed'
        })
        .eq('id', selectedBooking.id)

      if (updateError) {
        console.error('Booking update error:', updateError)
        // Don't delete user here since profile was created, but log error
        throw new Error(`Booking update failed: ${updateError.message}`)
      }

      console.log('Booking updated with user_id')

      setSuccess(true)
      
      // Refresh the list
      await loadPendingBookings()
      setSelectedBooking(null)
      setPassword('')
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)

    } catch (error) {
      console.error('Error creating account:', error)
      setError(error.message || 'Failed to create account. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    )
  }

  if (!admin) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create User Accounts</h1>
          <p className="text-gray-600 mt-1">Create accounts for users who made bookings without logging in</p>
        </div>
        {success && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
            <CheckCircle className="w-5 h-5" />
            <span>Account created successfully!</span>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Bookings List */}
        <div className="col-span-1 bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Pending Bookings</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {pendingBookings.length}
            </span>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {pendingBookings.map(booking => (
              <button
                key={booking.id}
                onClick={() => {
                  setSelectedBooking(booking)
                  setError(null)
                }}
                className={`w-full text-left p-3 rounded-lg border transition ${
                  selectedBooking?.id === booking.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <p className="font-medium text-gray-900">{booking.guest_name}</p>
                <p className="text-sm text-gray-500">{booking.celebrity_name}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(booking.created_at).toLocaleDateString()}
                </p>
              </button>
            ))}
            {pendingBookings.length === 0 && (
              <p className="text-center text-gray-500 py-8">No pending bookings</p>
            )}
          </div>
        </div>

        {/* Booking Details & Account Creation */}
        <div className="col-span-2">
          {selectedBooking ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-lg text-gray-900 mb-4">Create Account</h2>
              
              {/* Booking Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">{selectedBooking.guest_name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium text-gray-900 break-all">{selectedBooking.guest_email}</p>
                    </div>
                  </div>
                  {selectedBooking.guest_phone && (
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4" />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="font-medium text-gray-900">{selectedBooking.guest_phone}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Celebrity</p>
                      <p className="font-medium text-gray-900">{selectedBooking.celebrity_name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Service Type</p>
                      <p className="font-medium capitalize text-gray-900">{selectedBooking.service_type}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="font-bold text-green-600">${selectedBooking.amount}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Creation Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Generate Password
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        readOnly
                        placeholder="Click generate to create password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                      />
                      {password && (
                        <button
                          onClick={() => copyToClipboard(password)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          title="Copy password"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={generatePassword}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                {password && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800 mb-2">
                      <strong>⚠️ Important:</strong> Save these credentials and send them to the user:
                    </p>
                    <div className="space-y-2 bg-white p-3 rounded border border-yellow-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Email:</span>
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono text-gray-800">{selectedBooking.guest_email}</code>
                          <button
                            onClick={() => copyToClipboard(selectedBooking.guest_email)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Password:</span>
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono text-gray-800">{password}</code>
                          <button
                            onClick={() => copyToClipboard(password)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-yellow-200">
                        <p className="text-xs text-gray-500">
                          Login URL: {window.location.origin}/login
                        </p>
                        <button
                          onClick={() => copyToClipboard(`${window.location.origin}/login`)}
                          className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                        >
                          Copy login link
                        </button>
                      </div>
                    </div>
                    {copied && (
                      <p className="text-xs text-green-600 mt-2">Copied to clipboard!</p>
                    )}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleCreateAccount}
                    disabled={creating || !password}
                    className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {creating ? 'Creating Account...' : 'Create Account'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBooking(null)
                      setPassword('')
                      setError(null)
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Select a booking to create an account</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}