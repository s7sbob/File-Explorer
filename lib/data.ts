import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

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

interface StorageData {
  root: FolderNode;
  recentFiles: RecentFile[];
  lastSaved: string;
}

const STORAGE_FILE = join(process.cwd(), '.fileexplorer-storage.json');
const MAX_RECENT_FILES = 20;

// **🔑 Singleton Pattern - يضمن نفس البيانات عبر كل الـ API routes**
let globalForStorage: any;

if (typeof globalThis !== 'undefined') {
  globalForStorage = globalThis;
} else if (typeof global !== 'undefined') {  
  globalForStorage = global;
} else {
  globalForStorage = {};
}

// Initialize singleton store
if (!globalForStorage.__FILE_EXPLORER_SINGLETON__) {
  console.log('🚀 Initializing singleton file explorer store...');
  
  const defaultRoot: FolderNode = {
    id: "root",
    name: "My Files",
    type: "folder",
    children: [
      { id: "folder-1", name: "Documents", type: "folder", children: [] },
      { id: "folder-2", name: "Images", type: "folder", children: [] },
    ],
  };

  // Try to load from file, fallback to defaults
  let initialData: StorageData | null = null;
  
  try {
    if (existsSync(STORAGE_FILE)) {
      const fileContent = readFileSync(STORAGE_FILE, 'utf-8');
      initialData = JSON.parse(fileContent);
      
      // Convert date strings back to Date objects
      if (initialData?.recentFiles) {
        initialData.recentFiles = initialData.recentFiles.map((file: any) => ({
          ...file,
          uploadedAt: new Date(file.uploadedAt)
        }));
      }
      console.log('✅ Loaded data from storage file');
    }
  } catch (error) {
    console.error('❌ Failed to load storage file:', error);
    initialData = null;
  }
  
  globalForStorage.__FILE_EXPLORER_SINGLETON__ = {
    root: initialData?.root || defaultRoot,
    recentFiles: initialData?.recentFiles || [],
  };
}

// Export the singleton store
export const store = globalForStorage.__FILE_EXPLORER_SINGLETON__;

// Persistence functions
export function saveToStorage() {
  try {
    const data: StorageData = {
      root: store.root,
      recentFiles: store.recentFiles.map((file: RecentFile) => ({
        ...file,
        uploadedAt: file.uploadedAt instanceof Date ? file.uploadedAt : new Date(file.uploadedAt)
      })),
      lastSaved: new Date().toISOString()
    };
    
    writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2));
    console.log('💾 Data saved to storage file');
  } catch (error) {
    console.error('❌ Failed to save data:', error);
  }
}

// Utility functions
export function findFolder(id: string, current: FolderNode = store.root): FolderNode | null {
  if (current.id === id) return current;
  for (const child of current.children) {
    if (child.type === "folder") {
      const result = findFolder(id, child);
      if (result) return result;
    }
  }
  return null;
}

export function findFolderPath(targetId: string, current: FolderNode = store.root, path: FolderNode[] = []): FolderNode[] | null {
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

export function getParentFolderId(targetId: string, current: FolderNode = store.root, parentId: string | null = null): string | null {
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

export function addToRecentFiles(fileData: Omit<RecentFile, 'uploadedAt'>) {
  // Remove if already exists (to avoid duplicates)
  const existingIndex = store.recentFiles.findIndex((file: RecentFile) => file.id === fileData.id);
  if (existingIndex >= 0) {
    store.recentFiles.splice(existingIndex, 1);
  }
  
  // Add to the beginning
  store.recentFiles.unshift({
    ...fileData,
    uploadedAt: new Date()
  });
  
  // Keep only the latest files (max limit)
  if (store.recentFiles.length > MAX_RECENT_FILES) {
    store.recentFiles.splice(MAX_RECENT_FILES);
  }
  
  // Save to file
  saveToStorage();
}

export function getRecentFiles(): RecentFile[] {
  return [...store.recentFiles]; // Return a copy
}

export function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() || '';
}
