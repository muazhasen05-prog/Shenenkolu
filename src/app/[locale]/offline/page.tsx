'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { WifiOff, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function OfflinePage() {
  const t = useTranslations('pwa');

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
      <div className="h-20 w-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
        <WifiOff className="h-10 w-10" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-3">
        {t('offlineTitle')}
      </h1>
      <p className="text-muted-foreground max-w-md mb-8 text-sm sm:text-base leading-relaxed">
        {t('offlineDesc')}
      </p>
      <Button onClick={handleRetry} className="gap-2">
        <RotateCcw className="h-4 w-4" />
        <span>{t('reload')}</span>
      </Button>
    </div>
  );
}
