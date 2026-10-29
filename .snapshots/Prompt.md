# FINAL MASTER PROMPT — SHENEN KOLU WOREDA PROSPERITY PARTY

## Design, Development, Integration, Testing, Security, and Zero-Cost Deployment of a Complete Multilingual Progressive Web Application

# 1. ROLE, RESPONSIBILITIES, AND EXECUTION EXPECTATIONS

You are an expert senior full-stack software engineer, software architect, UI/UX designer, Supabase database administrator, cybersecurity engineer, PWA specialist, real-time communications engineer, quality assurance engineer, and DevOps lead.

Your mission is to build, test, and prepare a complete application named:

**Shenen Kolu Woreda Prosperity Party**

This is a public community information platform through which visitors can read official news, announcements, photographs, community stories, event information, and meeting details. Authorized administrators must be able to manage the platform through a secure administration dashboard.

The system must operate as both:

1. A responsive website accessible through a browser.
2. An installable Progressive Web App (PWA) on compatible devices.

The website must support English, Afaan Oromoo, and Amharic. Users must be able to switch languages from any applicable page.

The application must include a genuine database, secure authentication, role-based authorization, media storage, news publishing, announcement management, photo gallery, online meetings, installation support, web push notifications, automated tests, and deployment documentation.

## Strict execution rules

Build the actual application, not a demonstration, static prototype, UI-only mockup, or collection of disconnected screens.

Work autonomously and proceed through all implementation phases without waiting for approval after presenting the initial plan.

Before starting, inspect the existing project. Preserve functioning code, existing user assets, and valid configurations. If the repository is empty, create the project using the specified technology stack.

Never delete useful files, overwrite user configuration unnecessarily, expose existing secrets, or replace the entire project merely to avoid fixing a problem.

Do not finish after creating a plan, homepage, dashboard layout, or database schema. Continue through all required phases.

Do not leave TODOs, fake success messages, placeholder buttons, hardcoded dashboard statistics, mock production data, disconnected forms, or nonfunctional menu items.

Automated tests may use controlled fixtures and explicitly identified test data. Production features must use their real backend and must never present test fixtures as actual organizational content.

Do not claim that an external service is configured, a deployment succeeded, a notification was received, a meeting connected, or a test passed unless that result has been verified.

When a provider requires an account, API key, browser permission, or manual configuration, implement the integration and document the exact remaining requirement honestly. Do not invent credentials.

# 2. ABSOLUTE ZERO-COST REQUIREMENT

## 2.1 Non-negotiable budget

The project must be designed for an initial deployment with a recurring service cost of **$0 per month**.

This is a strict requirement.

Do not require the owner to purchase a subscription, paid API, premium template, paid plugin, custom domain, dedicated server, commercial UI component, or developer tool to operate the initial application.

Do not enable automatic upgrades, usage-based billing, paid overages, or paid service dependencies.

Do not use trial-only services that become paid after a limited period.

Before implementation, verify the current official pricing, eligibility requirements, quota limits, and billing behavior of every external service.

If a feature cannot be delivered reliably within a free tier, implement the best genuine free alternative and document the limitation. Never silently introduce a paid dependency.

## 2.2 Approved technology choices

Use the following stack:

- **Next.js:** latest stable release with App Router.
- **React:** compatible stable release.
- **TypeScript:** strict mode.
- **Tailwind CSS:** responsive styling.
- **shadcn/ui:** open-source interface components.
- **Framer Motion:** subtle animations with reduced-motion support.
- **Supabase Free:** PostgreSQL, Auth, Storage, RLS, and supported Realtime functionality.
- **next-intl:** locale routing and internationalization.
- **Zod and React Hook Form:** validation and forms.
- **PWA:** a compatible service worker using Serwist or another maintained, compatible standards-based implementation.
- **Web Push:** browser-supported Push API and VAPID.
- **LiveKit:** real-time audio/video integration using its verified $0 plan, subject to its actual usage limits.
- **Optional Jitsi integration:** only as a separately configured fallback or testing option where appropriate.
- **Testing:** Vitest or an equivalent open-source unit test tool, plus Playwright for browser end-to-end tests.
- **Deployment:** an eligible free hosting platform and Supabase Free.

All necessary libraries must have a usable free option under their applicable licenses.

Do not install unnecessary packages or accept a paid alternative simply because it makes implementation easier.

## 2.3 Hosting selection and restrictions

Use Vercel Hobby only if the intended non-commercial use satisfies the provider's current terms and the application can remain on the $0 plan without a paid upgrade.

Otherwise, choose a compatible free hosting alternative, such as Cloudflare Workers, using an officially documented and tested Next.js-compatible deployment method.

Before choosing a hosting approach, verify compatibility with the actual application features, including server routes, Server Actions, authentication callbacks, scheduled tasks, cookies, security headers, environment variables, and LiveKit token generation.

Do not select an experimental adapter merely because its name mentions Next.js. Verify its feature compatibility and build output before relying on it.

Use a free provider subdomain initially. A purchased custom domain must not be required.

Never enable billing or automatic upgrades.

## 2.4 Free-tier safety

Design the application to work within real provider limits.

Implement:

- Efficient database queries.
- Pagination.
- Image compression and resizing.
- Limited file upload sizes.
- Public-content caching.
- Appropriate Realtime subscriptions.
- Rate limiting using available free platform or database capabilities.
- Clear quota-related error states.
- A manual usage-review checklist.

Do not assume unlimited file storage, unlimited user activity, unlimited bandwidth, continuous database availability, unlimited meeting minutes, or unlimited notification delivery.

If quotas are reached, the affected feature must fail gracefully, preserve existing data, and explain the problem without creating charges.

# 3. INITIAL PROJECT INSPECTION AND IMPLEMENTATION PLAN

Start by inspecting the existing repository, including:

