import { getMongoDb } from '@/lib/mongodb';
import { notFound, redirect } from 'next/navigation';

export const revalidate = 0; // Short link redirects should be fresh

export default async function ShortLinkPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  try {
    const db = await getMongoDb();
    
    // 1. Try finding in articles
    const articleDoc = await db.collection('articles').findOne({ shortId: code });
    if (articleDoc) {
      redirect(`/article/${articleDoc.slug}`);
    }
    
    // 2. Try finding in visual stories
    const storyDoc = await db.collection('visualStories').findOne({ shortId: code });
    if (storyDoc) {
      redirect(`/visual-stories/${storyDoc.slug}`);
    }

    notFound();
  } catch (error) {
    console.error(`[ShortLink] Error resolving code ${code}:`, error);
    notFound();
  }
}
