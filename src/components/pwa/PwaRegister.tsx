'use client';

import * as React from 'react';

// Extend window object with BeforeInstallPromptEvent
declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PwaRegister() {
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Shenen Kolu PWA ServiceWorker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.warn('ServiceWorker registration failed:', error);
        });
    }

    // Capture install prompt
    const handleBeforeInstall = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      (window as unknown as { deferredInstallPrompt?: BeforeInstallPromptEvent }).deferredInstallPrompt = e;
      window.dispatchEvent(new CustomEvent('pwa-installable'));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Track when app is installed
    window.addEventListener('appinstalled', () => {
      console.log('Shenen Kolu PWA was installed');
      // Fire install metric tracking endpoint
      fetch('/api/pwa/install-metric', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAgent: navigator.userAgent }),
      }).catch(() => {});
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  return null;
}
