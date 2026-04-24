'use client';

import { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';

export function SidebarNewsletter() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
    }
  };

  return (
    <div className="bg-primary/5 border border-primary/10 rounded-sm p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-4 -mt-4 p-8 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
          <Mail className="h-3 w-3" />
          Stay Updated
        </h3>
        
        <p className="font-serif text-lg font-bold leading-tight mb-4">
          Get Drishyam's best analysis in your inbox.
        </p>

        {isSubscribed ? (
          <div className="flex items-center gap-2 text-primary font-bold animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Check className="h-4 w-4" />
            <span>{t('subscribed_success') || 'Subscription Confirmed!'}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="Your email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-sm bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            />
            <button
              type="submit"
              className="w-full bg-foreground text-background font-bold text-[10px] uppercase tracking-widest py-3 rounded-sm hover:-translate-y-0.5 transition-all shadow-md active:translate-y-0"
            >
              Join the Editorial Feed
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
