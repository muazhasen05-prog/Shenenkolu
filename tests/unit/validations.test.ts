import { describe, it, expect } from 'vitest';
import {
  contactFormSchema,
  newsFormSchema,
  announcementFormSchema,
  pushSubscriptionSchema,
} from '@/lib/validations';

describe('Zod Validation Schemas', () => {
  describe('contactFormSchema', () => {
    it('accepts valid contact submission data', () => {
      const valid = {
        fullName: 'Chala Gemechu',
        email: 'chala@example.com',
        phone: '+251911000000',
        subject: 'Woreda Irrigation Inquiry',
        message: 'I would like to inquire about cooperative solar pump access.',
      };
      const result = contactFormSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      const invalid = {
        fullName: 'Chala Gemechu',
        email: 'not-an-email',
        subject: 'Inquiry',
        message: 'This is a message with sufficient length.',
      };
      const result = contactFormSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects message shorter than 10 characters', () => {
      const invalid = {
        fullName: 'Chala Gemechu',
        email: 'chala@example.com',
        subject: 'Inquiry',
        message: 'Short',
      };
      const result = contactFormSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('newsFormSchema', () => {
    it('validates news article slug format (alphanumeric and dashes)', () => {
      const valid = {
        slug: 'valid-slug-123',
        category: 'Agriculture',
        featured_image: '',
        status: 'published' as const,
        is_featured: false,
        is_pinned: false,
        en: { title: 'English Title', excerpt: 'Excerpt', body: 'Body text content' },
        om: { title: 'Oromo Title', excerpt: 'Excerpt', body: 'Body text content' },
        am: { title: 'Amharic Title', excerpt: 'Excerpt', body: 'Body text content' },
      };
      expect(newsFormSchema.safeParse(valid).success).toBe(true);

      const invalidSlug = { ...valid, slug: 'Invalid Slug with Spaces!' };
      expect(newsFormSchema.safeParse(invalidSlug).success).toBe(false);
    });
  });

  describe('pushSubscriptionSchema', () => {
    it('validates valid web push subscription object', () => {
      const valid = {
        endpoint: 'https://fcm.googleapis.com/fcm/send/sample-token',
        keys: {
          p256dh: 'BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QT9t044Yjs2TU2CudzwTU201HBEGSOxPtLw30SpU5N8KqvYk=',
          auth: 'tBHItJI5svbpez7KI4CCXg==',
        },
      };
      expect(pushSubscriptionSchema.safeParse(valid).success).toBe(true);
    });

    it('rejects malformed push endpoints', () => {
      const invalid = {
        endpoint: 'not-a-valid-url',
        keys: {
          p256dh: 'key',
          auth: 'auth',
        },
      };
      expect(pushSubscriptionSchema.safeParse(invalid).success).toBe(false);
    });
  });
});
