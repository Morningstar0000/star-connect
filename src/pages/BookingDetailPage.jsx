import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import MainLayout from '../components/MainLayout'
import {
    ArrowLeft,
    Star,
    Calendar,
    Clock,
    DollarSign,
    Mail,
    User,
    Phone,
    MessageCircle,
    CreditCard,
    CheckCircle,
    XCircle,
    AlertCircle,
    Image as ImageIcon
} from 'lucide-react'
import JoinCallButton from '../components/JoinCallButton'
import WatchVideoButton from '../components/WatchVideoButton'

export default function BookingDetailPage() {
    const { bookingId } = useParams()
    const navigate = useNavigate()
    const [booking, setBooking] = useState(null)
    const [celebrity, setCelebrity] = useState(null)
    const [call, setCall] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [imageError, setImageError] = useState(false)

    useEffect(() => {
        fetchBookingDetails()
    }, [bookingId])

    const fetchBookingDetails = async () => {
        try {
            const decodedId = decodeURIComponent(bookingId)
            console.log('Fetching booking with ID:', decodedId)

            const { data: bookingData, error: bookingError } = await supabase
                .from('bookings')
                .select('*')
                .eq('id', decodedId)
                .single()

            if (bookingError) throw bookingError

            console.log('Booking found:', bookingData)
            setBooking(bookingData)

            if (bookingData.call_id) {
                const { data: callData, error: callError } = await supabase
                    .from('calls')
                    .select('*')
                    .eq('id', bookingData.call_id)
                    .single()

                if (!callError && callData) {
                    console.log('Call found:', callData)
                    setCall(callData)
                }
            }

            if (bookingData.celebrity_id) {
                console.log('Fetching celebrity with ID:', bookingData.celebrity_id)

                const { data: celebrityData, error: celebrityError } = await supabase
                    .from('celebrities')
                    .select('*')
                    .eq('id', bookingData.celebrity_id)
                    .single()

                if (celebrityError) {
                    console.error('Error fetching celebrity:', celebrityError)
                } else {
                    console.log('Celebrity found:', celebrityData)
                    setCelebrity(celebrityData)
                }
            }

        } catch (error) {
            console.error('Error fetching booking:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm"><AlertCircle className="w-4 h-4" /> Pending</span>
            case 'confirmed':
                return <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"><CheckCircle className="w-4 h-4" /> Confirmed</span>
            case 'completed':
                return <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"><CheckCircle className="w-4 h-4" /> Completed</span>
            case 'cancelled':
                return <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"><XCircle className="w-4 h-4" /> Cancelled</span>
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
        if (!dateString) return 'Not scheduled'
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const formatTime = (timeString) => {
        if (!timeString) return 'Not scheduled'
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

    const handleImageError = () => {
        console.log('Image failed to load for celebrity:', celebrity?.name)
        setImageError(true)
    }

    if (loading) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
                </div>
            </MainLayout>
        )
    }

    if (error || !booking) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Booking Not Found</h2>
                        <p className="text-foreground/60 mb-6">The booking you're looking for doesn't exist or you don't have permission to view it.</p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-2 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            <main className="min-h-screen bg-background py-12">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Back button */}
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>

                    {/* Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">Booking Details</h1>
                            <div className="flex items-center gap-2">
                                <p className="text-foreground/60">Booking ID: {booking.id}</p>
                                {/* Service Type Badge */}
                                {getServiceTypeBadge(booking.service_type)}
                            </div>
                        </div>
                        {getStatusBadge(booking.status)}
                    </div>

                    {/* Main Content */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Left Column - Celebrity Info */}
                        <div className="md:col-span-1">
                            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                                <div className="text-center mb-4">
                                    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-secondary/10">
                                        {celebrity?.image && !imageError ? (
                                            <img
                                                src={celebrity.image}
                                                alt={celebrity.name || booking.celebrity_name}
                                                className="w-full h-full object-cover"
                                                onError={handleImageError}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-primary">
                                                <span className="text-4xl font-bold text-white">
                                                    {(celebrity?.name || booking.celebrity_name)?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <h2 className="text-xl font-bold text-foreground">{celebrity?.name || booking.celebrity_name}</h2>
                                    <p className="text-foreground/60">{celebrity?.category || 'Celebrity'}</p>

                                    {celebrity?.rating && (
                                        <div className="flex items-center justify-center gap-1 mt-2">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-medium">{celebrity.rating}</span>
                                            <span className="text-xs text-foreground/60">({celebrity.total_reviews} reviews)</span>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-border pt-4 mt-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-foreground/60">Service:</span>
                                            <span className="font-medium capitalize">{booking.service_type}</span>
                                        </div>
                                        {booking.duration && booking.service_type?.toLowerCase() === 'videocall' && (
                                            <div className="flex justify-between">
                                                <span className="text-foreground/60">Duration:</span>
                                                <span className="font-medium">{booking.duration} minutes</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-foreground/60">Amount:</span>
                                            <span className="font-bold text-secondary">${booking.amount}</span>
                                        </div>

                                        {celebrity && (
                                            <>
                                                <div className="border-t border-border my-2 pt-2"></div>
                                                {booking.service_type?.toLowerCase() === 'videocall' && (
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-foreground/60">Price/min:</span>
                                                        <span className="font-medium">${celebrity.price_per_minute}</span>
                                                    </div>
                                                )}
                                                {booking.service_type?.toLowerCase() === 'shoutout' && (
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-foreground/60">Shoutout Price:</span>
                                                        <span className="font-medium">${celebrity.shoutout_price}</span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>


                                {booking && (
                                    <div className="border-t border-border pt-4 mt-4">
                                        {booking.service_type?.toLowerCase() === 'videocall' ? (
                                            <JoinCallButton booking={booking} call={call} />
                                        ) : booking.service_type?.toLowerCase() === 'shoutout' && booking.status === 'confirmed' ? (
                                            <WatchVideoButton booking={booking} />
                                        ) : null}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Booking Details */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Guest Information */}
                            <div className="bg-card border border-border rounded-xl p-6">
                                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5 text-secondary" />
                                    Guest Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-foreground/60 mb-1">Name</p>
                                        <p className="font-medium">{booking.guest_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-foreground/60 mb-1">Email</p>
                                        <p className="font-medium flex items-center gap-1">
                                            <Mail className="w-3 h-3" />
                                            {booking.guest_email}
                                        </p>
                                    </div>
                                    {booking.guest_phone && (
                                        <div>
                                            <p className="text-xs text-foreground/60 mb-1">Phone</p>
                                            <p className="font-medium flex items-center gap-1">
                                                <Phone className="w-3 h-3" />
                                                {booking.guest_phone}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Booking Schedule */}
                            <div className="bg-card border border-border rounded-xl p-6">
                                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-secondary" />
                                    Schedule
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-foreground/60 mb-1">Date</p>
                                        <p className="font-medium">{formatDate(booking.booking_date)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-foreground/60 mb-1">Time</p>
                                        <p className="font-medium">{formatTime(booking.booking_time)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-foreground/60 mb-1">Occasion</p>
                                        <p className="font-medium capitalize">{booking.occasion || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-foreground/60 mb-1">Created</p>
                                        <p className="font-medium">{new Date(booking.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Message */}
                            {booking.message && (
                                <div className="bg-card border border-border rounded-xl p-6">
                                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                        <MessageCircle className="w-5 h-5 text-secondary" />
                                        Message
                                    </h3>
                                    <p className="text-foreground/70 italic bg-muted/30 p-4 rounded-lg">
                                        "{booking.message}"
                                    </p>
                                </div>
                            )}

                            {/* Payment Information */}
                            <div className="bg-card border border-border rounded-xl p-6">
                                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-secondary" />
                                    Payment Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-foreground/60 mb-1">Payment Method</p>
                                        <p className="font-medium capitalize">{booking.payment_method}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-foreground/60 mb-1">Amount</p>
                                        <p className="font-bold text-secondary">${booking.amount}</p>
                                    </div>
                                    {booking.payment_reference && (
                                        <div className="col-span-2">
                                            <p className="text-xs text-foreground/60 mb-1">Reference</p>
                                            <p className="font-mono text-sm bg-muted p-2 rounded">{booking.payment_reference}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => navigate('/browse')}
                                    className="flex-1 px-6 py-3 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition font-medium"
                                >
                                    Book Another Celebrity
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </MainLayout>
    )
}