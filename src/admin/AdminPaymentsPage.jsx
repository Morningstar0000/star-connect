import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react'
import { 
  getAllPaymentMethods, 
  updatePaymentMethod, 
  togglePaymentMethodStatus,
  deletePaymentMethod,
} from '@/lib/paymentService'
import PaymentMethodForm from './PaymentMethodForm'

export default function AdminPaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingMethod, setEditingMethod] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    loadPaymentMethods()
  }, [])

  const loadPaymentMethods = async () => {
    try {
      const data = await getAllPaymentMethods()
      setPaymentMethods(data || [])
    } catch (error) {
      console.error('Error loading payment methods:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await togglePaymentMethodStatus(id, !currentStatus)
      await loadPaymentMethods()
    } catch (error) {
      console.error('Error toggling status:', error)
      alert('Failed to update payment method status')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return
    
    try {
      await deletePaymentMethod(id)
      await loadPaymentMethods()
    } catch (error) {
      console.error('Error deleting payment method:', error)
      alert('Failed to delete payment method')
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingMethod(null)
    loadPaymentMethods()
  }

  // Pagination
  const totalPages = Math.ceil(paymentMethods.length / itemsPerPage)
  const paginatedMethods = paymentMethods.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

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
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            to="/admin"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
            <p className="text-gray-600 mt-1">Manage payment options for customers</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setEditingMethod(null)
              setShowForm(true)
            }}
            className="px-4 py-2 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Payment Method
          </button>
        </div>
      </div>

      {/* Payment Methods Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Method</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Description</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Sort Order</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMethods.map((method) => {
              // Get the appropriate icon based on method_type
              const getIcon = () => {
                if (method.icon === 'CreditCard') return '💳'
                if (method.icon === 'Wallet') return '💸'
                if (method.icon === 'Bitcoin') return '₿'
                if (method.icon === 'Landmark') return '🏦'
                if (method.icon === 'Smartphone') return '📱'
                return method.icon || '💳'
              }

              return (
                <tr key={method.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getIcon()}</span>
                      <div>
                        <p className="font-medium">{method.display_name}</p>
                        <p className="text-xs text-gray-500">{method.method_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{method.description}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleStatus(method.id, method.is_active)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition ${
                        method.is_active 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {method.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {method.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="p-4">
                    <input
                      type="number"
                      value={method.sort_order}
                      onChange={async (e) => {
                        try {
                          await updatePaymentMethod(method.id, { sort_order: parseInt(e.target.value) })
                          await loadPaymentMethods()
                        } catch (error) {
                          console.error('Error updating sort order:', error)
                        }
                      }}
                      className="w-20 px-2 py-1 border border-gray-200 rounded-lg text-sm"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingMethod(method)
                          setShowForm(true)
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(method.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, paymentMethods.length)} of {paymentMethods.length} methods
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

      {/* Payment Method Form Modal */}
      {showForm && (
        <PaymentMethodForm
          method={editingMethod}
          onClose={() => {
            setShowForm(false)
            setEditingMethod(null)
          }}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  )
}