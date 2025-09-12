export type FileNode = {
  id: string;
  name: string;
  type: "file";
};

export type FolderNode = {
  id: string;
  name: string;
  type: "folder";
  children: Array<FolderNode | FileNode>;
};

export type RecentFile = {
  id: string;
  name: string;
  folderId: string;
  folderName: string;
  uploadedAt: Date;
  fileType: string;
};

export const root: FolderNode = {
  id: "root",
  name: "My Files",
  type: "folder",
  children: [
    { id: "folder-1", name: "Documents", type: "folder", children: [] },
    { id: "folder-2", name: "Images", type: "folder", children: [] },
  ],
};

// In-memory recent files storage (max 20 files)
export const recentFiles: RecentFile[] = [];
const MAX_RECENT_FILES = 20;

export function findFolder(
  id: string,
  current: FolderNode = root
): FolderNode | null {
  if (current.id === id) return current;
  for (const child of current.children) {
    if (child.type === "folder") {
      const result = findFolder(id, child);
      if (result) return result;
    }
  }
  return null;
}

/**
 * Find the path from root to the specified folder
 */
export function findFolderPath(
  targetId: string,
  current: FolderNode = root,
  path: FolderNode[] = []
): FolderNode[] | null {
  const currentPath = [...path, current];
  
  if (current.id === targetId) {
    return currentPath;
  }
  
  for (const child of current.children) {
    if (child.type === "folder") {
      const result = findFolderPath(targetId, child, currentPath);
      if (result) return result;
    }
  }
  
  return null;
}

/**
 * Get the parent folder ID for a given folder
 */
export function getParentFolderId(
  targetId: string,
  current: FolderNode = root,
  parentId: string | null = null
): string | null {
  if (current.id === targetId) {
    return parentId;
  }
  
  for (const child of current.children) {
    if (child.type === "folder") {
      const result = getParentFolderId(targetId, child, current.id);
      if (result !== null) return result;
    }
  }
  
  return null;
}

/**
 * Add a file to the recent files list
 */
export function addToRecentFiles(fileData: Omit<RecentFile, 'uploadedAt'>) {
  // Remove if already exists (to avoid duplicates)
  const existingIndex = recentFiles.findIndex(file => file.id === fileData.id);
  if (existingIndex >= 0) {
    recentFiles.splice(existingIndex, 1);
  }
  
  // Add to the beginning
  recentFiles.unshift({
    ...fileData,
    uploadedAt: new Date()
  });
  
  // Keep only the latest files (max limit)
  if (recentFiles.length > MAX_RECENT_FILES) {
    recentFiles.splice(MAX_RECENT_FILES);
  }
}

/**
 * Get all recent files
 */
export function getRecentFiles(): RecentFile[] {
  return [...recentFiles]; // Return a copy
}

/**
 * Get file extension from filename
 */
export function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() || '';
}
