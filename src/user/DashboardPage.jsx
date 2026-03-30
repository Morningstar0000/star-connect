// src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { Calendar, Clock, CheckCircle, Star, DollarSign } from 'lucide-react'
import JoinCallButton from '../components/JoinCallButton'
import WatchVideoButton from '../components/WatchVideoButton'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [bookings, setBookings] = useState([])
  const [calls, setCalls] = useState({})
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    totalSpent: 0
  })

  // Fetch bookings when user is available
  useEffect(() => {
    if (user) {
      fetchUserBookings()
    }
  }, [user])

  const fetchUserBookings = async () => {
    setLoadingBookings(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setBookings(data || [])

      // Fetch calls for bookings with call_id
      const bookingsWithCalls = data?.filter(b => b.call_id) || []
      if (bookingsWithCalls.length > 0) {
        const { data: callsData, error: callsError } = await supabase
          .from('calls')
          .select('*')
          .in('id', bookingsWithCalls.map(b => b.call_id))

        if (!callsError && callsData) {
          const callsMap = {}
          callsData.forEach(call => {
            callsMap[call.id] = call
          })
          setCalls(callsMap)
        }
      }

      // Calculate stats
      const total = data?.length || 0
      let pendingCount = 0
      let confirmedCount = 0
      let completedCount = 0

      data?.forEach(booking => {
        const status = booking.status?.toLowerCase()
        if (status === 'pending') pendingCount++
        else if (status === 'confirmed') confirmedCount++
        else if (status === 'completed') completedCount++
      })

      const totalSpent = data?.reduce((sum, b) => sum + (b.amount || 0), 0) || 0

      setStats({
        total,
        pending: pendingCount,
        confirmed: confirmedCount,
        completed: completedCount,
        totalSpent
      })

    } catch (error) {
      console.error('Error fetching bookings:', error)
      setError(error.message || 'Failed to load bookings')
    } finally {
      setLoadingBookings(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || ''
    switch (statusLower) {
      case 'pending':
        return <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm"><Clock className="w-4 h-4" /> Pending</span>
      case 'confirmed':
        return <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"><CheckCircle className="w-4 h-4" /> Confirmed</span>
      case 'completed':
        return <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"><CheckCircle className="w-4 h-4" /> Completed</span>
      case 'cancelled':
        return <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">Cancelled</span>
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{status}</span>
    }
  }

  const getServiceTypeBadge = (serviceType) => {
    const type = serviceType?.toLowerCase()
    if (type === 'videocall') {
      return <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">📹 Video Call</span>
    } else if (type === 'shoutout') {
      return <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">💬 Shoutout</span>
    }
    return null
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return 'Time not set'
    if (timeString.includes(':')) {
      const [hours, minutes] = timeString.split(':')
      const date = new Date()
      date.setHours(parseInt(hours), parseInt(minutes))
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }
    return timeString
  }

  if (loading || loadingBookings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
          
        </div>

      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-card border border-border rounded-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Unable to Load Dashboard</h2>
          <p className="text-foreground/60 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Welcome back, {user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}!
            </h1>
            <p className="text-lg text-foreground/60">Here's what's happening with your bookings</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-5 h-5 text-secondary" />
                <span className="text-2xl font-bold text-secondary">{stats.total}</span>
              </div>
              <p className="text-foreground/60 text-sm">Total Bookings</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="text-2xl font-bold text-yellow-600">{stats.pending}</span>
              </div>
              <p className="text-foreground/60 text-sm">Pending</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">{stats.confirmed}</span>
              </div>
              <p className="text-foreground/60 text-sm">Confirmed</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-5 h-5 text-secondary" />
                <span className="text-2xl font-bold text-secondary">${stats.totalSpent}</span>
              </div>
              <p className="text-foreground/60 text-sm">Total Spent</p>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Recent Bookings</h2>

            {bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.slice(0, 5).map(booking => (
                  <div
                    key={booking.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-border rounded-lg hover:bg-muted transition cursor-pointer"
                  >
                    <div
                      className="flex-1"
                      onClick={() => navigate(`/booking/${encodeURIComponent(booking.id)}`)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold text-foreground">{booking.celebrity_name}</span>
                        {getServiceTypeBadge(booking.service_type)}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
                        <span>📅 {formatDate(booking.booking_date)}</span>
                        {booking.booking_time && <span>⏰ {formatTime(booking.booking_time)}</span>}
                        <span>💰 ${booking.amount}</span>
                      </div>
                      {booking.message && (
                        <p className="text-sm text-foreground/70 mt-2 italic line-clamp-1">
                          "{booking.message}"
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-3 md:mt-0">
                      {getStatusBadge(booking.status)}
                      {booking.status === 'confirmed' && (
                        <div className="ml-2">
                          {booking.service_type?.toLowerCase() === 'videocall' ? (
                            <JoinCallButton booking={booking} call={calls[booking.call_id]} />
                          ) : booking.service_type?.toLowerCase() === 'shoutout' ? (
                            <WatchVideoButton booking={booking} />
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-foreground/60 mb-4">You haven't made any bookings yet.</p>
                <button
                  onClick={() => navigate('/browse')}
                  className="px-6 py-2 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition font-medium"
                >
                  Browse Celebrities
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
    </>
  )
}