- Folder structure.
- `package.json` and lockfile.
- Next.js version and project configuration.
- TypeScript settings.
- Styling and component libraries.
- Existing routes and layouts.
- Supabase clients and database migrations.
- Authentication and authorization logic.
- Environment configuration.
- Existing PWA files.
- Tests and build scripts.
- Deployment configuration.
- Existing assets and branding.

Identify missing, broken, duplicated, insecure, incomplete, or disconnected functionality.

Prepare a concise implementation plan and proposed folder tree, then immediately proceed with implementation.

Do not wait for approval.

Maintain a development checklist and update it after every phase. Run the available verification commands after each logical implementation phase, fix discovered errors, and proceed.

If a dependency cannot be installed or a command fails because of network restrictions, inspect the error and find a genuine solution rather than ignoring the problem.

# 4. USER EXPERIENCE, BRANDING, AND VISUAL DESIGN

Create a professional, trustworthy, modern institutional website suitable for public information and community engagement.

## 4.1 Brand identity

Use the full name:

**Shenen Kolu Woreda Prosperity Party**

Provide a configurable logo area. If no official logo is available, use a simple original typographic or geometric logo that can be replaced later. Do not invent official emblems or claim that an unofficial graphic is an authorized logo.

Use a carefully balanced green, yellow, and red-inspired accent palette with neutral backgrounds. The result should feel organized and professional rather than excessively colorful.

Use consistent typography, spacing, buttons, cards, borders, icons, shadows, transitions, and page layouts.

Use Noto Sans or another suitable openly licensed font with proper Amharic/Ethiopic script support.

## 4.2 Responsive design

The full application must work on:

- Android phones.
- iPhones and iPads.
- Desktop browsers.
- Laptops.
- Tablets.
- Large displays.

Use responsive layouts and optimize for low-bandwidth connections.

Ensure that the navigation, forms, tables, image cards, dashboard sidebar, meeting controls, and language selector remain usable on narrow screens.

Implement accessible keyboard focus, semantic headings, meaningful image alt text, proper form labels, sufficient contrast, and reduced-motion preferences.

Support light and dark themes without compromising readability.

Use Framer Motion selectively. Respect `prefers-reduced-motion`.

Avoid excessive animation, unnecessary background video, oversized decorative graphics, and heavy effects that slow down low-end devices.

# 5. TECHNICAL ARCHITECTURE AND FOLDER ORGANIZATION

Use the Next.js App Router and TypeScript strict mode.

Create logical modules for:

- Localized public layouts and pages.
- Authentication.
- Protected admin layouts.
- Reusable UI components.
- Translation files.
- Supabase browser and server clients.
- Authorization utilities.
- News services.
- Announcement services.
- Media upload services.
- Gallery management.
- Meeting services.
- LiveKit integration.
- Notification services.
- Database migrations.
- Validation schemas.
- Audit logging.
- Automated tests.
- PWA files.
- Deployment configuration.

Use Server Components by default and Client Components where browser interaction is required.

Keep sensitive operations on the server.

Define strong TypeScript types for database entities, API results, form data, session information, and role permissions.

Do not use `any` as a shortcut, suppress TypeScript errors without justification, or place all business logic inside a single large component.

Choose compatible package versions based on the current stable documentation when implementation begins.

# 6. LANGUAGE SUPPORT AND LOCALIZED ROUTING

Support exactly these primary application locales:

- `en` — English.
- `om` — Afaan Oromoo.
- `am` — Amharic.

Use next-intl with localized URL prefixes.

Examples:

- `/en`
- `/om`
- `/am`
- `/en/news`
- `/om/news`
- `/am/news`

## 6.1 Homepage redirection

Opening `/` must redirect to the appropriate language homepage.

Use this language-resolution priority:

1. Valid saved language preference in a server-readable cookie.
2. Supported browser language preference.
3. English as the default.

Maintain the user's selected language through a cookie and localStorage where appropriate. Because localStorage is unavailable during server rendering, use a cookie for the initial server-side decision and synchronize localStorage after client initialization.

Avoid unnecessary language-switch redirects that lose the user's current page.

When changing the language on an article, announcement, or event page, navigate to the corresponding translated record when available.

## 6.2 Translation files

Create:

- `messages/en.json`
- `messages/om.json`
- `messages/am.json`

Every visible UI label, button, error, confirmation, form hint, navigation item, dashboard title, notification preference, meeting control, empty state, and accessible label must use the localization system.

Do not hardcode English strings inside application components when those strings should be translated.

Validate translation keys and provide appropriate fallbacks.

Implement a translation audit test so that missing or unused translation keys can be identified.

Do not claim that an unreviewed machine translation has been verified by a native speaker.

## 6.3 Dynamic content

News, announcements, gallery items, events, meeting titles, and other user-facing content must support separate language versions.

Use English as the configured fallback if the requested translation is missing.

Keep the original content language and translated versions clear to editors.

Never show internal translation keys or raw technical error messages to public users.

## 6.4 Localized dates and metadata

Support:

- Locale-aware date and time formatting.
- Ethiopian local time settings using `Africa/Addis_Ababa`.
- Correct Unicode and Ethiopic-script rendering.
- Localized document titles and descriptions.
- Canonical URLs.
- `hreflang` alternatives.
- Localized social-sharing metadata.
- Localized form validation messages.

Do not store ambiguous date strings in the database when a proper timestamp can be used.

# 7. PUBLIC WEBSITE AND HOMEPAGE

Create a fully working homepage populated from real Supabase content.

Visitors must be able to read public content without registering unless a feature specifically requires authentication.

## 7.1 Header and navigation

Include:

- Organization logo and name.
- Home.
- News.
- Announcements.
- Gallery.
- Events.
- Meetings.
- About.
- Contact.
- Language switcher.
- Search.
- Theme selector.
- Install App action when supported.
- Login or account menu depending on session state.

