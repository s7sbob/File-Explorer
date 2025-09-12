import { CreateFolderButton } from './CreateFolderButton';
import { CreateFileButton } from './CreateFileButton';

interface ActionButtonsProps {
  folderId: string;
}

export function ActionButtons({ folderId }: ActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <CreateFolderButton folderId={folderId} />
      <CreateFileButton folderId={folderId} />
    </div>
  );
}
