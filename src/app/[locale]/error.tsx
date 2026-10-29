'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const tCommon = useTranslations('common');

  React.useEffect(() => {
    console.error('Shenen Kolu Application Error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
      <div className="h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-6">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
        {tCommon('error')}
      </h2>
      <p className="text-muted-foreground max-w-md mb-6 text-sm">
        A temporary error occurred while processing your request. Please try again or return to the homepage.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>{tCommon('retry')}</span>
        </Button>
      </div>
    </div>
  );
}
