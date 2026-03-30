// src/pages/VideoCallPage.jsx (Optional - for instructions)
import { useLocation, useNavigate } from 'react-router-dom';
import { Video, ExternalLink, ArrowLeft } from 'lucide-react';

const VideoCallPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const roomUrl = location.state?.roomUrl;
  const celebrityName = location.state?.celebrityName || 'Celebrity';

  const handleJoinCall = () => {
    if (roomUrl) {
      window.open(roomUrl, '_blank');
      // Navigate back to dashboard after opening
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    }
  };

  if (!roomUrl) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">No Call Found</h2>
          <p className="text-gray-600 mb-6">This call room doesn't exist or has expired.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Video className="w-10 h-10 text-blue-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Ready to Connect?
          </h1>
          
          <p className="text-gray-600 mb-4">
            You're about to join a video call with <strong>{celebrityName}</strong>
          </p>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              📝 The call will open in a new tab. Make sure to:
            </p>
            <ul className="text-sm text-blue-700 mt-2 text-left list-disc list-inside">
              <li>Allow camera and microphone access</li>
              <li>Enter your name when prompted</li>
              <li>Click "Join" to start the call</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleJoinCall}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition font-medium"
            >
              <ExternalLink className="w-5 h-5" />
              Open Video Call
            </button>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCallPage;