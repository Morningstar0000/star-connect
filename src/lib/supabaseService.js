import { supabase } from './supabaseClient'

// Profile functions
export const createProfile = async (userId, userData) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([{ id: userId, ...userData }])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

// Booking functions
export const createBooking = async (bookingData) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert([bookingData])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getUserBookings = async (userId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const getGuestBookings = async (email) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('guest_email', email)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const updateBookingStatus = async (bookingId, status) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Wishlist functions
export const addToWishlist = async (userId, celebrity) => {
  const { data, error } = await supabase
    .from('wishlists')
    .insert([{
      user_id: userId,
      celebrity_id: celebrity.id,
      celebrity_name: celebrity.name
    }])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const removeFromWishlist = async (userId, celebrityId) => {
  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('user_id', userId)
    .eq('celebrity_id', celebrityId)
  
  if (error) throw error
}

export const getWishlist = async (userId) => {
  const { data, error } = await supabase
    .from('wishlists')
    .select('*')
    .eq('user_id', userId)
  
  if (error) throw error
  return data
}

export const isInWishlist = async (userId, celebrityId) => {
  const { data, error } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', userId)
    .eq('celebrity_id', celebrityId)
    .maybeSingle()
  
  if (error) throw error
  return !!data
}