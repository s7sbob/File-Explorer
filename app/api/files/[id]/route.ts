import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { findFolder, addToRecentFiles, getFileExtension, saveToStorage } from '@/lib/data';
import { writeFile, mkdir, access, constants } from 'fs/promises';
import { join, basename, extname } from 'path';

export const runtime = 'nodejs';

/**
 * Generate unique filename if file already exists
 */
async function generateUniqueFilename(directory: string, originalName: string): Promise<string> {
  const ext = extname(originalName);
  const nameWithoutExt = basename(originalName, ext);
  
  let uniqueName = originalName;
  let counter = 1;
  
  while (true) {
    try {
      const filePath = join(directory, uniqueName);
      await access(filePath, constants.F_OK);
      // File exists, try next number
      uniqueName = `${nameWithoutExt} (${counter})${ext}`;
      counter++;
    } catch {
      // File doesn't exist, we can use this name
      break;
    }
  }
  
  return uniqueName;
}

/**
 * Check if filename exists in the specific folder's children
 */
function isFilenameUsedInFolder(folder: any, filename: string): boolean {
  return folder.children.some((child: any) => 
    child.type === 'file' && child.name === filename
  );
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  
  
  
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const providedName = formData.get('name')?.toString();
  
  
  
  
  const parent = findFolder(params.id);
  
  
  if (!parent || !file) {
    
    return NextResponse.json({ 
      error: 'Invalid request: missing parent or file',
      debug: {
        folderId: params.id,
        parentFound: !!parent,
        fileFound: !!file
      }
    }, { status: 400 });
  }

  // Decide base filename
  const requestedName = (providedName && providedName.trim()) ? providedName.trim() : file.name;
  const safeName = basename(requestedName);
  
  if (!safeName) {
    return NextResponse.json({ error: 'Invalid file name' }, { status: 400 });
  }
  
  const publicDir = join(process.cwd(), 'public');
  
  try {
    // Ensure public directory exists
    await mkdir(publicDir, { recursive: true });
    
    // 🔑 Generate unique filename to avoid conflicts
    const uniqueFileName = await generateUniqueFilename(publicDir, safeName);
    const filePath = join(publicDir, uniqueFileName);
    
    
    
    
    
    // Save file with unique name
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));
    
    
    
  } catch (err: any) {
    console.error('❌ Failed to save file:', err);
    return NextResponse.json({ error: 'Failed to save file' }, { status: 500 });
  }

  // Create new file ID
  const newFileId = Date.now().toString();

  // 🔑 Check if filename is used in THIS specific folder
  let finalDisplayName = safeName;
  let counter = 1;
  
  while (isFilenameUsedInFolder(parent, finalDisplayName)) {
    const ext = extname(safeName);
    const nameWithoutExt = basename(safeName, ext);
    finalDisplayName = `${nameWithoutExt} (${counter})${ext}`;
    counter++;
  }
  
  

  // Update singleton store with display name
  parent.children.push({
    id: newFileId,
    name: finalDisplayName, // This is what user sees in the folder
    type: 'file',
  });

  // Add to recent files
  addToRecentFiles({
    id: newFileId,
    name: finalDisplayName,
    folderId: params.id,
    folderName: parent.name,
    fileType: getFileExtension(finalDisplayName)
  });
  
  
  
  
  // Save to persistent storage
  saveToStorage();
  
  revalidatePath('/');
  revalidatePath(`/folder/${params.id}`);
  revalidatePath('/recent');
  
  return NextResponse.json({ 
    success: true,
    displayName: finalDisplayName,
    actualFileName: await generateUniqueFilename(publicDir, safeName)
  });
}
