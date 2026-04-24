'use client';

import { Facebook, Twitter, MessageCircle, Link2, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface SocialShareSideProps {
  title: string;
  url: string;
}

export function SocialShareSide({ title, url }: SocialShareSideProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [fullUrl, setFullUrl] = useState(url);

  useEffect(() => {
    setFullUrl(`${window.location.origin}${url}`);
  }, [url]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + fullUrl)}`,
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
        {t('social_share')}
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
        {/* WhatsApp */}
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-4 bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white rounded-xl shadow-[0_8px_20px_-8px_rgba(37,211,102,0.5)] hover:shadow-[0_12px_24px_-8px_rgba(37,211,102,0.7)] hover:-translate-y-1 hover:brightness-110 active:scale-95 transition-all duration-300"
        >
          <MessageCircle className="h-5 w-5 drop-shadow-md" />
          <span className="text-[11px] font-black uppercase tracking-widest lg:hidden xl:block">WhatsApp</span>
        </a>

        {/* Facebook */}
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-4 bg-gradient-to-br from-[#1877F2] to-[#0d5ac9] text-white rounded-xl shadow-[0_8px_20px_-8px_rgba(24,119,242,0.5)] hover:shadow-[0_12px_24px_-8px_rgba(24,119,242,0.7)] hover:-translate-y-1 hover:brightness-110 active:scale-95 transition-all duration-300"
        >
          <Facebook className="h-5 w-5 drop-shadow-md" />
          <span className="text-[11px] font-black uppercase tracking-widest lg:hidden xl:block">Facebook</span>
        </a>

        {/* Twitter/X */}
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-4 bg-zinc-950 text-white rounded-xl shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.7)] hover:-translate-y-1 hover:brightness-125 active:scale-95 transition-all duration-300 border border-white/5"
        >
          <Twitter className="h-5 w-5 drop-shadow-md" />
          <span className="text-[11px] font-black uppercase tracking-widest lg:hidden xl:block">X (Twitter)</span>
        </a>

        {/* Copy Link */}
        <button
          onClick={copyToClipboard}
          className={`flex items-center gap-3 px-4 py-4 rounded-xl border transition-all duration-300 hover:-translate-y-1 active:scale-95 ${
            copied 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-lg shadow-emerald-500/10' 
            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm hover:shadow-lg hover:border-primary/20'
          }`}
        >
          {copied ? <Check className="h-5 w-5 animate-in zoom-in duration-300" /> : <Link2 className="h-5 w-5" />}
          <span className="text-[11px] font-black uppercase tracking-widest lg:hidden xl:block">
            {copied ? 'Copied' : 'Copy Link'}
          </span>
        </button>
      </div>
    </div>
  );
}