Every navigation link must work.

Do not use `href="#"` as a substitute for functionality.

On mobile, use a clean, accessible collapsible navigation menu.

## 7.2 Hero section

Create an attractive hero section containing:

- Organizational name.
- A concise welcome message.
- Configurable description.
- Appropriate organizational photograph or banner.
- A link to read recent news.
- A call to action for upcoming meetings.

Do not invent achievements, government endorsements, contact details, official statements, or factual claims about the organization.

## 7.3 Homepage news

Display the latest published news in responsive cards.

Each card should contain:

- Cover image.
- Headline.
- Short description.
- Publication date.
- Category.
- Read-more navigation.

Add a featured-story area, category filtering where appropriate, and a link to the complete news archive.

## 7.4 Homepage announcements

Show active, published announcements.

Support normal and urgent priorities, pinned notices, publication dates, and expiration dates.

Urgent announcements should be visually distinguishable but accessible and readable.

Expired or unpublished notices must not appear in active public announcement sections.

## 7.5 Homepage gallery

Display photographs with translated titles and descriptions.

Provide a responsive card grid, gallery detail view, appropriate image sizing, and lazy loading.

## 7.6 Meetings and upcoming events

Show upcoming scheduled meetings and events where permitted.

Each meeting card should show its title, description, date, time, host or organizing office when appropriate, status, and a Join action when joining is permitted.

The Join button must not pretend that a meeting is live if it has not been activated.

## 7.7 Footer

Include configurable organizational information, navigation links, contact information, social links, privacy notice, copyright text, and relevant policies.

Do not invent addresses, telephone numbers, email addresses, or social-media URLs.

## 7.8 Public pages

Implement all required pages:

- Home.
- News list.
- News detail.
- Announcements list.
- Announcement detail.
- Photo gallery.
- Gallery detail or expanded viewing.
- Events.
- Meetings.
- Meeting room.
- About.
- Contact.
- Privacy policy.
- Terms or appropriate usage policy.
- Custom 404.
- Error pages.
- Localized offline fallback.

All public content must come from the database or genuine configuration, not hardcoded production arrays.

# 8. NEWS MANAGEMENT SYSTEM

Build a genuine database-backed news publishing system.

Each news article must support:

- Unique identifier.
- Unique slug.
- English title and excerpt.
- Afaan Oromoo title and excerpt.
- Amharic title and excerpt.
- Full article body in each supported language.
- Original content language.
- Featured image.
- Multiple additional images where needed.
- Category.
- Tags.
- Author or responsible office.
- Draft, scheduled, published, and archived statuses.
- Publication timestamp.
- Creation and update timestamps.
- Optional SEO metadata.
- Featured or pinned state.
- Notification preference.

## 8.1 Editor features

Authorized editors and administrators must be able to:

- Create articles.
- Edit existing articles.
- Save drafts.
- Preview all language versions.
- Upload and replace images.
- Arrange multiple images.
- Publish immediately.
- Schedule publication.
- Unpublish.
- Archive and restore.
- Search and filter.
- Delete with confirmation.
- View publication and modification history.

Use a free, maintained rich-text editing library if rich text editing is needed.

Sanitize rich text on the server and validate the allowed HTML elements and attributes. Prevent stored XSS.

Do not render untrusted HTML without sanitization.

## 8.2 Publishing rules

Public visitors may only retrieve currently published content.

Draft and archived content must remain inaccessible publicly.

Scheduled content must not become accessible before its publication time.

Implement reliable scheduled publication using a verified free scheduling mechanism compatible with the chosen hosting environment.

If automatic scheduling cannot be guaranteed by the selected free infrastructure, document the exact operational limitation and implement a secure, idempotent scheduling mechanism that does not create unintended charges.

Do not use client-side timers as the only publication mechanism.

## 8.3 Notification integration

When publishing an article, provide a toggle for sending notifications.

Publishing must succeed or fail independently of push delivery. If publication succeeds but notifications fail, preserve the article and show the notification outcome honestly.

Prevent duplicate notification delivery through appropriate event or outbox records and idempotency controls.

# 9. ANNOUNCEMENT MANAGEMENT

Implement full CRUD for announcements.

Each announcement must contain:

- Unique identifier.
- Translated title and body.
- Optional attachment.
- Normal or urgent priority.
- Draft, scheduled, published, or archived status as appropriate.
- Publication timestamp.
- Optional expiration timestamp.
- Author or organizing office.
- Optional pinned state.
- Creation and update timestamps.
- Notification preference.

Authorized users must be able to create, edit, preview, schedule, publish, archive, restore, search, and delete announcements according to their permissions.

Handle attachments securely and validate the supported types and sizes.

Public lists must display only valid active announcements.

Use appropriate confirmations for destructive operations.

# 10. PHOTO GALLERY AND MEDIA MANAGEMENT

Build a complete media and photo gallery management system.

Administrators must be able to:

- Upload photographs.
- Add English, Afaan Oromoo, and Amharic titles.
- Add descriptions in all three languages.
- Set alt text for accessibility.
- Set categories.
- Reorder photos using accessible drag-and-drop controls and keyboard-accessible alternative controls.
- Publish or unpublish gallery items.
- Replace an image.
- Delete an image when safe.

Store the image files in Supabase Storage and the associated metadata in PostgreSQL.

Use client-side compression when appropriate, while repeating critical validation on the server.

Set strict permitted MIME types and maximum upload sizes.

Prefer optimized WebP or other appropriate efficient image formats.

Use responsive image dimensions and lazy loading.

Do not use base64 image strings as a substitute for proper persistent media storage.

Prevent accidental deletion of files referenced by existing content.

Never generate fake image URLs or pretend an upload succeeded when the storage operation failed.

# 11. SECURE ADMINISTRATIVE DASHBOARD

Implement `/admin` as a protected application area with its own navigation, layout, responsive sidebar, account menu, notifications, and logout action.

