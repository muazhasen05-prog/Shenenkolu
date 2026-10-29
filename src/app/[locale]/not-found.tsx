'use client';

import * as React from 'react';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  const tNav = useTranslations('nav');

  return (
    <div className="container mx-auto px-4 py-24 sm:py-32 flex flex-col items-center justify-center text-center">
      <div className="h-20 w-20 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-3xl mb-6">
        404
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
        Page Not Found
      </h1>
      <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
        The page or resource you are looking for does not exist, has been archived, or may have been moved.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link href="/">
          <Button className="gap-2">
            <Home className="h-4 w-4" />
            <span>{tNav('home')}</span>
          </Button>
        </Link>
        <Link href="/news">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>{tNav('news')}</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
