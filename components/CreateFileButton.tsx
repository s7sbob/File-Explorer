'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface CreateFileButtonProps {
  folderId: string;
}

export function CreateFileButton({ folderId }: CreateFileButtonProps) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customName, setCustomName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setCustomName(file.name);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    console.log('\n=== FILE UPLOAD DEBUG ===');
    console.log('Current pathname:', pathname);
    console.log('Folder ID:', folderId);
    console.log('Selected file:', selectedFile.name);
    console.log('API URL:', `/api/files/${folderId}`);

    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const fileName = customName.trim() || selectedFile.name;
      formData.append('name', fileName);

      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await fetch(`/api/files/${folderId}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (response.ok) {
        console.log('✅ Upload successful');
        router.refresh();
        handleClose();
      } else {
        console.log('❌ Upload failed:', result);
        setError(result.error || 'Failed to upload file');
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
    setCustomName('');
    setError(null);
  };

  const getFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="border px-3 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
        disabled={isLoading}
      >
        + File
      </button>
      
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg min-w-96">
            <h3 className="text-lg font-semibold mb-4">Upload New File</h3>
            
            {/* Debug Info */}
            <div className="mb-4 p-2 bg-blue-50 rounded text-xs text-blue-700">
              <strong>Debug:</strong><br />
              Folder ID: {folderId}<br />
              Path: {pathname}
            </div>
            
            {/* Error Display */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}
            
            {/* File Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select File
              </label>
              <input
                type="file"
                onChange={handleFileSelect}
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
                accept="*/*"
              />
            </div>

            {/* File Info */}
            {selectedFile && (
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">
                  <p><strong>Original:</strong> {selectedFile.name}</p>
                  <p><strong>Size:</strong> {getFileSize(selectedFile.size)}</p>
                  <p><strong>Type:</strong> {selectedFile.type || 'Unknown'}</p>
                </div>
              </div>
            )}

            {/* Custom Name Input */}
            {selectedFile && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter custom filename"
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to use original filename
                </p>
              </div>
            )}
            
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50"
                disabled={isLoading || !selectedFile}
              >
                {isLoading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
