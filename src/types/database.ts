export type UserRole = 'super_admin' | 'editor' | 'moderator' | 'member';

export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'archived';
export type AnnouncementPriority = 'normal' | 'urgent';
export type MeetingAccessPolicy = 'public' | 'members' | 'restricted';
export type MeetingStatus = 'scheduled' | 'active' | 'completed' | 'cancelled';
export type SupportedLocale = 'en' | 'om' | 'am';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string | null;
  phone?: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  category: string;
  featured_image: string;
  images?: string[];
  status: ContentStatus;
  is_featured: boolean;
  is_pinned: boolean;
  author_id?: string | null;
  author_name?: string | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  // Joined or resolved translations
  translations?: NewsTranslation[];
  // Resolved for current locale with English fallback
  title?: string;
  excerpt?: string;
  body?: string;
}

export interface NewsTranslation {
  id: string;
  news_id?: string;
  locale: SupportedLocale;
  title: string;
  excerpt: string;
  body: string;
  seo_title?: string | null;
  seo_description?: string | null;
}

export interface Announcement {
  id: string;
  priority: AnnouncementPriority;
  status: ContentStatus;
  is_pinned: boolean;
  attachment_url?: string | null;
  attachment_name?: string | null;
  author_id?: string | null;
  published_at?: string | null;
  expires_at?: string | null;
  created_at: string;
  updated_at: string;
  translations?: AnnouncementTranslation[];
  title?: string;
  body?: string;
}

export interface AnnouncementTranslation {
  id: string;
  announcement_id?: string;
  locale: SupportedLocale;
  title: string;
  body: string;
}

export interface GalleryItem {
  id: string;
  image_url: string;
  category: string;
  sort_order: number;
  is_published: boolean;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  translations?: GalleryTranslation[];
  title?: string;
  description?: string;
  alt_text?: string;
}

export interface GalleryTranslation {
  id: string;
  gallery_item_id?: string;
  locale: SupportedLocale;
  title: string;
  description?: string | null;
  alt_text: string;
}

export interface Meeting {
  id: string;
  room_id: string;
  host_id?: string | null;
  host_name?: string | null;
  scheduled_start: string;
  duration_minutes: number;
  access_policy: MeetingAccessPolicy;
  status: MeetingStatus;
  max_participants: number;
  created_at: string;
  updated_at: string;
  translations?: MeetingTranslation[];
  title?: string;
  description?: string;
}

export interface MeetingTranslation {
  id: string;
  meeting_id?: string;
  locale: SupportedLocale;
  title: string;
  description?: string | null;
}

export interface CommunityEvent {
  id: string;
  location: string;
  start_time: string;
  end_time?: string | null;
  organizer: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  translations?: EventTranslation[];
  title?: string;
  description?: string;
}

export interface EventTranslation {
  id: string;
  event_id: string;
  locale: SupportedLocale;
  title: string;
  description?: string | null;
}

export interface PushSubscriptionRecord {
  id: string;
  user_id?: string | null;
  endpoint: string;
  p256dh: string;
  auth: string;
  user_agent?: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  url?: string | null;
  category: 'news' | 'announcement' | 'meeting' | 'system';
  sent_by?: string | null;
  delivered_count: number;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  ip_address?: string | null;
  created_at: string;
}

export interface SiteSetting {
  key: string;
  value: Record<string, unknown>;
  updated_by?: string | null;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  actor_id?: string | null;
  actor_email?: string | null;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  details?: Record<string, unknown> | null;
  ip_address?: string | null;
  created_at: string;
}
