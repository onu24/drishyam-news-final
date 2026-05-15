import { SkeletonArticleCard } from '@/components/ui/LoadingState';

export default function CategoryLoading() {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Category Header Skeleton */}
          <div className="space-y-4">
            <div className="h-10 w-48 bg-secondary rounded animate-pulse" />
            <div className="h-4 w-96 bg-secondary/60 rounded animate-pulse" />
          </div>
          
          <hr className="border-border/50" />

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <SkeletonArticleCard key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
