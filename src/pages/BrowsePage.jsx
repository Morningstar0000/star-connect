import { useState, useEffect } from 'react'
import CelebrityCard from '@/components/CelebrityCard'
import { 
  getAllCelebrities, 
  getCelebritiesByCategory,
  searchCelebrities 
} from '@/lib/celebrityService'
import * as Select from '@radix-ui/react-select'
import { Search, Loader2, X } from 'lucide-react'
import MainLayout from '../components/MainLayout'

// Categories for filtering
const CATEGORIES = ['All', 'Actor', 'Musician', 'Athlete', 'Comedian', 'Influencer']

export default function BrowsePage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('rating')
  const [searchTerm, setSearchTerm] = useState('')
  const [celebrities, setCelebrities] = useState([])
  const [loading, setLoading] = useState(true)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Load all celebrities on mount
  useEffect(() => {
    loadAllCelebrities()
  }, [])

  // Real-time search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        performSearch()
      } else {
        // If search is empty, load based on category
        if (selectedCategory === 'All') {
          loadAllCelebrities()
        } else {
          loadCelebritiesByCategory(selectedCategory)
        }
        setSuggestions([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, selectedCategory])

  const loadAllCelebrities = async () => {
    setLoading(true)
    try {
      const data = await getAllCelebrities()
      setCelebrities(data || [])
    } catch (error) {
      console.error('Error loading celebrities:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCelebritiesByCategory = async (category) => {
    setLoading(true)
    try {
      const data = await getCelebritiesByCategory(category)
      setCelebrities(data || [])
    } catch (error) {
      console.error('Error loading celebrities by category:', error)
    } finally {
      setLoading(false)
    }
  }

  const performSearch = async () => {
    setLoading(true)
    
    try {
      // Get search results from Supabase
      const results = await searchCelebrities(searchTerm)
      
      // Filter by category if needed
      let filteredResults = results
      if (selectedCategory !== 'All') {
        filteredResults = results.filter(c => c.category === selectedCategory)
      }
      
      setCelebrities(filteredResults)
      
      // Generate suggestions based on search term
      const allCelebs = await getAllCelebrities()
      const suggestionResults = allCelebs
        .filter(celeb => 
          celeb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          celeb.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (celeb.tags && celeb.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
        )
        .slice(0, 5)
        .map(celeb => ({
          id: celeb.id,
          name: celeb.name,
          category: celeb.category,
          image: celeb.image
        }))
      
      setSuggestions(suggestionResults)
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setShowSuggestions(true)
  }

  const handleSuggestionClick = (celebrity) => {
    setSearchTerm(celebrity.name)
    setShowSuggestions(false)
    performSearch()
  }

  const clearSearch = () => {
    setSearchTerm('')
    setShowSuggestions(false)
    if (selectedCategory === 'All') {
      loadAllCelebrities()
    } else {
      loadCelebritiesByCategory(selectedCategory)
    }
  }

  // Filter and sort
  const getFilteredCelebrities = () => {
    let filtered = [...celebrities]

    // Apply sorting
    if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price_per_minute - b.price_per_minute)
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price_per_minute - a.price_per_minute)
    } else if (sortBy === 'reviews') {
      filtered.sort((a, b) => b.total_reviews - a.total_reviews)
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    return filtered
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    if (category === 'All') {
      if (searchTerm.trim()) {
        performSearch()
      } else {
        loadAllCelebrities()
      }
    } else {
      if (searchTerm.trim()) {
        performSearch()
      } else {
        loadCelebritiesByCategory(category)
      }
    }
  }

  const handleClearFilters = () => {
    setSelectedCategory('All')
    setSortBy('rating')
    setSearchTerm('')
    setShowSuggestions(false)
    loadAllCelebrities()
  }

  const filteredCelebrities = getFilteredCelebrities()

  if (loading && celebrities.length === 0) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Browse Celebrities
            </h1>
            {/* <p className="text-lg text-foreground/60">
              {filteredCelebrities.length} celebrities available to book
            </p> */}
          </div>

          {/* Search Bar with Autocomplete */}
          <div className="mb-8 relative">
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => {
                    setTimeout(() => setShowSuggestions(false), 200)
                  }}
                  placeholder="Search for a celebrity by name, category, or tag..."
                  className="w-full px-4 py-3 pl-12 pr-10 border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-foreground/40 w-5 h-5" />
                
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/40 hover:text-foreground/60"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </form>

            {/* Autocomplete Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted transition text-left"
                    onClick={() => handleSuggestionClick(suggestion)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      <img 
                        src={suggestion.image} 
                        alt={suggestion.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(suggestion.name)}&size=40&background=7C3AED&color=fff`;
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{suggestion.name}</p>
                      <p className="text-sm text-foreground/60">{suggestion.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6 sticky top-20">
                {/* Category Filter */}
                <div>
                  <h3 className="font-bold mb-4 text-foreground">Category</h3>
                  <div className="space-y-2">
                    {CATEGORIES.map(category => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`block w-full text-left px-4 py-2 rounded-lg transition ${
                          selectedCategory === category
                            ? 'bg-secondary text-primary font-semibold'
                            : 'hover:bg-muted text-foreground/70'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>


                {/* Clear Filters */}
                {(selectedCategory !== 'All' || searchTerm || sortBy !== 'rating') && (
                  <button
                    onClick={handleClearFilters}
                    className="w-full px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>

            {/* Celebrity Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                </div>
              ) : filteredCelebrities.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredCelebrities.map(celebrity => (
                    <CelebrityCard key={celebrity.id} celebrity={celebrity} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-muted/30 rounded-lg">
                  <p className="text-lg text-foreground/60 mb-4">
                    No celebrities found matching your search or filters.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  )
}