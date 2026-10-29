'use client';

import * as React from 'react';
import Image from 'next/image';
import { GalleryItem } from '@/types/database';
import { Modal } from '@/components/ui/Modal';
import { Maximize2, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function GalleryViewer({ items }: { items: GalleryItem[] }) {
  const [selectedItem, setSelectedItem] = React.useState<GalleryItem | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');

  const categories = ['All', ...Array.from(new Set(items.map((i) => i.category)))];

  const filteredItems =
    selectedCategory === 'All'
      ? items
      : items.filter((i) => i.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              selectedCategory === cat
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="group relative h-64 rounded-xl overflow-hidden bg-card border border-border shadow-sm cursor-pointer hover:shadow-md transition-all"
          >
            <Image
              src={item.image_url}
              alt={item.alt_text || item.title || 'Gallery photograph'}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
              <div className="flex justify-end">
                <span className="p-1.5 rounded-full bg-black/50 text-white backdrop-blur-sm">
                  <Maximize2 className="h-4 w-4" />
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-emerald-300">
                  {item.category}
                </span>
                <h4 className="text-white text-sm font-bold line-clamp-2">
                  {item.title}
                </h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={selectedItem.title}
          className="max-w-3xl p-4 sm:p-6"
        >
          <div className="space-y-4">
            <div className="relative h-72 sm:h-96 w-full rounded-xl overflow-hidden bg-muted">
              <Image
                src={selectedItem.image_url}
                alt={selectedItem.alt_text || selectedItem.title || 'Photograph'}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 768px"
                className="object-contain"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1 inline" />
                  {selectedItem.category}
                </Badge>
              </div>

              {selectedItem.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedItem.description}
                </p>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
