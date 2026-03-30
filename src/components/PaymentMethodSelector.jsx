import { useState, useEffect } from 'react'
import { ArrowRight, Lock, CreditCard, Landmark, Smartphone, Bitcoin, Globe, Wallet, ChevronRight, ChevronDown } from 'lucide-react'
import { getActivePaymentMethods, getPaymentMethodsByType } from '@/lib/paymentService'

// Map icon strings to actual components
const iconMap = {
  CreditCard: <CreditCard className="w-5 h-5" />,
  Wallet: <Wallet className="w-5 h-5" />,
  Bitcoin: <Bitcoin className="w-5 h-5" />,
  Landmark: <Landmark className="w-5 h-5" />,
  Smartphone: <Smartphone className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />
}

// Method colors
const methodColors = {
  paypal: {
    bg: 'bg-[#0070BA]',
    lightBg: 'bg-[#0070BA]/10',
    border: 'border-[#0070BA]',
    text: 'text-[#0070BA]'
  },
  wire: {
    bg: 'bg-green-600',
    lightBg: 'bg-green-600/10',
    border: 'border-green-600',
    text: 'text-green-600'
  },
  cashapp: {
    bg: 'bg-[#00D632]',
    lightBg: 'bg-[#00D632]/10',
    border: 'border-[#00D632]',
    text: 'text-[#00D632]'
  },
  venmo: {
    bg: 'bg-[#008CFF]',
    lightBg: 'bg-[#008CFF]/10',
    border: 'border-[#008CFF]',
    text: 'text-[#008CFF]'
  },
  applepay: {
    bg: 'bg-black',
    lightBg: 'bg-black/10',
    border: 'border-black',
    text: 'text-black'
  },
  card: {
    bg: 'bg-purple-600',
    lightBg: 'bg-purple-600/10',
    border: 'border-purple-600',
    text: 'text-purple-600'
  },
  crypto: {
    bg: 'bg-orange-500',
    lightBg: 'bg-orange-500/10',
    border: 'border-orange-500',
    text: 'text-orange-500'
  }
}

