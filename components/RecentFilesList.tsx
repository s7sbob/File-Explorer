import { FileIcon } from './FileIcon';
import { FilePreview } from './FilePreview';

interface RecentFile {
  id: string;
  name: string;
  folderId: string;
  folderName: string;
  uploadedAt: string;
  fileType: string;
}

interface RecentFilesListProps {
  files: RecentFile[];
}

export function RecentFilesList({ files }: RecentFilesListProps) {
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString();
  };

  const getFolderLink = (folderId: string): string => {
    return folderId === 'root' ? '/' : `/folder/${folderId}`;
  };

  return (
    <div className="space-y-3">
      {files.map((file) => (
        <div
          key={file.id}
          className="group p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="flex-shrink-0">
                <FileIcon fileName={file.name} className="w-8 h-8" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate text-sm lg:text-base">
                  {file.name}
                </h3>
                <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                  <span>in</span>
                  <a 
                    href={getFolderLink(file.folderId)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {file.folderName}
                  </a>
                  <span>•</span>
                  <span>{formatTimeAgo(file.uploadedAt)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <FilePreview fileName={file.name} />
              <a
                href={`/${file.name}`}
                download={file.name}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
