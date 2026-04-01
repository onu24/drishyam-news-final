import { notFound } from 'next/navigation';
import { getVisualStoryBySlug } from '@/lib/data';
import { StoryViewer } from '@/components/article/StoryViewer';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const story = await getVisualStoryBySlug(slug);
  if (!story) return { title: 'Story Not Found' };

  return {
    title: `${story.title} | Visual Stories | Drishyam News`,
    description: story.slides[0]?.caption || story.title,
    openGraph: {
      title: story.title,
      description: story.slides[0]?.caption || story.title,
      images: [story.coverImage],
    },
  };
}

export default async function VisualStoryPage({ params }: PageProps) {
  const { slug } = await params;
  const story = await getVisualStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black">
      <StoryViewer story={story} />
    </div>
  );
}
