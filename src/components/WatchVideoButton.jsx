// src/components/WatchVideoButton.jsx
import { useState, useRef } from 'react';
import { Play, Loader2, X, Download, Maximize2 } from 'lucide-react';

const WatchVideoButton = ({ booking }) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);
  const modalContentRef = useRef(null);

  const hasVideo = booking?.shoutout_video_url && booking?.shoutout_video_status === 'uploaded';

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  const handleVideoError = () => {
    setVideoError(true);
    setIsLoading(false);
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleDownload = async () => {
    try {
      // Fetch the video as a blob
      const response = await fetch(booking.shoutout_video_url);
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Create a filename from celebrity name and date
      const fileName = `shoutout-${booking.celebrity_name.replace(/\s/g, '-')}-${new Date().toISOString().split('T')[0]}.mp4`;
      link.download = fileName;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open(booking.shoutout_video_url, '_blank');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsLoading(true);
    setVideoError(false);
  };

  if (!hasVideo) {
    return (
      <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
        <Play className="w-4 h-4" />
        <span className="text-sm">Video being prepared</span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <Play className="w-4 h-4" />
        Watch Shoutout Video
      </button>

      {/* Video Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div 
            ref={modalContentRef}
            className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Shoutout from {booking.celebrity_name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Your personalized video message
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Video Container */}
            <div className="p-6 flex-1 overflow-auto">
              {videoError ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <Play className="w-8 h-8 text-red-600" />
                  </div>
                  <p className="text-gray-600 mb-2">Unable to load video</p>
                  <p className="text-sm text-gray-500">Please try again later or contact support.</p>
                  <a
                    href={booking.shoutout_video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Try opening directly
                  </a>
                </div>
              ) : (
                <div className="relative bg-black rounded-lg overflow-hidden">
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                      <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
                    </div>
                  )}
                  <video
                    ref={videoRef}
                    controls
                    autoPlay
                    className="w-full h-auto max-h-[70vh] object-contain"
                    onLoadedData={handleVideoLoad}
                    onError={handleVideoError}
                    style={{ display: isLoading ? 'none' : 'block' }}
                  >
                    <source src={booking.shoutout_video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              
              {/* Video Info and Actions */}
              {!videoError && (
                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-purple-800">
                      🎉 This is your special shoutout video from {booking.celebrity_name}! 
                      Feel free to download and share it with friends and family.
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleFullscreen}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <Maximize2 className="w-4 h-4" />
                      Full Screen
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Video
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WatchVideoButton;