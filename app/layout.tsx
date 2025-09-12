import type { ReactNode } from 'react';
import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'File Explorer',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="h-full bg-gray-50">
        <div className="h-full flex flex-col lg:flex-row">
          {/* Mobile Header */}
          <header className="lg:hidden bg-white border-b border-gray-200 p-4">
            <h1 className="text-xl font-bold text-gray-900">File Explorer</h1>
          </header>

          {/* Sidebar */}
          <aside className="lg:w-64 bg-white border-r border-gray-200 lg:flex-shrink-0">
            <div className="h-full overflow-y-auto">
              <div className="p-4">
                <h1 className="hidden lg:block text-xl font-bold text-gray-900 mb-6">
                  File Explorer
                </h1>
                
                <nav className="space-y-2">
                  <Link 
                    href="/" 
                    className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                    <span className="font-medium">My Files</span>
                  </Link>
                  
                  <Link 
                    href="/recent" 
                    className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Recent Files</span>
                  </Link>
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="h-full p-4 lg:p-6 max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
