# Qajeelfama Bulchiinsaa — Afaan Oromoo

## Wiirtuu Odeeffannoo Paartii Badhaadhinaa Aanaa Shenen Koolu

Baga nagaan gara qajeelfama bulchiinsa seera qabeessa weebsaayitii fi appii PWA Paartii Badhaadhinaa Aanaa Shenen Koolutti dhuftan.

---

## 1. Qophii Bulchiinsaa fi Seensa Jalqabaa

### 1.1 Super Admin Jalqabaa Hojirra Oolchuu
Akkaawuntii `super_admin` isa jalqabaa haala amansiisaa ta'een hundeessuuf:

1. Faayila `.env.local` keessatti qindeessaa:
   ```env
   INITIAL_ADMIN_EMAIL="admin@shenenkolu.gov.et"
   INITIAL_ADMIN_PASSWORD="JechaDarbiiCimaa123!"
   INITIAL_ADMIN_FULL_NAME="Bulchaa Hojii Raawwachiiftuu"
   ```
2. Tarmínaala irratti ajaja kana raawwadhaa:
   ```bash
   npm run bootstrap:admin
   ```
3. Iskiriipitiin kun herrega Supabase Auth keessatti uumuun ga'ee `super_admin` kennuufi galmee mirkaneessa.

### 1.2 Daashboordiitti Seenuu
- Toora kanaan banaa: `https://your-domain.com/om/auth/login`
- Imeelii fi jecha darbii keessan galchuun seenadha.
- Erga seentanii booda, baafata gubbaa irraa **Gabaasa Daashboordii** ykn `/admin` tuqaa.

---

## 2. Bulchiinsa Oduu fi Gabaasa Misoomaa (`/admin/news`)

Kutaan kun gulaaltotaa fi bulchitootaaf gabaasa misooma aanaa, qonnaa, bishaanii fi ijaarsa bu'uuraalee maxxansuuf gargaara.

### 2.1 Oduu Haaraa Uumuu
1. Baafata cinaa irraa **Bulchiinsa Oduu** &rarr; **Haaraa Uumi** (`/admin/news/new`) filadha.
2. **Kutaalee Afaanii:**
   - **English:** Mata duree, cuunfaa fi qabiyyee guutuu Afaan Ingiliziitiin galchaa.
   - **Afaan Oromoo:** Mata duree, cuunfaa fi qabiyyee guutuu Afaan Oromootiin barreessaa.
   - **አማርኛ:** Mata duree fi gabaasa guutuu Afaan Amaaraatiin galchaa.
3. **Kutaa (Category):** Kutaa dhimmi kun ilaallatu filadha (fkn: *Misooma Qonnaa fi Baadiyyaa*, *Bishaan fi Bu'uuraalee Misoomaa*).
4. **Suuraa Maxxansaa:** Liankii suuraa qulqullina qabuu galchaa.
5. **Haala Maxxansaa:**
   - **Published (Maxxanfame):** Battalumatti uummataaf ifa ta'a.
   - **Draft (Wixinee):** Keessatti qofa qophaa'ee tura.
6. **Beeksisa Erguu:** Lammiileen appii fe'atan akka beeksisni battalaa dhaquuf **Send Web Push Alert** kan jedhu banaa.
7. **Publish Article** tuquun xumuraa.

---

## 3. Bulchiinsa Beeksisoota Ummataa (`/admin/announcements`)

Beeksisoonni qajeelfama bulchiinsaa fi xalayaalee aanaa ariifachiisoo ta'anidha.

### 3.1 Sadarkaa Beeksisaa (Normal vs Urgent)
- **Normal (Idilee):** Baafata beeksisaa keessatti mul'ata.
- **Urgent (Ariifachiisaa):** Fuula hundumaa gubbaatti bifa diimaa ifuun mallattoo ariifachiisaa waliin mul'ata (fkn: talaallii daa'immanii, eeggannoo qilleensaa).

### 3.2 Guyyaa Itti Xumuramu
- Beeksisoota yeroo murtaa'e qabaniif **Expiration Date** galchaa. Yeroon sun yommuu darbu sirnichi ofumaan fuula uummataa irraa dhoksa.

---

## 4. Kuusa Suuraa (`/admin/gallery`)

- Hojiiwwan misooma aanaa suuraan galmeessuuf suuraalee haaraa fe'aa.
- **Alt Text:** Namoota ijaan arguu hin dandeenyeef ibsa suuraa afaan sadaniinuu galchuun barbaachisaadha.

---

## 5. Walga'iiwwan Toora Intarneetii (`/admin/meetings`)

LiveKit WebRTC fayyadamuun mariiwwan uummataa fi kora hoggansaa baasii tokko malee geggeessuuf gargaara.

### 5.1 Sagantaa Walga'ii Qopheessuu
1. **Meetings & Forums** &rarr; **Schedule Meeting** (`/admin/meetings/new`) tuqaa.
2. Mata duree fi ibsa afaan sadaniinuu galchaa.
3. **Koodii Kutaa:** Koodii qulqulluu ta'e galchaa (fkn: `shenen-kolu-qonna-2026`).
4. **Eeyyama Seensaa:**
   - **Open to Public:** Ummanni hundi liankii kanaan seenuu danda'a.
   - **Members Only:** Miseensota galmaa'an qofaaf.
   - **Restricted:** Affeerraadhaan qofa.

### 5.2 To'annoo Keessummeessaa (Host Controls)
- Keessummeessaan walga'ichaa:
  - **Mute All:** Hirmaattota hunda sagalee cufuu danda'a.
  - **Share Screen:** Sanadoota fi gabaasa argisiisuu.
  - **End for All:** Hundaaf walga'icha xumuruu.

---

## 6. Bulchiinsa Ga'ee fi Miseensotaa (`/admin/users`)

*Super Administrator qofaan kan to'atamu.*

- `super_admin`: Aangoo guutuu sirnichaa.
- `editor`: Oduu, beeksisa fi suuraalee maxxansuu fi beeksisa erguu.
- `moderator`: Walga'iiwwan geggeessuu fi to'achuu.
- `member`: Lammiilee galmaa'an kanneen walga'ii irratti hirmaatan.

---

## 7. Galmee Hojii Bulchiinsaa (`/admin/audit-logs`)

Tarkaanfiin bulchiinsaa hundi (oduu uumuu, beeksisa maxxansuu, ga'ee jijjiiruu) yeroo fi eenyummaa nama raawwatee waliin galmaa'ee tura.