The dashboard must be functional on desktop and mobile.

## 11.1 Dashboard overview

Display real database-backed metrics for:

- Total published news.
- Draft articles.
- Scheduled articles.
- Active announcements.
- Upcoming meetings.
- Registered users.
- Push notification subscribers.
- Recent administrative activity.
- Installation metrics where they can be measured reliably.

Do not hardcode any metric.

Document the definition and source of each metric.

PWA installation counts are not universally observable across all browsers. Count only actual app-install events where supported or explicitly recorded installation reports, and label the result accordingly. Never invent an install count based on homepage visits.

## 11.2 News dashboard

Provide functional news creation, editing, translation, previewing, publishing, scheduling, archiving, restoration, search, filtering, pagination, and deletion.

## 11.3 Announcement dashboard

Provide complete announcement editing, translation, priorities, publication scheduling, expiration, notification toggles, attachment management, and archives.

## 11.4 Gallery dashboard

Provide photo uploads, translation fields, alt text, categories, reordering, previewing, publication control, replacement, and deletion.

## 11.5 Meetings dashboard

Provide meeting scheduling, host selection, access policies, status updates, invitations, participant management where available, and meeting cancellation.

## 11.6 User and role management

Only `super_admin` may manage privileged user roles.

Support safe user lookup, account status management, role assignment, and role revocation.

Do not allow users to change their own role or create a super-admin account through public registration.

## 11.7 Notification dashboard

Provide notification history and outcomes, subscriber counts, user preferences, manual notification controls for authorized staff, and failed-delivery information where available.

## 11.8 Website settings

Allow authorized administrators to manage approved public-facing settings such as:

- Organization name.
- Logo.
- Public description.
- Contact details.
- Default locale.
- Theme preferences.
- Footer information.
- Relevant homepage settings.

Use database-backed settings where appropriate. Validate all setting changes.

## 11.9 Audit log

Record sensitive administrative actions such as:

- Content creation.
- Publication.
- Content deletion.
- Role changes.
- Meeting creation and cancellation.
- Notification sending.
- Security-related administrative actions.

Record actor, action, target, timestamp, and appropriately limited metadata.

Prevent ordinary users from modifying audit records.

Do not log passwords, authentication tokens, private keys, or unnecessary personal information.

# 12. AUTHENTICATION AND ROLE-BASED AUTHORIZATION

Use Supabase Auth for email and password authentication, session management, and supported account recovery.

Roles:

- `super_admin`
- `editor`
- `moderator`
- Ordinary authenticated member.
- Public visitor.

A visitor must be able to view published content without an account.

## 12.1 Role permissions

**Super Admin**

- Full system administration.
- User and role management.
- Site settings.
- All authorized content operations.
- Meeting administration.
- Access to administrative audit records.

**Editor**

- Create, edit, preview, and publish approved content.
- Manage news, announcements, and gallery entries according to configured permissions.
- Cannot assign privileged roles.

**Moderator**

- Manage permitted meeting activities and public interaction.
- Perform only explicitly authorized moderation actions.
- Cannot escalate privileges or grant administrative roles.

**Ordinary member**

- Access permitted member functions.
- Manage their own relevant preferences.
- Join meetings according to meeting access rules.

**Visitor**

- Read public content.
- Open publicly accessible meeting invitations where permitted.
- Cannot access administrative functions.

## 12.2 Security requirements

Enforce authorization in the UI, server routes, Server Actions, and database RLS policies.

Hiding a button is not sufficient authorization.

A user must not be able to become a super-admin by manipulating:

- Request bodies.
- Browser storage.
- Client-side state.
- Profile forms.
- URL parameters.
- Cookies that are not securely validated.
- API requests.

Use secure role-assignment procedures.

Keep Supabase privileged keys server-side only.

Implement server-side route protection and revalidate sessions appropriately.

Use the current official Supabase authentication guidance rather than obsolete authentication patterns.

# 13. SUPABASE DATABASE DESIGN AND MIGRATIONS

Use Supabase PostgreSQL as the persistent data source.

Create complete SQL migrations, constraints, relationships, indexes, and appropriate database functions or triggers.

At minimum, implement:

1. `profiles`
2. `news`
3. `news_translations`
4. `announcements`
5. `announcement_translations`
6. `gallery_items`
7. `gallery_translations`
8. `meetings`
9. `meeting_participants`
10. `push_subscriptions`
11. `audit_logs`
12. `site_settings`

Also add appropriate supporting tables where required, such as:

- News categories and translated categories.
- Events and translations.
- User roles or permissions.
- Notification records.
- Notification preferences.
- Push delivery or outbox records.
- Media metadata.
- Contact messages.
- Meeting invitations.
- Installation metrics where supported.

## 13.1 Data quality

Use suitable primary keys, foreign keys, unique constraints, indexes, timestamp fields, status checks, and deletion behavior.

Use UTC timestamps in storage where appropriate and localize their presentation.

Use consistent status values, identifier types, and naming conventions.

Use transactions for multi-step operations where supported.

Avoid duplicate records and orphaned media.

## 13.2 Row Level Security

Enable RLS on every application table exposed through Supabase's data APIs.

Create explicit policies for:

- Public read access to published and unexpired public content only.
- Authenticated owners accessing their own allowed profile information.
- Editors performing authorized content operations.
- Moderators performing their permitted actions.
- Super-admin-only role management.
- Users managing only their own notification subscriptions and preferences.
- Appropriate meeting access.
- Restricted audit-log reading.
- Server-side privileged operations.

Public access must never expose drafts, secret invitation data, unnecessary personal information, notification subscription keys, private attachments, or privileged settings.

For translated records, access rules must also check the parent record's publication status.

Use secure helper functions for role checks when needed. Apply a fixed and safe `search_path` to security-definer functions, and prevent recursive policy problems.

