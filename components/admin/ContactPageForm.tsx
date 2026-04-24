'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContactPageContent } from '@/lib/types';
import { updateContactPageContentAction } from '@/lib/actions/dashboard-actions';
import { AlertCircle, CheckCircle2, Loader2, Save, Mail, Phone, MapPin, Info } from 'lucide-react';

interface ContactPageFormProps {
  initialContent: ContactPageContent;
}

export function ContactPageForm({ initialContent }: ContactPageFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    heroTitle:    initialContent.heroTitle    || '',
    heroTitle_hi: initialContent.heroTitle_hi || '',
    heroSubtitle: initialContent.heroSubtitle || '',
    heroSubtitle_hi: initialContent.heroSubtitle_hi || '',
    email:        initialContent.email        || '',
    phone:        initialContent.phone        || '',
    address:      initialContent.address      || '',
    address_hi:   initialContent.address_hi   || '',
    extraInfo:    initialContent.extraInfo    || '',
    extraInfo_hi: initialContent.extraInfo_hi || '',
  });

  const set = (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.heroTitle.trim()) {
      setError('Page title is required.');
      return;
    }

    setLoading(true);
    try {
      const result = await updateContactPageContentAction({
        heroTitle:    formData.heroTitle.trim(),
        heroTitle_hi: formData.heroTitle_hi.trim(),
        heroSubtitle: formData.heroSubtitle.trim(),
        heroSubtitle_hi: formData.heroSubtitle_hi.trim(),
        email:        formData.email.trim(),
        phone:        formData.phone.trim(),
        address:      formData.address.trim(),
        address_hi:   formData.address_hi.trim(),
        extraInfo:    formData.extraInfo.trim(),
        extraInfo_hi: formData.extraInfo_hi.trim(),
      });

      if (!result.success) throw new Error(result.error || 'Update failed');

      setSuccess(true);
      setTimeout(() => {
        router.refresh();
        setSuccess(false);
      }, 900);
    } catch (err) {
      console.error('[ContactPageForm] Save error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update Contact page');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl pb-16 animate-in fade-in duration-500">

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
          <AlertCircle size={18} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg">
          <CheckCircle2 size={18} />
          <p className="text-sm font-medium">Contact page updated successfully.</p>
        </div>
      )}

      {/* ── Hero / Page Heading ─────────────────────────────────────── */}
      <div className="bg-background border border-border rounded-xl p-6 space-y-4 shadow-sm">
        <h2 className="font-serif text-2xl font-bold">Page Heading</h2>
        <p className="text-sm text-muted-foreground">
          Controls the large title and sub-text visitors see at the top of the Contact Us page.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Page Title (English) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.heroTitle}
              onChange={set('heroTitle')}
              suppressHydrationWarning
              placeholder="e.g. Contact Us"
              className="w-full bg-secondary/30 p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-primary">
              Page Title (Hindi)
            </label>
            <input
              type="text"
              value={formData.heroTitle_hi}
              onChange={set('heroTitle_hi')}
              suppressHydrationWarning
              placeholder="शीर्षक (हिंदी में)"
              className="w-full bg-primary/5 p-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-hindi"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Sub-title (English)
            </label>
            <textarea
              value={formData.heroSubtitle}
              onChange={set('heroSubtitle')}
              suppressHydrationWarning
              rows={3}
              placeholder="Brief description under the page title"
              className="w-full bg-secondary/30 p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-primary">
              Sub-title (Hindi)
            </label>
            <textarea
              value={formData.heroSubtitle_hi}
              onChange={set('heroSubtitle_hi')}
              suppressHydrationWarning
              rows={3}
              placeholder="उप-शीर्षक (हिंदी में)"
              className="w-full bg-primary/5 p-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none font-hindi"
            />
          </div>
        </div>
      </div>

      {/* ── Contact Details ─────────────────────────────────────────── */}
      <div className="bg-background border border-border rounded-xl p-6 space-y-5 shadow-sm">
        <h2 className="font-serif text-2xl font-bold">Contact Details</h2>
        <p className="text-sm text-muted-foreground">
          These values populate the info cards on the left side of the public contact page.
        </p>

        {/* Email */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1.5 text-muted-foreground">
            <Mail size={13} /> Email Addresses
          </label>
          <textarea
            value={formData.email}
            onChange={set('email')}
            suppressHydrationWarning
            rows={2}
            placeholder={"editorial@drishyamnews.in\nbusiness@drishyamnews.in"}
            className="w-full bg-secondary/30 p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none"
          />
          <p className="text-[11px] text-muted-foreground mt-1">One email per line — all lines are displayed.</p>
        </div>

        {/* Phone */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1.5 text-muted-foreground">
            <Phone size={13} /> Phone Number
          </label>
          <input
            type="text"
            value={formData.phone}
            onChange={set('phone')}
            suppressHydrationWarning
            placeholder="+91 11 XXXX XXXX"
            className="w-full bg-secondary/30 p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
          />
        </div>

        {/* Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <MapPin size={13} /> Office Address (English)
            </label>
            <textarea
              value={formData.address}
              onChange={set('address')}
              suppressHydrationWarning
              rows={2}
              placeholder="New Delhi, India"
              className="w-full bg-secondary/30 p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <MapPin size={13} /> Office Address (Hindi)
            </label>
            <textarea
              value={formData.address_hi}
              onChange={set('address_hi')}
              suppressHydrationWarning
              rows={2}
              placeholder="कार्यालय का पता (हिंदी में)"
              className="w-full bg-primary/5 p-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none font-hindi"
            />
          </div>
        </div>
      </div>

      {/* ── Extra Info ──────────────────────────────────────────────── */}
      <div className="bg-background border border-border rounded-xl p-6 space-y-4 shadow-sm">
        <h2 className="font-serif text-2xl font-bold">Additional Info</h2>
        <p className="text-sm text-muted-foreground flex items-start gap-2">
          <Info size={14} className="mt-0.5 shrink-0" />
          Optional note shown below the contact form on the public page.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Extra Info (English)
            </label>
            <textarea
              value={formData.extraInfo}
              onChange={set('extraInfo')}
              suppressHydrationWarning
              rows={4}
              placeholder="e.g. We typically respond within 2 business days."
              className="w-full bg-secondary/30 p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-primary">
              Extra Info (Hindi)
            </label>
            <textarea
              value={formData.extraInfo_hi}
              onChange={set('extraInfo_hi')}
              suppressHydrationWarning
              rows={4}
              placeholder="अतिरिक्त जानकारी (हिंदी में)"
              className="w-full bg-primary/5 p-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none font-hindi"
            />
          </div>
        </div>
      </div>

      {/* ── Sticky Save Bar ─────────────────────────────────────────── */}
      <div className="sticky bottom-0 bg-background/80 backdrop-blur-md border border-border rounded-lg p-4">
        <button
          type="submit"
          disabled={loading}
          suppressHydrationWarning
          className="px-6 py-3 bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-sm hover:bg-black transition-colors disabled:opacity-50 inline-flex items-center gap-2"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Contact Page
        </button>
      </div>
    </form>
  );
}
