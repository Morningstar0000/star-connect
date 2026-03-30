import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Clock, CheckCircle, Upload, ArrowLeft, Lock, FileText, Image } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { getPaymentMethodByMethodId } from '@/lib/paymentService'

export default function PaymentProcessingPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const method = searchParams.get('method')
  const amount = searchParams.get('amount')
  const reference = searchParams.get('reference')
  const crypto = searchParams.get('crypto')
  
  // Get booking details from localStorage
  const [bookingData, setBookingData] = useState({})
  const [saving, setSaving] = useState(false)
  const [methodDetails, setMethodDetails] = useState(null)
  const [loadingMethod, setLoadingMethod] = useState(true)
  
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [paymentSubmitted, setPaymentSubmitted] = useState(false)
  
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('pendingBooking') || '{}')
    console.log('Loaded from localStorage:', data)
    setBookingData(data)
  }, [])
  
  useEffect(() => {
    const fetchMethodDetails = async () => {
      if (!method) return
      
      try {
        const paymentMethod = await getPaymentMethodByMethodId(method)
        
        if (paymentMethod) {
          if (paymentMethod.method_type === 'crypto') {
            setMethodDetails({
              name: paymentMethod.display_name,
              icon: paymentMethod.icon === 'Bitcoin' ? '₿' : paymentMethod.icon,
              wallet_address: paymentMethod.wallet_address,
              network: paymentMethod.network,
              estimated_price: paymentMethod.estimated_price,
              instructions: paymentMethod.instructions
            })
          } else {
            setMethodDetails({
              name: paymentMethod.display_name,
              icon: paymentMethod.icon === 'Wallet' ? '💳' : 
                    paymentMethod.icon === 'Landmark' ? '🏦' :
                    paymentMethod.icon === 'Smartphone' ? '📱' : '💳',
              email: paymentMethod.email,
              cashtag: paymentMethod.cashtag,
              username: paymentMethod.username,
              bank_name: paymentMethod.bank_name,
              account_name: paymentMethod.account_name,
              account_number: paymentMethod.account_number,
              routing_number: paymentMethod.routing_number,
              swift_code: paymentMethod.swift_code,
              instructions: paymentMethod.instructions
            })
          }
        } else {
          const details = getFallbackMethodDetails(method)
          setMethodDetails(details)
        }
      } catch (error) {
        console.error('Error fetching method details:', error)
        const details = getFallbackMethodDetails(method)
        setMethodDetails(details)
      } finally {
        setLoadingMethod(false)
      }
    }
    
    fetchMethodDetails()
  }, [method])

  const getFallbackMethodDetails = (methodId) => {
    switch(methodId) {
      case 'paypal':
        return {
          name: 'PayPal',
          icon: '💸',
          email: 'payments@starconnect.com'
        }
      case 'wire':
        return {
          name: 'Wire Transfer',
          icon: '🏦',
          bank_name: 'Chase Bank',
          account_name: 'StarConnect Media',
          account_number: '1234567890',
          routing_number: '021000021',
          swift_code: 'CHASUS33'
        }
      case 'cashapp':
        return {
          name: 'Cash App',
          icon: '💵',
          cashtag: '$StarConnectPay'
        }
      case 'venmo':
        return {
          name: 'Venmo',
          icon: '💳',
          username: '@StarConnect-Official'
        }
      case 'applepay':
        return {
          name: 'Apple Pay',
          icon: '📱'
        }
      case 'card':
        return {
          name: 'Credit/Debit Card',
          icon: '💳'
        }
      case 'btc':
        return {
          name: 'Bitcoin (BTC)',
          icon: '₿',
          wallet_address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
          network: 'Bitcoin',
          estimated_price: 65000
        }
      case 'eth':
        return {
          name: 'Ethereum (ETH)',
          icon: 'Ξ',
          wallet_address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
          network: 'Ethereum',
          estimated_price: 3500
        }
      case 'usdt':
        return {
          name: 'Tether (USDT)',
          icon: '₮',
          wallet_address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
          network: 'ERC-20',
          estimated_price: 1
        }
      default:
        return {
          name: methodId,
          icon: '💳'
        }
    }
  }
  
  const { 
    celebrity, 
    name, 
    email, 
    phone,
    serviceType, 
    date, 
    time,
    duration, 
    message,
    occasion
  } = bookingData

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload an image file (JPEG, PNG, GIF) or PDF')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
      
      setSelectedFile(file)
    }
  }

  const uploadFileToStorage = async (file) => {
    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `payment-proofs/${fileName}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('payment-proofs')
        .upload(filePath, file)

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }

  const handleConfirmPayment = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Upload file to Supabase Storage
      const fileUrl = await uploadFileToStorage(selectedFile)
      
      clearInterval(interval)
      setUploadProgress(100)

      // Store the file URL in booking data for later
      const updatedBookingData = {
        ...bookingData,
        paymentProof: fileUrl,
        proofUploadedAt: new Date().toISOString()
      }
      
      localStorage.setItem('pendingBooking', JSON.stringify(updatedBookingData))
      setBookingData(updatedBookingData)
      
      setTimeout(() => {
        setUploading(false)
        setPaymentSubmitted(true)
      }, 500)
      
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Failed to upload file. Please try again.')
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const generateBookingId = () => {
    return `#SC-${Math.floor(100000 + Math.random() * 900000)}`
  }

  const handleSubmitBooking = async () => {
    setSaving(true)
    
    try {
      const bookingId = generateBookingId()
      
      console.log('Generated booking ID:', bookingId)
      
      // Save booking to Supabase with payment proof URL
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert([{
          id: bookingId,
          guest_email: email,
          guest_name: name,
          guest_phone: phone || null,
          celebrity_id: celebrity?.id,
          celebrity_name: celebrity?.name,
          service_type: serviceType,
          booking_date: date || null,
          booking_time: time || null,
          duration: serviceType === 'video-call' ? duration : null,
          message: message || null,
          occasion: occasion || null,
          amount: parseFloat(amount),
          payment_method: method,
          payment_reference: reference || null,
          payment_proof: bookingData.paymentProof || null,
          proof_uploaded_at: bookingData.proofUploadedAt || null,
          status: 'pending',
          created_at: new Date().toISOString()
        }])
        .select()
        .single()
      
      if (error) throw error
      
      console.log('Booking saved to Supabase:', booking)
      
      localStorage.removeItem('pendingBooking')
      
      navigate('/booking-received', {
        state: {
          bookingId,
          celebrityName: celebrity?.name,
          celebrityCategory: celebrity?.category,
          name: name,
          email: email,
          serviceType: serviceType,
          date: date,
          time: time,
          duration: duration,
          occasion: occasion,
          message: message,
          amount: parseFloat(amount),
          paymentMethod: method,
          paymentProof: bookingData.paymentProof
        }
      })
    } catch (error) {
      console.error('Error saving booking:', error)
      alert('There was an error saving your booking. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (paymentSubmitted) {
    return (
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2 text-center">Payment Pending</h1>
            <p className="text-lg text-foreground/70 mb-6 text-center">
              Thank you! Your payment proof has been submitted and is awaiting verification.
            </p>
            
            {/* Show uploaded proof */}
            {bookingData.paymentProof && (
              <div className="bg-muted/30 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Uploaded Proof:
                </p>
                <a 
                  href={bookingData.paymentProof} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-secondary hover:underline text-sm break-all"
                >
                  {bookingData.paymentProof.split('/').pop()}
                </a>
              </div>
            )}
            
            {/* Booking Summary */}
            <div className="bg-muted/30 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4">Booking Summary</h3>
              
              {celebrity && (
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                  <img
                    src={celebrity.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(celebrity.name || 'C')}&size=48&background=7C3AED&color=fff`}
                    alt={celebrity.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{celebrity.name}</p>
                    <p className="text-sm text-foreground/60">{celebrity.category}</p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-foreground/60">Your Name</p>
                  <p className="font-medium">{name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-foreground/60">Email</p>
                  <p className="font-medium">{email || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-foreground/60">Service</p>
                  <p className="font-medium">{serviceType === 'video-call' ? 'Video Call' : 'Shoutout'}</p>
                </div>
                <div>
                  <p className="text-xs text-foreground/60">Date</p>
                  <p className="font-medium">{date || 'To be scheduled'}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                <span className="font-semibold">Total Amount:</span>
                <span className="text-2xl font-bold text-secondary">${parseFloat(amount).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleSubmitBooking}
              disabled={saving}
              className="w-full py-4 bg-secondary text-primary font-semibold rounded-lg hover:bg-secondary/90 transition text-lg disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Submit Booking'}
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (loadingMethod) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
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
          Back to Payment Methods
        </button>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-secondary/10 to-primary/10 p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{methodDetails?.icon}</span>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Pay with {methodDetails?.name}
                </h1>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Timer Alert */}
            <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <h3 className="font-semibold text-yellow-800">Payment Pending</h3>
                <p className="text-sm text-yellow-700">
                  Please complete your payment within 30 minutes. Your booking will be held for you.
                </p>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-muted/30 rounded-lg p-6 mb-6">
              <div className="mb-4">
                <p className="text-sm text-foreground/60 mb-1">Amount to Pay:</p>
                <p className="text-3xl font-bold text-secondary">${parseFloat(amount).toFixed(2)} USD</p>
              </div>

              {/* Crypto Details */}
              {methodDetails?.wallet_address && (
                <div className="space-y-3 border-t border-border pt-4">
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Wallet Address:</p>
                    <p className="text-xs font-mono bg-background p-2 rounded border border-border break-all">
                      {methodDetails.wallet_address}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Network:</p>
                    <p className="font-medium bg-background p-2 rounded border border-border">
                      {methodDetails.network}
                    </p>
                  </div>
                  {methodDetails.estimated_price && (
                    <p className="text-sm text-foreground/60">
                      Estimated rate: 1 {methodDetails.name} = ${methodDetails.estimated_price}
                    </p>
                  )}
                </div>
              )}

              {/* Wire Transfer Details */}
              {methodDetails?.bank_name && (
                <div className="space-y-3 border-t border-border pt-4">
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Bank Name:</p>
                    <p className="font-medium bg-background p-2 rounded border border-border">{methodDetails.bank_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Account Name:</p>
                    <p className="font-medium bg-background p-2 rounded border border-border">{methodDetails.account_name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-foreground/60 mb-1">Account Number:</p>
                      <p className="font-mono bg-background p-2 rounded border border-border">{methodDetails.account_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60 mb-1">Routing Number:</p>
                      <p className="font-mono bg-background p-2 rounded border border-border">{methodDetails.routing_number}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">SWIFT Code:</p>
                    <p className="font-mono bg-background p-2 rounded border border-border">{methodDetails.swift_code}</p>
                  </div>
                </div>
              )}

              {/* PayPal Details */}
              {methodDetails?.email && (
                <div className="space-y-3 border-t border-border pt-4">
                  <p className="text-sm text-foreground/60 mb-1">PayPal Email:</p>
                  <p className="font-mono bg-background p-2 rounded border border-border">{methodDetails.email}</p>
                </div>
              )}

              {/* Cash App Details */}
              {methodDetails?.cashtag && (
                <div className="space-y-3 border-t border-border pt-4">
                  <p className="text-sm text-foreground/60 mb-1">Cash App $Cashtag:</p>
                  <p className="font-mono bg-background p-2 rounded border border-border">{methodDetails.cashtag}</p>
                </div>
              )}

              {/* Venmo Details */}
              {methodDetails?.username && (
                <div className="space-y-3 border-t border-border pt-4">
                  <p className="text-sm text-foreground/60 mb-1">Venmo Username:</p>
                  <p className="font-mono bg-background p-2 rounded border border-border">{methodDetails.username}</p>
                </div>
              )}

              {/* Instructions */}
              {methodDetails?.instructions && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-sm text-foreground/60 mb-1">Instructions:</p>
                  <p className="text-sm bg-background p-2 rounded border border-border">{methodDetails.instructions}</p>
                </div>
              )}
            </div>

            {/* Upload Proof */}
            <div className="border-2 border-dashed border-border rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4">Upload Payment Proof</h3>
              <p className="text-sm text-foreground/60 mb-4">
                Upload a screenshot or receipt of your payment (JPEG, PNG, GIF, or PDF, max 5MB)
              </p>
              
              <div className="space-y-4">
                <label className="flex-1">
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept="image/*,.pdf"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploading}
                    />
                    <div className="w-full p-4 bg-muted border border-border rounded-lg text-center hover:bg-muted/80 transition">
                      <Upload className="w-6 h-6 mx-auto mb-2 text-foreground/60" />
                      <span className="text-sm font-medium">
                        {selectedFile ? selectedFile.name : 'Choose File'}
                      </span>
                      {selectedFile && (
                        <p className="text-xs text-foreground/40 mt-1">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      )}
                    </div>
                  </div>
                </label>

                {/* Upload Progress */}
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-secondary transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* File Preview (for images) */}
                {selectedFile && selectedFile.type.startsWith('image/') && !uploading && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Preview:</p>
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="max-h-48 rounded-lg border border-border"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirmPayment}
              disabled={!selectedFile || uploading}
              className="w-full py-4 bg-secondary text-primary font-semibold rounded-lg hover:bg-secondary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'I Have Made the Payment'}
            </button>

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