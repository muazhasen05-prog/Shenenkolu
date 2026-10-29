'use client';

import * as React from 'react';
import { Bell, CheckCircle, AlertCircle, BellOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function NotificationBell() {
  const t = useTranslations('notifications');
  const tCommon = useTranslations('common');
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [permissionDenied, setPermissionDenied] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'denied') {
        setPermissionDenied(true);
      } else if (Notification.permission === 'granted') {
        // Check existing subscription
        navigator.serviceWorker?.ready.then((reg) => {
          reg.pushManager.getSubscription().then((sub) => {
            setIsSubscribed(!!sub);
          });
        });
      }
    }
  }, []);

  const handleToggleSubscription = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setMessage('Web Push is not supported by your current browser.');
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const reg = await navigator.serviceWorker.ready;

      if (isSubscribed) {
        // Unsubscribe
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          await sub.unsubscribe();
          await fetch('/api/push/unsubscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint: sub.endpoint }),
          });
        }
        setIsSubscribed(false);
        setMessage('You have been unsubscribed from push notifications.');
      } else {
        // Subscribe
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidPublicKey) {
          setMessage('VAPID public key is not configured.');
          setIsLoading(false);
          return;
        }

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          setPermissionDenied(true);
          setMessage(t('permissionDenied'));
          setIsLoading(false);
          return;
        }

        const convertedKey = urlBase64ToUint8Array(vapidPublicKey);
        const subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedKey,
        });

        // Send to backend
        const res = await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
            keys: {
              p256dh: btoa(
                String.fromCharCode.apply(
                  null,
                  Array.from(new Uint8Array(subscription.getKey('p256dh') || new ArrayBuffer(0)))
                )
              ),
              auth: btoa(
                String.fromCharCode.apply(
                  null,
                  Array.from(new Uint8Array(subscription.getKey('auth') || new ArrayBuffer(0)))
                )
              ),
            },
          }),
        });

        if (res.ok) {
          setIsSubscribed(true);
          setMessage('Push notifications enabled successfully!');
        } else {
          setMessage('Failed to register subscription with server.');
        }
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setMessage('An error occurred while updating notifications.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative inline-flex items-center justify-center h-9 w-9 rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="View notifications"
      >
        <Bell className="h-4 w-4" />
        {isSubscribed && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        )}
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={t('title')}
        description={t('subtitle')}
      >
        <div className="space-y-4 py-2">
          {message && (
            <div className="rounded-lg bg-muted p-3 text-sm flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>{message}</span>
            </div>
          )}

          {permissionDenied ? (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive flex items-start gap-2">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{t('permissionDenied')}</p>
                <p className="text-xs mt-1 text-muted-foreground">
                  To receive notifications, please open your browser settings, find this site, and set notifications to &quot;Allow&quot;.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      isSubscribed ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isSubscribed ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {isSubscribed ? t('pushEnabled') : t('pushDisabled')}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Instant alerts for breaking woreda news & meetings
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant={isSubscribed ? 'outline' : 'default'}
                  onClick={handleToggleSubscription}
                  isLoading={isLoading}
                >
                  {isSubscribed ? t('unsubscribeBtn') : t('subscribeBtn')}
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2 pt-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Notification Channels
            </h5>
            <ul className="text-sm space-y-1.5 text-foreground">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{t('newArticles')}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span>{t('urgentAlerts')}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                <span>{t('meetingReminders')}</span>
              </li>
            </ul>
          </div>

          <div className="flex justify-end pt-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              {tCommon('close')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
