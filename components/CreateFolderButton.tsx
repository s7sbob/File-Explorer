'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CreateFolderButtonProps {
  folderId: string;
}

export function CreateFolderButton({ folderId }: CreateFolderButtonProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/folders/${folderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      });
      
      if (response.ok) {
        router.refresh();
        setOpen(false);
        setName('');
      } else {
        // Handle error (could add toast notification here)
        console.error('Failed to create folder');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="border px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        disabled={isLoading}
      >
        + Folder
      </button>
      
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg min-w-80">
            <h3 className="text-lg font-semibold mb-4">Create New Folder</h3>
            
            <input
              autoFocus
              type="text"
              placeholder="Folder name"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
            
            <div className="flex gap-2 justify-end mt-4">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setName('');
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
                disabled={isLoading || !name.trim()}
              >
                {isLoading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
