import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { findFolder, saveToStorage } from '@/lib/data';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  
  
  
  try {
    const body = await req.json();
    const { name } = body;
    
    const parent = findFolder(params.id);
    
    
    if (!parent) {
      
      return NextResponse.json({ error: 'Parent folder not found' }, { status: 404 });
    }
    
    if (typeof name !== 'string' || !name.trim()) {
      
      return NextResponse.json({ error: 'Invalid folder name' }, { status: 400 });
    }
    
    // Create new folder
    const newFolder = {
      id: Date.now().toString(),
      name: name.trim(),
      type: 'folder' as const,
      children: [],
    };
    
    
    
    // **🔑 Add to singleton store**
    parent.children.push(newFolder);
    
    
    
    
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
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
