# CBE Care — Documentation Screenshots

Captured from the live application (Chromium, real UI interaction — not mockups).
Desktop shots are **1440×900 @2x**; mobile shots are **414×896 @3x**.

Start here: **`00-index-contact-sheet.png`** — every desktop screen on one sheet.

---

## Branding

The official **CBE Birr** logo is used throughout, in two variants generated from the supplied artwork:

| Asset | Use |
|---|---|
| `src/assets/cbe-birr-logo.png` | Masthead, light backgrounds (black "CBE" wordmark) |
| `src/assets/cbe-birr-logo-white.png` | Footer, purple backgrounds (white type, gold swoosh retained) |

Palette sampled directly from the logo pixels:

| Token | Hex | Source |
|---|---|---|
| Primary purple | `#6D1472` | Logo "Birr" wordmark |
| Purple (UI primary) | `#7D1A80` | Logo purple, lightened for interactive surfaces |
| Gold | `#F5B55B` | Logo swoosh |
| Gold accent | `#E8A029` | combanketh.et |

---

## Desktop screens

### Landing
| File | Shows |
|---|---|
| `01-home-hero.png` | Hero, live ticket lookup, brand masthead, KPI strip |
| `02-home-full.png` | Full page — service cards, 4-step process rail, SLA table |

### Complaint & feedback submission
| File | Shows |
|---|---|
| `03-complaint-step1-type.png` | Step 1 — submission type + 8 service areas with per-category SLA badges |
| `04-complaint-step2-details.png` | Step 2 — channel, severity, subject, description, amount, txn ref, file upload |
| `05-complaint-step3-contact.png` | Step 3 — contact details, anonymous toggle, region/branch, consent |
| `06-complaint-validation.png` | **Inline validation** — required-field errors blocking progression |
| `07-complaint-step4-review.png` | Step 4 — full review before submit, with computed target date |
| `08-complaint-success.png` | Confirmation — generated reference `CBE-YYMM-NNNN`, SLA, next steps |

### Case tracking
| File | Shows |
|---|---|
| `09-track-in-progress.png` | Active case — progress bar, 4-event timeline, assigned unit |
| `10-track-resolved-rating.png` | Resolved case — full timeline plus 5-star satisfaction rating |
| `11-track-escalated.png` | Escalated critical case — red alert banner, priority handling notice |

### Appointment booking
| File | Shows |
|---|---|
| `12-appointment-step1-service.png` | Step 1 — 8 bookable services with durations |
| `13-appointment-step2-branch.png` | Step 2 — region filter, branch cards with address and hours |
| `14-appointment-step3-slots.png` | Step 3 — 14-day strip, live slot grid with booked/closed states |
| `15-appointment-step4-details.png` | Step 4 — customer details, notes, reminder opt-in, summary |
| `16-appointment-confirmed.png` | Confirmation — reference `APT-NNNNN`, what to bring |
| `17-my-appointments.png` | Upcoming / Past / Cancelled tabs with per-booking actions |
| `18-appointment-reschedule.png` | Inline reschedule — conflict-aware date and slot re-pick |

### Staff resolution desk
| File | Shows |
|---|---|
| `19-admin-dashboard.png` | KPI tiles, filterable case table, SLA breach highlighted in red |
| `20-admin-case-drawer.png` | Case detail — full record, staff note field, status workflow, timeline |
| `21-admin-appointments.png` | Branch appointment queue with confirm/complete actions |
| `22-admin-insights.png` | Volume by service area, SLA health, status breakdown |

---

## Mobile screens

| File | Shows |
|---|---|
| `23-mobile-home.png` | Responsive landing page |
| `24-mobile-complaint.png` | Wizard on mobile — stepper collapses to numbered bubbles |
| `25-mobile-appointment.png` | Service picker stacked to a single column |
| `26-mobile-nav.png` | Hamburger navigation drawer open |

---

## Regenerating

```bash
cd cbe-care
npm install
npx playwright install chromium
npm run dev          # in one shell
node scripts/shoot.mjs   # in another
```

Output lands in `/home/user/screenshots/`. The script drives the real UI —
filling forms, clicking through wizards and submitting — so the screenshots
always reflect current behaviour.

---

## Notes for documentation authors

- Every screenshot is of **real application state**. The reference numbers
  (`CBE-2609-2215`, `APT-...`) were genuinely generated during capture, so they
  differ between runs.
- Sample data is Ethiopian in context: ETB amounts, Nekemte/Bahir Dar/Addis
  branches, `+2519…` mobile numbers, Amharic and Afaan Oromoo language toggles.
- The staff desk carries a visible "Demonstration view" banner — in production
  it sits behind staff SSO with role-based access control.
- Full-page shots (`02`, `04`–`22`) include the footer; crop to the content area
  if you need tighter figures.
