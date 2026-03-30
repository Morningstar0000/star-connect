import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Star, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react'
import { getAllCelebrities, deleteCelebrity, importMockCelebrities } from '@/lib/celebrityService'
import CelebrityForm from './CelebrityForm'
import ALL_CELEBRITIES from '@/lib/mockData'  // FIXED IMPORT

export default function AdminCelebritiesPage() {
  const [celebrities, setCelebrities] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingCelebrity, setEditingCelebrity] = useState(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importing, setImporting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    loadCelebrities()
  }, [])

  const loadCelebrities = async () => {
    try {
      const data = await getAllCelebrities()
      setCelebrities(data || [])
    } catch (error) {
      console.error('Error loading celebrities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this celebrity?')) return
    
    try {
      await deleteCelebrity(id)
      await loadCelebrities()
    } catch (error) {
      console.error('Error deleting celebrity:', error)
      alert('Failed to delete celebrity')
    }
  }

  const handleEdit = (celebrity) => {
    setEditingCelebrity(celebrity)
    setShowForm(true)
  }
  
  const handleFormSuccess = async () => {
  // Close the form modal
  setShowForm(false)
  setEditingCelebrity(null)
  
  // Reload the celebrities list
  setLoading(true)
  try {
    await loadCelebrities()
  } catch (error) {
    console.error('Error reloading celebrities:', error)
  } finally {
    setLoading(false)
  }
}

  const handleImportMockData = async () => {
    setImporting(true)
    try {
      // Transform mock data to match database schema
      const dataToImport = ALL_CELEBRITIES.map(mock => ({
        name: mock.name,
        category: mock.category,
        image: mock.image,
        cover_image: mock.coverImage,
        rating: mock.rating,
        total_reviews: mock.totalReviews,
        price_per_minute: mock.pricePerMinute,
        shoutout_price: mock.shoutoutPrice,
        bio: mock.bio,
        tags: mock.tags,
        availability: mock.availability
      }))
      
      await importMockCelebrities(dataToImport)
      await loadCelebrities()
      setShowImportModal(false)
      alert('Mock data imported successfully!')
    } catch (error) {
      console.error('Error importing mock data:', error)
      alert('Failed to import mock data')
    } finally {
      setImporting(false)
    }
  }

  // Filter celebrities based on search
  const filteredCelebrities = celebrities.filter(celeb =>
    celeb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    celeb.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    celeb.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Pagination
  const totalPages = Math.ceil(filteredCelebrities.length / itemsPerPage)
  const paginatedCelebrities = filteredCelebrities.slice(
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
            <h1 className="text-2xl font-bold text-gray-900">Celebrity Management</h1>
            <p className="text-gray-600 mt-1">Add, edit, or manage celebrities in the database</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
          >
            <Star className="w-4 h-4" />
            Import Mock Data
          </button>
          <button
            onClick={() => {
              setEditingCelebrity(null)
              setShowForm(true)
            }}
            className="px-4 py-2 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Celebrity
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, category, or tags..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
          />
        </div>
      </div>

      {/* Celebrities Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Celebrity</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Category</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Price/Min</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Shoutout</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Rating</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCelebrities.map((celebrity) => (
              <tr key={celebrity.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={celebrity.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(celebrity.name)}&size=40&background=7C3AED&color=fff`}
                      alt={celebrity.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{celebrity.name}</p>
                      <p className="text-xs text-gray-500">{celebrity.tags?.slice(0, 2).join(', ')}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">{celebrity.category}</td>
                <td className="p-4 font-semibold">${celebrity.price_per_minute}</td>
                <td className="p-4 font-semibold">${celebrity.shoutout_price}</td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{celebrity.rating}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    celebrity.availability === 'Available' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {celebrity.availability}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(celebrity)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(celebrity.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCelebrities.length)} of {filteredCelebrities.length} celebrities
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 border border-gray-200 rounded-lg">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Celebrity Form Modal */}
      {showForm && (
        <CelebrityForm
          celebrity={editingCelebrity}
          onClose={() => {
            setShowForm(false)
            setEditingCelebrity(null)
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Import Mock Data Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Import Mock Data</h2>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">
              This will import {ALL_CELEBRITIES.length} celebrities from the mock data into your database. 
              This action will not delete existing celebrities.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> Make sure you don't create duplicate entries. Check existing celebrities before importing.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleImportMockData}
                disabled={importing}
                className="flex-1 px-4 py-2 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition disabled:opacity-50"
              >
                {importing ? 'Importing...' : 'Import Data'}
              </button>
              <button
                onClick={() => setShowImportModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}