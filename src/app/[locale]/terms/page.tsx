import * as React from 'react';
import { getTranslations } from 'next-intl/server';
import { FileText } from 'lucide-react';

export default async function TermsOfServicePage({
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
            <FileText className="h-4 w-4" />
            <span>Institutional Policy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {tCommon('termsOfService')}
          </h1>
          <p className="text-xs text-muted-foreground">
            Shenen Kolu Woreda Prosperity Party &bull; Official Community Portal
          </p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-foreground text-sm sm:text-base leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using the Shenen Kolu Woreda Prosperity Party website or installable PWA, you agree to comply with verified institutional terms and applicable laws of the Federal Democratic Republic of Ethiopia and Oromia Regional State.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">2. Authorized Use</h2>
            <p className="text-muted-foreground leading-relaxed">
              This platform provides authentic news, civic advisories, community consultation meetings, and developmental reports. Users agree not to disrupt public meetings, upload malicious content, or impersonate woreda officials.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">3. Official Content & Copyright</h2>
            <p className="text-muted-foreground leading-relaxed">
              All official articles, circulars, photographs, and media published on this portal are the intellectual property of the Shenen Kolu Woreda Administration and Prosperity Party, published for public benefit and citizen engagement.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
