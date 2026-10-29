import * as React from 'react';
import { getTranslations } from 'next-intl/server';
import { SupportedLocale } from '@/types/database';
import { getPublishedGalleryItems } from '@/lib/db/queries';
import { Image as ImageIcon } from 'lucide-react';
import { GalleryViewer } from '@/components/gallery/GalleryViewer';

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale = locale as SupportedLocale;

  const tGallery = await getTranslations({ locale, namespace: 'gallery' });
  const galleryItems = await getPublishedGalleryItems(currentLocale, 40);

  return (
    <div className="py-12 sm:py-16 bg-background min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider">
            <ImageIcon className="h-4 w-4" />
            <span>{tGallery('title')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {tGallery('title')}
          </h1>
          <p className="text-muted-foreground text-base">
            {tGallery('subtitle')}
          </p>
        </div>

        {galleryItems.length > 0 ? (
          <GalleryViewer items={galleryItems} />
        ) : (
          <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-border p-8">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
            <h3 className="text-lg font-bold text-foreground mb-1">
              {tGallery('noPhotosFound')}
            </h3>
            <p className="text-sm text-muted-foreground">
              Official developmental and community event photographs will be displayed here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
