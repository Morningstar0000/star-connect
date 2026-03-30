import { supabase } from './supabaseClient'

// Get all active payment methods
export async function getActivePaymentMethods() {
  const { data, error } = await supabase
    .from('payment_method')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  
  if (error) throw error
  return data
}

// Get all payment methods (admin only)
export async function getAllPaymentMethods() {
  const { data, error } = await supabase
    .from('payment_method')
    .select('*')
    .order('sort_order')
  
  if (error) throw error
  return data
}

// Get payment methods by type
export async function getPaymentMethodsByType(type) {
  const { data, error } = await supabase
    .from('payment_method')
    .select('*')
    .eq('method_type', type)
    .eq('is_active', true)
    .order('sort_order')
  
  if (error) throw error
  return data
}

// Get single payment method by ID
export async function getPaymentMethodById(id) {
  const { data, error } = await supabase
    .from('payment_method')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

// Get payment method by method_id
export async function getPaymentMethodByMethodId(methodId) {
  const { data, error } = await supabase
    .from('payment_method')
    .select('*')
    .eq('method_id', methodId)
    .single()
  
  if (error) throw error
  return data
}

// Create new payment method (admin only)
export async function createPaymentMethod(methodData) {
  const { data, error } = await supabase
    .from('payment_method')
    .insert([methodData])
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Update payment method (admin only)
export async function updatePaymentMethod(id, methodData) {
  const { data, error } = await supabase
    .from('payment_method')
    .update(methodData)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// In paymentService.js
export async function togglePaymentMethodStatus(id, isActive) {
  const { data, error } = await supabase
    .from('payment_method')
    .update({ is_active: isActive })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error toggling payment method status:', error)
    throw error
  }
  
  return data
}

// Delete payment method (soft delete by deactivating)
export async function deletePaymentMethod(id) {
  const { data, error } = await supabase
    .from('payment_method')
    .update({ is_active: false })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}