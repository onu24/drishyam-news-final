'use client';

import { Author } from '@/lib/types';
import Image from 'next/image';
import { useState } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Twitter, Facebook, Instagram, Linkedin, Mail, ShieldCheck } from 'lucide-react';

/** Handles broken avatar URLs from Firestore with a local fallback */
function AvatarImage({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src || '/placeholder-user.jpg');
  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      sizes="96px"
      className="object-cover"
      onError={() => setImgSrc('/placeholder-user.jpg')}
    />
  );
}

interface ArticleAuthorProps {
  author?: Author;
}

export function ArticleAuthor({ author }: ArticleAuthorProps) {
  const { language } = useLanguage();

  const defaultBio = language === 'hi'
    ? 'दृश्यम न्यूज़रूम आपको दुनिया भर से तेज, सत्यापित और गहराई से शोध की गई कहानियां लाने के लिए प्रतिबद्ध है।'
    : 'Drishyam Newsroom is committed to bringing you fast, verified, and deeply researched stories from across the globe.';

  const displayBio = author?.bio 
    ? author.bio 
    : (author?.name === 'Admin' 
       ? (language === 'hi' 
          ? 'एडमिन दृश्यम न्यूज में सत्यापित पत्रकारिता की एक प्रमुख आवाज हैं, जो निष्पक्ष और उच्च प्रभाव वाली खबरें देने के लिए समर्पित हैं।'
          : 'Admin is a leading voice in verified journalism at Drishyam News, dedicated to delivering unbiased, high-impact stories.')
       : defaultBio);

  const displayName = author?.name || (language === 'hi' ? 'दृश्यम न्यूज़रूम' : 'Drishyam Newsroom');
  const displayRole = author?.role || (language === 'hi' ? 'संपादकीय टीम' : 'Editorial Team');

  const socialLinks = author?.socialLinks || {};

  return (
    <div className="max-w-[700px] mx-auto mt-12 p-6 sm:p-8 bg-zinc-50 border border-zinc-200/60 rounded-xl transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start text-center sm:text-left">
        {/* Avatar Section */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-full overflow-hidden bg-zinc-250 border-4 border-white shadow-md ring-1 ring-zinc-200/50">
          {author ? (
            <AvatarImage src={author.avatar} alt={displayName} />
          ) : (
            <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-white font-serif text-3xl italic">
              D
            </div>
          )}
        </div>

        {/* Info & Content Section */}
        <div className="flex-1 w-full">
          {/* Name & Role Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 justify-center sm:justify-start mb-3">
            <h4 className="font-serif text-xl sm:text-2xl font-bold text-zinc-950 flex items-center gap-2 justify-center sm:justify-start">
              {displayName}
              <span title="Verified Author" className="inline-flex shrink-0">
                <ShieldCheck className="h-5 w-5 text-blue-500 fill-blue-500/10" />
              </span>
            </h4>
            
            <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
              <span className="px-3 py-1 bg-zinc-900 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-sm shadow-sm">
                {displayRole}
              </span>

              <span className="text-[10px] text-primary/80 font-bold tracking-tighter underline underline-offset-4 decoration-1 decoration-primary/20">
                @{language === 'hi' ? 'सत्यापित' : 'Verified'}
              </span>
            </div>
          </div>

          {/* Biography */}
          <p className="text-zinc-600 text-base leading-relaxed mb-6 font-sans">
            {displayBio}
          </p>

          {/* Social Links Row */}
          <div className="flex items-center justify-center sm:justify-start gap-4">
            {socialLinks.twitter && (
              <a
                href={socialLinks.twitter.startsWith('http') ? socialLinks.twitter : `https://twitter.com/${socialLinks.twitter.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white rounded-full border border-zinc-200 text-zinc-600 hover:text-sky-500 hover:border-sky-200 hover:bg-sky-50/30 hover:-translate-y-1 transition-all duration-300 shadow-sm"
                title="Twitter/X"
              >
                <Twitter className="h-4 w-4" />
              </a>
            )}
            
            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white rounded-full border border-zinc-200 text-zinc-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/30 hover:-translate-y-1 transition-all duration-300 shadow-sm"
                title="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            )}

            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white rounded-full border border-zinc-200 text-zinc-600 hover:text-pink-600 hover:border-pink-200 hover:bg-pink-50/30 hover:-translate-y-1 transition-all duration-300 shadow-sm"
                title="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}

            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white rounded-full border border-zinc-200 text-zinc-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/30 hover:-translate-y-1 transition-all duration-300 shadow-sm"
                title="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}

            {author?.email && (
              <a
                href={`mailto:${author.email}`}
                className="p-2 bg-white rounded-full border border-zinc-200 text-zinc-600 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50/30 hover:-translate-y-1 transition-all duration-300 shadow-sm"
                title="Email Author"
              >
                <Mail className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
