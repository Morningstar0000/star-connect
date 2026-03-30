// src/admin/AdminPage.jsx (Admin Dashboard)
import { useState, useEffect } from 'react'
import { useAdminAuth } from '@/context/AdminAuthContext'
import { supabase } from '@/lib/supabaseClient'
import { Calendar, DollarSign, Users, Star, CheckCircle, Clock, XCircle } from 'lucide-react'

export default function AdminPage() {
  const { admin } = useAdminAuth()
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    totalCelebrities: 0,
    totalUsers: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      // Fetch bookings stats
      const { data: bookings } = await supabase
        .from('bookings')
        .select('status, amount')

      const totalBookings = bookings?.length || 0
      const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0
      const confirmedBookings = bookings?.filter(b => b.status === 'confirmed').length || 0
      const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0
      const totalRevenue = bookings?.reduce((sum, b) => sum + (b.amount || 0), 0) || 0

      // Fetch celebrities count
      const { count: totalCelebrities } = await supabase
        .from('celebrities')
        .select('*', { count: 'exact', head: true })

      // Fetch users count
      const { count: totalUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })

      setStats({
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        totalRevenue,
        totalCelebrities: totalCelebrities || 0,
        totalUsers: totalUsers || 0
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {admin?.full_name || 'Admin'}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">{stats.totalBookings}</span>
          </div>
          <p className="text-gray-500 text-sm">Total Bookings</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <span className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</span>
          </div>
          <p className="text-gray-500 text-sm">Pending Bookings</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">{stats.confirmedBookings}</span>
          </div>
          <p className="text-gray-500 text-sm">Confirmed Bookings</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-2xl font-bold text-gray-900">{stats.completedBookings}</span>
          </div>
          <p className="text-gray-500 text-sm">Completed Bookings</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</span>
          </div>
          <p className="text-gray-500 text-sm">Total Revenue</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-5 h-5 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">{stats.totalCelebrities}</span>
          </div>
          <p className="text-gray-500 text-sm">Total Celebrities</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">{stats.totalUsers}</span>
          </div>
          <p className="text-gray-500 text-sm">Total Users</p>
        </div>
      </div>
    </div>
  )
}