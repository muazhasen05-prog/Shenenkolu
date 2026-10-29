-- =============================================================================
-- Migration 0002: Row Level Security (RLS) & Role-Based Authorization
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pwa_installs ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- Helper Functions with Fixed Safe search_path
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('super_admin', 'editor', 'moderator')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_editor_or_above()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('super_admin', 'editor')
  );
$$;

-- -----------------------------------------------------------------------------
-- Profiles Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Public profiles are readable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile fields except role"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    (role = (SELECT role FROM public.profiles WHERE id = auth.uid()) OR public.is_super_admin())
  );

CREATE POLICY "Super admins can update any profile including roles"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.is_super_admin());

-- -----------------------------------------------------------------------------
-- News Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Public can view published news"
  ON public.news FOR SELECT
  USING (
    status = 'published' AND
    (published_at IS NULL OR published_at <= timezone('utc'::text, now()))
  );

CREATE POLICY "Staff can view all news drafts and scheduled"
  ON public.news FOR SELECT
  TO authenticated
  USING (public.is_staff());

CREATE POLICY "Editors and super admins can insert news"
  ON public.news FOR INSERT
  TO authenticated
  WITH CHECK (public.is_editor_or_above());

CREATE POLICY "Editors and super admins can update news"
  ON public.news FOR UPDATE
  TO authenticated
  USING (public.is_editor_or_above());

CREATE POLICY "Editors and super admins can delete news"
  ON public.news FOR DELETE
  TO authenticated
  USING (public.is_editor_or_above());

-- News Translations Policies
CREATE POLICY "Public can view published news translations"
  ON public.news_translations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.news n
      WHERE n.id = news_translations.news_id
        AND n.status = 'published'
        AND (n.published_at IS NULL OR n.published_at <= timezone('utc'::text, now()))
    )
  );

CREATE POLICY "Staff can view all news translations"
  ON public.news_translations FOR SELECT
  TO authenticated
  USING (public.is_staff());

CREATE POLICY "Editors can manage news translations"
  ON public.news_translations FOR ALL
  TO authenticated
  USING (public.is_editor_or_above());

-- -----------------------------------------------------------------------------
-- Announcements Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Public can view active announcements"
  ON public.announcements FOR SELECT
  USING (
    status = 'published' AND
    (expires_at IS NULL OR expires_at > timezone('utc'::text, now()))
  );

CREATE POLICY "Staff can view all announcements"
  ON public.announcements FOR SELECT
  TO authenticated
  USING (public.is_staff());

CREATE POLICY "Editors can insert announcements"
  ON public.announcements FOR INSERT
  TO authenticated
  WITH CHECK (public.is_editor_or_above());

CREATE POLICY "Editors can update announcements"
  ON public.announcements FOR UPDATE
  TO authenticated
  USING (public.is_editor_or_above());

CREATE POLICY "Editors can delete announcements"
  ON public.announcements FOR DELETE
  TO authenticated
  USING (public.is_editor_or_above());

-- Announcement Translations Policies
CREATE POLICY "Public can view published announcement translations"
  ON public.announcement_translations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.announcements a
      WHERE a.id = announcement_translations.announcement_id
        AND a.status = 'published'
        AND (a.expires_at IS NULL OR a.expires_at > timezone('utc'::text, now()))
    )
  );

CREATE POLICY "Staff can view all announcement translations"
  ON public.announcement_translations FOR SELECT
  TO authenticated
  USING (public.is_staff());

CREATE POLICY "Editors can manage announcement translations"
  ON public.announcement_translations FOR ALL
  TO authenticated
  USING (public.is_editor_or_above());

-- -----------------------------------------------------------------------------
-- Gallery Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Public can view published gallery items"
  ON public.gallery_items FOR SELECT
  USING (is_published = true);

CREATE POLICY "Staff can view all gallery items"
  ON public.gallery_items FOR SELECT
  TO authenticated
  USING (public.is_staff());

CREATE POLICY "Editors can manage gallery items"
  ON public.gallery_items FOR ALL
  TO authenticated
  USING (public.is_editor_or_above());

CREATE POLICY "Public can view gallery translations"
  ON public.gallery_translations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.gallery_items g
      WHERE g.id = gallery_translations.gallery_item_id
        AND g.is_published = true
    )
  );

CREATE POLICY "Staff can manage gallery translations"
  ON public.gallery_translations FOR ALL
  TO authenticated
  USING (public.is_editor_or_above());

-- -----------------------------------------------------------------------------
-- Meetings Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Public can view public meetings"
  ON public.meetings FOR SELECT
  USING (
    access_policy = 'public' AND
    status IN ('scheduled', 'active')
  );

CREATE POLICY "Members can view member meetings"
  ON public.meetings FOR SELECT
  TO authenticated
  USING (
    (access_policy IN ('public', 'members') AND status IN ('scheduled', 'active'))
    OR public.is_staff()
  );

CREATE POLICY "Staff can manage meetings"
  ON public.meetings FOR ALL
  TO authenticated
  USING (public.is_staff());

-- Meeting Translations
CREATE POLICY "Public can view meeting translations"
  ON public.meeting_translations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.meetings m
      WHERE m.id = meeting_translations.meeting_id
        AND (m.access_policy = 'public' OR auth.role() = 'authenticated')
    )
  );

CREATE POLICY "Staff can manage meeting translations"
  ON public.meeting_translations FOR ALL
  TO authenticated
  USING (public.is_staff());

-- Meeting Participants
CREATE POLICY "Participants can view their room participants"
  ON public.meeting_participants FOR SELECT
  USING (true);

CREATE POLICY "Participants can insert their join record"
  ON public.meeting_participants FOR INSERT
  WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- Events Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Public can view scheduled events"
  ON public.events FOR SELECT
  USING (status IN ('scheduled', 'completed'));

CREATE POLICY "Staff can manage events"
  ON public.events FOR ALL
  TO authenticated
  USING (public.is_staff());

CREATE POLICY "Public can view event translations"
  ON public.event_translations FOR SELECT
  USING (true);

CREATE POLICY "Staff can manage event translations"
  ON public.event_translations FOR ALL
  TO authenticated
  USING (public.is_staff());

-- -----------------------------------------------------------------------------
-- Push Subscriptions Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Anyone can register push subscription"
  ON public.push_subscriptions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can manage their own push subscription"
  ON public.push_subscriptions FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can remove their push subscription"
  ON public.push_subscriptions FOR DELETE
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Staff can view push subscriber metrics"
  ON public.push_subscriptions FOR SELECT
  TO authenticated
  USING (public.is_staff());

-- -----------------------------------------------------------------------------
-- Notifications Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Authenticated users can read notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can insert notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff());

-- -----------------------------------------------------------------------------
-- Contact Messages Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Anyone can submit contact message"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Staff can view and update contact messages"
  ON public.contact_messages FOR ALL
  TO authenticated
  USING (public.is_staff());

-- -----------------------------------------------------------------------------
-- Site Settings Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Public can read site settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Super admins can manage site settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.is_super_admin());

-- -----------------------------------------------------------------------------
-- Audit Logs Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Super admins can view audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (public.is_super_admin());

CREATE POLICY "Server can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- PWA Installs Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Public can record PWA install"
  ON public.pwa_installs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Staff can view install metrics"
  ON public.pwa_installs FOR SELECT
  TO authenticated
  USING (public.is_staff());
