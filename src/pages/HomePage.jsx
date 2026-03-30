import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getAllCelebrities, formatPrice } from '@/lib/data'
import { useState, useEffect } from 'react'
import MainLayout from '@/components/MainLayout'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export default function HomePage() {
  const { user } = useAuth()
  const [featuredCelebrities, setFeaturedCelebrities] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [formStatus, setFormStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // Get all celebrities and take first 6 for featured
    const celebrities = getAllCelebrities()
    setFeaturedCelebrities(celebrities.slice(0, 6))
    setLoading(false)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setFormStatus({ type: '', message: '' })

    // Simulate form submission
    setTimeout(() => {
      console.log('Contact form submitted:', formData)
      setFormStatus({ type: 'success', message: 'Thank you for your message! We\'ll get back to you within 24 hours.' })
      setFormData({ name: '', email: '', subject: '', message: '' })
      setSubmitting(false)
      
      // Clear success message after 5 seconds
      setTimeout(() => setFormStatus({ type: '', message: '' }), 5000)
    }, 1500)
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </main>
    )
  }

  return (
    <MainLayout>
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-background to-muted py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
                  Connect with Your Favorite Celebrities
                </h1>
                <p className="text-xl text-foreground/70 mb-8 text-balance">
                  Book personalized video calls, get exclusive advice, and create unforgettable memories with the people you admire.
                </p>
                <div className="flex gap-4">
                  {user ? (
                    <Link
                      to="/browse"
                      className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-semibold"
                    >
                      Browse Celebrities
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/signup"
                        className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-semibold"
                      >
                        Get Started
                      </Link>
                      <Link
                        to="/browse"
                        className="px-8 py-3 border-2 border-primary text-primary hover:bg-primary/10 rounded-lg transition font-semibold"
                      >
                        Browse Now
                      </Link>
                    </>
                  )}
                </div>
              </div>
              <div className="relative h-96 md:h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary via-accent to-secondary opacity-20 rounded-2xl blur-3xl"></div>
                <div className="relative grid grid-cols-2 gap-4 h-full">
                  {featuredCelebrities.slice(0, 4).map((celebrity) => (
                    <div
                      key={celebrity.id}
                      className="rounded-xl overflow-hidden border-2 border-secondary/30 hover:border-secondary/60 transition"
                    >
                      <img
                        src={celebrity.image}
                        alt={celebrity.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(celebrity.name)}&size=200&background=7C3AED&color=fff`;
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Celebrities */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                Featured Celebrities
              </h2>
              <p className="text-lg text-foreground/60 text-balance">
                Discover amazing people ready to connect with you
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {featuredCelebrities.map((celebrity) => (
                <Link
                  key={celebrity.id}
                  to={`/celebrity/${celebrity.id}`}
                  className="group"
                >
                  <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition">
                    <div className="relative h-64 overflow-hidden bg-muted">
                      <img
                        src={celebrity.image}
                        alt={celebrity.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(celebrity.name)}&size=400&background=7C3AED&color=fff`;
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-secondary text-primary px-3 py-1 rounded-full text-sm font-semibold">
                        {formatPrice(celebrity.pricePerMinute)}/min
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">{celebrity.name}</h3>
                      <p className="text-sm text-foreground/60 mb-3">{celebrity.category}</p>
                      <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
                        {celebrity.bio}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-secondary font-bold text-sm">★</span>
                          <span className="text-sm font-semibold">{celebrity.rating}</span>
                          <span className="text-xs text-foreground/60">
                            ({celebrity.totalReviews})
                          </span>
                        </div>
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          {celebrity.availability}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/browse"
                className="px-8 py-3 border-2 border-primary text-primary hover:bg-primary/10 rounded-lg transition font-semibold inline-block"
              >
                View All Celebrities
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                How It Works
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { number: '1', title: 'Browse', description: 'Explore our curated list of celebrities' },
                { number: '2', title: 'Select', description: 'Choose your date and time slot' },
                { number: '3', title: 'Book', description: 'Complete payment securely' },
                { number: '4', title: 'Connect', description: 'Join your personalized video call' },
              ].map((step) => (
                <div key={step.number} className="text-center">
                  <div className="w-12 h-12 bg-secondary text-primary rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    {step.number}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-foreground/60">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact/Inquiry Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                Have a Question?
              </h2>
              <p className="text-lg text-foreground/60 text-balance max-w-2xl mx-auto">
                We're here to help! Whether you have questions about bookings, celebrities, or anything else, feel free to reach out.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground mb-4">Get in Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-card border border-border rounded-lg">
                    <Mail className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Email Us</p>
                      <p className="text-foreground/60">support@starconnect.com</p>
                      <p className="text-sm text-foreground/40">We'll respond within 24 hours</p>
                    </div>
                  </div>
                 
                  </div>
              </div>

              {/* Contact Form */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-2xl font-bold text-foreground mb-6">Send a Message</h3>
                
                {formStatus.message && (
                  <div className={`mb-4 p-3 rounded-lg ${
                    formStatus.type === 'success' 
                      ? 'bg-green-50 border border-green-200 text-green-700'
                      : 'bg-red-50 border border-red-200 text-red-600'
                  }`}>
                    {formStatus.message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                      placeholder="Booking Inquiry, Celebrity Question, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
              Ready to Connect?
            </h2>
            <p className="text-lg text-foreground/60 mb-8 text-balance">
              Join thousands of fans connecting with their favorite celebrities right now.
            </p>
            {user ? (
              <Link
                to="/browse"
                className="px-8 py-3 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition font-semibold inline-block"
              >
                Browse Celebrities Now
              </Link>
            ) : (
              <Link
                to="/browse"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-semibold inline-block"
              >
               Book now
              </Link>
            )}
          </div>
        </section>
      </main>
    </MainLayout>
  )
}