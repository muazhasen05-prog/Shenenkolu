import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date in locale-aware format using Africa/Addis_Ababa timezone
 */
export function formatDate(
  dateInput: string | Date | null | undefined,
  locale: string = 'en',
  options?: Intl.DateTimeFormatOptions
): string {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '';

  const defaultOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Africa/Addis_Ababa',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };

  try {
    // Map internal locale to BCP 47 locale
    const bcp47Locale = locale === 'om' ? 'om-ET' : locale === 'am' ? 'am-ET' : 'en-US';
    return new Intl.DateTimeFormat(bcp47Locale, defaultOptions).format(date);
  } catch {
    return date.toLocaleDateString();
  }
}

/**
 * Format time with Addis Ababa timezone
 */
export function formatTime(
  dateInput: string | Date | null | undefined,
  locale: string = 'en'
): string {
  return formatDate(dateInput, locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Truncate text cleanly to a maximum length
 */
export function truncate(text: string | null | undefined, maxLength: number = 160): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '...';
}

/**
 * Generate URL safe slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u1200-\u137F\-]+/g, '') // Keep alphanumeric and Ethiopic Unicode characters
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}
