import { ALL_CELEBRITIES } from './mockData';

// Categories for filtering
export const CATEGORIES = ['All', 'Actor', 'Musician', 'Athlete', 'Comedian', 'Influencer'];

// Payment methods (you can keep these)
export const PAYMENT_METHODS = [
  { id: 1, type: 'Bank Transfer', name: 'Chase Bank ****1234', last4: '1234' },
  { id: 2, type: 'PayPal', name: 'paypal@example.com', last4: null },
  { id: 3, type: 'Cash App', name: '$username', last4: null },
  { id: 4, type: 'Venmo', name: '@username', last4: null },
  { id: 5, type: 'Crypto', name: 'Bitcoin Wallet', last4: 'abc123' },
];

// Utility to get celebrity by ID (works with both number and string IDs)
export function getCelebrityById(id) {
  const searchId = typeof id === 'string' ? parseInt(id) : id;
  return ALL_CELEBRITIES.find(c => c.id === searchId);
}

// Get all celebrities
export function getAllCelebrities() {
  return ALL_CELEBRITIES;
}

// Get celebrities by category
export function getCelebritiesByCategory(category) {
  if (category === 'All') return ALL_CELEBRITIES;
  return ALL_CELEBRITIES.filter(c => c.category === category);
}

// Search celebrities
export function searchCelebrities(query) {
  const searchTerm = query.toLowerCase();
  return ALL_CELEBRITIES.filter(celeb => 
    celeb.name.toLowerCase().includes(searchTerm) ||
    celeb.category.toLowerCase().includes(searchTerm) ||
    celeb.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}

// Utility to get bookings from localStorage
export function getBookings(userId) {
  const bookings = localStorage.getItem(`starconnect_bookings_${userId}`);
  return bookings ? JSON.parse(bookings) : [];
}

// Utility to save booking
export function saveBooking(userId, booking) {
  const bookings = getBookings(userId);
  const newBooking = {
    id: Date.now(),
    ...booking,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };
  bookings.push(newBooking);
  localStorage.setItem(`starconnect_bookings_${userId}`, JSON.stringify(bookings));
  return newBooking;
}

// Utility to update booking status
export function updateBookingStatus(userId, bookingId, status) {
  const bookings = getBookings(userId);
  const updatedBookings = bookings.map(booking => 
    booking.id === bookingId ? { ...booking, status } : booking
  );
  localStorage.setItem(`starconnect_bookings_${userId}`, JSON.stringify(updatedBookings));
  return updatedBookings;
}

// Utility to get wishlist
export function getWishlist(userId) {
  const wishlist = localStorage.getItem(`starconnect_wishlist_${userId}`);
  return wishlist ? JSON.parse(wishlist) : [];
}

// Utility to toggle wishlist
export function toggleWishlist(userId, celebrityId) {
  const wishlist = getWishlist(userId);
  const index = wishlist.findIndex(id => id === celebrityId);
  
  if (index > -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push(celebrityId);
  }
  
  localStorage.setItem(`starconnect_wishlist_${userId}`, JSON.stringify(wishlist));
  return wishlist;
}

// Utility to check if celebrity is in wishlist
export function isInWishlist(userId, celebrityId) {
  const wishlist = getWishlist(userId);
  return wishlist.includes(celebrityId);
}

// Format price
export function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Get popular celebrities (top rated)
export function getPopularCelebrities(limit = 10) {
  return [...ALL_CELEBRITIES]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

// Get celebrities by tag
export function getCelebritiesByTag(tag) {
  return ALL_CELEBRITIES.filter(celeb => 
    celeb.tags?.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}