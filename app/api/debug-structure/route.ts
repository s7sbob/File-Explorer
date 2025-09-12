import { NextResponse } from 'next/server';
import { store } from '@/lib/data';

function printStructure(node: any, indent = '') {
  console.log(`${indent}📁 ${node.name} (ID: ${node.id})`);
  if (node.children) {
    node.children.forEach((child: any) => {
      if (child.type === 'folder') {
        printStructure(child, indent + '  ');
      } else {
        console.log(`${indent}  📄 ${child.name} (ID: ${child.id})`);
      }
    });
  }
}

export async function GET() {
  console.log('\n=== SINGLETON STORE STRUCTURE ===');
  printStructure(store.root);
  console.log('Recent files count:', store.recentFiles.length);
  console.log('================================\n');
  
  return NextResponse.json({ 
    message: 'Check console for structure',
    timestamp: new Date().toISOString(),
    rootStructure: store.root,
    recentFilesCount: store.recentFiles.length
  });
}
