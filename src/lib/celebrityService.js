import { supabase } from './supabaseClient'

// Get all celebrities
export async function getAllCelebrities() {
  const { data, error } = await supabase
    .from('celebrities')
    .select('*')
    .order('name')
  
  if (error) {
    console.error('Error fetching celebrities:', error)
    throw error
  }
  return data
}

// Get single celebrity by ID
export async function getCelebrityById(id) {
  const { data, error } = await supabase
    .from('celebrities')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching celebrity:', error)
    throw error
  }
  return data
}

// Create new celebrity
export async function createCelebrity(celebrityData) {
  console.log('Creating celebrity with data:', celebrityData)
  
  const { data, error } = await supabase
    .from('celebrities')
    .insert([celebrityData])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating celebrity:', error)
    throw error
  }
  console.log('Celebrity created:', data)
  return data
}

// Update celebrity
export async function updateCelebrity(id, celebrityData) {
  console.log('Updating celebrity ID:', id)
  console.log('Update data:', celebrityData)
  
  const { data, error } = await supabase
    .from('celebrities')
    .update(celebrityData)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating celebrity:', error)
    throw error
  }
  console.log('Celebrity updated:', data)
  return data
}

// Delete celebrity
export async function deleteCelebrity(id) {
  console.log('Deleting celebrity ID:', id)
  
  const { error } = await supabase
    .from('celebrities')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting celebrity:', error)
    throw error
  }
  console.log('Celebrity deleted successfully')
  return true
}

// Import mock data to Supabase
export async function importMockCelebrities(mockData) {
  console.log('Importing mock data, count:', mockData.length)
  
  const { data, error } = await supabase
    .from('celebrities')
    .insert(mockData)
    .select()
  
  if (error) {
    console.error('Error importing mock data:', error)
    throw error
  }
  console.log('Import successful:', data.length, 'celebrities added')
  return data
}

// Get celebrities by category
export async function getCelebritiesByCategory(category) {
  const { data, error } = await supabase
    .from('celebrities')
    .select('*')
    .eq('category', category)
    .order('name')
  
  if (error) {
    console.error('Error fetching celebrities by category:', error)
    throw error
  }
  return data || []
}

// Search celebrities
export async function searchCelebrities(searchTerm) {
  const { data, error } = await supabase
    .from('celebrities')
    .select('*')
    .or(`name.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
    .order('name')
  
  if (error) {
    console.error('Error searching celebrities:', error)
    throw error
  }
  return data || []
}