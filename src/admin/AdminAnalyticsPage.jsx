import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '@/context/AdminAuthContext'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { 
  DollarSign, 
  Calendar, 
  Users, 
  Star, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  CreditCard,
  UserPlus,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

export default function AdminAnalyticsPage() {
  const navigate = useNavigate()
  const { admin, loading: authLoading } = useAdminAuth()
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState({
    // Revenue stats
    totalRevenue: 0,
    monthlyRevenue: 0,
    weeklyRevenue: 0,
    averageBookingValue: 0,
    
    // Booking stats
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    
    // User stats
    totalUsers: 0,
    newUsersThisMonth: 0,
    usersWithBookings: 0,
    
    // Celebrity stats
    totalCelebrities: 0,
    mostBookedCelebrity: '',
    topCelebrityBookings: 0,
    
    // Payment stats
    paymentsByMethod: {},
    
    // Growth rates
    revenueGrowth: 0,
    bookingGrowth: 0,
    userGrowth: 0
  })

  useEffect(() => {
    if (!authLoading && !admin) {
      navigate('/admin-login')
      return
    }
    if (admin) {
      fetchAnalytics()
    }
  }, [admin, authLoading, navigate])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      // Get current date ranges
      const now = new Date()
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const firstDayOfWeek = new Date(now)
      firstDayOfWeek.setDate(now.getDate() - now.getDay())
      
      // Reset time to start of day
      firstDayOfMonth.setHours(0, 0, 0, 0)
      firstDayOfWeek.setHours(0, 0, 0, 0)

      // Fetch all bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')

      if (bookingsError) throw bookingsError

      // Fetch all users
      const { data: users, error: usersError } = await supabase
        .from('user_profiles')
        .select('*')

      if (usersError) throw usersError

      // Fetch celebrities count
      const { count: totalCelebrities, error: celebritiesError } = await supabase
        .from('celebrities')
        .select('*', { count: 'exact', head: true })

      if (celebritiesError) throw celebritiesError

      // Calculate statistics
      const totalBookings = bookings?.length || 0
      const totalRevenue = bookings?.reduce((sum, b) => sum + (b.amount || 0), 0) || 0
      
      // Bookings by status
      const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0
      const confirmedBookings = bookings?.filter(b => b.status === 'confirmed').length || 0
      const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0
      const cancelledBookings = bookings?.filter(b => b.status === 'cancelled').length || 0

      // Revenue by time periods
      const monthlyBookings = bookings?.filter(b => new Date(b.created_at) >= firstDayOfMonth) || []
      const monthlyRevenue = monthlyBookings.reduce((sum, b) => sum + (b.amount || 0), 0)

      const weeklyBookings = bookings?.filter(b => new Date(b.created_at) >= firstDayOfWeek) || []
      const weeklyRevenue = weeklyBookings.reduce((sum, b) => sum + (b.amount || 0), 0)

      // Average booking value
      const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0

      // User stats
      const totalUsers = users?.length || 0
      const newUsersThisMonth = users?.filter(u => new Date(u.created_at) >= firstDayOfMonth).length || 0
      
      // Users who have made bookings
      const usersWithBookings = new Set(bookings?.map(b => b.user_id).filter(id => id)).size

      // Most booked celebrity
      const celebrityCounts = {}
      bookings?.forEach(b => {
        celebrityCounts[b.celebrity_name] = (celebrityCounts[b.celebrity_name] || 0) + 1
      })
      
      let mostBookedCelebrity = ''
      let topCelebrityBookings = 0
      Object.entries(celebrityCounts).forEach(([name, count]) => {
        if (count > topCelebrityBookings) {
          topCelebrityBookings = count
          mostBookedCelebrity = name
        }
      })

      // Payment methods distribution
      const paymentsByMethod = {}
      bookings?.forEach(b => {
        const method = b.payment_method || 'unknown'
        paymentsByMethod[method] = (paymentsByMethod[method] || 0) + 1
      })

      // Calculate growth rates (comparing with previous month)
      const previousMonth = new Date()
      previousMonth.setMonth(previousMonth.getMonth() - 1)
      previousMonth.setHours(0, 0, 0, 0)
      
      const previousMonthBookings = bookings?.filter(b => {
        const date = new Date(b.created_at)
        return date >= previousMonth && date < firstDayOfMonth
      }) || []
      
      const previousMonthRevenue = previousMonthBookings.reduce((sum, b) => sum + (b.amount || 0), 0)
      const previousMonthUsers = users?.filter(u => {
        const date = new Date(u.created_at)
        return date >= previousMonth && date < firstDayOfMonth
      }).length || 0

      const revenueGrowth = previousMonthRevenue > 0 
        ? ((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
        : monthlyRevenue > 0 ? 100 : 0
      
      const bookingGrowth = previousMonthBookings.length > 0
        ? ((monthlyBookings.length - previousMonthBookings.length) / previousMonthBookings.length) * 100
        : monthlyBookings.length > 0 ? 100 : 0
      
      const userGrowth = previousMonthUsers > 0
        ? ((newUsersThisMonth - previousMonthUsers) / previousMonthUsers) * 100
        : newUsersThisMonth > 0 ? 100 : 0

      setAnalytics({
        totalRevenue,
        monthlyRevenue,
        weeklyRevenue,
        averageBookingValue,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        totalUsers,
        newUsersThisMonth,
        usersWithBookings,
        totalCelebrities: totalCelebrities || 0,
        mostBookedCelebrity,
        topCelebrityBookings,
        paymentsByMethod,
        revenueGrowth,
        bookingGrowth,
        userGrowth
      })

    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    )
  }

  if (!admin) {
    return null
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">Real-time statistics and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className={`text-xs font-medium flex items-center gap-1 ${
              analytics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {analytics.revenueGrowth >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {formatPercentage(analytics.revenueGrowth)}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalRevenue)}</p>
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-xs text-gray-400 mt-1">{formatCurrency(analytics.monthlyRevenue)} this month</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className={`text-xs font-medium flex items-center gap-1 ${
              analytics.bookingGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {analytics.bookingGrowth >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {formatPercentage(analytics.bookingGrowth)}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.totalBookings}</p>
          <p className="text-sm text-gray-500">Total Bookings</p>
          <p className="text-xs text-gray-400 mt-1">{analytics.pendingBookings} pending</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span className={`text-xs font-medium flex items-center gap-1 ${
              analytics.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {analytics.userGrowth >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {formatPercentage(analytics.userGrowth)}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.totalUsers}</p>
          <p className="text-sm text-gray-500">Registered Users</p>
          <p className="text-xs text-gray-400 mt-1">{analytics.newUsersThisMonth} new this month</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.totalCelebrities}</p>
          <p className="text-sm text-gray-500">Celebrities</p>
          <p className="text-xs text-gray-400 mt-1">
            {analytics.mostBookedCelebrity ? `Top: ${analytics.mostBookedCelebrity}` : 'No bookings yet'}
          </p>
        </div>
      </div>

      {/* Booking Status Breakdown */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Booking Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600">Pending</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">{analytics.pendingBookings}</span>
                <span className="text-xs text-gray-500">
                  {analytics.totalBookings > 0 ? ((analytics.pendingBookings / analytics.totalBookings) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">Confirmed</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">{analytics.confirmedBookings}</span>
                <span className="text-xs text-gray-500">
                  {analytics.totalBookings > 0 ? ((analytics.confirmedBookings / analytics.totalBookings) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600">Completed</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">{analytics.completedBookings}</span>
                <span className="text-xs text-gray-500">
                  {analytics.totalBookings > 0 ? ((analytics.completedBookings / analytics.totalBookings) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-600">Cancelled</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">{analytics.cancelledBookings}</span>
                <span className="text-xs text-gray-500">
                  {analytics.totalBookings > 0 ? ((analytics.cancelledBookings / analytics.totalBookings) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Engagement */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">User Engagement</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Users with bookings</span>
              <span className="font-semibold">{analytics.usersWithBookings}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Conversion rate</span>
              <span className="font-semibold">
                {analytics.totalUsers > 0 
                  ? ((analytics.usersWithBookings / analytics.totalUsers) * 100).toFixed(1) 
                  : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg. bookings per user</span>
              <span className="font-semibold">
                {analytics.usersWithBookings > 0 
                  ? (analytics.totalBookings / analytics.usersWithBookings).toFixed(1) 
                  : 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg. booking value</span>
              <span className="font-semibold">{formatCurrency(analytics.averageBookingValue)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Distribution */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Payment Methods Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.keys(analytics.paymentsByMethod).length > 0 ? (
            Object.entries(analytics.paymentsByMethod).map(([method, count]) => (
              <div key={method} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1 capitalize">{method}</p>
                <p className="text-lg font-semibold">{count}</p>
                <p className="text-xs text-gray-400">
                  {analytics.totalBookings > 0 ? ((count / analytics.totalBookings) * 100).toFixed(1) : 0}%
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-4 text-center py-4 text-gray-500">
              No payment data available yet
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-600">
            {formatCurrency(analytics.weeklyRevenue)} this week
          </span>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <UserPlus className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-gray-600">
            {analytics.newUsersThisMonth} new users this month
          </span>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <Star className="w-4 h-4 text-orange-500" />
          <span className="text-sm text-gray-600">
            {analytics.mostBookedCelebrity 
              ? `Top: ${analytics.mostBookedCelebrity} (${analytics.topCelebrityBookings})` 
              : 'No bookings yet'}
          </span>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-600">
            {analytics.completedBookings} completed bookings
          </span>
        </div>
      </div>
    </div>
  )
}