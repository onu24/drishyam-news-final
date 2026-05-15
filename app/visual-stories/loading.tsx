import { SkeletonStoryCard } from '@/components/ui/LoadingState';

export default function VisualStoriesLoading() {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="h-10 w-64 bg-secondary rounded animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {[...Array(10)].map((_, i) => (
              <SkeletonStoryCard key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
