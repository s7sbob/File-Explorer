import { findFolder, findFolderPath } from '@/lib/data';
import { ActionButtons } from '@/components/ActionButtons';
import { FolderList } from '@/components/FolderList';
import { Breadcrumb } from '@/components/Breadcrumb';

export default function Home() {
  const folder = findFolder('root');
  
  if (!folder) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500 text-xl">Root folder not found</p>
          <p className="text-gray-500 mt-2">Please check your data configuration</p>
        </div>
      </div>
    );
  }

  const path = findFolderPath('root') || [];

  return (
    <div className="space-y-6">
      <Breadcrumb path={path} />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">My Files</h1>
          <p className="text-gray-500 mt-1">
            {folder.children.length} {folder.children.length === 1 ? 'item' : 'items'}
          </p>
        </div>
        <ActionButtons folderId="root" />
      </div>
      
      <FolderList nodes={folder.children} />
    </div>
  );
}
