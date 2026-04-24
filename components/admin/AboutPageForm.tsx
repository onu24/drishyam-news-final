'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AboutPageContent } from '@/lib/types';
import { updateAboutPageContentAction } from '@/lib/actions/dashboard-actions';
import { AvatarUpload } from '@/components/admin/AvatarUpload';
import { AlertCircle, CheckCircle2, Loader2, Save } from 'lucide-react';

interface AboutPageFormProps {
  initialContent: AboutPageContent;
}

export function AboutPageForm({ initialContent }: AboutPageFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isUploadingProfileImage, setIsUploadingProfileImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [valuesText, setValuesText] = useState(initialContent.values.join('\n'));
  const [valuesHiText, setValuesHiText] = useState((initialContent.values_hi || []).join('\n'));
  const [formData, setFormData] = useState({
    heroTitle: initialContent.heroTitle || '',
    heroTitle_hi: initialContent.heroTitle_hi || '',
    heroSubtitle: initialContent.heroSubtitle || '',
    heroSubtitle_hi: initialContent.heroSubtitle_hi || '',
    profileImage: initialContent.profileImage || '',
    intro: initialContent.intro || '',
    intro_hi: initialContent.intro_hi || '',
    story: initialContent.story || '',
    story_hi: initialContent.story_hi || '',
    mission: initialContent.mission || '',
    mission_hi: initialContent.mission_hi || '',
    vision: initialContent.vision || '',
    vision_hi: initialContent.vision_hi || '',
  });

  const valuesPreview = useMemo(
    () =>
      valuesText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
    [valuesText]
  );

  const valuesHiPreview = useMemo(
    () =>
      valuesHiText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
    [valuesHiText]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.heroTitle.trim()) {
      setError('Hero title is required.');
      return;
    }
    if (isUploadingProfileImage) {
      setError('Please wait for the image upload to finish.');
      return;
    }

    setLoading(true);
    try {
      const result = await updateAboutPageContentAction({
        heroTitle: formData.heroTitle.trim(),
        heroTitle_hi: formData.heroTitle_hi.trim(),
        heroSubtitle: formData.heroSubtitle.trim(),
        heroSubtitle_hi: formData.heroSubtitle_hi.trim(),
        profileImage: formData.profileImage.trim() || '/placeholder-user.jpg',
        intro: formData.intro.trim(),
        intro_hi: formData.intro_hi.trim(),
        story: formData.story.trim(),
        story_hi: formData.story_hi.trim(),
        mission: formData.mission.trim(),
        mission_hi: formData.mission_hi.trim(),
        vision: formData.vision.trim(),
        vision_hi: formData.vision_hi.trim(),
        values: valuesPreview,
        values_hi: valuesHiPreview,
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
          <div>
            <p className="text-sm text-muted-foreground mb-3">About page profile image (WhatsApp DP style)</p>
            <AvatarUpload
              currentAvatar={formData.profileImage}
              onAvatarUpload={(url) => setFormData((prev) => ({ ...prev, profileImage: url }))}
              onUploadingChange={setIsUploadingProfileImage}
              folder="site/about"
              inputId="about-profile-image-input"
              buttonLabel="Upload Profile Image"
              alt="About page profile image"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Title (English)</label>
              <input
                type="text"
                value={formData.heroTitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, heroTitle: e.target.value }))}
                suppressHydrationWarning
                className="w-full bg-secondary/30 p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Hero title"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-primary tracking-wider">Title (Hindi)</label>
              <input
                type="text"
                value={formData.heroTitle_hi}
                onChange={(e) => setFormData((prev) => ({ ...prev, heroTitle_hi: e.target.value }))}
                suppressHydrationWarning
                className="w-full bg-primary/5 p-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 font-hindi"
                placeholder="शीर्षक (हिंदी में)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Subtitle (English)</label>
              <textarea
                value={formData.heroSubtitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
                suppressHydrationWarning
                className="w-full bg-secondary/30 p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[96px] resize-none"
                placeholder="Hero subtitle"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-primary tracking-wider">Subtitle (Hindi)</label>
              <textarea
                value={formData.heroSubtitle_hi}
                onChange={(e) => setFormData((prev) => ({ ...prev, heroSubtitle_hi: e.target.value }))}
                suppressHydrationWarning
                className="w-full bg-primary/5 p-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[96px] resize-none font-hindi"
                placeholder="उप-शीर्षक (हिंदी में)"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background border border-border rounded-xl p-6 space-y-5 shadow-sm">
        <h2 className="font-serif text-2xl font-bold">About Content</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Intro (English)</label>
            <textarea
              value={formData.intro}
              onChange={(e) => setFormData((prev) => ({ ...prev, intro: e.target.value }))}
              suppressHydrationWarning
              className="w-full bg-secondary/30 p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[96px] resize-none"
              placeholder="Intro paragraph"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-primary tracking-wider">Intro (Hindi)</label>
            <textarea
              value={formData.intro_hi}
              onChange={(e) => setFormData((prev) => ({ ...prev, intro_hi: e.target.value }))}
              suppressHydrationWarning
              className="w-full bg-primary/5 p-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[96px] resize-none font-hindi"
              placeholder="प्रस्तावना (हिंदी में)"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Our Story (English)</label>
            <textarea
              value={formData.story}
              onChange={(e) => setFormData((prev) => ({ ...prev, story: e.target.value }))}
              suppressHydrationWarning
              className="w-full bg-secondary/30 p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[140px] resize-none"
              placeholder="Our story"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-primary tracking-wider">Our Story (Hindi)</label>
            <textarea
              value={formData.story_hi}
              onChange={(e) => setFormData((prev) => ({ ...prev, story_hi: e.target.value }))}
              suppressHydrationWarning
              className="w-full bg-primary/5 p-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[140px] resize-none font-hindi"
              placeholder="हमारी कहानी (हिंदी में)"
            />
          </div>
        </div>
      </div>

      <div className="bg-background border border-border rounded-xl p-6 space-y-5 shadow-sm">
        <h2 className="font-serif text-2xl font-bold">Mission & Vision</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Mission (English)</label>
            <textarea
              value={formData.mission}
              onChange={(e) => setFormData((prev) => ({ ...prev, mission: e.target.value }))}
              suppressHydrationWarning
              className="w-full bg-secondary/30 p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[96px] resize-none"
              placeholder="Mission statement"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-primary tracking-wider">Mission (Hindi)</label>
            <textarea
              value={formData.mission_hi}
              onChange={(e) => setFormData((prev) => ({ ...prev, mission_hi: e.target.value }))}
              suppressHydrationWarning
              className="w-full bg-primary/5 p-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[96px] resize-none font-hindi"
              placeholder="मिशन (हिंदी में)"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Vision (English)</label>
            <textarea
              value={formData.vision}
              onChange={(e) => setFormData((prev) => ({ ...prev, vision: e.target.value }))}
              suppressHydrationWarning
              className="w-full bg-secondary/30 p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[96px] resize-none"
              placeholder="Vision statement"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-primary tracking-wider">Vision (Hindi)</label>
            <textarea
              value={formData.vision_hi}
              onChange={(e) => setFormData((prev) => ({ ...prev, vision_hi: e.target.value }))}
              suppressHydrationWarning
              className="w-full bg-primary/5 p-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[96px] resize-none font-hindi"
              placeholder="विज़न (हिंदी में)"
            />
          </div>
        </div>
      </div>

      <div className="bg-background border border-border rounded-xl p-6 space-y-5 shadow-sm">
        <h2 className="font-serif text-2xl font-bold">Core Values</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Values (English)</label>
            <p className="text-[10px] text-muted-foreground">One value per line.</p>
            <textarea
              value={valuesText}
              onChange={(e) => setValuesText(e.target.value)}
              suppressHydrationWarning
              className="w-full bg-secondary/30 p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[140px] resize-none"
              placeholder={'Accuracy\nIndependence\nAccountability'}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-primary tracking-wider">Values (Hindi)</label>
            <p className="text-[10px] text-muted-foreground">एक लाइन में एक वैल्यू लिखें।</p>
            <textarea
              value={valuesHiText}
              onChange={(e) => setValuesHiText(e.target.value)}
              suppressHydrationWarning
              className="w-full bg-primary/5 p-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[140px] resize-none font-hindi"
              placeholder={'सटीकता\nस्वतंत्रता\nजवाबदेही'}
            />
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-background/80 backdrop-blur-md border border-border rounded-lg p-4">
        <button
          type="submit"
          disabled={loading || isUploadingProfileImage}
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
