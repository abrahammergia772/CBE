# CBE Care — Documentation Screenshots

Captured from the live application (Chromium, real UI interaction — not mockups).
Desktop shots are **1440×900 @2x**; mobile shots are **414×896 @3x**.

Start here: **`00-index-contact-sheet.png`** — every desktop screen on one sheet.

Regenerate with `npm run dev` running, then `node scripts/shoot.mjs`.

---

## Branding

The official **Commercial Bank of Ethiopia bronze seal** is used throughout, from a single
transparent asset that works on both the white masthead and the purple footer:

| Asset | Use |
|---|---|
| `src/assets/cbe-logo.png` | 192×192 transparent PNG — masthead at 52px, footer at 44px |

Palette sampled from combanketh.et's own stylesheet:

| Token | Hex | Source |
|---|---|---|
| Purple (UI primary) | `#7D1A80` | CBE purple, tuned for interactive surfaces |
| Purple deep | `#910096` | combanketh.et |
| Gold | `#F5B55B` | Seal highlight |
| Gold accent | `#E8A029` | combanketh.et |

---

## Scope

Every screen is scoped to **CBE Busa Branch** (Dawo Woreda, South West Shewa Zone, Oromia).

---

## Desktop screens

| File | Screen |
|---|---|
| `01-home-hero.png` | Home — hero, branch identity, ticket lookup |
| `02-home-full.png` | Home — full page |
| `03-complaint-step1-type.png` | Complaint wizard — step 1, submission type |
| `04-complaint-step2-details.png` | Complaint wizard — step 2, details filled |
| `05-complaint-step3-contact.png` | Complaint wizard — step 3, contact + locality |
| `06-complaint-validation.png` | Complaint wizard — inline validation errors |
| `07-complaint-step4-review.png` | Complaint wizard — step 4, review |
| `08-complaint-success.png` | Complaint — reference number issued |
| `09-track-in-progress.png` | Track — case in progress with timeline |
| `10-track-resolved-rating.png` | Track — resolved case with star rating |
| `11-track-escalated.png` | Track — escalated case |
| `12-appointment-step1-service.png` | Booking — step 1, service |
| `13-appointment-step2-date.png` | Booking — step 2, date strip |
| `14-appointment-step2-slots.png` | Booking — step 2, live slot availability |
| `15-appointment-step3-details.png` | Booking — step 3, your details |
| `16-appointment-confirmed.png` | Booking — confirmation |
| `17-my-appointments.png` | My Appointments — upcoming / past / cancelled |
| `18-appointment-reschedule.png` | My Appointments — inline reschedule |
| `18b-staff-login.png` | Staff sign-in with the three demo accounts |
| `19-admin-dashboard.png` | Staff Desk — KPIs and case table (signed in as Branch Manager) |
| `20-admin-case-drawer.png` | Staff Desk — case drawer with status workflow |
| `21-admin-appointments.png` | Staff Desk — appointments queue |
| `22-admin-insights.png` | Staff Desk — insights |

## Mobile screens

| File | Screen |
|---|---|
| `23-mobile-home.png` | Home |
| `24-mobile-complaint.png` | Complaint wizard |
| `25-mobile-appointment.png` | Booking wizard |
| `25b-mobile-login.png` | Staff sign-in |
| `26-mobile-nav.png` | Hamburger navigation open |
