import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'

export default function BookingConfirmationPage() {
  return (
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Booking Submitted!</h1>
          <p className="text-lg text-foreground/70 mb-6">
            Your booking has been successfully submitted and is now pending confirmation.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-blue-800">
              <strong className="block mb-2">📧 What's next?</strong>
              We'll notify the celebrity of your booking. You'll receive a confirmation email once they accept. You can track your booking status in your dashboard.
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Link
              to="/dashboard"
              className="px-6 py-2 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition"
            >
              View My Bookings
            </Link>
            <Link
              to="/browse"
              className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition"
            >
              Browse More Celebrities
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}