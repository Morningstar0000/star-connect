import axios from 'axios';
import { mockCelebrities } from './mockData';

const API_NINJAS_KEY = import.meta.env.VITE_API_NINJAS_KEY;
const BASE_URL = 'https://api.api-ninjas.com/v1/celebrity';

// Create axios instance with default config
const apiNinjasClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-Api-Key': API_NINJAS_KEY
  },
  timeout: 10000
});

// Cache for API results to reduce calls
const apiCache = new Map();

/**
 * Search celebrities by name
 */
export async function searchCelebritiesByName(name, limit = 30) {
  if (!name || name.length < 2) return [];
  
  const cacheKey = `name_${name}_${limit}`;
  
  // Check cache first
  if (apiCache.has(cacheKey)) {
    console.log('Returning cached results for:', name);
    return apiCache.get(cacheKey);
  }
  
  try {
    const response = await apiNinjasClient.get('/', {
      params: { name, limit }
    });
    
    const results = response.data;
    apiCache.set(cacheKey, results);
    
    // Clear cache after 1 hour
    setTimeout(() => apiCache.delete(cacheKey), 60 * 60 * 1000);
    
    return results;
  } catch (error) {
    console.error('API Ninjas error:', error.response?.data || error.message);
    return [];
  }
}

/**
 * Get all celebrities (with pagination)
 */
export async function getAllCelebrities(offset = 0, limit = 30) {
  const cacheKey = `all_${offset}_${limit}`;
  
  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }
  
  try {
    // Note: API Ninjas doesn't have a "get all" endpoint
    // You'd need to search by popular names or use mock data
    const popularNames = ['Chris', 'Emma', 'Tom', 'Will', 'Angelina', 'Brad'];
    const randomName = popularNames[Math.floor(Math.random() * popularNames.length)];
    
    const response = await apiNinjasClient.get('/', {
      params: { name: randomName, limit }
    });
    
    apiCache.set(cacheKey, response.data);
    setTimeout(() => apiCache.delete(cacheKey), 60 * 60 * 1000);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching celebrities:', error);
    return [];
  }
}

/**
 * Get celebrity by exact name
 */
export async function getCelebrityByName(name) {
  const results = await searchCelebritiesByName(name, 1);
  return results[0] || null;
}

/**
 * Search with mock data fallback
 * This combines API results with your mock data
 */
export async function searchWithFallback(searchTerm) {
  // First, search in mock data
  const mockResults = mockCelebrities.filter(celeb => 
    celeb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    celeb.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Then search in API
  const apiResults = await searchCelebritiesByName(searchTerm);
  
  // Transform API results to match your app's format
  const transformedApiResults = apiResults.map(apiCeleb => ({
    id: `api_${apiCeleb.name.replace(/\s+/g, '_').toLowerCase()}`,
    name: apiCeleb.name,
    category: apiCeleb.occupation?.[0] || 'Celebrity',
    image: getCelebrityImage(apiCeleb.name), // You'll need an image service
    coverImage: getCelebrityCoverImage(apiCeleb.name),
    rating: (4 + Math.random() * 0.9).toFixed(1), // Random rating between 4-5
    totalReviews: Math.floor(Math.random() * 200) + 50,
    pricePerMinute: Math.floor(Math.random() * 200) + 100,
    shoutoutPrice: Math.floor(Math.random() * 300) + 200,
    bio: `${apiCeleb.name} is a ${apiCeleb.occupation?.join(', ') || 'celebrity'} from ${apiCeleb.nationality || 'the world'}. Born in ${apiCeleb.birthday || 'unknown'}.`,
    netWorth: apiCeleb.net_worth,
    nationality: apiCeleb.nationality,
    birthday: apiCeleb.birthday,
    gender: apiCeleb.gender,
    source: 'api'
  }));
  
  // Combine results (remove duplicates)
  const combined = [...mockResults, ...transformedApiResults];
  const uniqueNames = new Set();
  
  return combined.filter(celeb => {
    if (uniqueNames.has(celeb.name.toLowerCase())) {
      return false;
    }
    uniqueNames.add(celeb.name.toLowerCase());
    return true;
  });
}

/**
 * Helper function to get celebrity images
 * You can use a service like Unsplash or placeholder images
 */
function getCelebrityImage(name) {
  // For now, return a placeholder
  // Later you can integrate with an image API
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=7C3AED&color=fff`;
}

function getCelebrityCoverImage(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=1200&background=4F46E5&color=fff`;
}

/**
 * Get popular celebrities (for homepage)
 */
export async function getPopularCelebrities(limit = 12) {
  // Start with mock data
  let popular = [...mockCelebrities];
  
  // Try to get some from API
  try {
    const popularNames = ['Tom Cruise', 'Emma Watson', 'Dwayne Johnson', 'Taylor Swift', 'Leonardo DiCaprio'];
    const promises = popularNames.map(name => getCelebrityByName(name));
    const apiResults = await Promise.all(promises);
    
    const validApiResults = apiResults
      .filter(result => result !== null)
      .map(apiCeleb => ({
        id: `api_${apiCeleb.name.replace(/\s+/g, '_').toLowerCase()}`,
        name: apiCeleb.name,
        category: apiCeleb.occupation?.[0] || 'Celebrity',
        image: getCelebrityImage(apiCeleb.name),
        rating: (4 + Math.random() * 0.9).toFixed(1),
        totalReviews: Math.floor(Math.random() * 200) + 50,
        pricePerMinute: Math.floor(Math.random() * 200) + 100,
        shoutoutPrice: Math.floor(Math.random() * 300) + 200,
        bio: `${apiCeleb.name} is a ${apiCeleb.occupation?.join(', ') || 'celebrity'}.`,
        source: 'api'
      }));
    
    popular = [...popular, ...validApiResults];
  } catch (error) {
    console.error('Error fetching popular celebrities:', error);
  }
  
  // Remove duplicates and return
  const uniqueNames = new Set();
  return popular
    .filter(celeb => {
      if (uniqueNames.has(celeb.name.toLowerCase())) return false;
      uniqueNames.add(celeb.name.toLowerCase());
      return true;
    })
    .slice(0, limit);
}