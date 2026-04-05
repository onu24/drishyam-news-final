'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AboutPageContent } from '@/lib/types';
import { updateAboutPageContentAction } from '@/lib/actions/dashboard-actions';
import { AlertCircle, CheckCircle2, Loader2, Save } from 'lucide-react';

interface AboutPageFormProps {
  initialContent: AboutPageContent;
}

export function AboutPageForm({ initialContent }: AboutPageFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [valuesText, setValuesText] = useState(initialContent.values.join('\n'));
  const [formData, setFormData] = useState({
    heroTitle: initialContent.heroTitle || '',
    heroSubtitle: initialContent.heroSubtitle || '',
    intro: initialContent.intro || '',
    story: initialContent.story || '',
    mission: initialContent.mission || '',
    vision: initialContent.vision || '',
  });

  const valuesPreview = useMemo(
    () =>
      valuesText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
    [valuesText]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.heroTitle.trim()) {
      setError('Hero title is required.');
      return;
    }

    setLoading(true);
    try {
      const result = await updateAboutPageContentAction({
        heroTitle: formData.heroTitle.trim(),
        heroSubtitle: formData.heroSubtitle.trim(),
        intro: formData.intro.trim(),
        story: formData.story.trim(),
        mission: formData.mission.trim(),
        vision: formData.vision.trim(),
        values: valuesPreview,
      });

      if (!result.success) {
        throw new Error(result.error || 'Update failed');
      }

      setSuccess(true);
      setTimeout(() => {
        router.refresh();
        setSuccess(false);
      }, 900);
    } catch (err) {
      console.error('[AboutPageForm] Save error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update About page');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl pb-16 animate-in fade-in duration-500">
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
          <AlertCircle size={18} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg">
          <CheckCircle2 size={18} />
          <p className="text-sm font-medium">About page updated successfully.</p>
        </div>
      )}

      <div className="bg-background border border-border rounded-xl p-6 space-y-5 shadow-sm">
        <h2 className="font-serif text-2xl font-bold">Hero Section</h2>
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            value={formData.heroTitle}
            onChange={(e) => setFormData((prev) => ({ ...prev, heroTitle: e.target.value }))}
            suppressHydrationWarning
            className="w-full bg-secondary/30 p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Hero title"
          />
          <textarea
            value={formData.heroSubtitle}
            onChange={(e) => setFormData((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
            suppressHydrationWarning
            className="w-full bg-secondary/30 p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[96px] resize-none"
            placeholder="Hero subtitle"
          />
        </div>
      </div>

      <div className="bg-background border border-border rounded-xl p-6 space-y-5 shadow-sm">
        <h2 className="font-serif text-2xl font-bold">About Content</h2>
        <textarea
          value={formData.intro}
          onChange={(e) => setFormData((prev) => ({ ...prev, intro: e.target.value }))}
          suppressHydrationWarning
          className="w-full bg-secondary/30 p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[96px] resize-none"
          placeholder="Intro paragraph"
        />
        <textarea
          value={formData.story}
          onChange={(e) => setFormData((prev) => ({ ...prev, story: e.target.value }))}
          suppressHydrationWarning
          className="w-full bg-secondary/30 p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[140px] resize-none"
          placeholder="Our story"
        />
      </div>

      <div className="bg-background border border-border rounded-xl p-6 space-y-5 shadow-sm">
        <h2 className="font-serif text-2xl font-bold">Mission & Vision</h2>
        <textarea
          value={formData.mission}
          onChange={(e) => setFormData((prev) => ({ ...prev, mission: e.target.value }))}
          suppressHydrationWarning
          className="w-full bg-secondary/30 p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[96px] resize-none"
          placeholder="Mission statement"
        />
        <textarea
          value={formData.vision}
          onChange={(e) => setFormData((prev) => ({ ...prev, vision: e.target.value }))}
          suppressHydrationWarning
          className="w-full bg-secondary/30 p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[96px] resize-none"
          placeholder="Vision statement"
        />
      </div>

      <div className="bg-background border border-border rounded-xl p-6 space-y-5 shadow-sm">
        <h2 className="font-serif text-2xl font-bold">Core Values</h2>
        <p className="text-sm text-muted-foreground">Enter one value per line.</p>
        <textarea
          value={valuesText}
          onChange={(e) => setValuesText(e.target.value)}
          suppressHydrationWarning
          className="w-full bg-secondary/30 p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[140px] resize-none"
          placeholder={'Accuracy\nIndependence\nAccountability'}
        />
      </div>

      <div className="sticky bottom-0 bg-background/80 backdrop-blur-md border border-border rounded-lg p-4">
        <button
          type="submit"
          disabled={loading}
          suppressHydrationWarning
          className="px-6 py-3 bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-sm hover:bg-black transition-colors disabled:opacity-50 inline-flex items-center gap-2"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save About Page
        </button>
      </div>
    </form>
  );
}