export default function PaymentMethodSelector({ selectedMethod, onSelect, totalAmount, onContinue, celebrity, bookingDetails }) {
  const [paymentMethods, setPaymentMethods] = useState([])
  const [cryptoMethods, setCryptoMethods] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCrypto, setSelectedCrypto] = useState(null)
  const [showCryptoDropdown, setShowCryptoDropdown] = useState(false)
  
  // Generate random reference
  const reference = `SW${Math.floor(Math.random() * 100000000)}`

  useEffect(() => {
    loadPaymentMethods()
  }, [])

  useEffect(() => {
    // Load crypto methods separately
    const loadCrypto = async () => {
      try {
        const crypto = await getPaymentMethodsByType('crypto')
        setCryptoMethods(crypto || [])
        if (crypto && crypto.length > 0) {
          setSelectedCrypto(crypto[0].method_id)
        }
      } catch (error) {
        console.error('Error loading crypto methods:', error)
      }
    }
    loadCrypto()
  }, [])

  const loadPaymentMethods = async () => {
    try {
      const methods = await getActivePaymentMethods()
      // Filter out crypto methods from main list since we'll show them as one option
      const nonCryptoMethods = methods.filter(m => m.method_type !== 'crypto')
      setPaymentMethods(nonCryptoMethods || [])
    } catch (error) {
      console.error('Error loading payment methods:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSelectedCryptoDetails = () => {
    return cryptoMethods.find(c => c.method_id === selectedCrypto)
  }

  const getEstimatedCrypto = () => {
    const crypto = getSelectedCryptoDetails()
    if (!crypto || !crypto.estimated_price) return '0.00'
    return (totalAmount / crypto.estimated_price).toFixed(8)
  }

  const handleCryptoSelect = (cryptoId) => {
    setSelectedCrypto(cryptoId)
    setShowCryptoDropdown(false)
  }

  const handleContinue = () => {
    const crypto = getSelectedCryptoDetails()
    
    // If crypto is selected, pass the specific crypto method_id
    const methodToPass = selectedMethod === 'crypto' ? selectedCrypto : selectedMethod
    
    onContinue({
      method: methodToPass,
      amount: totalAmount,
      reference: selectedMethod === 'wire' ? reference : null,
      cryptoDetails: selectedMethod === 'crypto' ? crypto : null,
      estimatedCrypto: selectedMethod === 'crypto' ? getEstimatedCrypto() : null,
      celebrity,
      bookingDetails
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Select Payment Method</h3>
        <div className="space-y-3">
          {/* Non-crypto payment methods */}
          {paymentMethods.map((method) => {
            const colors = methodColors[method.method_id] || methodColors.card
            const IconComponent = iconMap[method.icon] || <Wallet className="w-5 h-5" />
            
            return (
              <button
                key={method.id}
                onClick={() => onSelect(method.method_id)}
                className={`w-full p-4 flex items-center gap-4 border rounded-lg transition ${
                  selectedMethod === method.method_id
                    ? `${colors.lightBg} ${colors.border} border-2`
                    : 'border-border hover:border-foreground/20 bg-card'
                }`}
              >
                <div className={`w-12 h-12 ${colors.lightBg} rounded-full flex items-center justify-center ${colors.text}`}>
                  {IconComponent}
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-foreground">{method.display_name}</h4>
                  <p className="text-sm text-foreground/60">{method.description}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === method.method_id
                    ? `${colors.border} border-2`
                    : 'border-foreground/20'
                }`}>
                  {selectedMethod === method.method_id && (
                    <div className={`w-3 h-3 rounded-full ${colors.bg}`} />
                  )}
                </div>
              </button>
            )
          })}

          {/* Cryptocurrency - Single Option */}
          {cryptoMethods.length > 0 && (
            <div className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => {
                  onSelect('crypto')
                  setShowCryptoDropdown(true) // Auto-open dropdown when selecting crypto
                }}
                className={`w-full p-4 flex items-center gap-4 transition ${
                  selectedMethod === 'crypto'
                    ? 'bg-orange-500/10 border-orange-500 border-2'
                    : 'bg-card hover:bg-muted border border-border'
                }`}
              >
                <div className={`w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500`}>
                  <Bitcoin className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-foreground">Cryptocurrency</h4>
                  <p className="text-sm text-foreground/60">Pay with Bitcoin, Ethereum, USDT or BNB</p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedMethod === 'crypto' && (
                    <span className="text-sm text-orange-500">{getSelectedCryptoDetails()?.name}</span>
                  )}
                  <ChevronDown className={`w-4 h-4 transition-transform ${selectedMethod === 'crypto' && showCryptoDropdown ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Crypto Dropdown - Only show when crypto is selected */}
              {selectedMethod === 'crypto' && showCryptoDropdown && (
                <div className="border-t border-border bg-muted/20 p-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground/70 mb-2">Select Cryptocurrency:</p>
                    {cryptoMethods.map((crypto) => (
                      <button
                        key={crypto.id}
                        onClick={() => handleCryptoSelect(crypto.method_id)}
                        className={`w-full p-3 flex items-center gap-3 rounded-lg transition ${
                          selectedCrypto === crypto.method_id
                            ? 'bg-orange-500/10 border border-orange-500'
                            : 'bg-card border border-border hover:bg-muted'
                        }`}
                      >
                        {/* <span className="text-xl">{crypto.icon || '₿'}</span> */}
                        <div className="flex-1 text-left">
                          <p className="font-medium">{crypto.display_name}</p>
                          <p className="text-xs text-foreground/60">{crypto.description}</p>
                        </div>
                        {selectedCrypto === crypto.method_id && (
                          <span className="text-orange-500">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* PayPal Instructions */}
      {selectedMethod === 'paypal' && (
        <div className="border border-border rounded-lg p-6 bg-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#0070BA]/10 rounded-full flex items-center justify-center text-[#0070BA]">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg">PayPal Instructions</h3>
          </div>
          
          <div className="space-y-4">
            {/* Amount to Pay */}
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-foreground/60">Amount to Pay:</span>
              <span className="font-bold text-xl text-secondary">${totalAmount.toFixed(2)} USD</span>
            </div>

            <div className="bg-[#0070BA]/5 border border-[#0070BA]/20 rounded-lg p-4">
              <p className="text-sm font-medium mb-2">PayPal Email:</p>
              <p className="text-lg font-mono bg-background p-2 rounded border border-border">
                {paymentMethods.find(m => m.method_id === 'paypal')?.email || 'payments@starconnect.com'}
              </p>
            </div>
            <p className="text-sm text-foreground/60">
              {paymentMethods.find(m => m.method_id === 'paypal')?.instructions || 
                "You'll be redirected to our secure payment processing page where you can complete your PayPal payment."}
            </p>

            <button
              onClick={handleContinue}
              className="w-full mt-4 py-3 bg-secondary text-primary font-semibold rounded-lg hover:bg-secondary/90 transition flex items-center justify-center gap-2"
            >
              Continue to Payment Processing
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Wire Transfer Instructions */}
      {selectedMethod === 'wire' && (
        <div className="border border-border rounded-lg p-6 bg-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-600/10 rounded-full flex items-center justify-center text-green-600">
              <Landmark className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg">Wire Transfer Instructions</h3>
          </div>
          
          <div className="space-y-4">
            {/* Amount to Pay */}
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-foreground/60">Amount to Transfer:</span>
              <span className="font-bold text-xl text-secondary">${totalAmount.toFixed(2)} USD</span>
            </div>
            
            {/* Reference Number */}
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-foreground/60">Reference Number:</span>
              <span className="font-mono font-semibold">{reference}</span>
            </div>


            {/* Instructions - Now separate */}
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="font-medium mb-2">Instructions:</p>
              <ol className="space-y-2 list-decimal list-inside text-sm text-foreground/70">
                <li>Log in to your online banking</li>
                <li>Use the bank details above to add the payee</li>
                <li>Transfer the exact amount shown above</li>
                <li>Include the reference number in the transfer notes</li>
              </ol>
            </div>

            <button
              onClick={handleContinue}
              className="w-full mt-4 py-3 bg-secondary text-primary font-semibold rounded-lg hover:bg-secondary/90 transition flex items-center justify-center gap-2"
            >
              Continue to Payment Processing
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Cash App Instructions */}
      {selectedMethod === 'cashapp' && (
        <div className="border border-border rounded-lg p-6 bg-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#00D632]/10 rounded-full flex items-center justify-center text-[#00D632]">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg">Cash App Instructions</h3>
          </div>
          
          <div className="space-y-4">
            {/* Amount to Pay */}
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-foreground/60">Amount to Pay:</span>
              <span className="font-bold text-xl text-secondary">${totalAmount.toFixed(2)} USD</span>
            </div>

            <div className="bg-[#00D632]/5 border border-[#00D632]/20 rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Cash App $Cashtag:</p>
              <p className="text-lg font-mono bg-background p-2 rounded border border-border">
                {paymentMethods.find(m => m.method_id === 'cashapp')?.cashtag || '$StarConnectPay'}
              </p>
            </div>
            <p className="text-sm text-foreground/60">
              {paymentMethods.find(m => m.method_id === 'cashapp')?.instructions || 
                "Send payment to the $cashtag above and include your booking ID in the note."}
            </p>

            <button
              onClick={handleContinue}
              className="w-full mt-4 py-3 bg-secondary text-primary font-semibold rounded-lg hover:bg-secondary/90 transition flex items-center justify-center gap-2"
            >
              Continue to Payment Processing
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Venmo Instructions */}
      {selectedMethod === 'venmo' && (
        <div className="border border-border rounded-lg p-6 bg-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#008CFF]/10 rounded-full flex items-center justify-center text-[#008CFF]">
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg">Venmo Instructions</h3>
          </div>
          
          <div className="space-y-4">
            {/* Amount to Pay */}
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-foreground/60">Amount to Pay:</span>
              <span className="font-bold text-xl text-secondary">${totalAmount.toFixed(2)} USD</span>
            </div>

            <div className="bg-[#008CFF]/5 border border-[#008CFF]/20 rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Venmo Username:</p>
              <p className="text-lg font-mono bg-background p-2 rounded border border-border">
                {paymentMethods.find(m => m.method_id === 'venmo')?.username || '@StarConnect-Official'}
              </p>
            </div>
            <p className="text-sm text-foreground/60">
              {paymentMethods.find(m => m.method_id === 'venmo')?.instructions || 
                "Send payment to the Venmo username above and include your booking ID in the note."}
            </p>

            <button
              onClick={handleContinue}
              className="w-full mt-4 py-3 bg-secondary text-primary font-semibold rounded-lg hover:bg-secondary/90 transition flex items-center justify-center gap-2"
            >
              Continue to Payment Processing
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Apple Pay Instructions */}
      {selectedMethod === 'applepay' && (
        <div className="border border-border rounded-lg p-6 bg-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center text-black">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg">Apple Pay Instructions</h3>
          </div>
          
          <div className="space-y-4">
            {/* Amount to Pay */}
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-foreground/60">Amount to Pay:</span>
              <span className="font-bold text-xl text-secondary">${totalAmount.toFixed(2)} USD</span>
            </div>

            <p className="text-sm text-foreground/60">
              {paymentMethods.find(m => m.method_id === 'applepay')?.instructions || 
                "Use Apple Pay for a secure and fast checkout. You'll be prompted to complete the payment on your device."}
            </p>

            <button
              onClick={handleContinue}
              className="w-full mt-4 py-3 bg-secondary text-primary font-semibold rounded-lg hover:bg-secondary/90 transition flex items-center justify-center gap-2"
            >
              Continue to Payment Processing
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Card Instructions */}
      {selectedMethod === 'card' && (
        <div className="border border-border rounded-lg p-6 bg-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-600/10 rounded-full flex items-center justify-center text-purple-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg">Card Payment Instructions</h3>
          </div>
          
          <div className="space-y-4">
            {/* Amount to Pay */}
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-foreground/60">Amount to Pay:</span>
              <span className="font-bold text-xl text-secondary">${totalAmount.toFixed(2)} USD</span>
            </div>

            <p className="text-sm text-foreground/60">
              {paymentMethods.find(m => m.method_id === 'card')?.instructions || 
                "Enter your card details securely on the next page."}
            </p>

            <button
              onClick={handleContinue}
              className="w-full mt-4 py-3 bg-secondary text-primary font-semibold rounded-lg hover:bg-secondary/90 transition flex items-center justify-center gap-2"
            >
              Continue to Payment Processing
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Crypto Instructions */}
      {selectedMethod === 'crypto' && selectedCrypto && (
        <div className="border border-border rounded-lg p-6 bg-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500">
              <Bitcoin className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg">
              {getSelectedCryptoDetails()?.display_name} Instructions
            </h3>
          </div>
          
          <p className="text-sm text-foreground/60 mb-4">
            {getSelectedCryptoDetails()?.instructions ||
              "Send the exact amount to the address provided below."}
          </p>

          <div className="bg-muted/30 rounded-lg p-4 mb-4 space-y-3">
            {/* Amount to Pay */}
            <div className="flex justify-between items-center">
              <span className="text-foreground/60">Amount to Pay:</span>
              <span className="font-bold">${totalAmount.toFixed(2)} USD</span>
            </div>
            
            {/* Estimated Crypto */}
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="text-foreground/60">Estimated {getSelectedCryptoDetails()?.name}:</span>
              <span className="font-mono font-semibold">{getEstimatedCrypto()} {getSelectedCryptoDetails()?.symbol?.toLowerCase()}</span>
            </div>
            
            {/* Wallet Address */}
            <div className="pt-2 border-t border-border">
              <p className="text-sm font-medium mb-1 flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Wallet Address:
              </p>
              <p className="text-xs font-mono bg-background p-2 rounded border border-border break-all">
                {getSelectedCryptoDetails()?.wallet_address}
              </p>
            </div>
            
            {/* Network */}
            <div>
              <p className="text-sm font-medium mb-1 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Network:
              </p>
              <p className="text-sm bg-background p-2 rounded border border-border">
                {getSelectedCryptoDetails()?.network}
              </p>
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="w-full py-3 bg-secondary text-primary font-semibold rounded-lg hover:bg-secondary/90 transition flex items-center justify-center gap-2"
          >
            Continue to Payment Processing
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Security Footer */}
      <div className="flex items-center justify-center gap-2 text-sm text-foreground/60">
        <Lock className="w-4 h-4" />
        <span>All transactions are secure and encrypted. We never store your payment details.</span>
      </div>
    </div>
  )
}