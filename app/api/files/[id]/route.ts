import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { findFolder, addToRecentFiles, getFileExtension } from '@/lib/data';
import { writeFile, mkdir } from 'fs/promises';
import { join, basename } from 'path';

export const runtime = 'nodejs';

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
      error: 'Invalid request: missing parent or file' 
    }, { status: 400 });
  }

  // Decide filename: prefer 'name' field, fallback to uploaded file's original name
  const rawName = (providedName && providedName.trim()) ? providedName.trim() : file.name;
  const safeName = basename(rawName);
  
  if (!safeName) {
    return NextResponse.json({ error: 'Invalid file name' }, { status: 400 });
  }
  
  const publicDir = join(process.cwd(), 'public');
  const filePath = join(publicDir, safeName);

  try {
    // Ensure public directory exists and create the file
    await mkdir(publicDir, { recursive: true });
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes), { flag: 'wx' });
  } catch (err: any) {
    if (err && typeof err === 'object' && 'code' in err && (err as any).code === 'EEXIST') {
      return NextResponse.json({ error: 'File already exists in public folder' }, { status: 409 });
    }
    console.error('Failed to create file in public folder:', err);
    return NextResponse.json({ error: 'Failed to create file' }, { status: 500 });
  }

  // Create new file ID
  const newFileId = Date.now().toString();

  // Update in-memory structure after successful file creation
  parent.children.push({
    id: newFileId,
    name: safeName,
    type: 'file',
  });

  // Add to recent files
  addToRecentFiles({
    id: newFileId,
    name: safeName,
    folderId: params.id,
    folderName: parent.name,
    fileType: getFileExtension(safeName)
  });
  
  revalidatePath('/');
  revalidatePath(`/folder/${params.id}`);
  revalidatePath('/recent'); // Revalidate recent files page
  
  return NextResponse.json({ success: true });
}
