import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { 
  Lock, 
  Bell, 
  LogOut, 
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'
import MainLayout from '../components/MainLayout'

export default function DashboardSettingsPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  
  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailBookings: true,
    emailPromotions: false,
    emailReminders: true,
    smsNotifications: false
  })

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    // Validate passwords
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' })
      setLoading(false)
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })

      if (error) throw error

      // Show success message
      setMessage({ type: 'success', text: 'Password updated successfully!' })
      
      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' })
      }, 3000)
      
    } catch (error) {
      console.error('Error updating password:', error)
      setMessage({ type: 'error', text: error.message || 'Failed to update password' })
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' })
      }, 5000)
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
    // Here you would save to database
    setMessage({ type: 'success', text: 'Preferences updated!' })
    setTimeout(() => setMessage({ type: '', text: '' }), 2000)
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  return (
    
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Settings</h1>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-600'
          }`}>
            {message.type === 'success' 
              ? <CheckCircle className="w-5 h-5" /> 
              : <AlertCircle className="w-5 h-5" />
            }
            <p>{message.text}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Password Change Section */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-secondary" />
              Change Password
            </h2>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary pr-10"
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/40 hover:text-foreground/60"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary pr-10"
                    placeholder="Enter new password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/40 hover:text-foreground/60"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-foreground/40 mt-1">Minimum 6 characters</p>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary pr-10"
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/40 hover:text-foreground/60"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition font-semibold disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Email Notifications Section */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-secondary" />
              Notification Preferences
            </h2>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.emailBookings}
                  onChange={() => handleNotificationChange('emailBookings')}
                  className="w-4 h-4 accent-secondary"
                />
                <div>
                  <span className="text-foreground font-medium">Booking Updates</span>
                  <p className="text-xs text-foreground/60">Receive emails about your booking status changes</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.emailReminders}
                  onChange={() => handleNotificationChange('emailReminders')}
                  className="w-4 h-4 accent-secondary"
                />
                <div>
                  <span className="text-foreground font-medium">Reminders</span>
                  <p className="text-xs text-foreground/60">Get reminded about upcoming bookings</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.emailPromotions}
                  onChange={() => handleNotificationChange('emailPromotions')}
                  className="w-4 h-4 accent-secondary"
                />
                <div>
                  <span className="text-foreground font-medium">Promotions & Offers</span>
                  <p className="text-xs text-foreground/60">Receive special offers and celebrity announcements</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.smsNotifications}
                  onChange={() => handleNotificationChange('smsNotifications')}
                  className="w-4 h-4 accent-secondary"
                />
                <div>
                  <span className="text-foreground font-medium">SMS Notifications</span>
                  <p className="text-xs text-foreground/60">Get text messages for urgent updates</p>
                </div>
              </label>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-card border border-destructive/20 rounded-xl p-6">
            <h2 className="text-xl font-bold text-destructive mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Danger Zone
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                <div>
                  <h3 className="font-semibold text-foreground">Logout from device</h3>
                  <p className="text-sm text-foreground/60">Sign out of your account on this device</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition font-semibold flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    
  )
}