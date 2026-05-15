import { SkeletonArticleCard } from '@/components/ui/LoadingState';

export default function LatestLoading() {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          <div className="flex flex-col items-center text-center space-y-4">
             <div className="h-10 w-64 bg-secondary rounded animate-pulse" />
             <div className="h-4 w-96 bg-secondary/60 rounded animate-pulse" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, i) => (
              <SkeletonArticleCard key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
