'use client';

import * as React from 'react';
import { Link, usePathname } from '@/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X, Home, Newspaper, Bell, Image, Calendar, Video, Info, Mail, LayoutDashboard, LogIn } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { InstallPwaPrompt } from '@/components/pwa/InstallPwaPrompt';

export function MobileNav() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  // Close drawer when path changes
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { href: '/', label: tNav('home'), icon: Home },
    { href: '/news', label: tNav('news'), icon: Newspaper },
    { href: '/announcements', label: tNav('announcements'), icon: Bell },
    { href: '/gallery', label: tNav('gallery'), icon: Image },
    { href: '/events', label: tNav('events'), icon: Calendar },
    { href: '/meetings', label: tNav('meetings'), icon: Video },
    { href: '/about', label: tNav('about'), icon: Info },
    { href: '/contact', label: tNav('contact'), icon: Mail },
  ];

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center p-2 rounded-lg border border-border bg-background text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Open mobile menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="fixed inset-y-0 right-0 w-full max-w-xs bg-background p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    SK
                  </div>
                  <span className="font-bold text-sm line-clamp-1">{tCommon('siteName')}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="mt-6 flex flex-col space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground font-bold'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="my-6 border-t border-border pt-4 space-y-2">
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>{tNav('admin')}</span>
                </Link>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  <span>{tNav('login')}</span>
                </Link>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-border pt-4 flex items-center justify-between">
              <LanguageSwitcher />
              <div className="flex items-center gap-2">
                <InstallPwaPrompt />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
