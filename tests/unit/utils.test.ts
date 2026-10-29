import { describe, it, expect } from 'vitest';
import { slugify, truncate, formatDate } from '@/lib/utils';

describe('Utility Functions', () => {
  it('slugifies latin and mixed strings cleanly', () => {
    expect(slugify('Shenen Kolu Woreda Development 2026')).toBe(
      'shenen-kolu-woreda-development-2026'
    );
    expect(slugify('Special !@#$%^&*() Characters')).toBe('special-characters');
  });

  it('truncates long strings with ellipsis', () => {
    const text = 'This is a long sentence intended to test the truncation utility helper.';
    expect(truncate(text, 20)).toBe('This is a long sente...');
    expect(truncate('Short', 50)).toBe('Short');
  });

  it('formats dates safely using Africa/Addis_Ababa timezone', () => {
    const timestamp = '2026-10-29T10:00:00Z';
    const formattedEn = formatDate(timestamp, 'en');
    expect(formattedEn).toContain('2026');

    // Safe handling of null/undefined
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
    expect(formatDate('invalid-date-string')).toBe('');
  });
});
