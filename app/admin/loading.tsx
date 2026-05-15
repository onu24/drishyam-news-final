import { LoadingState } from '@/components/ui/LoadingState';

export default function AdminLoading() {
  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
           <div className="h-8 w-64 bg-secondary rounded animate-pulse" />
           <div className="h-10 w-32 bg-secondary rounded animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[...Array(4)].map((_, i) => (
             <div key={i} className="h-32 w-full bg-secondary/50 rounded-xl animate-pulse" />
           ))}
        </div>

        <div className="h-[600px] w-full bg-secondary/20 rounded-2xl animate-pulse border border-border/40" />
      </div>
      
      <div className="fixed bottom-12 right-12">
        <LoadingState fullPage={false} message="Updating Workspace..." />
      </div>
    </div>
  );
}
