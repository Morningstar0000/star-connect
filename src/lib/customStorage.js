// src/lib/customStorage.js
// Custom storage adapter to avoid lock issues
export const customStorage = {
  getItem: (key) => {
    try {
      const value = localStorage.getItem(key)
      return value
    } catch (error) {
      console.error('Storage get error:', error)
      return null
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.error('Storage set error:', error)
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Storage remove error:', error)
    }
  }
}