Never assume that middleware alone protects database records.

## 13.3 Secure initial administrator creation

Provide a documented, secure, one-time administrator setup procedure.

Use a server-only script or trusted administrative setup procedure that:

- Reads the intended initial administrator identity from protected configuration.
- Verifies that the user account exists or securely creates/invites it.
- Assigns `super_admin` through a privileged server-side operation.
- Prevents ordinary clients from invoking the privileged procedure.
- Avoids hardcoded passwords or default credentials.

The application must fail safely if the initial administrator is not configured. Document exactly how the owner creates the first administrator.

## 13.4 Storage buckets

Create appropriate buckets for:

- `news-images`
- `gallery`
- `attachments`

Configure public read access only for content intended to be public.

Restrict upload, update, and deletion operations to authorized users.

Use private storage and signed URLs for documents that are not intended for public distribution.

Check file types, size limits, object ownership, and authorization both before and during upload handling.

Create version-controlled SQL migrations or repeatable setup scripts for storage configuration and policies.

## 13.5 Development seed data

Create a seed script with clearly identified sample multilingual content for local development and controlled automated testing.

The seed script must not automatically populate production with fake news, invented official announcements, fictional achievements, or fake users.

Production should start with real authorized content or appropriate empty states.

Document the difference between development fixtures and production data.

# 14. MEETING SYSTEM — REAL-TIME AUDIO AND VIDEO

Build a working online meeting feature integrated into the application.

Prefer LiveKit WebRTC using its current eligible $0 service plan. Keep the meeting provider replaceable through a documented configuration setting.

Do not make paid Zoom APIs, paid LiveKit tiers, commercial conferencing SDKs, or paid hosting mandatory.

## 14.1 Scheduling

Authorized administrators must be able to create official meetings with:

- Title.
- Description.
- Translations.
- Host.
- Start time.
- Duration.
- Room identifier.
- Access policy.
- Participant limit where supported.
- Scheduled, active, completed, or cancelled status.
- Created and updated timestamps.

Provide an instant-meeting function for authorized hosts where appropriate.

Use unpredictable room identifiers. Do not expose provider API secrets.

## 14.2 Joining meetings

Allow users to join through a meeting link or code, subject to the meeting's access policy.

Before joining:

- Confirm that the meeting exists.
- Confirm that it is available.
- Check any applicable authentication, invitation, role, or waiting-room restrictions.
- Obtain an appropriately restricted room token from the server.
- Request media permissions through browser controls.
- Display clear errors for denied permissions or unavailable devices.

Do not automatically expose a private meeting to the public.

## 14.3 Meeting interface

Implement, where supported by the configured provider:

- Real-time audio.
- Real-time video.
- Participant video tiles.
- Microphone mute and unmute.
- Camera on and off.
- Participant list.
- Screen sharing.
- Text chat.
- Raise hand.
- Leave meeting.
- Device selection.
- Connection status.
- Reconnection handling.
- Host controls.

Design a clear, professional video-conferencing layout that works on phones and computers.

Disable controls that the browser, device, or current role cannot support, and explain why.

Do not display fake video tiles or simulated participant connections.

## 14.4 Host controls

Authorized hosts must be able to:

- Start a scheduled meeting.
- Manage entry where supported.
- Mute participants where permitted.
- Remove disruptive participants.
- End the meeting for all participants.
- Update the database meeting status.

Verify that privileged actions are authorized on the server.

## 14.5 LiveKit integration

Generate tokens only on secure server routes.

The token-generation workflow must:

1. Authenticate the requesting user where required.
2. Retrieve the target meeting.
3. Check its access policy.
4. Verify the permitted role.
5. Generate a token limited to the intended room and necessary permissions.
6. Set an appropriate expiry.
7. Return only the minimum information needed by the client.

Keep the LiveKit API secret exclusively on the server.

Use the official LiveKit SDK and documented patterns.

Implement connection state handling, token errors, device-permission errors, and graceful disconnection.

Do not require meeting recording. Do not enable recording unless a separately documented, consent-aware, authorized recording implementation is deliberately added.

## 14.6 Zero-cost usage constraints

Before relying on LiveKit Cloud, verify the current Build plan terms, WebRTC participant-minute allowance, transfer allowance, concurrency limits, authentication requirements, and billing behavior.

Implement application-level usage safeguards where possible.

When the free allocation is exhausted, stop admitting new meetings or show a clear restriction until usage becomes available again. Never automatically upgrade.

Do not describe the meeting service as unlimited or guaranteed to remain available at all times.

## 14.7 Optional Jitsi mode

If an embedded Jitsi fallback is implemented, keep it behind an explicit environment setting.

Do not silently switch from a private LiveKit meeting to a publicly hosted Jitsi room when this would weaken access control or privacy.

The public `meet.jit.si` service may be used for appropriate development or best-effort testing, but must not be represented as a guaranteed private, production-grade service.

Document the differences between the configured providers and use clear access warnings where applicable.

# 15. INSTALLABLE PROGRESSIVE WEB APPLICATION

Implement the public website as a proper installable PWA.

Create:

- A valid web app manifest.
- Correct application name and short name.
- Appropriate icons in required sizes, including 192 × 192 and 512 × 512.
- Maskable icon variants.
- Theme and background colors.
- Standalone display mode.
- Start URL.
- A compatible service worker.
- Offline fallback page.
- Cache invalidation strategy.
- Installation state handling.

Do not use a broken icon path or pretend that the browser installed the application.

## 15.1 Installation interface

Add an Install App button or banner when appropriate.

Use the `beforeinstallprompt` event only in supporting browsers and only when the application is installable.

On iOS Safari or unsupported browsers, provide localized instructions for adding the site to the home screen where applicable.

Do not repeatedly interrupt visitors with installation prompts.

Do not claim to force an installation. The user must accept the available browser installation flow.

