'use client';

import * as React from 'react';
import { usePathname, useRouter, locales, Locale, localeNames } from '@/navigation';
import { useLocale } from 'next-intl';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const handleSelectLanguage = (newLocale: Locale) => {
    // 1. Set server-readable cookie for Next.js middleware and future visits
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    // 2. Persist in localStorage
    try {
      localStorage.setItem('preferred_locale', newLocale);
    } catch {
      // Ignore
    }

    // 3. Navigate with new locale, preserving current sub-path
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select Language"
      >
        <Globe className="h-4 w-4 text-primary" />
        <span className="font-semibold">{localeNames[currentLocale]}</span>
        <svg
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-card p-1 text-card-foreground shadow-lg z-50 animate-in fade-in zoom-in-95 duration-150">
          {locales.map((locale) => {
            const isSelected = locale === currentLocale;
            return (
              <button
                key={locale}
                onClick={() => handleSelectLanguage(locale)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg text-left transition-colors ${
                  isSelected
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <span>{localeNames[locale]}</span>
                {isSelected && (
                  <span className="h-2 w-2 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
