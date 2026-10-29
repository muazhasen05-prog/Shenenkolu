'use client';

import * as React from 'react';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import { MapPin, Mail, Phone, ShieldCheck } from 'lucide-react';

export function Footer() {
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="container mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Organization Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-emerald-500 flex items-center justify-center text-primary-foreground font-black text-lg shadow-sm">
                SK
              </div>
              <span className="font-bold text-base leading-tight">
                {tCommon('siteName')}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {tCommon('slogan')}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Verified Institutional Information Portal</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  {tNav('home')}
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-muted-foreground hover:text-primary transition-colors">
                  {tNav('news')}
                </Link>
              </li>
              <li>
                <Link href="/announcements" className="text-muted-foreground hover:text-primary transition-colors">
                  {tNav('announcements')}
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-muted-foreground hover:text-primary transition-colors">
                  {tNav('gallery')}
                </Link>
              </li>
              <li>
                <Link href="/meetings" className="text-muted-foreground hover:text-primary transition-colors">
                  {tNav('meetings')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Governance & Community */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Institutional
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  {tNav('about')}
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-muted-foreground hover:text-primary transition-colors">
                  {tNav('events')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  {tNav('contact')}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  {tNav('admin')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  {tCommon('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  {tCommon('termsOfService')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Office Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Executive Office
            </h4>
            <div className="space-y-2.5 text-sm text-muted-foreground">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Shenen Kolu Woreda Administration Complex, Oromia, Ethiopia</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>info@shenenkolu.gov.et</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+251 11 000 0000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>{tCommon('copyright', { year: currentYear.toString() })}</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:underline">
              {tCommon('privacyPolicy')}
            </Link>
            <span>&bull;</span>
            <Link href="/terms" className="hover:underline">
              {tCommon('termsOfService')}
            </Link>
            <span>&bull;</span>
            <span>Ethiopian Standard Time (UTC+3)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
