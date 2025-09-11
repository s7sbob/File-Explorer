import Link from 'next/link';
import { FolderNode } from '@/lib/data';

interface BreadcrumbProps {
  path: FolderNode[];
}

export function Breadcrumb({ path }: BreadcrumbProps) {
  if (path.length === 0) return null;

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-600 mb-4">
      {path.map((folder, index) => {
        const isLast = index === path.length - 1;
        const href = folder.id === 'root' ? '/' : `/folder/${folder.id}`;
        
        return (
          <div key={folder.id} className="flex items-center">
            {index > 0 && (
              <svg
                className="w-4 h-4 mx-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
            
            {isLast ? (
              <span className="font-medium text-gray-900">{folder.name}</span>
            ) : (
              <Link
                href={href}
                className="hover:text-blue-600 transition-colors font-medium"
              >
                {folder.name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
