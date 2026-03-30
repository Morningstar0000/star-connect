import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { createCallRoom, createCallForExistingBooking } from '@/lib/callService'
import {
  Calendar,
  DollarSign,
  User,
  Star,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Mail,
  Phone,
  Tag,
  MessageCircle,
  CreditCard,
  Globe,
  Wallet,
  X,
  ImagesIcon,
  Video,
  ExternalLink
} from 'lucide-react'
import { Image as ImageIcon } from 'lucide-react'
import ShoutoutVideoUpload from './ShoutoutVideoUpload'

export default function AdminBookingsPage() {
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const [bookings, setBookings] = useState([])
  const [calls, setCalls] = useState({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [creatingCall, setCreatingCall] = useState(false)
  const itemsPerPage = 10

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookings(data || [])

      // Fetch calls for bookings that have call_id
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
    } catch (error) {
      console.error('Error loading bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      // If confirming a booking, create a call room
      if (newStatus === 'confirmed') {
        const booking = bookings.find(b => b.id === bookingId)

        // Check if call already exists
        if (booking?.call_id) {
          alert('This booking already has a video call room created.')
          return
        }

        setCreatingCall(true)

        try {
          // Create video call room
          await createCallRoom(booking)

          // Update booking status
          const { error } = await supabase
            .from('bookings')
            .update({ status: newStatus })
            .eq('id', bookingId)

          if (error) throw error

          alert('Booking confirmed and video call room created successfully!')
        } catch (error) {
          console.error('Error creating call room:', error)
          alert(`Failed to create video call room: ${error.message || 'Please try again.'}`)
          return
        } finally {
          setCreatingCall(false)
        }
      } else {
        // Just update status without creating call
        const { error } = await supabase
          .from('bookings')
          .update({ status: newStatus })
          .eq('id', bookingId)

        if (error) throw error
      }

      await loadBookings()
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: newStatus })
      }
    } catch (error) {
      console.error('Error updating booking status:', error)
      alert('Failed to update booking status')
    }
  }

  const manuallyCreateCallRoom = async (booking) => {
    if (!window.confirm(`Create video call room for booking ${booking.id}?`)) return;

    try {
      const result = await createCallForExistingBooking(booking.id);

      if (result.success) {
        alert('Video call room created successfully!');
        await loadBookings(); // Refresh the list
        if (selectedBooking?.id === booking.id) {
          // Refresh modal data
          const updatedBooking = { ...selectedBooking, call_id: result.call.id };
          setSelectedBooking(updatedBooking);
        }
      } else {
        alert(`Failed to create call room: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error manually creating call room:', error);
      alert('Failed to create video call room. Check console for details.');
    }
  };

  // NEW FUNCTION: Join call as celebrity
  const joinCallAsCelebrity = async (booking) => {
    if (!booking.call_id) {
      alert('This booking does not have a call room yet. Please confirm the booking first to create a call room.');
      return;
    }
    
    try {
      const { data: call, error } = await supabase
        .from('calls')
        .select('room_url, status')
        .eq('id', booking.call_id)
        .single();
      
      if (error) {
        console.error('Error fetching call:', error);
        alert('Failed to retrieve call room. Please try again.');
        return;
      }
      
      if (!call?.room_url) {
        alert('Call room URL not found. Please create a new call room.');
        return;
      }
      
      if (call.status !== 'active') {
        alert('This call room is no longer active.');
        return;
      }
      
      console.log('Celebrity joining call:', call.room_url);
      // Open the room in a new tab for the celebrity
      window.open(call.room_url, '_blank');
      
    } catch (error) {
      console.error('Error joining call:', error);
      alert('Failed to join the call. Please try again.');
    }
  };

  const viewBookingDetails = (booking) => {
    setSelectedBooking(booking)
    setShowModal(true)
  }

  // Filter bookings based on search and status
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.celebrity_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guest_email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs"><Clock className="w-3 h-3" /> Pending</span>
      case 'confirmed':
        return <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs"><CheckCircle className="w-3 h-3" /> Confirmed</span>
      case 'completed':
        return <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"><CheckCircle className="w-3 h-3" /> Completed</span>
      case 'cancelled':
        return <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs"><XCircle className="w-3 h-3" /> Cancelled</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">{status}</span>
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return 'Not specified'
    return timeString
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
        <p className="text-gray-600 mt-1">Manage and update booking statuses</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Bookings</p>
          <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{bookings.filter(b => b.status === 'pending').length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Confirmed</p>
          <p className="text-2xl font-bold text-green-600">{bookings.filter(b => b.status === 'confirmed').length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-blue-600">{bookings.filter(b => b.status === 'completed').length}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by guest name, email, celebrity, or booking ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Booking ID</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Guest</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Celebrity</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Date</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Amount</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Call Room</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBookings.length > 0 ? paginatedBookings.map(booking => (
              <tr key={booking.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                <td className="p-4">
                  <span className="font-mono text-sm">{booking.id}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{booking.guest_name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{booking.celebrity_name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      {booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : 'TBD'}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold">${booking.amount}</span>
                  </div>
                </td>
                <td className="p-4">
                  {getStatusBadge(booking.status)}
                </td>
                <td className="p-4">
                  {booking.call_id ? (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <Video className="w-3 h-3" />
                      Room Created
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Not Created</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {/* View Details Button */}
                    <button
                      onClick={() => viewBookingDetails(booking)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 text-blue-600" />
                    </button>
                    
                    {/* Join as Celebrity Button - Only for confirmed bookings with call room */}
                    {booking.status === 'confirmed' && booking.call_id && (
                      <button
                        onClick={() => joinCallAsCelebrity(booking)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title="Join Call as Celebrity"
                      >
                        <ExternalLink className="w-4 h-4 text-purple-600" />
                      </button>
                    )}
                    
                    {/* Create Call Room Button - For confirmed bookings without call */}
                    {booking.status === 'confirmed' && !booking.call_id && (
                      <button
                        onClick={() => manuallyCreateCallRoom(booking)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title="Create Video Call Room"
                      >
                        <Video className="w-4 h-4 text-green-600" />
                      </button>
                    )}
                    
                    {/* Status Dropdown */}
                    <select
                      value={booking.status}
                      onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                      disabled={creatingCall && booking.status === 'pending'}
                      className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 disabled:opacity-50"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirm</option>
                      <option value="completed">Complete</option>
                      <option value="cancelled">Cancel</option>
                    </select>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="8" className="p-8 text-center text-gray-500">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length} bookings
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 border border-gray-200 rounded-lg">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Booking Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Badge and Call Room Info */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  {getStatusBadge(selectedBooking.status)}
                </div>
                <div className="flex items-center gap-3">
                  {selectedBooking.call_id && (
                    <span className="flex items-center gap-1 text-xs bg-green-50 text-green-600 px-2 py-1 rounded">
                      <Video className="w-3 h-3" />
                      Call Room Ready
                    </span>
                  )}
                  <span className="text-sm text-gray-500">
                    Created: {new Date(selectedBooking.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Booking ID */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Booking ID</p>
                <p className="font-mono text-sm">{selectedBooking.id}</p>
              </div>

              {/* Guest Information */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Guest Information
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Name</p>
                    <p className="font-medium">{selectedBooking.guest_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="font-medium flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {selectedBooking.guest_email}
                    </p>
                  </div>
                  {selectedBooking.guest_phone && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Phone</p>
                      <p className="font-medium flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {selectedBooking.guest_phone}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Details */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Booking Details
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Celebrity</p>
                    <p className="font-medium flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {selectedBooking.celebrity_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Service Type</p>
                    <p className="font-medium capitalize">{selectedBooking.service_type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date</p>
                    <p className="font-medium">{formatDate(selectedBooking.booking_date)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Time</p>
                    <p className="font-medium">{formatTime(selectedBooking.booking_time)}</p>
                  </div>
                  {selectedBooking.duration && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Duration</p>
                      <p className="font-medium">{selectedBooking.duration} minutes</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Occasion</p>
                    <p className="font-medium capitalize">{selectedBooking.occasion || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Message */}
              {selectedBooking.message && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm italic">"{selectedBooking.message}"</p>
                  </div>
                </div>
              )}

              {/* Payment Information */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payment Information
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Amount</p>
                    <p className="font-bold text-secondary">${selectedBooking.amount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                    <p className="font-medium capitalize flex items-center gap-1">
                      {selectedBooking.payment_method === 'btc' && <Globe className="w-3 h-3" />}
                      {selectedBooking.payment_method === 'eth' && <Globe className="w-3 h-3" />}
                      {selectedBooking.payment_method === 'usdt' && <Wallet className="w-3 h-3" />}
                      {selectedBooking.payment_method === 'paypal' && <CreditCard className="w-3 h-3" />}
                      {selectedBooking.payment_method === 'wire' && <CreditCard className="w-3 h-3" />}
                      {selectedBooking.payment_method === 'cashapp' && <CreditCard className="w-3 h-3" />}
                      {selectedBooking.payment_method}
                    </p>
                  </div>
                  {selectedBooking.payment_reference && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500 mb-1">Reference</p>
                      <p className="font-mono text-sm">{selectedBooking.payment_reference}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Proof Section */}
              {selectedBooking.payment_proof ? (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <ImagesIcon className="w-4 h-4" />
                    Payment Proof
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="relative">
                        <img
                          src={selectedBooking.payment_proof}
                          alt="Payment Proof"
                          className="max-h-96 w-full object-contain rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available'
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          Uploaded: {selectedBooking.proof_uploaded_at
                            ? new Date(selectedBooking.proof_uploaded_at).toLocaleString()
                            : 'Date not available'}
                        </p>
                        <a
                          href={selectedBooking.payment_proof}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition text-sm"
                        >
                          <ImageIcon className="w-4 h-4" />
                          View Full Size
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Payment Proof
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-500">No payment proof uploaded yet</p>
                  </div>
                </div>
              )}

              {/* Account Status */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Account Status
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {selectedBooking.user_id ? (
                    <div className="space-y-2">
                      <p className="text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Account exists and is linked to this booking
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-2 pt-2 border-t border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">User ID</p>
                          <p className="font-mono text-xs">{selectedBooking.user_id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Status</p>
                          <p className="text-sm font-medium text-green-600">Active</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-yellow-600 flex items-center gap-1 mb-3">
                        <Clock className="w-4 h-4" />
                        No account linked to this booking yet
                      </p>

                      <button
                        onClick={async () => {
                          const { data: existingUser } = await supabase
                            .from('user_profiles')
                            .select('id, full_name, email')
                            .eq('email', selectedBooking.guest_email)
                            .maybeSingle()

                          if (existingUser) {
                            if (confirm(`User "${existingUser.full_name || existingUser.email}" already exists. Link this booking to their account?`)) {
                              try {
                                const { error } = await supabase
                                  .from('bookings')
                                  .update({ user_id: existingUser.id })
                                  .eq('id', selectedBooking.id)

                                if (error) throw error

                                alert('Booking linked successfully!')
                                setSelectedBooking({ ...selectedBooking, user_id: existingUser.id })
                                await loadBookings()
                              } catch (error) {
                                console.error('Error linking booking:', error)
                                alert('Failed to link booking')
                              }
                            }
                          } else {
                            alert('No existing user found. Please create an account from the Create User Accounts page.')
                          }
                        }}
                        className="w-full px-4 py-2 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition text-sm font-medium mb-2"
                      >
                        Check & Link Existing User
                      </button>

                      <p className="text-xs text-gray-500 mt-2">
                        Email: <span className="font-mono">{selectedBooking.guest_email}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Video Call Section */}
              {selectedBooking.status === 'confirmed' && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Video Call
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {selectedBooking.call_id ? (
                      <div className="space-y-3">
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Call room is ready
                        </p>
                        <button
                          onClick={() => joinCallAsCelebrity(selectedBooking)}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Join Call as Celebrity
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm text-yellow-600">
                          No call room created yet.
                        </p>
                        <button
                          onClick={() => manuallyCreateCallRoom(selectedBooking)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
                        >
                          <Video className="w-4 h-4" />
                          Create Video Call Room
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Shoutout Video Upload Section - Only for shoutout bookings */}
{selectedBooking.service_type?.toLowerCase() === 'shoutout' && selectedBooking.status === 'confirmed' && (
  <div className="border-t border-gray-200 pt-4">
    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
      <Video className="w-4 h-4" />
      Shoutout Video
    </h3>
    <div className="bg-gray-50 rounded-lg p-4">
      <ShoutoutVideoUpload 
        booking={selectedBooking}
        onVideoUploaded={(updatedBooking) => {
          setSelectedBooking(updatedBooking);
          loadBookings(); // Refresh the list
        }}
      />
    </div>
  </div>
)}

              {/* Update Status Section */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Update Status</h3>
                <div className="flex gap-2">
                  <select
                    value={selectedBooking.status}
                    onChange={(e) => {
                      updateBookingStatus(selectedBooking.id, e.target.value)
                      setSelectedBooking({ ...selectedBooking, status: e.target.value })
                    }}
                    disabled={creatingCall && selectedBooking.status === 'pending'}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 disabled:opacity-50"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {creatingCall && selectedBooking.status === 'pending' && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-secondary"></div>
                      Creating call room...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}