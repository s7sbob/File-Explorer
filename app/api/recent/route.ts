import { NextResponse } from 'next/server';
import { getRecentFiles } from '@/lib/data';

export async function GET() {
  try {
    const recentFiles = getRecentFiles();
    
    // Convert dates to ISO strings for JSON serialization
    const serializedFiles = recentFiles.map(file => ({
      ...file,
      uploadedAt: file.uploadedAt.toISOString()
    }));
    
    return NextResponse.json({
      success: true,
      files: serializedFiles,
      count: serializedFiles.length
    });
  } catch (error) {
    console.error('Error fetching recent files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent files' }, 
      { status: 500 }
    );
  }
}
