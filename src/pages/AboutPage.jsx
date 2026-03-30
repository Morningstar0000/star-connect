import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../components/MainLayout'
import { supabase } from '@/lib/supabaseClient'
import { Users, Star, Heart, Globe, Shield, Zap, Quote, ChevronLeft, ChevronRight, MessageCircle, Award } from 'lucide-react'

export default function AboutPage() {
  const [featuredTestimonials, setFeaturedTestimonials] = useState([])
  const [fanReviews, setFanReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      // Featured Testimonials - from celebrities/influencers
      const featured = [
        {
          id: 1,
          name: "Tom Felton",
          role: "Actor",
          avatar: "TF",
          rating: 5,
          content: "StarConnect has created an incredible platform that helps me connect with fans in a meaningful way. The experience is always rewarding and personal.",
          date: "2024-02-15",
          type: "celebrity",
          badge: "Celebrity Partner"
        },
        {
          id: 2,
          name: "Dwayne Johnson",
          role: "Actor & Producer",
          avatar: "DJ",
          rating: 5,
          content: "I love using StarConnect to send personalized messages to fans. Seeing their reactions makes my day! It's a fantastic platform that brings genuine joy to people.",
          date: "2024-02-10",
          type: "celebrity",
          badge: "Celebrity Partner"
        },
        {
          id: 3,
          name: "Serena Williams",
          role: "Tennis Champion",
          avatar: "SW",
          rating: 5,
          content: "The team behind StarConnect truly cares about creating authentic connections. I'm proud to be part of a platform that makes people smile.",
          date: "2024-02-05",
          type: "celebrity",
          badge: "Celebrity Partner"
        }
      ]

      // Fan Reviews - from real customers
      const fans = [
        {
          id: 4,
          name: "Sarah Johnson",
          role: "Birthday Organizer",
          avatar: "SJ",
          rating: 5,
          content: "I booked a shoutout from Kevin Hart for my husband's birthday. It was absolutely amazing! He was so funny and personal. Definitely the highlight of the celebration!",
          date: "2024-05-15",
          celebrity: "Kevin Hart",
          verified: true
        },
        {
          id: 5,
          name: "Michael Chen",
          role: "Superfan",
          avatar: "MC",
          rating: 5,
          content: "Getting a video from Taylor Swift was a dream come true! She was so sweet and personal. The whole process was smooth and easy. Highly recommend!",
          date: "2025-08-10",
          celebrity: "Taylor Swift",
          verified: true
        },
        {
          id: 6,
          name: "Emily Rodriguez",
          role: "Corporate Event Planner",
          avatar: "ER",
          rating: 5,
          content: "We booked Dwayne Johnson for our company event. He was professional, motivational, and exactly what our team needed. The team is still talking about it!",
          date: "2025-02-05",
          celebrity: "Dwayne Johnson",
          verified: true
        },
        {
          id: 7,
          name: "David Kim",
          role: "Wedding Planner",
          avatar: "DK",
          rating: 5,
          content: "Serena Williams sent a wedding congratulation video. It was so inspiring and heartfelt. Made the bride's day extra special!",
          date: "2024-10-28",
          celebrity: "Serena Williams",
          verified: true
        },
        {
          id: 8,
          name: "Lisa Thompson",
          role: "Proud Mom",
          avatar: "LT",
          rating: 5,
          content: "My daughter is a huge fan of Zendaya. The video we got was perfect - so genuine and encouraging. She hasn't stopped watching it!",
          date: "2024-04-20",
          celebrity: "Zendaya",
          verified: true
        },
        {
          id: 9,
          name: "James Wilson",
          role: "Business Owner",
          avatar: "JW",
          rating: 4,
          content: "Great experience overall. The celebrity delivered exactly what we asked for. Will definitely use this service again!",
          date: "2025-06-15",
          celebrity: "Robert Downey Jr.",
          verified: false
        }
      ]

      setFeaturedTestimonials(featured)
      setFanReviews(fans)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % featuredTestimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + featuredTestimonials.length) % featuredTestimonials.length)
  }

  const calculateAverageRating = () => {
    if (fanReviews.length === 0) return 0
    const sum = fanReviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / fanReviews.length).toFixed(1)
  }

  const getStarRating = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <MainLayout>
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-foreground mb-6">About StarConnect</h1>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              We're on a mission to bring fans closer to their favorite celebrities through authentic, personalized video experiences.
            </p>
          </div>

          {/* Mission Section */}
          <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-foreground/70 mb-4">
                To create meaningful connections between fans and celebrities, making unforgettable moments accessible to everyone.
              </p>
              <p className="text-foreground/70">
                Whether it's a birthday surprise, a motivational message, or just a moment of joy, we believe every interaction should be special.
              </p>
            </div>
            <div className="bg-gradient-to-br from-secondary/10 to-primary/10 rounded-xl p-8 text-center">
              <Heart className="w-16 h-16 text-secondary mx-auto mb-4" />
              <p className="text-foreground/70 italic">
                "Creating moments that matter, one video at a time."
              </p>
            </div>
          </div>

          {/* Celebrity Testimonials Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Award className="w-6 h-6 text-secondary" />
                <h2 className="text-3xl font-bold text-foreground">Celebrity Testimonials</h2>
              </div>
              <p className="text-foreground/60">Hear what our celebrity partners have to say about StarConnect</p>
            </div>

            {featuredTestimonials.length > 0 && (
              <div className="bg-gradient-to-r from-secondary/5 to-primary/5 rounded-2xl p-8">
                <div className="relative">
                  <Quote className="absolute -top-4 -left-4 w-12 h-12 text-secondary/20" />
                  <div className="text-center py-8 px-4">
                    <div className="flex justify-center mb-4">
                      {getStarRating(featuredTestimonials[currentTestimonial].rating)}
                    </div>
                    <p className="text-xl text-foreground/80 italic mb-6 max-w-3xl mx-auto">
                      "{featuredTestimonials[currentTestimonial].content}"
                    </p>
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-bold">
                        {featuredTestimonials[currentTestimonial].avatar}
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-foreground">{featuredTestimonials[currentTestimonial].name}</p>
                        <p className="text-sm text-foreground/60">{featuredTestimonials[currentTestimonial].role}</p>
                        <span className="inline-block mt-1 text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">
                          {featuredTestimonials[currentTestimonial].badge}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Carousel Controls */}
                  {featuredTestimonials.length > 1 && (
                    <div className="flex justify-center gap-4 mt-4">
                      <button
                        onClick={prevTestimonial}
                        className="p-2 rounded-full bg-card border border-border hover:bg-muted transition"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <div className="flex gap-2">
                        {featuredTestimonials.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentTestimonial(idx)}
                            className={`w-2 h-2 rounded-full transition ${
                              currentTestimonial === idx ? 'bg-secondary w-4' : 'bg-foreground/20'
                            }`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={nextTestimonial}
                        className="p-2 rounded-full bg-card border border-border hover:bg-muted transition"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Fan Reviews Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <MessageCircle className="w-6 h-6 text-secondary" />
                <h2 className="text-3xl font-bold text-foreground">Fan Reviews</h2>
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold text-foreground">{calculateAverageRating()}</span>
                <span className="text-foreground/60">out of 5</span>
              </div>
              <p className="text-foreground/60">Join thousands of satisfied customers who created unforgettable moments</p>
            </div>

            {/* All Fan Reviews Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {fanReviews.map((review) => (
                <div key={review.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-bold">
                      {review.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{review.name}</p>
                      <p className="text-xs text-foreground/60">{review.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {getStarRating(review.rating)}
                    {review.verified && (
                      <span className="ml-2 text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">Verified</span>
                    )}
                  </div>
                  <p className="text-foreground/70 text-sm line-clamp-3 mb-3">
                    "{review.content}"
                  </p>
                  <p className="text-xs text-secondary">✨ Booked {review.celebrity}</p>
                  <p className="text-xs text-foreground/40 mt-2">{new Date(review.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>

            {/* Write a Review CTA */}
            {/* <div className="mt-12 text-center p-8 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-xl">
              <MessageCircle className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Had a Great Experience?</h3>
              <p className="text-foreground/60 mb-4">Share your story and inspire others!</p>
              <button className="px-6 py-2 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition font-medium">
                Write a Review
              </button>
            </div> */}
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-card border border-border rounded-xl">
                <Star className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Authenticity</h3>
                <p className="text-foreground/60">Genuine connections between fans and celebrities</p>
              </div>
              <div className="text-center p-6 bg-card border border-border rounded-xl">
                <Shield className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Trust & Safety</h3>
                <p className="text-foreground/60">Secure platform with verified celebrities</p>
              </div>
              <div className="text-center p-6 bg-card border border-border rounded-xl">
                <Zap className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Accessibility</h3>
                <p className="text-foreground/60">Making celebrity connections available to all</p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="text-center p-6 bg-card border border-border rounded-xl">
              <p className="text-4xl font-bold text-secondary">100+</p>
              <p className="text-foreground/60">Celebrities</p>
            </div>
            <div className="text-center p-6 bg-card border border-border rounded-xl">
              <p className="text-4xl font-bold text-secondary">1,000+</p>
              <p className="text-foreground/60">Happy Fans</p>
            </div>
            <div className="text-center p-6 bg-card border border-border rounded-xl">
              <p className="text-4xl font-bold text-secondary">50+</p>
              <p className="text-foreground/60">Categories</p>
            </div>
            <div className="text-center p-6 bg-card border border-border rounded-xl">
              <p className="text-4xl font-bold text-secondary">4.9</p>
              <p className="text-foreground/60">Average Rating</p>
            </div>
          </div>

          {/* Team Section */}
          {/* <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-card border border-border rounded-xl">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-semibold text-lg">John Doe</h3>
                <p className="text-foreground/60">Founder & CEO</p>
              </div>
              <div className="text-center p-6 bg-card border border-border rounded-xl">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-semibold text-lg">Jane Smith</h3>
                <p className="text-foreground/60">Head of Talent</p>
              </div>
              <div className="text-center p-6 bg-card border border-border rounded-xl">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-semibold text-lg">Mike Johnson</h3>
                <p className="text-foreground/60">Customer Experience</p>
              </div>
            </div>
          </div> */}

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-xl p-12 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Connect?</h2>
            <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
              Join thousands of fans who have already created unforgettable moments with their favorite celebrities.
            </p>
            <Link
              to="/browse"
              className="px-8 py-3 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition font-semibold inline-block"
            >
              Browse Celebrities
            </Link>
          </div>
        </div>
      </main>
    </MainLayout>
  )
}