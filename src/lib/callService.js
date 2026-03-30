// src/services/callService.js
import { supabase } from '../lib/supabaseClient';

const DAILY_API_KEY = import.meta.env.VITE_DAILY_API_KEY;
const DAILY_API_URL = 'https://api.daily.co/v1';

export const createCallRoom = async (booking) => {
  try {
    console.log('Creating call room for booking:', booking.id);
    
    // Clean the booking ID to remove special characters for room name
    const cleanBookingId = booking.id.replace(/[^a-zA-Z0-9]/g, '');
    const roomName = `starconnect-${cleanBookingId}-${Date.now()}`;
    
    console.log('Room name:', roomName);
    
    const requestBody = {
      name: roomName,
      privacy: 'public', // Change from 'private' to 'public'
      properties: {
        exp: Math.floor(Date.now() / 1000) + 7200, // 2 hours expiry
        enable_recording: false,
        enable_knocking: false,
        start_audio_off: false,
        start_video_off: false,
        max_participants: 2, // Limit to fan and celebrity
        // Enable guests to join without authentication
        enable_network_ui: true,
        enable_prejoin_ui: true,
      },
    };
    
    const response = await fetch(`${DAILY_API_URL}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DAILY_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Daily.co API error details:', errorData);
      throw new Error(errorData.message || `Failed to create Daily.co room: ${response.status}`);
    }

    const room = await response.json();
    console.log('Daily.co room created successfully:', room);
    
    // Store in Supabase
    const { data: call, error } = await supabase
      .from('calls')
      .insert({
        booking_id: booking.id,
        room_url: room.url,
        room_name: room.name,
        daily_room_id: room.id,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    // Update booking with call_id
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ call_id: call.id })
      .eq('id', booking.id);

    if (updateError) {
      console.error('Supabase update error:', updateError);
      throw updateError;
    }

    console.log('Call room created and linked to booking:', call);
    return call;
  } catch (error) {
    console.error('Error creating call room:', error);
    throw error;
  }
};

// Function to manually create a call for existing bookings
export const createCallForExistingBooking = async (bookingId) => {
  try {
    console.log('Creating call for existing booking:', bookingId);
    
    // First, get the booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();
    
    if (bookingError) {
      console.error('Error fetching booking:', bookingError);
      return { success: false, error: 'Booking not found' };
    }
    
    // Check if call already exists
    if (booking.call_id) {
      console.log('Booking already has a call:', booking.call_id);
      return { success: false, error: 'Call room already exists for this booking' };
    }
    
    // Create the call room
    const call = await createCallRoom(booking);
    return { success: true, call };
  } catch (error) {
    console.error('Error creating call for existing booking:', error);
    return { success: false, error: error.message };
  }
};

export const getCallByBookingId = async (bookingId) => {
  const { data, error } = await supabase
    .from('calls')
    .select('*')
    .eq('booking_id', bookingId)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching call:', error);
    return null;
  }
  
  return data;
};

export const getCallById = async (callId) => {
  const { data, error } = await supabase
    .from('calls')
    .select('*')
    .eq('id', callId)
    .single();
  
  if (error) {
    console.error('Error fetching call:', error);
    return null;
  }
  
  return data;
};

export const endCall = async (callId) => {
  const { error } = await supabase
    .from('calls')
    .update({ 
      status: 'ended',
      ended_at: new Date().toISOString()
    })
    .eq('id', callId);
  
  if (error) {
    console.error('Error ending call:', error);
    throw error;
  }
};