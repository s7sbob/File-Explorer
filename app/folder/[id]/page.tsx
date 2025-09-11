import { findFolder } from '@/lib/data';
import { CreateFolderButton } from '@/components/CreateFolderButton';
import { FolderList } from '@/components/FolderList';

interface Props {
  params: { id: string };
}

export default function FolderPage({ params }: Props) {
  const folder = findFolder(params.id);
  
  if (!folder) {
    return <p className="text-red-500">Folder not found</p>;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{folder.name}</h1>
        <CreateFolderButton folderId={params.id} />
      </div>
      {/* TODO: allow creating files */}
      <FolderList nodes={folder.children} />
    </div>
  );
}
