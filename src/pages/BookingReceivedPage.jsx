import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Mail, User, Clock, CheckCircle } from 'lucide-react'

export default function BookingReceivedPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth() // Get current user from auth context
  const { 
    bookingId, 
    celebrityName, 
    celebrityCategory,
    name,
    email, 
    serviceType,
    date,
    time,
    duration,
    occasion,
    message,
    amount,
    paymentMethod
  } = location.state || {}

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-card border border-border rounded-xl p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">Booking Received!</h1>
          <p className="text-lg text-foreground/70 mb-6">
            Your booking request has been submitted. We'll notify {celebrityName} and get back to you within 24 hours.
          </p>

          {/* Next Steps Section - Different for guests vs registered users */}
          {!user ? (
            // For GUESTS (no account)
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-blue-900">Account Creation in Progress</h3>
              </div>
              
              <p className="text-blue-800 mb-4">
                An administrator will create your account within 24-48 hours. Once your account is ready, you'll receive an email with your login credentials.
              </p>
              
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2 text-sm text-blue-700">
                  <CheckCircle className="w-4 h-4" />
                  Track your booking status once logged in
                </li>
                <li className="flex items-center gap-2 text-sm text-blue-700">
                  <CheckCircle className="w-4 h-4" />
                  Save your favorite celebrities
                </li>
                <li className="flex items-center gap-2 text-sm text-blue-700">
                  <CheckCircle className="w-4 h-4" />
                  Get booking notifications via email
                </li>
                <li className="flex items-center gap-2 text-sm text-blue-700">
                  <CheckCircle className="w-4 h-4" />
                  Manage all your bookings in one place
                </li>
              </ul>
              
              <div className="bg-white/50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                <strong>📧 Check your email regularly!</strong> We'll send your login credentials to <span className="font-mono">{email}</span> once your account is ready.
              </div>
            </div>
          ) : (
            // For REGISTERED USERS (already have account)
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-green-900">Track Your Booking</h3>
              </div>
              
              <p className="text-green-800 mb-4">
                You're logged in! You can track your booking status and manage all your bookings from your dashboard.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => navigate(`/booking/${bookingId}`)}
                  className="flex-1 px-4 py-2 bg-white text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition font-medium"
                >
                  View Booking Details
                </button>
              </div>
            </div>
          )}

          {/* Booking Details */}
          <div className="bg-muted/30 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-lg mb-4">Booking Details</h3>
            
            {/* Celebrity Info */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-bold">
                {celebrityName?.charAt(0)}
              </div>
              <div>
                <p className="font-semibold">{celebrityName}</p>
                <p className="text-sm text-foreground/60">{celebrityCategory}</p>
              </div>
            </div>
            
            {/* Personal Info */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-foreground/60">Your Name</p>
                <p className="font-medium">{name}</p>
              </div>
              <div>
                <p className="text-xs text-foreground/60">Email</p>
                <p className="font-medium">{email}</p>
              </div>
            </div>
            
            {/* Booking Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-border">
              <div>
                <p className="text-xs text-foreground/60">Booking ID</p>
                <p className="font-mono text-sm">{bookingId}</p>
              </div>
              <div>
                <p className="text-xs text-foreground/60">Service</p>
                <p className="font-medium">{serviceType === 'video-call' ? 'Video Call' : 'Shoutout'}</p>
              </div>
              {serviceType === 'video-call' && (
                <div>
                  <p className="text-xs text-foreground/60">Duration</p>
                  <p className="font-medium">{duration} minutes</p>
                </div>
              )}
              <div>
                <p className="text-xs text-foreground/60">Date</p>
                <p className="font-medium">{date || 'To be scheduled'}</p>
              </div>
              {time && (
                <div>
                  <p className="text-xs text-foreground/60">Time</p>
                  <p className="font-medium">{time}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-foreground/60">Occasion</p>
                <p className="font-medium capitalize">{occasion || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-xs text-foreground/60">Payment Method</p>
                <p className="font-medium capitalize">{paymentMethod?.replace('-', ' ')}</p>
              </div>
              <div>
                <p className="text-xs text-foreground/60">Total Amount</p>
                <p className="font-bold text-secondary">${amount?.toFixed(2)}</p>
              </div>
            </div>
            
            {/* Message if exists */}
            {message && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-foreground/60 mb-2">Your Message</p>
                <p className="text-sm bg-background p-3 rounded border border-border">
                  "{message}"
                </p>
              </div>
            )}
            
            {/* Status */}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-foreground/60">Status</p>
              <p className="text-yellow-600 font-medium">Pending Payment Verification</p>
            </div>
          </div>

          {/* Return Home Button */}
          <button
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition font-medium"
          >
            Return Home
          </button>
        </div>
      </div>
    </main>
  )
}