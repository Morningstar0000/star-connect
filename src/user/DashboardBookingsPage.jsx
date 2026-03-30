import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import MainLayout from '../components/MainLayout'
import { Calendar, Clock, CheckCircle, Star, DollarSign, ArrowLeft } from 'lucide-react'

export default function DashboardBookingsPage() {
  const navigate = useNavigate()
  const { user, userType, loading } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login')
      } else if (userType === 'admin') {
        navigate('/admin')
      }
    }
  }, [user, userType, loading, navigate])

  useEffect(() => {
    if (user && userType === 'regular') {
      fetchAllBookings()
    }
  }, [user, userType])

  const fetchAllBookings = async () => {
    setLoadingBookings(true)
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookings(data || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoadingBookings(false)
    }
  }

  // In the getStatusBadge function, ensure it handles lowercase status
const getStatusBadge = (status) => {
  const statusLower = status?.toLowerCase() || ''
  
  switch(statusLower) {
    case 'pending':
      return <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm"><Clock className="w-3 h-3" /> Pending</span>
    case 'confirmed':
      return <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"><CheckCircle className="w-3 h-3" /> Confirmed</span>
    case 'completed':
      return <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"><CheckCircle className="w-3 h-3" /> Completed</span>
    default:
      return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{status}</span>
  }
}

  if (loading || loadingBookings) {
    return (
      
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </div>
     
    )
  }

  return (
  
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold text-foreground mb-8">All Bookings</h1>

          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map(booking => (
                <div key={booking.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="text-lg font-semibold text-foreground">{booking.celebrity_name}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-foreground/60">Date</p>
                          <p className="text-sm font-medium">
                            {booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : 'TBD'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground/60">Time</p>
                          <p className="text-sm font-medium">{booking.booking_time || 'TBD'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground/60">Service</p>
                          <p className="text-sm font-medium capitalize">{booking.service_type}</p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground/60">Amount</p>
                          <p className="text-sm font-bold text-secondary">${booking.amount}</p>
                        </div>
                      </div>

                      {booking.message && (
                        <p className="text-sm text-foreground/70 italic border-t border-border pt-3 mt-3">
                          "{booking.message}"
                        </p>
                      )}
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:ml-6">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card border border-border rounded-xl">
              <p className="text-foreground/60 mb-4">No bookings found.</p>
              <button 
                onClick={() => navigate('/browse')} 
                className="px-6 py-2 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition font-medium"
              >
                Browse Celebrities
              </button>
            </div>
          )}
        </div>
      </main>
    
  )
}