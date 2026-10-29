import * as React from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Image as ImageIcon, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default async function AdminGalleryPage() {
  const supabase = await createClient();

  const { data: galleryItems } = await supabase
    .from('gallery_items')
    .select(`
      id,
      image_url,
      category,
      sort_order,
      is_published,
      created_at,
      translations:gallery_translations (
        locale,
        title,
        alt_text
      )
    `)
    .order('sort_order', { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Media & Photo Gallery Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage public community photographs, categories, and multilingual descriptions.
          </p>
        </div>

        <Button className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          <span>Upload Photograph</span>
        </Button>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            <span>Gallery Collection</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {galleryItems && galleryItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {galleryItems.map((item) => {
                const transList = item.translations || [];
                const enTitle =
                  transList.find((t: { locale: string }) => t.locale === 'en')?.title ||
                  transList[0]?.title ||
                  'Untitled';

                return (
                  <div
                    key={item.id}
                    className="group relative rounded-xl overflow-hidden border border-border bg-card flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 w-full bg-muted overflow-hidden">
                        <Image
                          src={item.image_url}
                          alt="Gallery item"
                          fill
                          sizes="(max-width: 640px) 100vw, 25vw"
                          className="object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-sm">
                          {item.category}
                        </span>
                      </div>
                      <div className="p-4 space-y-1">
                        <h4 className="font-bold text-sm text-foreground line-clamp-1">
                          {enTitle}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Order: {item.sort_order}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 flex items-center justify-between border-t border-border mt-2">
                      <Badge
                        variant={item.is_published ? 'default' : 'outline'}
                        className="text-[10px]"
                      >
                        {item.is_published ? 'Published' : 'Hidden'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground space-y-3">
              <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground/30" />
              <p>No gallery photographs uploaded yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
