interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: string;
}

export function EmptyState({ 
  title = "This folder is empty",
  description = "Use the buttons above to add folders or files",
  icon = "📁"
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 lg:py-16">
      <div className="text-6xl lg:text-8xl mb-4">{icon}</div>
      <h3 className="text-lg lg:text-xl font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm lg:text-base text-gray-500 max-w-md mx-auto">{description}</p>
    </div>
  );
}
