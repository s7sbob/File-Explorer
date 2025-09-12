import { findFolder, findFolderPath, getParentFolderId } from '@/lib/data';
import { ActionButtons } from '@/components/ActionButtons';
import { FolderList } from '@/components/FolderList';
import { Breadcrumb } from '@/components/Breadcrumb';
import { BackButton } from '@/components/BackButton';

interface Props {
  params: { id: string };
}

export default function FolderPage({ params }: Props) {
  const folder = findFolder(params.id);
  
  if (!folder) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500 text-xl">Folder not found</p>
          <p className="text-gray-500 mt-2">The requested folder does not exist</p>
        </div>
      </div>
    );
  }
  
  const path = findFolderPath(params.id) || [];
  const parentId = getParentFolderId(params.id);
  
  return (
    <div className="space-y-6">
      <Breadcrumb path={path} />
      <BackButton parentId={parentId} />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{folder.name}</h1>
          <p className="text-gray-500 mt-1">
            {folder.children.length} {folder.children.length === 1 ? 'item' : 'items'}
          </p>
        </div>
        {/* ✅ المهم: التأكد من params.id */}
        <ActionButtons folderId={params.id} />
      </div>
      
      <FolderList nodes={folder.children} />
    </div>
  );
}
