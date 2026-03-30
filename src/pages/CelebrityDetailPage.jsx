import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getCelebrityById } from '@/lib/celebrityService'
import { isInWishlist, toggleWishlist, formatPrice } from '@/lib/data'
import MainLayout from '../components/MainLayout'

export default function CelebrityDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [celebrity, setCelebrity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [wishlisted, setWishlisted] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    fetchCelebrity()
  }, [id, user])

  const fetchCelebrity = async () => {
    setLoading(true)
    try {
      console.log('Looking for celebrity with ID:', id)
      
      // Convert id to number
      const celebId = parseInt(id)
      const data = await getCelebrityById(celebId)
      
      console.log('Found celebrity:', data)
      
      if (data) {
        setCelebrity(data)
        if (user) {
          setWishlisted(isInWishlist(user.id, data.id))
        }
      }
    } catch (error) {
      console.error('Error fetching celebrity:', error)
    } finally {
      setLoading(false)
    }
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

  if (!celebrity) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Celebrity Not Found</h2>
            <p className="text-lg text-foreground/60 mb-6">The celebrity you're looking for doesn't exist.</p>
            <button 
              onClick={() => navigate('/browse')} 
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
            >
              Back to Browse
            </button>
          </div>
        </div>
      </MainLayout>
    )
  }

  const handleWishlist = () => {
    if (!user) {
      navigate('/login')
      return
    }
    toggleWishlist(user.id, celebrity.id)
    setWishlisted(!wishlisted)
  }

  const handleBooking = () => {
    navigate(`/book/${celebrity.id}`)
  }

  // Fallback image if the main image fails to load
  const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(celebrity.name)}&size=400&background=7C3AED&color=fff&bold=true`

  return (
    <MainLayout>
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition mb-8"
          >
            ← Back
          </button>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Left Column - Image */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="rounded-xl overflow-hidden bg-muted aspect-square mb-4">
                  <img 
                    src={imageError ? fallbackImage : celebrity.image} 
                    alt={celebrity.name} 
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {celebrity.tags?.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-muted rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-foreground mb-2">{celebrity.name}</h1>
                  <p className="text-xl text-foreground/60">{celebrity.category}</p>
                </div>
                <button 
                  onClick={handleWishlist} 
                  className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                    wishlisted 
                      ? 'bg-secondary text-primary' 
                      : 'bg-muted hover:bg-border text-foreground/70'
                  }`}
                >
                  <span className="text-lg">{wishlisted ? '★' : '☆'}</span>
                  Wishlist
                </button>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <span className="text-secondary font-bold text-xl">★</span>
                  <span className="font-bold text-xl">{celebrity.rating}</span>
                </div>
                <span className="text-foreground/40">•</span>
                <span className="text-foreground/60">{celebrity.total_reviews} reviews</span>
              </div>

              {/* Bio */}
              <p className="text-foreground/70 text-lg leading-relaxed mb-8">
                {celebrity.bio}
              </p>

              {/* Pricing Cards */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {/* Video Call Card */}
                <div className="bg-card border border-border rounded-lg p-6 hover:border-secondary transition cursor-pointer" onClick={handleBooking}>
                  <h3 className="font-semibold text-foreground mb-2">Video Call</h3>
                  <p className="text-3xl font-bold text-secondary mb-2">
                    {formatPrice(celebrity.price_per_minute)}<span className="text-sm font-normal text-foreground/60">/min</span>
                  </p>
                  <p className="text-sm text-foreground/60">15-minute minimum</p>
                </div>

                {/* Shoutout Card */}
                <div className="bg-card border border-border rounded-lg p-6 hover:border-secondary transition cursor-pointer" onClick={handleBooking}>
                  <h3 className="font-semibold text-foreground mb-2">Shoutout</h3>
                  <p className="text-3xl font-bold text-secondary mb-2">
                    {formatPrice(celebrity.shoutout_price)}
                  </p>
                  <p className="text-sm text-foreground/60">Personalized video message</p>
                </div>
              </div>

              {/* Book Button */}
              <button 
                onClick={handleBooking} 
                className="w-full py-4 bg-secondary text-primary font-semibold rounded-lg hover:bg-secondary/90 transition text-lg"
              >
                Book a Call with {celebrity.name.split(' ')[0]}
              </button>

              {/* Availability Note */}
              <p className="text-center text-sm text-foreground/60 mt-4">
                {celebrity.availability || 'Contact for availability'}
              </p>

              {/* Guest Booking Notice */}
              {!user && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                  <p>✨ No account needed! You can book as a guest. After booking, we'll send you a link to create your account and track your booking.</p>
                </div>
              )}

              {/* Additional Details */}
              <div className="mt-8 pt-8 border-t border-border">
                <h2 className="text-xl font-bold text-foreground mb-4">About {celebrity.name.split(' ')[0]}</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">What to expect</h3>
                    <ul className="space-y-2 text-foreground/70">
                      <li>• 1-on-1 video call</li>
                      <li>• Personalized conversation</li>
                      <li>• 24-hour cancellation policy</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Details</h3>
                    <ul className="space-y-2 text-foreground/70">
                      <li>• Status: {celebrity.availability}</li>
                      <li>• Response: Usually within 24 hours</li>
                      <li>• Duration: 15-60 minutes</li>
                    </ul>
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