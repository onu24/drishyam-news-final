'use client';

import Image from 'next/image';

interface ArticleImageGalleryProps {
  images: string[];
  title: string;
}

export function ArticleImageGallery({ images, title }: ArticleImageGalleryProps) {
  const validImages = images.filter(Boolean);

  if (validImages.length === 0) {
    return null;
  }

  return (
    <section className="my-10">
      <h3 className="text-xs font-black uppercase tracking-[0.22em] text-muted-foreground mb-4">
        Story Gallery
      </h3>

      <div className="md:hidden -mx-4 px-4 flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2">
        {validImages.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="relative shrink-0 w-[86%] aspect-[4/3] rounded-lg overflow-hidden border border-border bg-secondary/20 snap-center"
          >
            <Image
              src={image}
              alt={`${title} image ${index + 1}`}
              fill
              sizes="86vw"
              className="object-cover"
            />
            <div className="absolute bottom-2 right-2 text-[10px] font-black uppercase tracking-wider bg-black/70 text-white px-2 py-1 rounded">
              {index + 1}/{validImages.length}
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:grid grid-cols-2 gap-4">
        {validImages.map((image, index) => (
          <div
            key={`${image}-desktop-${index}`}
            className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-border bg-secondary/20"
          >
            <Image
              src={image}
              alt={`${title} image ${index + 1}`}
              fill
              sizes="(max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
