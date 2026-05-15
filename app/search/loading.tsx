import { SkeletonList } from '@/components/ui/LoadingState';

export default function SearchLoading() {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="h-10 w-full bg-secondary rounded-xl animate-pulse" />
          <div className="h-4 w-48 bg-secondary/60 rounded animate-pulse" />
          <SkeletonList />
        </div>
      </div>
    </div>
  );
}
