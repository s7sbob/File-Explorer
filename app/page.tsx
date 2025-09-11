import { findFolder } from '@/lib/data';
import { CreateFolderButton } from '@/components/CreateFolderButton';
import { CreateFileButton } from '@/components/CreateFileButton';
import { FolderList } from '@/components/FolderList';

export default function Home() {
  const folder = findFolder('root');
  
  if (!folder) {
    return <p className="text-red-500">Root folder not found</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Files</h1>
        <div className="flex gap-2">
          <CreateFolderButton folderId="root" />
          <CreateFileButton folderId="root" />
        </div>
      </div>
      <FolderList nodes={folder.children} />
    </div>
  );
}
