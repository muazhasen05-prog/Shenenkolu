# Free-Tier Cost, Dependency, and Quota Audit

## Shenen Kolu Woreda Prosperity Party Multilingual PWA

This document provides a comprehensive operational and economic audit of every external service, software library, API, and hosting component integrated into the Shenen Kolu Woreda Prosperity Party web platform.

---

## 1. Executive Summary & Zero-Cost Guarantee

- **Target Monthly Recurring Operational Cost:** **$0.00 / month**
- **Credit Card / Payment Method Required for Launch:** **No**
- **Automatic Upgrades / Overage Billing:** **Strictly Disabled**
- **Graceful Failure Behavior:** When provider limits are reached, features enter graceful read-only or diagnostic states without causing downtime or incurring financial liability.

---

## 2. External Provider & Infrastructure Breakdown

### 2.1 Supabase (PostgreSQL Database, Authentication, Storage, Row Level Security)
- **Role:** Primary persistent data layer, user management, multilingual content storage, and media hosting.
- **Service Plan:** **Supabase Free Tier**
- **Included Verified Free Quota:**
  - **Database Size:** 500 MB (sufficient for ~200,000 text news articles and announcements)
  - **Auth Active Users (MAU):** 50,000 monthly active users
  - **File Storage:** 1 GB (accommodates ~5,000 optimized WebP photographs)
  - **Egress Bandwidth:** 2 GB / month
  - **Realtime Concurrent Connections:** 200 concurrent connections
- **Billing Behavior Beyond Quota:**
  - Supabase Free tier automatically pauses or enters read-only mode upon quota exhaustion.
  - **No unexpected credit card charges can occur.**
- **Application Safeguards:**
  - Image resizing and WebP compression on upload
  - Database pagination on all public queries (max 20 records per page)
  - Selective SQL column projection instead of unbounded queries
  - Row Level Security (RLS) enforcement preventing unauthorized storage abuse

---

### 2.2 LiveKit Cloud (Real-Time Audio & Video WebRTC Meetings)
- **Role:** Powering interactive town halls, executive meetings, and citizen consultation forums.
- **Service Plan:** **LiveKit Cloud Build Tier ($0 / month)**
- **Included Verified Free Quota:**
  - **Participant Minutes:** 10,000 participant-minutes per month (~166 hours of individual audio/video streaming)
  - **Data Transfer Out:** 50 GB / month
  - **Max Concurrent Participants:** Configured up to 50 participants per room
- **Billing Behavior Beyond Quota:**
  - In the Build Tier, additional meeting room connections are paused or rejected until the next billing month.
  - **No automatic billing upgrade.**
- **Application Safeguards:**
  - Server-side JWT token generation enforcing room participant limits (`max_participants = 50`)
  - Token expiration set to a maximum of 3 hours per session
  - UI diagnostic warnings displaying remaining community quota
  - Host controls allowing administrators to terminate meetings immediately

---

### 2.3 Web Push & VAPID (Native Browser Push Notifications)
- **Role:** Instant news alerts, urgent civic advisories, and town hall reminders.
- **Service Plan:** **Native W3C Web Push API + Web Crypto (100% Free & Self-Hosted)**
- **External Cost:** **$0.00 / month (No third-party SaaS messaging service used)**
- **Included Verified Free Quota:**
  - Unlimited push notification dispatches directly to browser push services (Google FCM, Mozilla Autopush, Apple WebPush)
- **Billing Behavior Beyond Quota:**
  - Pure standard protocol; zero external vendor subscriptions or paid SMS APIs required.
- **Application Safeguards:**
  - Duplicate notification filtering using database records
  - Automatic pruning of expired endpoints (HTTP 404 / 410 Gone)

---

### 2.4 Hosting Provider (Vercel Hobby / Cloudflare Pages / Node.js)
- **Role:** Serverless application deployment and CDN edge routing.
- **Service Plan:** **Vercel Hobby Tier ($0 / month)** or **Cloudflare Pages / Workers Free Tier**
- **Included Verified Free Quota:**
  - **Bandwidth:** 100 GB / month
  - **Serverless Function Invocations:** 100,000 executions / month
  - **Edge Middleware Requests:** 1,000,000 / month
  - **SSL Certificate:** Free automatic Let's Encrypt wildcard certificate
- **Billing Behavior Beyond Quota:**
  - Deployment halts or rate limits without credit card charge.
- **Application Safeguards:**
  - Static Site Generation (SSG) for all localized marketing pages (`/[locale]`, `/about`, `/privacy`, `/terms`)
  - Stale-while-revalidate client-side asset caching via Service Worker (`public/sw.js`)

---

## 3. Software License & Open-Source Verification

All runtime packages integrated into this repository operate under permissive open-source licenses:

| Package | Purpose | License | Cost |
|---|---|---|---|
| `next` | React Full-Stack Framework | MIT | $0 |
| `react` / `react-dom` | UI Rendering Engine | MIT | $0 |
| `next-intl` | Multilingual URL Routing | MIT | $0 |
| `@supabase/ssr` / `@supabase/supabase-js` | Database & Auth Client | MIT | $0 |
| `livekit-client` | WebRTC Browser Client | Apache 2.0 | $0 |
| `livekit-server-sdk` | JWT Token Generation | Apache 2.0 | $0 |
| `web-push` | VAPID Push Notification Delivery | MIT | $0 |
| `tailwindcss` | Utility-First Styling | MIT | $0 |
| `lucide-react` | Institutional Icons | ISC | $0 |
| `zod` | Server & Client Input Validation | MIT | $0 |
| `vitest` | Unit & Integration Testing | MIT | $0 |
| `@playwright/test` | End-to-End Browser Testing | Apache 2.0 | $0 |

---

## 4. Operational Cost Summary

$$\text{Total Monthly Cost} = \$0.00\text{ (Supabase)} + \$0.00\text{ (LiveKit)} + \$0.00\text{ (WebPush)} + \$0.00\text{ (Hosting)} = \mathbf{\$0.00 / \text{month}}$$
