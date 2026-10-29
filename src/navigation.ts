import { createNavigation } from 'next-intl/navigation';

export const locales = ['en', 'om', 'am'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  om: 'Afaan Oromoo',
  am: 'አማርኛ',
};

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  defaultLocale,
});
