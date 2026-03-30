import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle, Mail, Calendar, Clock, DollarSign, User, Lock, ArrowLeft } from 'lucide-react'

export default function BookingReviewPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { bookingDetails, paymentMethod, amount, reference, cryptoType, estimatedCrypto } = location.state || {}
  
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!bookingDetails) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground/60">No booking information found.</p>
          <button 
            onClick={() => navigate('/browse')}
            className="mt-4 px-4 py-2 bg-secondary text-primary rounded-lg"
          >
            Browse Celebrities
          </button>
        </div>
      </main>
    )
  }

  // Safely extract booking details with defaults
  const {
    celebrity = {},
    name = '',
    email = '',
    phone = '',
    serviceType = '',
    date = '',
    time = '',
    duration = 30,
    message = '',
    occasion = ''
  } = bookingDetails

  const handleSubmitBooking = () => {
    setSubmitting(true)
    
    // Simulate API call to save booking
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
      
      // Clear pending booking from localStorage
      localStorage.removeItem('pendingBooking')
      
      // Here you would save to Supabase
      console.log('Booking submitted:', {
        guestName: name,
        guestEmail: email,
        guestPhone: phone,
        celebrityId: celebrity.id,
        celebrityName: celebrity.name,
        serviceType,
        bookingDate: date,
        bookingTime: time,
        duration,
        message,
        occasion,
        amount,
        paymentMethod,
        reference,
        cryptoType,
        estimatedCrypto,
        status: 'pending',
        createdAt: new Date().toISOString()
      })
    }, 1500)
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-4">Booking Confirmed!</h1>
            <p className="text-lg text-foreground/70 mb-6">
              Your booking has been successfully submitted and is now pending confirmation.
            </p>
            
            {/* Claim Account Section */}
            <div className="bg-gradient-to-r from-secondary/10 to-primary/10 border border-secondary/20 rounded-lg p-6 mb-6 text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">✨ Claim Your Account</h3>
              </div>
              
              <p className="text-foreground/70 mb-4">
                We've sent a magic link to <strong>{email}</strong>. Click it to create your account and:
              </p>
              
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-secondary">✓</span> Track your booking status
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-secondary">✓</span> Save favorite celebrities
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-secondary">✓</span> Get booking notifications
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-secondary">✓</span> Manage future bookings easily
                </li>
              </ul>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                <strong>📧 Check your inbox!</strong> The email might take a few minutes to arrive.
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition"
              >
                Return Home
              </button>
              <button
                onClick={() => navigate('/browse')}
                className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition"
              >
                Browse More
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-3xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-secondary/10 to-primary/10 p-6 border-b border-border">
            <h1 className="text-2xl font-bold text-foreground">Review Your Booking</h1>
            <p className="text-foreground/60">Please review your booking details before submitting</p>
          </div>

          <div className="p-6">
            {/* Success Message - Payment Verified */}
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <h3 className="font-semibold text-green-800">Payment Verified!</h3>
                <p className="text-sm text-green-700">
                  Your payment has been recorded. Review and submit your booking below.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Booking Details */}
              <div className="md:col-span-2 space-y-4">
                <h2 className="font-semibold text-lg">Booking Details</h2>
                
                <div className="bg-muted/30 rounded-lg p-4">
                  {/* Celebrity Info - Add safe check */}
                  {celebrity && (
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={celebrity.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(celebrity.name || 'User')}&size=48&background=7C3AED&color=fff`}
                        alt={celebrity.name || 'Celebrity'}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(celebrity.name || 'User')}&size=48&background=7C3AED&color=fff`;
                        }}
                      />
                      <div>
                        <p className="font-semibold">{celebrity.name || 'Celebrity'}</p>
                        <p className="text-sm text-foreground/60">{celebrity.category || 'Celebrity'}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-foreground/40" />
                      <span className="text-sm">{name || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-foreground/40" />
                      <span className="text-sm">{email || 'Not provided'}</span>
                    </div>
                    {phone && (
                      <div className="flex items-center gap-2">
                        <span className="text-foreground/40">📞</span>
                        <span className="text-sm">{phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-foreground/60 mb-1">Service</p>
                      <p className="font-medium">{serviceType === 'video-call' ? 'Video Call' : 'Shoutout'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground/60 mb-1">Duration</p>
                      <p className="font-medium">{duration} minutes</p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground/60 mb-1">Date</p>
                      <p className="font-medium">{date || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground/60 mb-1">Time</p>
                      <p className="font-medium">{time || 'To be scheduled'}</p>
                    </div>
                  </div>

                  {message && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs text-foreground/60 mb-2">Your Message</p>
                      <p className="text-sm bg-background p-3 rounded border border-border">
                        "{message}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="md:col-span-1">
                <div className="bg-card border border-border rounded-lg p-4 sticky top-24">
                  <h3 className="font-semibold mb-4">Payment Summary</h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Payment Method:</span>
                      <span className="font-medium capitalize">{paymentMethod?.replace('-', ' ') || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Amount:</span>
                      <span className="font-bold text-secondary">${amount?.toFixed(2) || '0.00'}</span>
                    </div>
                    {reference && (
                      <div className="flex justify-between">
                        <span className="text-foreground/60">Reference:</span>
                        <span className="font-mono text-xs">{reference}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border pt-4">
                    <button
                      onClick={handleSubmitBooking}
                      disabled={submitting}
                      className="w-full py-3 bg-secondary text-primary font-semibold rounded-lg hover:bg-secondary/90 transition disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Booking'}
                    </button>
                  </div>

                  <p className="text-xs text-foreground/60 text-center mt-4">
                    By submitting, you agree to our Terms of Service
                  </p>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-foreground/60 border-t border-border pt-6">
              <Lock className="w-4 h-4" />
              <span>All transactions are secure and encrypted. We never store your payment details.</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}