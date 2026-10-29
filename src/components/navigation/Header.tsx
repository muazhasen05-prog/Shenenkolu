'use client';

import * as React from 'react';
import { Link, usePathname } from '@/navigation';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { MobileNav } from './MobileNav';
import { InstallPwaPrompt } from '@/components/pwa/InstallPwaPrompt';
import { NotificationBell } from '@/components/pwa/NotificationBell';
import { LayoutDashboard } from 'lucide-react';

export function Header() {
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const pathname = usePathname();

  const links = [
    { href: '/', label: tNav('home') },
    { href: '/news', label: tNav('news') },
    { href: '/announcements', label: tNav('announcements') },
    { href: '/gallery', label: tNav('gallery') },
    { href: '/events', label: tNav('events') },
    { href: '/meetings', label: tNav('meetings') },
    { href: '/about', label: tNav('about') },
    { href: '/contact', label: tNav('contact') },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-emerald-500 flex items-center justify-center text-primary-foreground font-black text-lg shadow-sm border border-primary/20">
            SK
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {tCommon('siteName')}
            </span>
            <span className="text-xs text-muted-foreground hidden lg:inline">
              Oromia, Ethiopia
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Cluster */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <InstallPwaPrompt />
            <NotificationBell />
            <ThemeToggle />
            <LanguageSwitcher />
          </div>

          <Link
            href="/admin"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground text-sm font-semibold transition-all shadow-sm"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>{tNav('admin')}</span>
          </Link>

          {/* Mobile Navigation Trigger */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
