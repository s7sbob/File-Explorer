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

export const root: FolderNode = {
  id: "root",
  name: "My Files",
  type: "folder",
  children: [
    { id: "folder-1", name: "Documents", type: "folder", children: [] },
    { id: "folder-2", name: "Images", type: "folder", children: [] },
  ],
};

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
 * Returns an array of folder objects representing the breadcrumb path
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
