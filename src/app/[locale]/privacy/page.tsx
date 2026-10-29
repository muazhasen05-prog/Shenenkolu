import * as React from 'react';
import { getTranslations } from 'next-intl/server';
import { ShieldCheck } from 'lucide-react';

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  return (
    <div className="py-12 sm:py-16 bg-background min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" />
            <span>Public Data Protection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {tCommon('privacyPolicy')}
          </h1>
          <p className="text-xs text-muted-foreground">
            Effective Date: October 2026 &bull; Shenen Kolu Woreda Prosperity Party
          </p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-foreground text-sm sm:text-base leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">1. Commitment to Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Shenen Kolu Woreda Prosperity Party is committed to protecting the privacy, confidentiality, and data sovereignty of all community members visiting our public web platform and Progressive Web Application (PWA).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">2. Information Collected</h2>
            <p className="text-muted-foreground leading-relaxed">
              We collect only the minimum necessary data to provide verified institutional communications:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
              <li>Contact submissions (name, email, phone, message topic)</li>
              <li>Push notification tokens (anonymous browser endpoints for Web Push alerts)</li>
              <li>Account credentials for authorized staff and registered members</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">3. Live Meetings & WebRTC</h2>
            <p className="text-muted-foreground leading-relaxed">
              Real-time video/audio meetings operate via end-to-end encrypted WebRTC through LiveKit. Audio and video streams are transmitted strictly in real time. We do not automatically record, store, or sell meeting audio or video.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">4. Cookies and Local Storage</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use strictly functional cookies to preserve your selected language preference (English, Afaan Oromoo, or Amharic) and maintain active staff sessions. No commercial tracking or advertising cookies are utilized.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
