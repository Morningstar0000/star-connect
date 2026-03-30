import { useState } from 'react'
import { X, Save, Image as ImageIcon } from 'lucide-react'
import { createCelebrity, updateCelebrity } from '@/lib/celebrityService'

export default function CelebrityForm({ celebrity, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: celebrity?.name || '',
        category: celebrity?.category || 'Actor',
        image: celebrity?.image || '',
        cover_image: celebrity?.cover_image || '',
        rating: celebrity?.rating || 4.5,
        total_reviews: celebrity?.total_reviews || 0,
        price_per_minute: celebrity?.price_per_minute || 100,
        shoutout_price: celebrity?.shoutout_price || 200,
        bio: celebrity?.bio || '',
        tags: celebrity?.tags?.join(', ') || '',
        availability: celebrity?.availability || 'Available'
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const categories = ['Actor', 'Musician', 'Athlete', 'Comedian', 'Influencer']

    const validate = () => {
        const newErrors = {}
        if (!formData.name.trim()) newErrors.name = 'Name is required'
        if (!formData.category) newErrors.category = 'Category is required'
        if (!formData.price_per_minute) newErrors.price_per_minute = 'Price per minute is required'
        if (!formData.shoutout_price) newErrors.shoutout_price = 'Shoutout price is required'
        if (formData.price_per_minute < 0) newErrors.price_per_minute = 'Price must be positive'
        if (formData.shoutout_price < 0) newErrors.shoutout_price = 'Price must be positive'
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
  setErrors({})
  
  try {
    // Prepare data for database
    const dataToSave = {
      name: formData.name.trim(),
      category: formData.category,
      image: formData.image || null,
      cover_image: formData.cover_image || null,
      rating: parseFloat(formData.rating) || 4.5,
      total_reviews: parseInt(formData.total_reviews) || 0,
      price_per_minute: parseInt(formData.price_per_minute) || 100,
      shoutout_price: parseInt(formData.shoutout_price) || 200,
      bio: formData.bio || null,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      availability: formData.availability || 'Available'
    }

    console.log('Saving celebrity data:', dataToSave)

    let result
    if (celebrity) {
      // Update existing celebrity
      result = await updateCelebrity(celebrity.id, dataToSave)
      console.log('Update result:', result)
    } else {
      // Create new celebrity
      result = await createCelebrity(dataToSave)
      console.log('Create result:', result)
    }
    
    // Call onSuccess FIRST before showing alert
    // This will trigger the parent to refresh the list
    onSuccess()
    
    // Short delay to ensure state updates
    setTimeout(() => {
      alert(celebrity ? 'Celebrity updated successfully!' : 'Celebrity created successfully!')
    }, 100)
    
  } catch (error) {
    console.error('Error saving celebrity:', error)
    
    if (error.message) {
      alert(`Failed to save celebrity: ${error.message}`)
    } else {
      alert('Failed to save celebrity. Please check the console for details.')
    }
    setLoading(false) // Only set loading false on error
  }
}

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">
                        {celebrity ? 'Edit Celebrity' : 'Add New Celebrity'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 ${errors.name ? 'border-red-500' : 'border-gray-200'
                                    }`}
                            />
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category *
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Profile Image URL
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
                            />
                            {formData.image && (
                                <img src={formData.image} alt="Preview" className="w-10 h-10 rounded-full object-cover" />
                            )}
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price per Minute ($) *
                            </label>
                            <input
                                type="number"
                                value={formData.price_per_minute}
                                onChange={(e) => setFormData({ ...formData, price_per_minute: parseInt(e.target.value) })}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 ${errors.price_per_minute ? 'border-red-500' : 'border-gray-200'
                                    }`}
                            />
                            {errors.price_per_minute && <p className="text-xs text-red-500 mt-1">{errors.price_per_minute}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Shoutout Price ($) *
                            </label>
                            <input
                                type="number"
                                value={formData.shoutout_price}
                                onChange={(e) => setFormData({ ...formData, shoutout_price: parseInt(e.target.value) })}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 ${errors.shoutout_price ? 'border-red-500' : 'border-gray-200'
                                    }`}
                            />
                            {errors.shoutout_price && <p className="text-xs text-red-500 mt-1">{errors.shoutout_price}</p>}
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Rating (0-5)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                value={formData.rating}
                                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Total Reviews
                            </label>
                            <input
                                type="number"
                                value={formData.total_reviews}
                                onChange={(e) => setFormData({ ...formData, total_reviews: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tags (comma separated)
                        </label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            placeholder="Movies, Action, Comedy"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bio
                        </label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
                            placeholder="Write a short biography..."
                        />
                    </div>

                    {/* Availability */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Availability
                        </label>
                        <select
                            value={formData.availability}
                            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20"
                        >
                            <option value="Available">Available</option>
                            <option value="Limited">Limited</option>
                            <option value="Booked">Booked</option>
                            <option value="Unavailable">Unavailable</option>
                        </select>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {loading ? 'Saving...' : celebrity ? 'Update Celebrity' : 'Create Celebrity'}
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