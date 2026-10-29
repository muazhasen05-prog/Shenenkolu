import { z } from 'zod';

export const contactFormSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().max(20).optional().or(z.literal('')),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(150),
  message: z.string().min(10, 'Message must be at least 10 characters').max(3000),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const translationFieldSchema = z.object({
  title: z.string().min(2, 'Title is required').max(300),
  excerpt: z.string().max(500).optional().or(z.literal('')),
  body: z.string().min(5, 'Content body is required'),
});

export const newsFormSchema = z.object({
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9\-]+$/, 'Slug must be lowercase alphanumeric and dashes only'),
  category: z.string().min(2, 'Category is required'),
  featured_image: z.string().url('Must be a valid image URL').or(z.literal('')),
  status: z.enum(['draft', 'scheduled', 'published', 'archived']),
  is_featured: z.boolean().default(false),
  is_pinned: z.boolean().default(false),
  published_at: z.string().optional().nullable(),
  en: translationFieldSchema,
  om: translationFieldSchema,
  am: translationFieldSchema,
});

export type NewsFormData = z.infer<typeof newsFormSchema>;

export const announcementFormSchema = z.object({
  priority: z.enum(['normal', 'urgent']),
  status: z.enum(['draft', 'published', 'archived']),
  is_pinned: z.boolean().default(false),
  expires_at: z.string().optional().nullable(),
  attachment_url: z.string().optional().nullable(),
  attachment_name: z.string().optional().nullable(),
  en: z.object({
    title: z.string().min(2, 'English title is required'),
    body: z.string().min(5, 'English body is required'),
  }),
  om: z.object({
    title: z.string().min(2, 'Afaan Oromoo title is required'),
    body: z.string().min(5, 'Afaan Oromoo body is required'),
  }),
  am: z.object({
    title: z.string().min(2, 'Amharic title is required'),
    body: z.string().min(5, 'Amharic body is required'),
  }),
});

export type AnnouncementFormData = z.infer<typeof announcementFormSchema>;

export const galleryItemFormSchema = z.object({
  image_url: z.string().min(1, 'Image URL or path is required'),
  category: z.string().min(1, 'Category is required'),
  sort_order: z.number().int().default(0),
  is_published: z.boolean().default(true),
  en: z.object({
    title: z.string().min(1, 'English title is required'),
    description: z.string().optional(),
    alt_text: z.string().min(1, 'English alt text is required for accessibility'),
  }),
  om: z.object({
    title: z.string().min(1, 'Afaan Oromoo title is required'),
    description: z.string().optional(),
    alt_text: z.string().min(1, 'Alt text is required'),
  }),
  am: z.object({
    title: z.string().min(1, 'Amharic title is required'),
    description: z.string().optional(),
    alt_text: z.string().min(1, 'Alt text is required'),
  }),
});

export type GalleryItemFormData = z.infer<typeof galleryItemFormSchema>;

export const meetingFormSchema = z.object({
  room_id: z.string().min(3).regex(/^[a-zA-Z0-9_\-]+$/),
  scheduled_start: z.string().min(1, 'Start time is required'),
  duration_minutes: z.number().int().min(5).max(480).default(60),
  access_policy: z.enum(['public', 'members', 'restricted']),
  status: z.enum(['scheduled', 'active', 'completed', 'cancelled']).default('scheduled'),
  max_participants: z.number().int().min(2).max(100).default(50),
  en: z.object({
    title: z.string().min(2, 'Title is required'),
    description: z.string().optional(),
  }),
  om: z.object({
    title: z.string().min(2, 'Title is required'),
    description: z.string().optional(),
  }),
  am: z.object({
    title: z.string().min(2, 'Title is required'),
    description: z.string().optional(),
  }),
});

export type MeetingFormData = z.infer<typeof meetingFormSchema>;

export const pushSubscriptionSchema = z.object({
  endpoint: z.string().url('Endpoint must be a valid URL'),
  keys: z.object({
    p256dh: z.string().min(1, 'p256dh key is required'),
    auth: z.string().min(1, 'auth key is required'),
  }),
  userAgent: z.string().optional(),
});

export const sendPushBroadcastSchema = z.object({
  title: z.string().min(2, 'Notification title is required').max(100),
  message: z.string().min(5, 'Message body is required').max(300),
  url: z.string().min(1, 'Action URL is required'),
  category: z.enum(['news', 'announcement', 'meeting', 'system']).default('news'),
});
