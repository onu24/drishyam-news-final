import { SkeletonArticleDetail } from '@/components/ui/LoadingState';

export default function ArticleLoading() {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <SkeletonArticleDetail />
          </div>
          <div className="hidden lg:block lg:col-span-4 space-y-8">
            <div className="h-[400px] w-full bg-secondary/30 rounded-2xl animate-pulse" />
            <div className="h-[600px] w-full bg-secondary/30 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
