import Link from 'next/link';
import { getAllVisualStories } from '@/lib/dashboard';
import { StoryTable } from '@/components/admin/StoryTable';

export const revalidate = 0;

export default async function StoriesPage() {
  const stories = await getAllVisualStories();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Visual Stories</h1>
          <p className="text-muted-foreground">Create and manage swipeable web stories for the frontend.</p>
        </div>
        <Link
          href="/admin/stories/new"
          className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors shadow-sm"
        >
          + New Visual Story
        </Link>
      </div>

      <StoryTable initialStories={stories} />
    </div>
  );
}
