# Shenen Kolu Woreda Prosperity Party

[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15_App_Router-black.svg)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Free_Tier-emerald.svg)](https://supabase.com/)
[![LiveKit](https://img.shields.io/badge/LiveKit-WebRTC_Build_Tier-teal.svg)](https://livekit.io/)
[![PWA](https://img.shields.io/badge/PWA-Installable-purple.svg)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An institutional, multilingual (English, Afaan Oromoo, Amharic) public community information platform and installable Progressive Web Application (PWA) with a real database, secure authentication, role-based authorization, news & announcement publishing, photo gallery, LiveKit WebRTC meetings, and native web push notifications.

**Engineered with a non-negotiable initial recurring service cost of $0.00 / month.**

---

## 🌟 Key Features

- **Multilingual Support:** Fully translated UI and dynamic database content in **English (`en`)**, **Afaan Oromoo (`om`)**, and **Amharic (`am`)** with automatic language resolution, cookie persistence, and fallback.
- **Progressive Web App (PWA):** Installable on Android, iOS Safari, desktop Chrome, and Edge with standalone display mode, 192/512px & maskable icons, and service worker offline caching.
- **News Publishing System:** Database-backed articles with multilingual headlines, excerpts, full bodies, cover images, categories, pinned states, and publication statuses (`draft`, `scheduled`, `published`, `archived`).
- **Public Announcements:** Urgent animated alert banners, normal notices, expiration dates, and file attachments.
- **Media & Photo Gallery:** Community photographic documentation with category filtering, accessible alt text in all three languages, and interactive modal preview lightbox.
- **Real-Time Meetings (LiveKit WebRTC):** Audio/video town halls, screen sharing, meeting chat, hand raising, host controls (mute all, end meeting), and room access policies (`public`, `members`, `restricted`).
- **Web Push Notifications:** Native VAPID browser push notifications alerting citizens of breaking news, urgent circulars, and town hall sessions without paid third-party SMS or messaging APIs.
- **Role-Based Access Control (RBAC):** Server-enforced permissions for `super_admin`, `editor`, `moderator`, `member`, and public visitors backed by Supabase Row Level Security (RLS).
- **Administrative Dashboard (`/admin`):** Protected overview with real database metrics, full content CRUD, role management, push broadcast center, site settings, and audit logs.
- **Strict Zero-Cost Deployment:** Operates exclusively within verified free tiers of Supabase, LiveKit Cloud Build Tier, and standard hosting platforms.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, Server & Client Components) |
| **Language** | TypeScript (Strict mode enabled) |
| **Styling** | Tailwind CSS with balanced Ethiopian institutional palette |
| **Localization** | `next-intl` (URL prefixes: `/en`, `/om`, `/am`) |
| **Database & Auth** | Supabase Free (PostgreSQL, Auth, Storage, RLS) |
| **Audio/Video** | LiveKit WebRTC (Build Tier: 10,000 participant-min/mo included) |
| **Push Notifications** | Web Push API + VAPID (`web-push`) |
| **Validation** | Zod + React Hook Form |
| **Testing** | Vitest (Unit & Integration) + Playwright (Browser E2E) |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js:** v18.18+ or v20+
- **Git**

### 2. Clone and Install
```bash
git clone <repository-url>
cd ShenenKoluProsperityParty
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your free credentials from:
- [Supabase](https://supabase.com) (Database, Auth, Storage)
- [LiveKit Cloud](https://livekit.io) (Free Build Tier for WebRTC meetings)
- Generate VAPID keys: `npx web-push generate-vapid-keys`

### 4. Database Setup & First Administrator
1. In the Supabase SQL Editor, run:
   - `supabase/migrations/0001_initial_schema.sql` (Tables & relations)
   - `supabase/migrations/0002_row_level_security.sql` (RLS policies)
   - `supabase/migrations/0003_storage_buckets.sql` (Storage buckets)
   - `supabase/seed.sql` (Optional development sample data)
2. Initialize your first Super Administrator account:
   ```bash
   npm run bootstrap:admin
   ```

### 5. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. The root `/` route will automatically redirect to your preferred language (e.g. `/en`, `/om`, or `/am`).

---

## 🧪 Testing Suite

Run the unit and integration tests (i18n key audit, RBAC matrix, Zod validations, utility checks):
```bash
npm test
```

Run TypeScript strict type checking:
```bash
npm run typecheck
```

Run Playwright end-to-end tests:
```bash
npm run test:e2e
```

Run production compilation:
```bash
npm run build
```

---

## 📚 Documentation & Guides

- **English Administrator Manual:** [`docs/ADMIN_GUIDE_EN.md`](docs/ADMIN_GUIDE_EN.md)
- **Afaan Oromoo Administrator Manual:** [`docs/ADMIN_GUIDE_OM.md`](docs/ADMIN_GUIDE_OM.md)
- **Amharic Administrator Manual:** [`docs/ADMIN_GUIDE_AM.md`](docs/ADMIN_GUIDE_AM.md)
- **Free-Tier Cost & Dependency Audit:** [`docs/FREE_TIER_AUDIT.md`](docs/FREE_TIER_AUDIT.md)

---

## 📄 License

This project is licensed under the terms of the MIT License.
All rights reserved © Shenen Kolu Woreda Prosperity Party.
