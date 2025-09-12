import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { findFolder, addToRecentFiles, getFileExtension, saveToStorage } from '@/lib/data';
import { writeFile, mkdir } from 'fs/promises';
import { join, basename } from 'path';

export const runtime = 'nodejs';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  console.log('\n=== FILE UPLOAD API DEBUG ===');
  console.log('Folder ID from params:', params.id);
  
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const providedName = formData.get('name')?.toString();
  
  console.log('File received:', file ? file.name : 'null');
  console.log('Provided name:', providedName);
  
  const parent = findFolder(params.id);
  console.log('Parent folder found:', parent ? `${parent.name} (${parent.id})` : 'null');
  
  if (!parent || !file) {
    console.log('❌ ERROR: Missing parent or file');
    console.log('Parent exists:', !!parent);
    console.log('File exists:', !!file);
    return NextResponse.json({ 
      error: 'Invalid request: missing parent or file',
      debug: {
        folderId: params.id,
        parentFound: !!parent,
        fileFound: !!file
      }
    }, { status: 400 });
  }

  // Decide filename
  const rawName = (providedName && providedName.trim()) ? providedName.trim() : file.name;
  const safeName = basename(rawName);
  
  if (!safeName) {
    return NextResponse.json({ error: 'Invalid file name' }, { status: 400 });
  }
  
  const publicDir = join(process.cwd(), 'public');
  const filePath = join(publicDir, safeName);

  try {
    // Create file in public directory
    await mkdir(publicDir, { recursive: true });
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes), { flag: 'wx' });
  } catch (err: any) {
    if (err && typeof err === 'object' && 'code' in err && err.code === 'EEXIST') {
      return NextResponse.json({ error: 'File already exists' }, { status: 409 });
    }
    console.error('Failed to create file:', err);
    return NextResponse.json({ error: 'Failed to create file' }, { status: 500 });
  }

  // Create new file ID
  const newFileId = Date.now().toString();

  // **🔑 Update singleton store**
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
  
  console.log('✅ File uploaded successfully:', safeName);
  console.log('Parent children count:', parent.children.length);
  
  // Save to persistent storage
  saveToStorage();
  
  revalidatePath('/');
  revalidatePath(`/folder/${params.id}`);
  revalidatePath('/recent');
  
  return NextResponse.json({ success: true });
}
