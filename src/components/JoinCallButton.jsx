// src/components/JoinCallButton.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Clock, AlertCircle, Loader2, ExternalLink } from 'lucide-react';

const JoinCallButton = ({ booking, call }) => {
  const navigate = useNavigate();
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinCall = () => {
    if (!call?.room_url) {
      console.error('No room URL available');
      alert('Call room not ready yet. Please try again later.');
      return;
    }
    
    setIsJoining(true);
    console.log('Opening call room in new tab:', call.room_url);
    
    // Open the Daily.co room in a new tab
    window.open(call.room_url, '_blank');
    
    // Reset joining state after a moment
    setTimeout(() => {
      setIsJoining(false);
    }, 1000);
  };

  // Check if this is a video call service type
  const isVideoCallService = booking?.service_type?.toLowerCase() === 'videocall';
  
  // Check if call is ready
  const isCallReady = call?.status === 'active' && call?.room_url;
  const isBookingConfirmed = booking?.status === 'confirmed';
  
  // Only show button for video call service type
  if (!isVideoCallService) {
    return null; // Don't show anything for shoutout bookings
  }
  
  if (!isBookingConfirmed) {
    return (
      <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-3 py-2 rounded-md">
        <Clock className="w-4 h-4" />
        <span className="text-sm">Waiting for confirmation</span>
      </div>
    );
  }

  if (!isCallReady) {
    return (
      <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm">Call room being prepared</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleJoinCall}
      disabled={isJoining}
      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
    >
      {isJoining ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <ExternalLink className="w-4 h-4" />
      )}
      {isJoining ? 'Opening...' : 'Join Video Call'}
    </button>
  );
};

export default JoinCallButton;