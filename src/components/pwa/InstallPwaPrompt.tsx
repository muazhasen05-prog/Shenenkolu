'use client';

import * as React from 'react';
import { Download, Share, PlusSquare, Smartphone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { BeforeInstallPromptEvent } from './PwaRegister';

export function InstallPwaPrompt() {
  const t = useTranslations('common');
  const tPwa = useTranslations('pwa');
  const [canInstall, setCanInstall] = React.useState(false);
  const [isIos, setIsIos] = React.useState(false);
  const [isStandalone, setIsStandalone] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);

  React.useEffect(() => {
    // Check if already in standalone display mode
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    const onInstallable = () => {
      setCanInstall(true);
    };

    window.addEventListener('pwa-installable', onInstallable);

    // If deferredPrompt is already stored on window
    if ((window as unknown as { deferredInstallPrompt?: BeforeInstallPromptEvent }).deferredInstallPrompt) {
      setCanInstall(true);
    }

    return () => {
      window.removeEventListener('pwa-installable', onInstallable);
    };
  }, []);

  if (isStandalone) {
    return null; // Already installed and operating in PWA mode
  }

  const handleInstallClick = async () => {
    const deferredPrompt = (window as unknown as { deferredInstallPrompt?: BeforeInstallPromptEvent })
      .deferredInstallPrompt;

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setCanInstall(false);
      }
      (window as unknown as { deferredInstallPrompt?: BeforeInstallPromptEvent }).deferredInstallPrompt = undefined;
    } else {
      // Show instructional modal (for iOS or non-prompting browsers)
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        title={t('installApp')}
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">{t('installApp')}</span>
      </button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={t('installPromptTitle')}
        description={t('installPromptDesc')}
      >
        <div className="space-y-4 py-2">
          {isIos ? (
            <div className="rounded-lg bg-muted/60 p-4 space-y-3 text-sm">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Smartphone className="h-5 w-5 text-primary" />
                <span>Instructions for Apple iOS (Safari)</span>
              </div>
              <p className="text-muted-foreground">{tPwa('installGuideIos')}</p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span>1. Tap the Share button</span>
                  <Share className="h-4 w-4 text-primary inline" />
                  <span>at the bottom of your screen.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>2. Scroll down and tap</span>
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    <PlusSquare className="h-4 w-4" /> Add to Home Screen
                  </span>
                </li>
                <li>3. Tap &ldquo;Add&rdquo; in the top-right corner to finish.</li>
              </ol>
            </div>
          ) : (
            <div className="rounded-lg bg-muted/60 p-4 space-y-2 text-sm text-muted-foreground">
              <p>{tPwa('installGuideAndroid')}</p>
              <p>You can also install this platform directly from your browser&apos;s options menu (&vellip; &rarr; Install App).</p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              {t('close')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
