// src/components/ShoutoutVideoUpload.jsx
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Upload, Video, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const ShoutoutVideoUpload = ({ booking, onVideoUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleVideoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Please upload a valid video file (MP4, MOV, etc.)');
      return;
    }

    // Validate file size (max 500MB)
    if (file.size > 500 * 1024 * 1024) {
      setError('Video file must be less than 500MB');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `shoutout-${booking.id}-${Date.now()}.${fileExt}`;
      const filePath = `shoutout-videos/${fileName}`;

      console.log('Uploading video to:', filePath);
      console.log('File size:', file.size, 'bytes');
      console.log('File type:', file.type);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('shoutout-videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('shoutout-videos')
        .getPublicUrl(filePath);

      const videoUrl = urlData.publicUrl;
      console.log('Video URL:', videoUrl);

      // Update booking with video URL
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          shoutout_video_url: videoUrl,
          shoutout_video_uploaded_at: new Date().toISOString(),
          shoutout_video_status: 'uploaded',
        })
        .eq('id', booking.id);

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      setSuccess(true);
      
      // Notify parent component
      if (onVideoUploaded) {
        onVideoUploaded({
          ...booking,
          shoutout_video_url: videoUrl,
          shoutout_video_status: 'uploaded',
        });
      }

      // Reset after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Error uploading video:', error);
      
      // Provide user-friendly error message
      if (error.message?.includes('row-level security policy')) {
        setError('Permission denied. Please contact the administrator to set up storage policies.');
      } else if (error.message?.includes('bucket')) {
        setError('Storage bucket not found. Please contact the administrator.');
      } else {
        setError(error.message || 'Failed to upload video. Please try again.');
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const hasVideo = booking.shoutout_video_url && booking.shoutout_video_status === 'uploaded';

  return (
    <div className="space-y-4">
      {hasVideo ? (
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Video Uploaded</span>
          </div>
          <p className="text-sm text-green-600 mb-3">
            Shoutout video has been uploaded and is ready for the fan.
          </p>
          <button
            onClick={() => window.open(booking.shoutout_video_url, '_blank')}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
          >
            <Video className="w-4 h-4" />
            Preview Video
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            disabled={uploading}
            className="hidden"
            id={`video-upload-${booking.id}`}
          />
          <label
            htmlFor={`video-upload-${booking.id}`}
            className="cursor-pointer block"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                {uploading ? (
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-700">
                  {uploading ? 'Uploading...' : 'Upload Shoutout Video'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  MP4, MOV, or AVI (max 500MB)
                </p>
              </div>
              {uploading && uploadProgress > 0 && (
                <div className="w-full max-w-xs">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 rounded-full h-2 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round(uploadProgress)}% uploaded
                  </p>
                </div>
              )}
              {error && (
                <div className="mt-2 p-2 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              {success && (
                <p className="text-sm text-green-600 mt-2">Video uploaded successfully!</p>
              )}
            </div>
          </label>
        </div>
      )}
    </div>
  );
};

export default ShoutoutVideoUpload;