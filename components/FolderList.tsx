import Link from 'next/link';
import type { FolderNode, FileNode } from '@/lib/data';
import { FileIcon } from './FileIcon';
import { FilePreview } from './FilePreview';

export function FolderList({ nodes }: { nodes: Array<FolderNode | FileNode> }) {
  if (!nodes.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-4xl mb-4">📁</div>
        <p className="text-lg">This folder is empty</p>
        <p className="text-sm">Use the buttons above to add folders or files</p>
      </div>
    );
  }

  const folders = nodes.filter((node): node is FolderNode => node.type === 'folder');
  const files = nodes.filter((node): node is FileNode => node.type === 'file');

  return (
    <div className="space-y-6">
      {/* Folders Section */}
      {folders.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">Folders</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {folders.map((folder) => (
              <Link
                key={folder.id}
                href={`/folder/${folder.id}`}
                className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-white"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-blue-500 group-hover:text-blue-600">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate group-hover:text-blue-600">
                      {folder.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {folder.children.length} items
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Files Section */}
      {files.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">Files</h3>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="group p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 bg-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <FileIcon fileName={file.name} className="w-6 h-6 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {file.name.split('.').pop()?.toUpperCase()} file
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FilePreview fileName={file.name} />
                    <a
                      href={`/${file.name}`}
                      download={file.name}
                      className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
