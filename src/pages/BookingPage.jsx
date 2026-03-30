import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCelebrityById } from '@/lib/celebrityService'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { Calendar, Clock, MessageCircle, CreditCard, Mail, User, Phone, Star } from 'lucide-react'
import PaymentMethodSelector from '../components/PaymentMethodSelector'
import MainLayout from '../components/MainLayout'

export default function BookingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [celebrity, setCelebrity] = useState(null)
  const [loadingCelebrity, setLoadingCelebrity] = useState(true)
  const [userProfile, setUserProfile] = useState(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('paypal')
  const [step, setStep] = useState(1)
  const [bookingDetails, setBookingDetails] = useState({
    // Guest info
    name: '',
    email: '',
    phone: '',

    // Booking details
    serviceType: 'video-call',
    date: '',
    time: '',
    duration: 30,
    message: '',
    occasion: 'birthday',

    // Payment
    paymentMethod: 'bank-transfer',
    paymentConfirmed: false
  })

  const [loading, setLoading] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingId, setBookingId] = useState(null)

  // Fetch celebrity from Supabase
  useEffect(() => {
    fetchCelebrity()
  }, [id])

  // Fetch user profile if logged in
  useEffect(() => {
    if (user) {
      fetchUserProfile()
    }
  }, [user])

  // Auto-fill user data when profile is loaded
  useEffect(() => {
    if (userProfile) {
      setBookingDetails(prev => ({
        ...prev,
        name: userProfile.full_name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || ''
      }))
      
      // Skip to step 2 for logged-in users
      setStep(2)
    }
  }, [userProfile])

  const fetchCelebrity = async () => {
    setLoadingCelebrity(true)
    try {
      const celebId = parseInt(id)
      const data = await getCelebrityById(celebId)
      setCelebrity(data)
    } catch (error) {
      console.error('Error fetching celebrity:', error)
    } finally {
      setLoadingCelebrity(false)
    }
  }

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setUserProfile(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  if (loadingCelebrity) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </div>
      </MainLayout>
    )
  }

  if (!celebrity) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-foreground/60">Celebrity not found</p>
        </div>
      </MainLayout>
    )
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setBookingDetails(prev => ({ ...prev, [name]: value }))
  }

  const handlePaymentContinue = (paymentData) => {
    // Save COMPLETE booking details to localStorage
    const completeBookingData = {
      // Celebrity info
      celebrity: {
        id: celebrity.id,
        name: celebrity.name,
        category: celebrity.category,
        image: celebrity.image,
        pricePerMinute: celebrity.price_per_minute,
        shoutoutPrice: celebrity.shoutout_price
      },
      // User info
      name: bookingDetails.name,
      email: bookingDetails.email,
      phone: bookingDetails.phone || '',
      // Booking details
      serviceType: bookingDetails.serviceType,
      date: bookingDetails.date,
      time: bookingDetails.time || '',
      duration: bookingDetails.duration,
      message: bookingDetails.message,
      occasion: bookingDetails.occasion,
      // Calculated amount
      amount: paymentData.amount
    }
    
    console.log('Saving to localStorage:', completeBookingData)
    localStorage.setItem('pendingBooking', JSON.stringify(completeBookingData))
    
    // Build query params for payment processing page
    const params = new URLSearchParams({
      method: paymentData.method,
      amount: paymentData.amount.toString()
    })
    
    if (paymentData.reference) {
      params.append('reference', paymentData.reference)
    }
    
    if (paymentData.crypto) {
      params.append('crypto', paymentData.crypto)
      params.append('estimatedCrypto', paymentData.estimatedCrypto)
    }
    
    navigate(`/payment-processing?${params.toString()}`)
  }

  const handleSubmitBooking = async () => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Generate a unique booking ID
      const newBookingId = `#SC-${Math.floor(100000 + Math.random() * 900000)}`
      setBookingId(newBookingId)

      // Save booking to localStorage (temporary)
      const bookings = JSON.parse(localStorage.getItem('guest_bookings') || '[]')
      bookings.push({
        id: newBookingId,
        ...bookingDetails,
        celebrityId: celebrity.id,
        celebrityName: celebrity.name,
        status: 'pending',
        createdAt: new Date().toISOString()
      })
      localStorage.setItem('guest_bookings', JSON.stringify(bookings))

      setBookingComplete(true)
      setLoading(false)
    }, 2000)
  }

  // Calculate total amount based on service type
  const calculateTotal = () => {
    if (bookingDetails.serviceType === 'video-call') {
      return celebrity.price_per_minute * (bookingDetails.duration || 30)
    } else {
      return celebrity.shoutout_price
    }
  }

  if (bookingComplete) {
    return (
      <MainLayout>
        <main className="min-h-screen bg-background py-12">
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h1 className="text-3xl font-bold text-foreground mb-4">Booking Received!</h1>
              <p className="text-lg text-foreground/70 mb-6">
                Your booking request has been submitted. We'll notify {celebrity.name} and get back to you within 24 hours.
              </p>

              <div className="bg-muted/30 rounded-lg p-6 mb-8 text-left">
                <h2 className="font-semibold mb-4">Booking Details</h2>
                <p className="text-sm mb-2"><span className="text-foreground/60">Booking ID:</span> {bookingId}</p>
                <p className="text-sm mb-2"><span className="text-foreground/60">Celebrity:</span> {celebrity.name}</p>
                <p className="text-sm mb-2"><span className="text-foreground/60">Email:</span> {bookingDetails.email}</p>
                <p className="text-sm"><span className="text-foreground/60">Status:</span> <span className="text-yellow-600">Pending Payment Verification</span></p>
              </div>

              {!user && (
                <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-6 mb-8">
                  <h3 className="font-semibold text-lg mb-3">✨ Claim Your Account</h3>
                  <p className="text-foreground/70 mb-4">
                    We've sent a magic link to <strong>{bookingDetails.email}</strong>. Click it to create your account and:
                  </p>
                  <ul className="text-left space-y-2 mb-6">
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
              )}

              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition"
              >
                Return to Home
              </button>
            </div>
          </div>
        </main>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= i ? 'bg-secondary text-primary' : 'bg-muted text-foreground/40'
                  }`}>
                    {i}
                  </div>
                  {i < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      step > i ? 'bg-secondary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className={step >= 1 ? 'text-secondary' : 'text-foreground/40'}>
                {user ? 'Welcome Back' : 'Details'}
              </span>
              <span className={step >= 2 ? 'text-secondary' : 'text-foreground/40'}>Message</span>
              <span className={step >= 3 ? 'text-secondary' : 'text-foreground/40'}>Payment</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="md:col-span-2">
              <div className="bg-card border border-border rounded-xl p-6">
                {/* Step 1 - User Info (only for guests) */}
                {step === 1 && !user && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Your Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40 w-5 h-5" />
                          <input
                            type="text"
                            name="name"
                            value={bookingDetails.name}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="John Doe"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Email Address *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40 w-5 h-5" />
                          <input
                            type="email"
                            name="email"
                            value={bookingDetails.email}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Phone Number (Optional)</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40 w-5 h-5" />
                          <input
                            type="tel"
                            name="phone"
                            value={bookingDetails.phone}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="+1 234 567 8900"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1 for logged-in users - Show welcome message */}
                {step === 1 && user && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Welcome Back!</h2>
                    <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-6 mb-4">
                      <p className="text-foreground/70 mb-2">
                        You're booking with <span className="font-semibold">{celebrity.name}</span>
                      </p>
                      <p className="text-sm text-foreground/60">
                        We'll use the information from your account:
                      </p>
                      <div className="mt-3 space-y-1 text-sm">
                        <p><span className="text-foreground/60">Name:</span> {userProfile?.full_name}</p>
                        <p><span className="text-foreground/60">Email:</span> {userProfile?.email}</p>
                        {userProfile?.phone && <p><span className="text-foreground/60">Phone:</span> {userProfile.phone}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2 - Message Details */}
                {step === 2 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Your Message</h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Service Type</label>
                        <select
                          name="serviceType"
                          value={bookingDetails.serviceType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                        >
                          <option value="video-call">Video Call (${celebrity.price_per_minute}/min)</option>
                          <option value="shoutout">Shoutout (${celebrity.shoutout_price})</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Date</label>
                          <input
                            type="date"
                            name="date"
                            value={bookingDetails.date}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Time</label>
                          <input
                            type="time"
                            name="time"
                            value={bookingDetails.time}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                          />
                        </div>
                      </div>

                      {bookingDetails.serviceType === 'video-call' && (
                        <div>
                          <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                          <select
                            name="duration"
                            value={bookingDetails.duration}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                          >
                            <option value={5}>5 minutes (${celebrity.price_per_minute * 5})</option>
                            <option value={10}>10 minutes (${celebrity.price_per_minute * 10})</option>
                            <option value={15}>15 minutes (${celebrity.price_per_minute * 15})</option>
                            <option value={30}>30 minutes (${celebrity.price_per_minute * 30})</option>
                          </select>
                          <p className="text-xs text-foreground/60 mt-1">Most calls are 5-15 minutes</p>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium mb-2">Occasion</label>
                        <select
                          name="occasion"
                          value={bookingDetails.occasion}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                        >
                          <option value="birthday">Birthday</option>
                          <option value="anniversary">Anniversary</option>
                          <option value="wedding">Wedding</option>
                          <option value="graduation">Graduation</option>
                          <option value="just-because">Just Because</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Your Message to {celebrity.name}</label>
                        <textarea
                          name="message"
                          value={bookingDetails.message}
                          onChange={handleInputChange}
                          rows="4"
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                          placeholder="Tell the celebrity what you'd like them to say or do..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3 - Payment */}
                {step === 3 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                    <PaymentMethodSelector 
                      selectedMethod={selectedPaymentMethod}
                      onSelect={setSelectedPaymentMethod}
                      totalAmount={calculateTotal()}
                      onContinue={handlePaymentContinue}
                      celebrity={celebrity}
                      bookingDetails={bookingDetails}
                    />
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  {step > 1 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition"
                    >
                      Back
                    </button>
                  )}
                  {step < 3 ? (
                    <button
                      onClick={() => setStep(step + 1)}
                      className="ml-auto px-6 py-2 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition"
                      disabled={step === 1 && !user && (!bookingDetails.name || !bookingDetails.email)}
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitBooking}
                      disabled={loading}
                      className="ml-auto px-6 py-2 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Submit Booking'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                <h3 className="font-bold text-lg mb-4">Booking Summary</h3>

                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={celebrity.image}
                    alt={celebrity.name}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(celebrity.name)}&size=48&background=7C3AED&color=fff`;
                    }}
                  />
                  <div>
                    <p className="font-semibold">{celebrity.name}</p>
                    <p className="text-sm text-foreground/60">{celebrity.category}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm mb-4">
                  {/* Service */}
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Service:</span>
                    <span className="font-medium">
                      {bookingDetails.serviceType === 'video-call' ? 'Video Call' : 'Shoutout'}
                    </span>
                  </div>

                  {/* Duration (for video calls) */}
                  {bookingDetails.serviceType === 'video-call' && (
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Duration:</span>
                      <span className="font-medium">{bookingDetails.duration} minutes</span>
                    </div>
                  )}

                  {/* Date */}
                  {bookingDetails.date && (
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Date:</span>
                      <span className="font-medium">{bookingDetails.date}</span>
                    </div>
                  )}

                  {/* Time */}
                  {bookingDetails.time && (
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Time:</span>
                      <span className="font-medium">{bookingDetails.time}</span>
                    </div>
                  )}

                  {/* Occasion */}
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Occasion:</span>
                    <span className="font-medium capitalize">{bookingDetails.occasion}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span className="text-secondary">
                      ${calculateTotal()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  )
}