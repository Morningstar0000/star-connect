import { Link } from 'react-router-dom'
import { Search, Calendar, Video, Share2, Star, Clock, CheckCircle, ArrowRight } from 'lucide-react'
import MainLayout from '../components/MainLayout'

export default function HowItWorksPage() {
    return (
        <MainLayout>
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 md:py-28 overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                        Connect with Your Favorite Stars
                    </h1>
                    <p className="text-xl md:text-2xl text-foreground/70 mb-8 max-w-3xl mx-auto">
                        Access hundreds of celebrities and request a personalized video message for any occasion.
                    </p>
                    <Link
                        to="/browse"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-primary font-semibold rounded-full hover:bg-secondary/90 transition text-lg"
                    >
                        Browse Stars
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* How It Works Steps */}
            <section className="py-20 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center text-foreground mb-16">
                        How StarConnect Works
                    </h2>

                    <div className="space-y-20">
                        {/* Step 1 - Search */}
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="order-2 md:order-1">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-primary font-bold text-xl mb-6">
                                    1
                                </div>
                                <h3 className="text-3xl font-bold text-foreground mb-4">Search for a Star</h3>
                                <p className="text-lg text-foreground/70 mb-6">
                                    Find the right celebrity for any occasion. Birthdays, milestones, or even a well-deserved roast,
                                    the perfect celebrity is only a search away. Browse by category, price, or popularity.
                                </p>

                                {/* Example search preview */}
                                <div className="bg-card border border-border rounded-lg p-4 max-w-md">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                                            <Search className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1 h-10 bg-muted rounded-lg"></div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <img
                                            src="https://ui-avatars.com/api/?name=Tom+Felton&size=40&background=7C3AED&color=fff"
                                            alt="Tom Felton"
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div>
                                            <p className="font-semibold">Tom Felton</p>
                                            <p className="text-sm text-foreground/60">Actor • 3m reviews</p>
                                        </div>
                                        <span className="ml-auto text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                                            Popular
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="order-1 md:order-2 relative">
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                    <img
                                        src="https://cdn.cameo.com/static/assets/search-for-a-star-1x.png"
                                        alt="Search for celebrities"
                                        className="w-full h-auto"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-secondary/20 to-transparent"></div>
                                </div>
                                {/* Decorative elements */}
                                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl"></div>
                                <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
                            </div>
                        </div>

                        {/* Step 2 - Request */}
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="relative order-1">
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                    <img
                                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn8tT9pNFtj09-47Ajq1c5LT2DAiL2IbaElg&s"
                                        alt="Request a video"
                                        className="w-full h-auto"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-secondary/20 to-transparent"></div>
                                </div>
                                {/* Floating card */}
                                <div className="absolute -bottom-6 -right-6 bg-card border border-border rounded-lg p-4 shadow-xl max-w-xs">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Calendar className="w-5 h-5 text-secondary" />
                                        <span className="text-sm font-semibold">Delivery within 7 days</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-primary" />
                                        <span className="text-sm">24hr express option available</span>
                                    </div>
                                </div>
                            </div>
                            <div className="order-2">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-primary font-bold text-xl mb-6">
                                    2
                                </div>
                                <h3 className="text-3xl font-bold text-foreground mb-4">Request Your Video</h3>
                                <p className="text-lg text-foreground/70 mb-6">
                                    Include all the important details in your request form. After it's submitted,
                                    stars have up to 7 days to complete it. Choose our 24hr delivery option if you
                                    need it sooner.
                                </p>

                                {/* Request preview */}
                                <div className="bg-gradient-to-br from-secondary/5 to-primary/5 border border-secondary/20 rounded-lg p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                                            <Video className="w-6 h-6 text-secondary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-lg mb-1">Your request is ready!</p>
                                            <p className="text-foreground/70">
                                                Tom Felton's video should be ready for your clients by wedding day
                                            </p>
                                            <div className="mt-3 flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                <span className="text-sm text-green-600">Ready to share</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 - Share */}
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="order-2 md:order-1">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-primary font-bold text-xl mb-6">
                                    3
                                </div>
                                <h3 className="text-3xl font-bold text-foreground mb-4">Share the Magic</h3>
                                <p className="text-lg text-foreground/70 mb-6">
                                    Magical moments deserve to be shared. Whether you're giving one or receiving a
                                    personalized video, capture the reaction and share it with the world.
                                </p>

                                {/* Share preview */}
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary border-2 border-white"></div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 bg-[#1DA1F2] text-white rounded-full hover:scale-110 transition">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.104c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.196-3.68 13.5 13.5 0 001.41-5.912 9.673 9.673 0 002.163-2.723z" />
                                            </svg>
                                        </button>
                                        <button className="p-2 bg-[#4267B2] text-white rounded-full hover:scale-110 transition">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                            </svg>
                                        </button>
                                        <button className="p-2 bg-[#E1306C] text-white rounded-full hover:scale-110 transition">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Video Section - Updated */}
                            <div className="order-1 md:order-2 relative">
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
                                    <video
                                        className="w-full h-auto"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        poster="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop"
                                    >
                                        <source src="https://cdn.cameo.com/static/assets/img-share.mp4" type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                    <div className="absolute inset-0 bg-gradient-to-tr from-secondary/20 to-transparent pointer-events-none"></div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center text-foreground mb-16">
                        Why Choose StarConnect?
                    </h2>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <Star className="w-8 h-8" />,
                                title: "A-List Celebrities",
                                description: "Access to hundreds of verified celebrities across all industries"
                            },
                            {
                                icon: <Clock className="w-8 h-8" />,
                                title: "Fast Delivery",
                                description: "Most videos delivered within 7 days, with 24hr express option"
                            },
                            {
                                icon: <CheckCircle className="w-8 h-8" />,
                                title: "100% Authentic",
                                description: "Every video is personally recorded by the celebrity"
                            },
                            {
                                icon: <Share2 className="w-8 h-8" />,
                                title: "Easy Sharing",
                                description: "Download and share your video on all social platforms"
                            }
                        ].map((feature, index) => (
                            <div key={index} className="text-center group">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-secondary/10 to-primary/10 rounded-2xl flex items-center justify-center text-secondary group-hover:scale-110 transition mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                                <p className="text-foreground/60">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-secondary/10 via-transparent to-primary/10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-foreground mb-6">
                        Ready to Create Something Special?
                    </h2>
                    <p className="text-xl text-foreground/70 mb-8">
                        Join thousands of fans who've already created unforgettable memories.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            to="/browse"
                            className="px-8 py-4 bg-secondary text-primary font-semibold rounded-full hover:bg-secondary/90 transition text-lg"
                        >
                            Browse Celebrities
                        </Link>
                        <Link
                            to="/signup"
                            className="px-8 py-4 border-2 border-secondary text-secondary font-semibold rounded-full hover:bg-secondary/10 transition text-lg"
                        >
                            Sign Up Free
                        </Link>
                    </div>
                </div>
            </section>
        </main>
        </MainLayout>
    )
}