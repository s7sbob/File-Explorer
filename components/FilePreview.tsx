'use client';

import { useState } from 'react';

interface FilePreviewProps {
  fileName: string;
}

export function FilePreview({ fileName }: FilePreviewProps) {
  const [showPreview, setShowPreview] = useState(false);

  const getFileExtension = (name: string): string => {
    return name.split('.').pop()?.toLowerCase() || '';
  };

  const isImage = (extension: string): boolean => {
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension);
  };

  const isVideo = (extension: string): boolean => {
    return ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension);
  };

  const isAudio = (extension: string): boolean => {
    return ['mp3', 'wav', 'ogg', 'aac', 'm4a'].includes(extension);
  };

  const extension = getFileExtension(fileName);
  const fileUrl = `/${fileName}`; // Files are stored in public directory

  const handlePreview = () => {
    if (isImage(extension) || isVideo(extension) || isAudio(extension)) {
      setShowPreview(true);
    } else {
      // For other files, try to open in new tab
      window.open(fileUrl, '_blank');
    }
  };

  const renderPreviewContent = () => {
    if (isImage(extension)) {
      return (
        <img
          src={fileUrl}
          alt={fileName}
          className="max-w-full max-h-96 object-contain"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-image.svg';
          }}
        />
      );
    }

    if (isVideo(extension)) {
      return (
        <video
          controls
          className="max-w-full max-h-96"
          preload="metadata"
        >
          <source src={fileUrl} type={`video/${extension}`} />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (isAudio(extension)) {
      return (
        <div className="p-8">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">🎵</div>
            <div className="font-medium">{fileName}</div>
          </div>
          <audio
            controls
            className="w-full"
            preload="metadata"
          >
            <source src={fileUrl} type={`audio/${extension}`} />
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <button
        onClick={handlePreview}
        className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
      >
        Preview
      </button>

      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold truncate">{fileName}</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 flex justify-center">
              {renderPreviewContent()}
            </div>
            
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
              <a
                href={fileUrl}
                download={fileName}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Download
              </a>
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
