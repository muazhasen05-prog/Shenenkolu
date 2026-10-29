# Administrator Manual — English

## Shenen Kolu Woreda Prosperity Party Information Platform

Welcome to the official administrative manual for the Shenen Kolu Woreda Prosperity Party web platform and Progressive Web Application (PWA).

---

## 1. Initial Administrator Setup & Login

### 1.1 First Super Administrator Bootstrap
To initialize the very first `super_admin` account without exposing passwords or relying on insecure public registration:

1. Configure your `.env.local` file:
   ```env
   INITIAL_ADMIN_EMAIL="admin@shenenkolu.gov.et"
   INITIAL_ADMIN_PASSWORD="YourSecurePasswordHere123!"
   INITIAL_ADMIN_FULL_NAME="Executive Administrator"
   ```
2. Execute the bootstrap script in your terminal:
   ```bash
   npm run bootstrap:admin
   ```
3. The script will securely verify or create the user in Supabase Auth and assign `role = 'super_admin'` in the `profiles` table.

### 1.2 Accessing the Dashboard
- Navigate to: `https://your-domain.com/en/auth/login`
- Enter your registered administrator email and password.
- Once signed in, click the **Dashboard** link in the navigation header or go directly to `/admin`.

---

## 2. News & Article Management (`/admin/news`)

The news module allows authorized editors and administrators to publish verified reports, agricultural advisories, and developmental stories.

### 2.1 Creating an Article
1. In the sidebar, click **News Management** &rarr; **Create Article** (`/admin/news/new`).
2. **Multilingual Tabs:**
   - **English:** Enter the headline, optional excerpt, and full body text.
   - **Afaan Oromoo:** Enter the Oromo headline, excerpt, and body.
   - **Amharic (አማርኛ):** Enter the Amharic headline, excerpt, and body.
3. **Category:** Select the appropriate woreda sector (e.g., *Agriculture & Rural Development*, *Infrastructure & Water*, *Education*).
4. **Cover Image:** Provide a valid image URL or uploaded asset link.
5. **Publishing Status:**
   - **Published:** Immediately visible to the public.
   - **Draft:** Saved internally for review by senior editors.
   - **Scheduled:** Will become visible upon publication date.
6. **Web Push Alert:** Toggle **Send Web Push Alert** to automatically notify subscribed citizens across all devices.
7. Click **Publish Article**.

---

## 3. Public Announcements Management (`/admin/announcements`)

Announcements are high-priority administrative notices and circulars.

### 3.1 Normal vs Urgent Priority
- **Normal Notices:** Displayed in the announcement feed with standard styling.
- **Urgent Notices:** Triggers an animated alert banner at the top of every public page. Ideal for vaccination drives, emergency weather advisories, or kebele security notifications.

### 3.2 Setting Expiration Dates
- Always set an **Expiration Date** for time-sensitive notices. Once the expiration timestamp passes, the system automatically removes the notice from public display without deleting the database record.

---

## 4. Media & Photo Gallery (`/admin/gallery`)

- **Upload Photographs:** Add high-quality community action photos.
- **Accessibility:** Always provide descriptive **Alt Text** in all three languages to ensure the site is accessible to visually impaired citizens using screen readers.
- **Sort Order:** Set integer values (1, 2, 3...) to control the display sequence.

---

## 5. Online Meetings & Town Halls (`/admin/meetings`)

LiveKit WebRTC powers interactive virtual town halls with zero recurring cost.

### 5.1 Scheduling a Session
1. Click **Meetings & Forums** &rarr; **Schedule Meeting** (`/admin/meetings/new`).
2. Provide an English, Afaan Oromoo, and Amharic title and description.
3. **Room Identifier:** Enter a unique alphanumeric code (e.g., `shenen-kolu-irrigation-forum`).
4. **Access Policy:**
   - **Open to Public:** Anyone with the link can join as a community participant.
   - **Members Only:** Requires user to sign in to their registered account.
   - **Restricted:** Only hosts and invited staff can enter.
5. Set the **Start Time** and **Duration**.

### 5.2 Host In-Call Administration
- When joining as the host, you have access to privileged controls:
  - **Mute All:** Silence participant audio to ensure clear presentations.
  - **Screen Share:** Present developmental documents or slides.
  - **End for All:** Terminates the session for everyone and updates database status to `completed`.

---

## 6. User & Role Administration (`/admin/users`)

*Restricted strictly to Super Administrators.*

### 6.1 Role Hierarchy
- `super_admin`: Full system access, site settings, and role management.
- `editor`: Publishing news, announcements, photo gallery, and notification broadcasts.
- `moderator`: Hosting and moderating public audio/video meetings.
- `member`: Public registered citizens participating in community meetings.

### 6.2 Modifying Roles
- Search for the user in the table and select the desired role from the dropdown. The system automatically verifies your clearance and logs the change to the audit trail.
- Administrators cannot demote their own active account.

---

## 7. Web Push Broadcasts (`/admin/notifications`)

- Broadcast instant alerts to all subscribed devices.
- Input a concise Title (max 100 chars), Message (max 300 chars), Destination URL, and Category.
- Click **Dispatch Notification**. The delivery log records the exact number of devices reached.

---

## 8. Audit Trail (`/admin/audit-logs`)

The audit log maintains a tamper-evident record of all administrative operations:
- Article creation, edits, and deletions
- Announcement publications
- Meeting creations and completions
- Role elevations and revocations
- Timestamp and actor email are permanently logged for institutional transparency.
