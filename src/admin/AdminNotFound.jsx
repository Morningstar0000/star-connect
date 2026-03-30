import { Link } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'

export default function AdminNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center max-w-md">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-6">
          The admin page you're looking for doesn't exist or is still under construction.
        </p>
        <div className="space-y-3">
          <Link
            to="/admin"
            className="block w-full px-6 py-3 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition font-medium"
          >
            Back to Admin Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="block w-full px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}