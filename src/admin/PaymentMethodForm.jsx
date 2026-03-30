import { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'
import { createPaymentMethod, updatePaymentMethod } from '@/lib/paymentService'

export default function PaymentMethodForm({ method, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    method_id: method?.method_id || '',
    method_type: method?.method_type || '',
    name: method?.name || '',
    display_name: method?.display_name || '',
    icon: method?.icon || 'Wallet',
    description: method?.description || '',
    
    // Bank/Wire fields
    bank_name: method?.bank_name || '',
    account_name: method?.account_name || '',
    account_number: method?.account_number || '',
    routing_number: method?.routing_number || '',
    swift_code: method?.swift_code || '',
    
    // Crypto fields
    wallet_address: method?.wallet_address || '',
    network: method?.network || '',
    estimated_price: method?.estimated_price || 1,
    
    // PayPal/Cash App fields
    email: method?.email || '',
    cashtag: method?.cashtag || '',
    username: method?.username || '',
    
    // Common fields
    instructions: method?.instructions || '',
    sort_order: method?.sort_order || 0,
    is_active: method?.is_active ?? true
  })
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const methodTypes = [
    { id: 'card', name: 'Credit/Debit Card', icon: 'CreditCard' },
    { id: 'paypal', name: 'PayPal', icon: 'Wallet' },
    { id: 'wire', name: 'Wire Transfer', icon: 'Landmark' },
    { id: 'cashapp', name: 'Cash App', icon: 'Wallet' },
    { id: 'venmo', name: 'Venmo', icon: 'Wallet' },
    { id: 'applepay', name: 'Apple Pay', icon: 'Smartphone' },
    { id: 'btc', name: 'Bitcoin (BTC)', icon: 'Bitcoin' },
    { id: 'eth', name: 'Ethereum (ETH)', icon: 'Bitcoin' },
    { id: 'usdt', name: 'Tether (USDT)', icon: 'Bitcoin' }
  ]

  const iconOptions = [
    { value: 'CreditCard', label: '💳 Credit Card' },
    { value: 'Wallet', label: '💸 Wallet/PayPal' },
    { value: 'Bitcoin', label: '₿ Bitcoin/Crypto' },
    { value: 'Landmark', label: '🏦 Bank/Wire' },
    { value: 'Smartphone', label: '📱 Mobile Payment' }
  ]

  useEffect(() => {
    if (method) {
      // Set method_type based on method_id for editing
      const methodType = methodTypes.find(t => t.id === method.method_id)?.id || ''
      setFormData(prev => ({
        ...prev,
        method_type: methodType
      }))
    }
  }, [method])

  const handleMethodTypeChange = (type) => {
    const selected = methodTypes.find(t => t.id === type)
    
    // Reset fields based on type
    const baseData = {
      method_id: type,
      method_type: type,
      name: type,
      display_name: selected?.name || '',
      icon: selected?.icon || 'Wallet',
      description: `Pay with ${selected?.name || type}`,
      
      // Reset all specific fields
      bank_name: '',
      account_name: '',
      account_number: '',
      routing_number: '',
      swift_code: '',
      wallet_address: '',
      network: '',
      estimated_price: 1,
      email: '',
      cashtag: '',
      username: '',
      instructions: ''
    }

    // Set default values based on type
    if (type === 'btc') {
      baseData.estimated_price = 65000
      baseData.network = 'Bitcoin'
      baseData.display_name = 'Bitcoin (BTC)'
    } else if (type === 'eth') {
      baseData.estimated_price = 3500
      baseData.network = 'Ethereum'
      baseData.display_name = 'Ethereum (ETH)'
    } else if (type === 'usdt') {
      baseData.estimated_price = 1
      baseData.network = 'ERC-20'
      baseData.display_name = 'Tether (USDT)'
    }

    setFormData({ ...formData, ...baseData })
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.method_id) newErrors.method_id = 'Method type is required'
    if (!formData.display_name) newErrors.display_name = 'Display name is required'

    // Validate based on method type
    if (formData.method_id === 'paypal' && !formData.email) {
      newErrors.email = 'PayPal email is required'
    }
    if (formData.method_id === 'wire') {
      if (!formData.bank_name) newErrors.bank_name = 'Bank name is required'
      if (!formData.account_name) newErrors.account_name = 'Account name is required'
      if (!formData.account_number) newErrors.account_number = 'Account number is required'
    }
    if (formData.method_id === 'cashapp' && !formData.cashtag) {
      newErrors.cashtag = 'Cash tag is required'
    }
    if (formData.method_id === 'venmo' && !formData.username) {
      newErrors.username = 'Venmo username is required'
    }
    if (formData.method_id === 'btc' && !formData.wallet_address) {
      newErrors.wallet_address = 'Bitcoin wallet address is required'
    }
    if (formData.method_id === 'eth' && !formData.wallet_address) {
      newErrors.wallet_address = 'Ethereum wallet address is required'
    }
    if (formData.method_id === 'usdt' && !formData.wallet_address) {
      newErrors.wallet_address = 'USDT wallet address is required'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      if (method) {
        await updatePaymentMethod(method.id, formData)
      } else {
        await createPaymentMethod(formData)
      }
      onSuccess()
    } catch (error) {
      console.error('Error saving payment method:', error)
      alert('Failed to save payment method')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {method ? 'Edit Payment Method' : 'Add Payment Method'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Method Type */}
          {!method && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method Type
              </label>
              <select
                value={formData.method_id}
                onChange={(e) => handleMethodTypeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
              >
                <option value="">Select a method type</option>
                {methodTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.method_id && (
                <p className="text-xs text-red-500 mt-1">{errors.method_id}</p>
              )}
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
                placeholder="e.g., Bitcoin (BTC)"
              />
              {errors.display_name && <p className="text-xs text-red-500 mt-1">{errors.display_name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon
              </label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
              >
                {iconOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
              placeholder="Brief description of this payment method"
            />
          </div>

          {/* Method-specific fields */}
          {formData.method_id === 'paypal' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PayPal Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
                placeholder="payments@example.com"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
          )}

          {formData.method_id === 'wire' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={formData.bank_name}
                  onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
                {errors.bank_name && <p className="text-xs text-red-500 mt-1">{errors.bank_name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  value={formData.account_name}
                  onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
                {errors.account_name && <p className="text-xs text-red-500 mt-1">{errors.account_name}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={formData.account_number}
                    onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
                  />
                  {errors.account_number && <p className="text-xs text-red-500 mt-1">{errors.account_number}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Routing Number
                  </label>
                  <input
                    type="text"
                    value={formData.routing_number}
                    onChange={(e) => setFormData({ ...formData, routing_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SWIFT Code
                </label>
                <input
                  type="text"
                  value={formData.swift_code}
                  onChange={(e) => setFormData({ ...formData, swift_code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>
            </div>
          )}

          {formData.method_id === 'cashapp' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cash App $Cashtag
              </label>
              <input
                type="text"
                value={formData.cashtag}
                onChange={(e) => setFormData({ ...formData, cashtag: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
                placeholder="$username"
              />
              {errors.cashtag && <p className="text-xs text-red-500 mt-1">{errors.cashtag}</p>}
            </div>
          )}

          {formData.method_id === 'venmo' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Venmo Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
                placeholder="@username"
              />
              {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
            </div>
          )}

          {/* Crypto Fields - BTC, ETH, USDT */}
          {(formData.method_id === 'btc' || formData.method_id === 'eth' || formData.method_id === 'usdt') && (
            <div className="space-y-3 border-t border-gray-200 pt-4">
              <h3 className="font-medium text-gray-900">Cryptocurrency Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wallet Address
                </label>
                <input
                  type="text"
                  value={formData.wallet_address}
                  onChange={(e) => setFormData({ ...formData, wallet_address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 font-mono text-sm"
                  placeholder="Enter wallet address"
                />
                {errors.wallet_address && <p className="text-xs text-red-500 mt-1">{errors.wallet_address}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Network
                </label>
                <input
                  type="text"
                  value={formData.network}
                  onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
                  placeholder={formData.method_id === 'btc' ? 'Bitcoin' : formData.method_id === 'eth' ? 'Ethereum' : 'ERC-20'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Price (USD)
                </label>
                <input
                  type="number"
                  value={formData.estimated_price}
                  onChange={(e) => setFormData({ ...formData, estimated_price: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
                  step="0.01"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Current estimated price in USD (e.g., BTC: 65000, ETH: 3500, USDT: 1)
                </p>
              </div>
            </div>
          )}

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort Order
            </label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-secondary rounded border-gray-300 focus:ring-secondary"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Active
            </label>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instructions (optional)
            </label>
            <textarea
              value={formData.instructions || ''}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
              placeholder="Additional instructions for customers..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : method ? 'Update Payment Method' : 'Create Payment Method'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}