import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { findFolder, saveToStorage } from '@/lib/data';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  console.log('\n=== FOLDER CREATION API DEBUG ===');
  console.log('Target parent folder ID:', params.id);
  
  try {
    const body = await req.json();
    const { name } = body;
    
    const parent = findFolder(params.id);
    console.log('Parent folder found:', parent ? `${parent.name} (${parent.id})` : 'null');
    
    if (!parent) {
      console.log('❌ ERROR: Parent folder not found');
      return NextResponse.json({ error: 'Parent folder not found' }, { status: 404 });
    }
    
    if (typeof name !== 'string' || !name.trim()) {
      console.log('❌ ERROR: Invalid folder name');
      return NextResponse.json({ error: 'Invalid folder name' }, { status: 400 });
    }
    
    // Create new folder
    const newFolder = {
      id: Date.now().toString(),
      name: name.trim(),
      type: 'folder' as const,
      children: [],
    };
    
    console.log('New folder created:', newFolder);
    
    // **🔑 Add to singleton store**
    parent.children.push(newFolder);
    
    console.log('✅ Folder created successfully');
    console.log('Parent children count:', parent.children.length);
    
    // Save to persistent storage
    saveToStorage();
    
    revalidatePath('/');
    revalidatePath(`/folder/${params.id}`);
    
    return NextResponse.json({ 
      success: true, 
      newFolder,
      parentId: params.id,
      parentName: parent.name
    });
    
  } catch (error) {
    console.log('❌ ERROR in folder creation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