## 15.2 Offline behavior

Provide a useful offline page and cache appropriate public static assets.

Where practical, support previously viewed public news content through a safe caching strategy.

Never cache privileged admin responses, private meeting access tokens, session secrets, personal data, or confidential attachments in a way that exposes information to another user of the same device.

When online access is restored, allow appropriate requests to resume without creating duplicate submissions.

# 16. WEB PUSH AND IN-APP NOTIFICATIONS

Implement genuine browser push notifications using Web Push and VAPID keys, combined with a database-backed notification center.

Support notifications for:

- Newly published news.
- Important announcements.
- Scheduled meetings.
- Meeting changes.
- Meeting cancellations.
- Other relevant public updates.

## 16.1 Subscription workflow

Ask for browser notification permission only after a meaningful user action or an appropriate explanation.

Users must be able to:

- Subscribe.
- Unsubscribe.
- Select notification categories.
- Review in-app notifications.
- Mark notifications as read.
- Adjust notification preferences.

Store the push subscription in Supabase with appropriate user association, timestamps, and status.

Protect subscription endpoints and restrict access to each user's own subscription records.

Keep the private VAPID key server-side.

## 16.2 Sending workflow

Only authorized actions may trigger administrative notifications.

When a user publishes content with the notification toggle enabled, create the relevant notification event and attempt delivery.

Prevent duplicates and record delivery attempts or observable failure states.

Clicking a notification should open the correct localized public URL.

If a push cannot be delivered, preserve the underlying published content and explain the failure to the administrator.

Do not claim that a push was received on the user's device merely because the server accepted the send request.

## 16.3 Scheduling and cost controls

Use a verified free-compatible scheduling mechanism for reminders and scheduled content.

Document the mechanism, permissions, frequency, provider limits, and setup steps.

Do not introduce paid SMTP, paid SMS, paid messaging APIs, premium automation services, or paid cron services.

Where an essential notification cannot be delivered without unavailable external configuration, implement the supported parts and provide precise setup instructions.

# 17. SEARCH, EVENTS, AND CONTACT FORMS

Provide a working search experience for public news, announcements, and relevant gallery content.

Implement:

- Search input.
- Search results.
- Category filtering.
- Date filtering where appropriate.
- Pagination or load-more behavior.
- Empty results state.
- Clear filters action.

Use PostgreSQL queries and appropriate indexes rather than hardcoded search results.

Implement events and meeting information where applicable. Events should have translated titles and descriptions, start and end timestamps, status, and optional location or meeting details.

Create a secure contact form if enabled:

- Validate input.
- Sanitize text.
- Apply suitable rate limiting.
- Prevent spam.
- Provide an accessible success or failure state.
- Keep submissions private to authorized staff.
- Avoid collecting unnecessary personal data.

Do not promise email delivery unless an actually configured free email capability supports the operation.

# 18. SECURITY, PRIVACY, AND APPLICATION HARDENING

Implement the following protections throughout the application:

- Server-side input validation.
- Zod validation schemas.
- Authorization checks for sensitive operations.
- Supabase RLS.
- Secure session handling.
- CSRF protection appropriate to the selected authentication and mutation model.
- Security headers.
- Safe cookie configuration where appropriate.
- Content Security Policy compatible with the actual meeting and media integrations.
- Upload type and size validation.
- Protection against stored and reflected XSS.
- Reasonable rate limiting.
- Safe error handling.
- Secret management.
- Audit logging.
- Protection against unauthorized role changes.
- Safe external redirect handling.
- Appropriate CORS configuration.
- Dependency vulnerability review.

Use the current supported Next.js security and deployment practices.

Do not expose API keys, service-role credentials, signing keys, VAPID private keys, or LiveKit secrets to the browser.

Use environment variables for local and production configurations.

Never commit `.env.local` or real secrets to source control.

Provide `.env.example` containing placeholders and descriptions only.

Rate-limit sensitive operations with genuinely available infrastructure or database-backed mechanisms that do not require paid services.

Do not claim that a basic database rate limiter replaces comprehensive infrastructure-level DDoS protection.

Implement privacy-conscious handling of profiles, meeting participation, push subscriptions, and contact messages.

# 19. PERFORMANCE, ACCESSIBILITY, AND SEO

Aim for high Lighthouse scores, with a target of 90 or higher in Performance, Accessibility, Best Practices, and SEO where the tested environment and implemented feature set permit it.

Do not fabricate benchmark results.

Use:

- Server rendering where useful.
- Static rendering for suitable public content.
- Optimized image sizes.
- Lazy loading below the fold.
- Caching with correct invalidation.
- Indexed database queries.
- Pagination.
- Reduced client JavaScript.
- Clear loading states.
- Efficient font loading.
- Responsive layouts.
- Accessible headings.
- Semantic HTML.
- Keyboard navigation.
- Visible focus styles.
- Appropriate color contrast.
- Accessible alternative text.
- Reduced-motion support.

Create localized metadata, sitemap, robots configuration, canonical URLs, and language alternates.

Ensure protected and private routes are not indexed or exposed through public sitemap entries.

For Amharic and Afaan Oromoo content, use appropriate typography and ensure text does not overflow or become unreadable.

Measure the real built application and address identified performance and accessibility problems.

# 20. ERROR STATES AND APPLICATION RELIABILITY

Implement useful loading, empty, success, and failure states for every major feature.

Handle:

- Unavailable Supabase service.
- Expired sessions.
- Unauthorized access.
- Failed uploads.
- Invalid forms.
- Missing translations.
- Missing or deleted articles.
- Quota exhaustion.
- Failed push delivery.
- Unsupported PWA installation.
- Offline access.
- Denied microphone or camera permissions.
- LiveKit connection failure.
- Missing external service credentials.
- Deployment configuration errors.

Create localized error and not-found pages.

