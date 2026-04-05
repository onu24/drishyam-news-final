'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { VisualStory } from '@/lib/types';
import { deleteVisualStoryAction } from '@/lib/actions/dashboard-actions';

interface StoryTableProps {
  initialStories: VisualStory[];
}

export function StoryTable({ initialStories }: StoryTableProps) {
  const [stories, setStories] = useState(initialStories);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm('Are you sure you want to permanently delete this visual story?')) return;

    setDeletingId(id);
    try {
      const result = await deleteVisualStoryAction(id);
      if (!result.success) {
        throw new Error(result.error || 'Delete failed');
      }
      setStories((prev) => prev.filter((story) => story.id !== id));
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete story');
    } finally {
      setDeletingId(null);
    }
  };

  if (stories.length === 0) {
    return (
      <div className="bg-background border border-border rounded-lg p-12 text-center shadow-sm">
        <p className="text-muted-foreground mb-4">No visual stories exist yet.</p>
        <Link href="/admin/stories/new" className="text-primary hover:text-primary/80 font-medium hover:underline">
          Create your first visual story
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background border border-border rounded-lg overflow-hidden shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="border-b border-border bg-secondary/50">
          <tr>
            <th className="py-4 px-6 font-semibold text-foreground uppercase tracking-wider text-xs">Title</th>
            <th className="py-4 px-6 font-semibold text-foreground uppercase tracking-wider text-xs">Category</th>
            <th className="py-4 px-6 font-semibold text-foreground uppercase tracking-wider text-xs text-center">Slides</th>
            <th className="py-4 px-6 font-semibold text-foreground uppercase tracking-wider text-xs">Date</th>
            <th className="text-right py-4 px-6 font-semibold text-foreground uppercase tracking-wider text-xs">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {stories.map((story) => (
            <tr key={story.id} className={`hover:bg-secondary/20 transition-colors ${deletingId === story.id ? 'opacity-50 animate-pulse' : ''}`}>
              <td className="py-4 px-6">
                <div className="font-medium text-foreground line-clamp-1">{story.title}</div>
                <div className="text-xs text-muted-foreground mt-1 font-mono">/{story.slug}</div>
              </td>
              <td className="py-4 px-6">
                <span className="text-xs uppercase tracking-wide font-semibold bg-secondary/60 px-2 py-1 rounded-sm">
                  {story.category}
                </span>
              </td>
              <td className="py-4 px-6 text-center font-bold text-foreground">{story.slides?.length || 0}</td>
              <td className="py-4 px-6 text-muted-foreground whitespace-nowrap">
                {new Date(story.createdAt || Date.now()).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </td>
              <td className="py-4 px-6 text-right space-x-4 whitespace-nowrap">
                <Link href={`/admin/stories/${story.id}/edit`} className="text-primary hover:text-primary/80 font-medium text-sm">
                  Edit
                </Link>
                <button
                  onClick={(e) => handleDelete(story.id, e)}
                  disabled={deletingId === story.id}
                  className="text-red-600/70 hover:text-red-700 font-medium text-sm disabled:cursor-not-allowed"
                >
                  {deletingId === story.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
