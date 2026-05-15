'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { ArticleContentFont } from '@/lib/types';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Reveal } from '@/components/animations/Reveal';
import { AdContainer } from '../AdContainer';
import Link from 'next/link';

interface ArticleContentProps {
  content?: string;
  content_hi?: string;
  keyPoints?: string[];
  articleType?: string;
  videoUrl?: string;
  contentFont?: ArticleContentFont;
}

const FONT_CLASS_MAP: Record<ArticleContentFont, string> = {
  serif: 'font-serif',
  sans: 'font-sans',
  mono: 'font-mono',
  roboto: 'font-roboto',
  poppins: 'font-poppins',
  merriweather: 'font-merriweather',
  playfair: 'font-playfair',
};

export function ArticleContent({ content, content_hi, keyPoints, articleType, videoUrl, contentFont = 'serif' }: ArticleContentProps) {
  const { language, t } = useLanguage();

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = videoUrl ? getYouTubeId(videoUrl) : null;
  
  // Choose correct content based on language with fallback
  const displayContent = (language === 'hi' && content_hi && content_hi.trim() !== '') ? content_hi : (content || content_hi);
  
  if (!displayContent && (!keyPoints || keyPoints.length === 0)) return null;

  // Parse markdown-like content (simple paragraphs separated by double newlines)
  const paragraphs = displayContent?.split('\n\n').filter(p => p.trim()) || [];
  const fontClass = language === 'hi' ? 'font-hindi' : (FONT_CLASS_MAP[contentFont] || FONT_CLASS_MAP.serif);

  return (
    <div className="max-w-[700px] mx-auto break-words">
      <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-foreground/90 prose-p:leading-[1.8] prose-p:mb-8 prose-a:text-primary prose-strong:text-foreground prose-a:break-all">
        
        {/* YouTube Video Embed */}
        {videoId && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl mb-12 bg-black border border-border/40 group">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
        {/* Key Points for Explainers */}
        {articleType === 'explainer' && keyPoints && keyPoints.length > 0 && (
          <div className="bg-blue-50 border-l-4 border-blue-600 p-8 my-10 rounded-r-md">
            <h3 className="text-blue-900 font-bold text-xl mb-4 flex items-center gap-2 m-0 font-sans">
              <CheckCircle2 className="h-5 w-5" />
              {t('key_highlights')}
            </h3>
            <ul className="space-y-3 m-0 list-none p-0">
              {keyPoints.map((point, i) => (
                <li key={i} className="text-blue-800 text-base leading-relaxed flex gap-3 p-0">
                  <span className="shrink-0 text-blue-400 mt-1.5">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {paragraphs.map((paragraph, index) => {
          // 1. Check if it's a heading (starts with #)
          if (paragraph.startsWith('#')) {
            const levelMatch = paragraph.match(/^#+/);
            if (levelMatch) {
                const level = levelMatch[0].length;
                const text = paragraph.replace(/^#+\s/, '');
                const HeadingTag = `h${Math.min(level + 1, 6)}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
                
                const id = text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-');
                
                return (
                  <Reveal key={index}>
                    <HeadingTag 
                      id={id}
                      className={`mt-14 mb-6 ${fontClass} font-bold text-foreground tracking-tight scroll-mt-24`}
                    >
                      {text}
                    </HeadingTag>
                  </Reveal>
                );
            }
          }

          // 2. Check for Blockquote (starts with >)
          if (paragraph.startsWith('>')) {
            const text = paragraph.replace(/^>\s/, '');
            return (
              <Reveal key={index}>
                <blockquote className={`border-l-4 border-primary pl-8 py-2 my-12 italic text-2xl sm:text-3xl ${fontClass} text-muted-foreground leading-relaxed font-serif`}>
                  {text}
                </blockquote>
              </Reveal>
            );
          }

          // 3. Check for raw HTML tags (like <img> injected by dashboard)
          const isHtml = paragraph.trim().startsWith('<') && paragraph.trim().endsWith('>');
          if (isHtml) {
            return (
              <Reveal key={index}>
                <div 
                  className="my-8 overflow-hidden rounded-xl"
                  dangerouslySetInnerHTML={{ __html: paragraph }} 
                />
              </Reveal>
            );
          }

          // Regular paragraph with internal linking
          const linkifyKeywords = (text: string) => {
            const keywords = [
              { word: 'India', slug: '/category/india' },
              { word: 'Politics', slug: '/category/politics' },
              { word: 'Economy', slug: '/category/economy' },
              { word: 'Technology', slug: '/category/technology' },
              { word: 'Entertainment', slug: '/category/entertainment' },
            ];

            let content = text;
            keywords.forEach(({ word, slug }) => {
              // Only replace if it's not already inside a tag
              // This is a simple check to avoid breaking <img> tags
              const regex = new RegExp(`\\b${word}\\b(?![^<]*>)`, 'g');
              content = content.replace(regex, `<a href="${slug}" class="text-primary font-bold hover:underline">${word}</a>`);
            });
            return content;
          };

          return (
            <React.Fragment key={index}>
              <Reveal>
                <p 
                  className={`text-xl leading-[1.7] text-foreground/90 mb-8 ${fontClass} selection:bg-primary/20`}
                  dangerouslySetInnerHTML={{ __html: linkifyKeywords(paragraph) }}
                />
              </Reveal>

              {/* Inject AdSense Containers */}
              {index === 1 && (
                <AdContainer slot="article_inline_top" format="rectangle" />
              )}
              {index === 4 && (
                <AdContainer slot="article_inline_bottom" format="auto" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
