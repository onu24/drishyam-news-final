import { CheckCircle2 } from 'lucide-react';

interface ArticleContentProps {
  content?: string;
  keyPoints?: string[];
  articleType?: string;
}

export function ArticleContent({ content, keyPoints, articleType }: ArticleContentProps) {
  if (!content && !keyPoints) return null;

  // Parse markdown-like content (simple paragraphs separated by double newlines)
  const paragraphs = content?.split('\n\n').filter(p => p.trim()) || [];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-6 prose-a:text-primary prose-strong:text-foreground">
        
        {/* Key Points for Explainers */}
        {articleType === 'explainer' && keyPoints && keyPoints.length > 0 && (
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-10 rounded-r-md">
            <h3 className="text-blue-900 font-bold text-xl mb-4 flex items-center gap-2 m-0 font-sans">
              <CheckCircle2 className="h-5 w-5" />
              In Brief: Key Takeaways
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
          // Check if it's a heading (starts with #)
          if (paragraph.startsWith('#')) {
            const levelMatch = paragraph.match(/^#+/);
            if (levelMatch) {
                const level = levelMatch[0].length;
                const text = paragraph.replace(/^#+\s/, '');
                const HeadingTag = `h${Math.min(level + 2, 6)}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
                
                return (
                  <HeadingTag key={index} className="mt-12 mb-6 font-serif font-bold text-foreground tracking-tight">
                    {text}
                  </HeadingTag>
                );
            }
          }

          // Check for Blockquote (starts with >)
          if (paragraph.startsWith('>')) {
            const text = paragraph.replace(/^>\s/, '');
            return (
              <blockquote key={index} className="border-l-4 border-primary pl-6 py-2 my-10 italic text-2xl font-serif text-muted-foreground leading-relaxed">
                {text}
              </blockquote>
            );
          }

          // Regular paragraph
          return (
            <p key={index} className="text-xl leading-relaxed text-foreground/90 mb-8 font-serif selection:bg-primary/20">
              {paragraph}
            </p>
          );
        })}
      </div>
    </div>
  );
}
