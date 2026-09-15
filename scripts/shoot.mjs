// Captures documentation screenshots by driving the real UI in Chromium.
import { chromium } from 'playwright'
import fs from 'node:fs'

const BASE = 'http://localhost:5173'
const OUT = '/home/user/screenshots'
fs.mkdirSync(OUT, { recursive: true })

const DESKTOP = { width: 1440, height: 900 }
const MOBILE = { width: 414, height: 896 }

const shots = []

const UNSTICK = `.masthead { position: static !important; }`

async function shoot(page, name, full = false) {
  const path = `${OUT}/${name}.png`
  await page.waitForTimeout(420)
  // A sticky masthead re-paints halfway down a fullPage capture, so pin it.
  const tag = full ? await page.addStyleTag({ content: UNSTICK }).catch(() => null) : null
  await page.screenshot({ path, fullPage: full })
  if (tag) await tag.evaluate((n) => n.remove()).catch(() => {})
  const kb = (fs.statSync(path).size / 1024).toFixed(0)
  shots.push(`${name}.png (${kb} KB)`)
  console.log(`  ✓ ${name}.png  ${kb} KB`)
}

const go = async (page, hash) => {
  await page.goto(`${BASE}/#${hash}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(650)
}

// Click a button/label by its visible text
async function tap(page, text, nth = 0) {
  const el = page.getByText(text, { exact: false }).nth(nth)
  await el.scrollIntoViewIfNeeded()
  await el.click()
  await page.waitForTimeout(300)
}

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: DESKTOP, deviceScaleFactor: 2 })
await ctx.clearCookies()
const page = await ctx.newPage()

console.log('\n— Desktop —')

// 01 Home
await go(page, '/')
await shoot(page, '01-home-hero')
await shoot(page, '02-home-full', true)

// 03 Complaint wizard — step 1
await go(page, '/submit')
await shoot(page, '03-complaint-step1-type')

// 04 step 2 details, filled
await page.getByText('ATM / Card Services').click()
await page.waitForTimeout(200)
await page.getByRole('button', { name: /Continue/ }).click()
await page.waitForTimeout(500)
await page.getByRole('button', { name: 'ATM', exact: true }).first().click()
await page.getByPlaceholder(/ATM debited my account/).fill('ATM debited my account but did not dispense cash')
await page.getByPlaceholder(/Describe what happened/).fill(
  'I tried to withdraw 5,000 ETB from the Busa Branch ATM on 12 September at around 3:40 PM. The machine processed the request and printed a slip, but no cash was dispensed. My account was debited immediately and I received an SMS confirming the withdrawal.'
)
await page.getByPlaceholder('5000').fill('5000')
await page.getByPlaceholder(/ATM88213904/).fill('ATM88213904')
await shoot(page, '04-complaint-step2-details', true)

// 05 step 3 contact
await page.getByRole('button', { name: /Continue/ }).click()
await page.waitForTimeout(500)
await page.getByPlaceholder(/Abebe Tolera/).fill('Abebe Tolera')
await page.getByPlaceholder('0911234567').fill('0911234567')
await page.getByPlaceholder('you@example.com').fill('abebe.tolera@example.com')
await page.getByPlaceholder('1000123456789').fill('1000234567891')
await page.locator('select').last().selectOption({ label: 'Busa Town — Kebele 01' })
await page.waitForTimeout(250)
await shoot(page, '05-complaint-step3-contact', true)

// 06 validation errors
await page.getByRole('button', { name: /Review submission/ }).click()
await page.waitForTimeout(450)
await shoot(page, '06-complaint-validation', true)

// 07 review step
await page.locator('input[type=checkbox]').last().check()
await page.getByRole('button', { name: /Review submission/ }).click()
await page.waitForTimeout(600)
await shoot(page, '07-complaint-step4-review', true)

// 08 success + ticket number
await page.getByRole('button', { name: /Confirm & Submit|Confirm &amp; Submit/ }).click()
await page.waitForTimeout(900)
await shoot(page, '08-complaint-success', true)

// 09/10 tracking
await go(page, '/track?id=CBE-2608-4471')
await shoot(page, '09-track-in-progress', true)
await go(page, '/track?id=CBE-2607-9902')
await shoot(page, '10-track-resolved-rating', true)
await go(page, '/track?id=CBE-2608-7788')
await shoot(page, '11-track-escalated', true)

// 12 appointment step 1
await go(page, '/appointment')
await shoot(page, '12-appointment-step1-service')

// 13 calendar (branch is fixed to Busa, so this is now step 2 of 3)
await page.getByText('Loan Consultation').click()
await page.getByRole('button', { name: /Continue/ }).click()
await page.waitForTimeout(500)
await shoot(page, '13-appointment-step2-date', true)

// 14 slots for the chosen day
await page.locator('.day').nth(2).click()
await page.waitForTimeout(500)
await shoot(page, '14-appointment-step2-slots', true)

// 15 confirmation
await page.locator('.slot:not([disabled])').nth(3).click()
await page.getByRole('button', { name: /Continue/ }).click()
await page.waitForTimeout(450)
await page.getByPlaceholder(/Abebe Tolera/).fill('Lensa Dinku')
await page.getByPlaceholder('0911234567').fill('0922334455')
await page.getByPlaceholder('you@example.com').fill('lensa.dinku@example.com')
await page.getByPlaceholder(/housing loan/).fill('Housing loan enquiry for a 3-bedroom unit in Busa town. Documents are ready.')
await page.locator('input[type=checkbox]').last().check()
await page.waitForTimeout(200)
await shoot(page, '15-appointment-step3-details', true)
await page.getByRole('button', { name: /Confirm Booking/ }).click()
await page.waitForTimeout(900)
await shoot(page, '16-appointment-confirmed', true)

// 17 my appointments
await go(page, '/my-appointments')
await shoot(page, '17-my-appointments', true)

// 18 reschedule open
try {
  await page.getByRole('button', { name: /Reschedule/ }).first().click()
  await page.waitForTimeout(600)
  await shoot(page, '18-appointment-reschedule', true)
} catch { console.log('  ! reschedule skipped') }

// 19 staff sign-in, then the desk
await go(page, '/login')
await shoot(page, '18b-staff-login', true)
await page.locator('.demo-user').first().click()
await page.waitForTimeout(250)
await page.getByRole('button', { name: /^Sign in$/ }).click()
await page.waitForTimeout(1400)
await shoot(page, '19-admin-dashboard', true)

// 20 case drawer
try {
  await page.getByRole('button', { name: 'Open' }).first().click()
  await page.waitForTimeout(700)
  await shoot(page, '20-admin-case-drawer', true)
} catch { console.log('  ! drawer skipped') }

// 21 appointments queue
await go(page, '/admin')
await page.getByRole('button', { name: /Appointments \(/ }).click()
await page.waitForTimeout(500)
await shoot(page, '21-admin-appointments', true)

// 22 insights
await page.getByRole('button', { name: /Insights/ }).click()
await page.waitForTimeout(600)
await shoot(page, '22-admin-insights', true)

console.log('\n— Mobile —')
const mctx = await browser.newContext({ viewport: MOBILE, deviceScaleFactor: 3, isMobile: true, hasTouch: true })
const m = await mctx.newPage()

await m.goto(`${BASE}/#/`, { waitUntil: 'networkidle' }); await m.waitForTimeout(700)
await shoot(m, '23-mobile-home', true)

await m.goto(`${BASE}/#/submit`, { waitUntil: 'networkidle' }); await m.waitForTimeout(700)
await shoot(m, '24-mobile-complaint', true)

await m.goto(`${BASE}/#/appointment`, { waitUntil: 'networkidle' }); await m.waitForTimeout(700)
await shoot(m, '25-mobile-appointment', true)

await m.goto(`${BASE}/#/login`, { waitUntil: 'networkidle' }); await m.waitForTimeout(700)
await shoot(m, '25b-mobile-login', true)

// 26 mobile nav open
await m.goto(`${BASE}/#/`, { waitUntil: 'networkidle' }); await m.waitForTimeout(500)
await m.locator('.burger').click(); await m.waitForTimeout(450)
await shoot(m, '26-mobile-nav')

await browser.close()
console.log(`\n${shots.length} screenshots -> ${OUT}\n`)
