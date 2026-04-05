import Link from 'next/link';
import { StoryForm } from '@/components/admin/StoryForm';
import { getVisualStoryById } from '@/lib/dashboard';

export default async function EditStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const story = await getVisualStoryById(id);

  if (!story) {
    return (
      <div>
        <Link href="/admin/stories" className="text-primary hover:text-primary/80 font-medium text-sm mb-4 inline-block">
          ← Back to Visual Stories
        </Link>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm">
          Visual story not found
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/stories" className="text-primary hover:text-primary/80 font-medium text-sm mb-4 inline-block">
          ← Back to Visual Stories
        </Link>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Edit Visual Story</h1>
        <p className="text-muted-foreground">Update the story details and slide sequence below.</p>
      </div>

      <StoryForm story={story} />
    </div>
  );
}