Avoid exposing SQL error details, stack traces, secrets, or private infrastructure information to visitors.

Do not silently swallow exceptions or return misleading success responses.

# 21. ENVIRONMENT VARIABLES AND CONFIGURATION

Create a complete `.env.example` for all implemented integrations.

Include the appropriate variables for:

- Supabase project URL.
- Supabase public/publishable key.
- Supabase secret/service-role key, only where required on the server.
- Public application base URL.
- LiveKit server URL.
- LiveKit API key.
- LiveKit API secret.
- Public VAPID key.
- Private VAPID key.
- VAPID contact subject.
- Optional meeting provider configuration.
- Any genuinely necessary scheduling or deployment configuration.

Use variable names supported by the selected SDKs and hosting environment.

Never put private keys in variables prefixed for client exposure.

Do not insert fake valid-looking credentials.

Validate required configuration at application startup or when a dependent feature is used, with clear actionable errors.

Document where each value comes from and which integration requires it.

The application must not depend on paid credentials for any core feature.

# 22. TESTING STRATEGY AND ACCEPTANCE VERIFICATION

Implement meaningful automated tests using free testing tools.

Use Vitest or an equivalent for unit tests, and Playwright for browser workflows.

Add tests for validation, permission logic, language resolution, translated-content fallback, publication rules, and meeting token authorization.

## 22.1 Public website tests

Verify:

- The root route selects the correct locale.
- Homepage pages load correctly.
- Navigation works.
- Language switching works.
- Articles open from real database records.
- Drafts are not publicly accessible.
- Announcements respect their publication and expiry rules.
- Gallery images display correctly.
- Search and filters return real results.
- Unknown pages display the localized 404.

## 22.2 Authentication and authorization tests

Verify:

- Configured login works.
- Logout works.
- Password recovery behaves as configured.
- Protected admin routes reject unauthorized users.
- Public users cannot create administrative roles.
- Editors cannot grant super-admin access.
- RLS policies prevent unauthorized reads and writes.
- The application cannot bypass permissions by changing client-side state.

## 22.3 Content-management tests

Verify:

- An authorized administrator can create a draft.
- An authorized user can update a draft.
- Publishing changes public visibility correctly.
- Scheduled content remains unavailable until permitted.
- Translations are saved and retrieved correctly.
- Image upload restrictions work.
- Unauthorized users cannot edit or delete protected records.
- Notification toggles produce the correct server-side behavior.

## 22.4 PWA and notification tests

Verify:

- The manifest loads.
- The application icons load.
- The service worker registers correctly.
- Offline fallback works.
- Installation UI is displayed appropriately for supported browsers.
- Unsupported installation flows show useful guidance.
- Subscription and unsubscription work.
- Push sending handles invalid or expired subscriptions.
- Notification links open the correct localized page.
- Sensitive responses are never stored in public caches.

## 22.5 Meeting tests

Verify:

- Meeting records can be created and retrieved.
- Meeting codes and links identify the correct room.
- Access rules are checked before token creation.
- Invalid or unauthorized users cannot obtain privileged tokens.
- A valid participant can connect using configured LiveKit credentials.
- Meeting controls work where supported.
- Host actions are authorized.
- Meeting completion updates database status.
- Permission denial and network errors are handled.
- Missing credentials produce meaningful error states.

## 22.6 Code quality

Run the actual project commands for:

- Dependency and configuration validation.
- ESLint.
- Prettier verification.
- TypeScript checks.
- Unit tests.
- Integration tests where configured.
- Playwright end-to-end tests.
- Production build.

Use the scripts defined by the actual repository. Do not report a command as passing if it was skipped or failed.

Test external integrations with controlled mocks when testing purely internal logic. Also perform real integration checks when credentials and services are configured.

A mocked meeting test must not be described as proof that a real video meeting connected.

If real external credentials are unavailable, state exactly which live-service tests could not be completed.

Fix all reproducible errors and rerun the affected checks.

# 23. FREE-PLAN USAGE AUDIT

Before deployment, produce a cost and dependency audit.

For every external provider, package, API, and hosting service, document:

- Name.
- Purpose.
- License or free plan.
- Verified free-tier allowances.
- Whether a payment method is required.
- Whether usage beyond the allowance can generate charges.
- Whether the service can pause or become unavailable.
- The feature affected by exhaustion.
- The configured protection against unwanted charges.

Verify the provider terms at the time of deployment rather than hardcoding outdated pricing assumptions into documentation.

Explicitly verify:

- Supabase Free database, storage, bandwidth, authentication, Realtime, and function limits.
- LiveKit Build meeting limits and billing behavior.
- The chosen hosting provider's eligibility and deployment limits.
- Notification and scheduling dependencies.
- All installed library licenses and dependencies.

Do not describe the application as unlimited or permanently available just because it uses free plans.

The application must never upgrade a service or introduce a paid provider automatically.

# 24. DEPLOYMENT AND REPOSITORY MANAGEMENT

Prepare the project for a real deployment using the verified free hosting option.

The deployment instructions must include:

1. Installing dependencies.
2. Configuring local environment variables.
3. Running database migrations.
4. Applying RLS policies.
5. Creating storage buckets and policies.
6. Creating the first administrator securely.
7. Starting the application locally.
8. Running the test suite.
9. Building the production version.
10. Connecting the deployment repository.
11. Configuring production environment variables.
12. Deploying to the selected free host.
13. Verifying the production site.
14. Testing authentication callbacks.
15. Testing PWA installation.
16. Testing Web Push on supported browsers.
17. Testing a real configured meeting.
18. Reviewing quotas and usage.
19. Updating the deployment after code changes.

Create a comprehensive README and clear troubleshooting instructions.

Use Git with a suitable `.gitignore`.

Never commit secrets or production database dumps.

If Git integration is available, help prepare meaningful commits, but do not claim that a remote repository was updated unless the operation actually succeeded.

