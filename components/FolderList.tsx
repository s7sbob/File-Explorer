import Link from 'next/link';
import type { FolderNode, FileNode } from '@/lib/data';
import { FileIcon } from './FileIcon';
import { FilePreview } from './FilePreview';
import { EmptyState } from './EmptyState';

export function FolderList({ nodes }: { nodes: Array<FolderNode | FileNode> }) {
  if (!nodes.length) {
    return <EmptyState />;
  }

  const folders = nodes.filter((node): node is FolderNode => node.type === 'folder');
  const files = nodes.filter((node): node is FileNode => node.type === 'file');

  return (
    <div className="space-y-8">
      {/* Folders Section */}
      {folders.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Folders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {folders.map((folder) => (
              <Link
                key={folder.id}
                href={`/folder/${folder.id}`}
                className="group p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="text-blue-500 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-200">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                  </div>
                  <div className="w-full">
                    <p className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {folder.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {folder.children.length} {folder.children.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Files Section */}
      {files.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Files</h2>
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
                      <p className="text-xs text-gray-500 mt-1">
                        {file.name.split('.').pop()?.toUpperCase()} file
                      </p>
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
        </section>
      )}
    </div>
  );
}
