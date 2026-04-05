import Link from 'next/link';
import { StoryForm } from '@/components/admin/StoryForm';

export default function NewStoryPage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/stories" className="text-primary hover:text-primary/80 font-medium text-sm mb-4 inline-block">
          ← Back to Visual Stories
        </Link>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Create Visual Story</h1>
        <p className="text-muted-foreground">Publish a new swipeable visual story for the videos/web stories section.</p>
      </div>

      <StoryForm />
    </div>
  );
}