Do not claim a deployment is live until the hosting provider confirms success and the resulting website has been verified.

# 25. REQUIRED PROJECT DELIVERABLES

Create the following actual project artifacts:

- Complete application source code.
- Next.js App Router pages and layouts.
- Responsive public website.
- Protected administrative dashboard.
- Reusable UI components.
- English, Afaan Oromoo, and Amharic translation files.
- Supabase client configuration.
- SQL migrations.
- RLS policies.
- Storage bucket and storage policy setup.
- Development-only multilingual seed script.
- Secure first-super-admin setup procedure.
- News and announcement management.
- Gallery management.
- Meeting scheduling and integration.
- PWA manifest and service worker.
- Install prompt and platform-specific installation instructions.
- Web Push subscription and delivery functionality.
- `.env.example`.
- ESLint and Prettier configuration.
- TypeScript configuration.
- Unit and integration tests.
- Playwright end-to-end tests.
- Deployment configuration.
- Complete README.
- English administrator guide.
- Afaan Oromoo administrator guide.
- Amharic administrator guide.
- Free-tier dependency and cost audit.
- Final implementation and verification report.

Do not create empty files merely to make the checklist appear complete.

Each delivered file must have meaningful implementation or a clear, legitimate purpose.

# 26. STRICT IMPLEMENTATION PHASES

Execute the following phases in order.

Do not wait for additional confirmation between phases.

## Phase 1 — Repository inspection and foundation

Inspect the existing project, verify package compatibility, establish the folder structure, configure TypeScript strict mode, install the necessary free libraries, configure Tailwind CSS and the design system, configure next-intl, and implement the shared localized layouts.

Create the first working homepage skeleton, theme, navigation, language selector, and routing behavior.

Run dependency checks, type checks, linting, and the development server. Fix errors before proceeding.

## Phase 2 — Database, authentication, and authorization

Create all necessary SQL migrations, tables, relationships, indexes, RLS policies, storage policies, and secure administrator bootstrap instructions.

Integrate Supabase Auth and create protected dashboard layouts.

Test real role enforcement and unauthorized requests before moving on.

## Phase 3 — Public pages and real content

Implement the homepage, news list and detail pages, announcements, photo gallery, events, meetings list, About, and Contact.

Connect all content to Supabase.

Implement language-aware content fallback, loading states, pagination, search, image handling, and appropriate metadata.

Do not substitute hardcoded production data for database results.

## Phase 4 — Administrative content management

Build the complete administrative dashboard and its CRUD operations.

Implement translated news and announcements, image uploads, gallery ordering, role restrictions, website settings, notifications management, and audit logging.

Verify actual database persistence after creating and editing records.

## Phase 5 — Real-time meetings

Integrate LiveKit using secure server token generation.

Implement room scheduling, permitted joining, responsive audio/video controls, screen sharing, chat if supported, participant management, meeting termination, status updates, and connection error handling.

Verify the configured free service's limits.

Do not mark this phase complete based solely on UI tests or mocked media.

## Phase 6 — PWA, offline support, and Web Push

Create the manifest, service worker, install interface, offline page, notification subscription workflows, and push delivery functionality.

Verify caching safety and browser-specific limitations.

Use no paid messaging or scheduling provider.

## Phase 7 — Automated testing, security, accessibility, and performance

Run the full test suite, type checks, linting, production build, and available browser tests.

Review the application's authorization model, database policies, file uploads, external API routes, notification handling, and meeting tokens.

Measure performance and accessibility, fix identified issues, and document any remaining external-service limitations.

## Phase 8 — Deployment, documentation, and final review

Finish the README, administrator guides, multilingual documentation, `.env.example`, migrations, deployment instructions, free-tier audit, and final checklist.

Verify the deployment procedure against the actual hosting configuration.

If external credentials are provided, test the corresponding integrations. If credentials are unavailable, clearly distinguish implemented code from live-service verification.

Review changed files, run a final production build, and report actual results.

# 27. FINAL ACCEPTANCE CRITERIA

The project must not be declared complete merely because the development server starts.

Completion requires all feasible application requirements to be implemented and verified:

- The homepage opens at the correct language URL.
- Public pages load from Supabase.
- English, Afaan Oromoo, and Amharic work consistently.
- Visitors can read public content.
- Authorized staff can create, edit, publish, and manage content.
- Privileged actions are protected by server authorization and RLS.
- News, announcements, images, translations, and meeting records persist.
- The PWA is installable on supported devices.
- Offline behavior is useful and does not expose private information.
- Web Push subscriptions and configured delivery work within the free allowance.
- Real audio/video meetings connect when LiveKit is configured.
- Meeting permissions and privileged host actions are enforced.
- Error, empty, loading, and success states are implemented.
- The application has no intentionally fake production functionality.
- Sensitive credentials are not exposed.
- Database migrations and storage policies are documented.
- Automated checks have been run, with actual results recorded.
- The hosting method is compatible with the completed application.
- The free-tier cost audit has been completed.
- No paid subscription or automatic upgrade is required for the agreed initial deployment.

If any requirement remains blocked by an unavailable credential, unsupported browser, external provider limit, or hosting limitation, report it explicitly and explain the next necessary action. Do not conceal it or fabricate a successful test.

# 28. FINAL INSTRUCTION

Begin immediately by inspecting the current repository.

Present the implementation plan and file tree, then proceed with Phase 1 without waiting for approval. Continue through every phase, implement real functionality, run the appropriate checks, fix discovered defects, and prepare the complete deployment documentation.

Prioritize correctness, security, maintainability, accessibility, multilingual quality, and the strict zero-cost requirement.

**The final result must be a genuine, integrated, professionally engineered Shenen Kolu Woreda Prosperity Party web application and installable PWA—not merely a visually attractive frontend or an unverified promise of completion.**
