import { EmptyState } from '@/components/EmptyState';

export default function RecentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Recent Files</h1>
        <p className="text-gray-500 mt-1">Files you've accessed recently</p>
      </div>
      
      <EmptyState 
        title="No recent files"
        description="Files you access will appear here for quick access"
        icon="🕒"
      />
    </div>
  );
}
