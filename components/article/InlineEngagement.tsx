'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Play, BookOpen, Layers } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface InlineEngagementProps {
  type: 'explainer' | 'video' | 'visual-story';
  title: string;
  slug: string;
  image?: string;
}

export function InlineEngagement({ type, title, slug, image }: InlineEngagementProps) {
  const { language, t } = useLanguage();

  const config = {
    explainer: {
      icon: <BookOpen className="h-4 w-4" />,
      label: language === 'hi' ? 'एक्सप्लेनर' : 'EXPLAINER',
      bg: 'bg-blue-50/50',
      border: 'border-blue-200',
      text: 'text-blue-900',
      accent: 'bg-blue-600',
    },
    video: {
      icon: <Play className="h-4 w-4" />,
      label: language === 'hi' ? 'वीडियो' : 'VIDEO',
      bg: 'bg-red-50/50',
      border: 'border-red-200',
      text: 'text-red-900',
      accent: 'bg-red-600',
    },
    'visual-story': {
      icon: <Layers className="h-4 w-4" />,
      label: language === 'hi' ? 'विजुअल स्टोरी' : 'VISUAL STORY',
      bg: 'bg-purple-50/50',
      border: 'border-purple-200',
      text: 'text-purple-900',
      accent: 'bg-purple-600',
    },
  }[type];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`my-12 p-1 border-l-4 ${config.accent.replace('bg-', 'border-')} ${config.bg} ${config.border} border rounded-r-lg group overflow-hidden relative`}
    >
      <Link href={`/${type === 'visual-story' ? 'visual-stories' : type === 'explainer' ? 'article' : type}/${slug}`} className="flex items-center gap-6 p-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`p-1.5 rounded-full ${config.accent} text-white`}>
              {config.icon}
            </span>
            <span className={`text-[10px] font-black tracking-widest uppercase ${config.text}`}>
              {config.label}
            </span>
          </div>
          <h4 className={`text-lg font-bold leading-tight ${config.text} group-hover:underline decoration-2 underline-offset-4`}>
            {title}
          </h4>
          <div className={`mt-3 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider ${config.text} opacity-70`}>
            {t('read_more') || 'Read More'}
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
        
        {image && (
          <div className="hidden sm:block w-32 h-20 rounded-md overflow-hidden relative shrink-0">
            <img src={image} alt="" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
          </div>
        )}
      </Link>
    </motion.div>
  );
}
