import Link from 'next/link';

interface BackButtonProps {
  parentId: string | null;
}

export function BackButton({ parentId }: BackButtonProps) {
  if (!parentId) return null;
  
  const href = parentId === 'root' ? '/' : `/folder/${parentId}`;
  
  return (
    <Link
      href={href}
      className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
    >
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Back to parent folder
    </Link>
  );
}
