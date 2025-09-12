'use client';

import { useEffect, useState } from 'react';
import { EmptyState } from '@/components/EmptyState';
import { RecentFilesList } from '@/components/RecentFilesList';

interface RecentFile {
  id: string;
  name: string;
  folderId: string;
  folderName: string;
  uploadedAt: string;
  fileType: string;
}

interface RecentFilesResponse {
  success: boolean;
  files: RecentFile[];
  count: number;
}

export default function RecentPage() {
  const [files, setFiles] = useState<RecentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentFiles = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/recent', {
          cache: 'no-store' // Always get fresh data
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch recent files');
        }
        
        const data: RecentFilesResponse = await response.json();
        setFiles(data.files);
      } catch (err) {
        console.error('Error fetching recent files:', err);
        setError('Failed to load recent files');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentFiles();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Recent Files</h1>
          <p className="text-gray-500 mt-1">Files you've uploaded recently</p>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2 text-gray-500">
            <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Loading recent files...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Recent Files</h1>
          <p className="text-gray-500 mt-1">Files you've uploaded recently</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Recent Files</h1>
          <p className="text-gray-500 mt-1">
            {files.length === 0 
              ? "No recent files yet" 
              : `${files.length} recent ${files.length === 1 ? 'file' : 'files'}`
            }
          </p>
        </div>
        
        {files.length > 0 && (
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        )}
      </div>
      
      {files.length === 0 ? (
        <EmptyState 
          title="No recent files"
          description="Files you upload will appear here for quick access"
          icon="🕒"
        />
      ) : (
        <RecentFilesList files={files} />
      )}
    </div>
  );
}
