#!/usr/bin/env node
// Screenshot script for CBE Care portal
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:5173/#'
const DIR = 'screenshots'
mkdirSync(DIR, { recursive: true })

const pages = [
  { name: '01-home',               path: '/' },
  { name: '02-home-quick-lookup',  path: '/' },
  { name: '03-complaint-step1',    path: '/submit' },
  { name: '04-complaint-step2',    path: '/submit' },
  { name: '05-track-resolved',     path: '/track?id=CBE-2607-9902' },
  { name: '06-track-resolved-solution', path: '/track?id=CBE-2607-9902' },
  { name: '07-track-in-progress',  path: '/track?id=CBE-2608-4471' },
  { name: '08-appointment',        path: '/appointment' },
  { name: '09-my-appointments',    path: '/my-appointments' },
  { name: '10-login',              path: '/login' },
  { name: '11-admin-dashboard',    path: '/admin' },
  { name: '12-admin-case-open',    path: '/admin' },
  { name: '13-admin-case-solution', path: '/admin' },
]

async function main() {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()

  // 1. Home page
  console.log('📷 01-home')
  await page.goto(BASE + '/')
  await page.waitForTimeout(1500)
  await page.screenshot({ path: `${DIR}/01-home.png`, fullPage: true })

  // 2. Home hero with quick lookup
  console.log('📷 02-home-quick-lookup')
  await page.screenshot({ path: `${DIR}/02-home-quick-lookup.png` })

  // 3. Complaint step 1
  console.log('📷 03-complaint-step1')
  await page.goto(BASE + '/submit')
  await page.waitForTimeout(1000)
  await page.screenshot({ path: `${DIR}/03-complaint-step1.png`, fullPage: true })

  // 4. Complaint step 2 - click a type to move forward
  console.log('📷 04-complaint-step2')
  const complaintType = page.locator('.pick').first()
  if (await complaintType.isVisible()) {
    await complaintType.click()
    await page.waitForTimeout(500)
    // Click next
    const nextBtn = page.locator('.btn-primary:has-text("Next")')
    if (await nextBtn.isVisible()) {
      await nextBtn.click()
      await page.waitForTimeout(500)
    }
  }
  await page.screenshot({ path: `${DIR}/04-complaint-step2.png`, fullPage: true })

  // 5. Track resolved case (with solution)
  console.log('📷 05-track-resolved')
  await page.goto(BASE + '/track?id=CBE-2607-9902')
  await page.waitForTimeout(1500)
  await page.screenshot({ path: `${DIR}/05-track-resolved.png`, fullPage: true })

  // 6. Track resolved - zoomed on solution block
  console.log('📷 06-track-resolved-solution')
  // Scroll to the solution block
  const solutionBlock = page.locator('text=Staff Feedback / Solution').first()
  if (await solutionBlock.isVisible()) {
    await solutionBlock.scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
  }
  await page.screenshot({ path: `${DIR}/06-track-resolved-solution.png` })

  // 7. Track in-progress case
  console.log('📷 07-track-in-progress')
  await page.goto(BASE + '/track?id=CBE-2608-4471')
  await page.waitForTimeout(1500)
  await page.screenshot({ path: `${DIR}/07-track-in-progress.png`, fullPage: true })

  // 8. Appointment booking
  console.log('📷 08-appointment')
  await page.goto(BASE + '/appointment')
  await page.waitForTimeout(1000)
  await page.screenshot({ path: `${DIR}/08-appointment.png`, fullPage: true })

  // 9. My appointments
  console.log('📷 09-my-appointments')
  await page.goto(BASE + '/my-appointments')
  await page.waitForTimeout(1000)
  await page.screenshot({ path: `${DIR}/09-my-appointments.png`, fullPage: true })

  // 10. Login page
  console.log('📷 10-login')
  await page.goto(BASE + '/login')
  await page.waitForTimeout(1000)
  await page.screenshot({ path: `${DIR}/10-login.png`, fullPage: true })

  // 11. Admin dashboard
  console.log('📷 11-admin-dashboard')
  // Login first
  const usernameInput = page.locator('input[placeholder*="username" i], input[type="text"]').first()
  const passwordInput = page.locator('input[type="password"]').first()
  if (await usernameInput.isVisible()) {
    await usernameInput.fill('manager')
    await passwordInput.fill('busa@123')
    const loginBtn = page.locator('button:has-text("Sign in")')
    await loginBtn.click()
    await page.waitForTimeout(1500)
  }
  // Navigate to admin if not already there
  await page.goto(BASE + '/admin')
  await page.waitForTimeout(1500)
  await page.screenshot({ path: `${DIR}/11-admin-dashboard.png`, fullPage: true })

  // 12. Admin case drawer - open a case
  console.log('📷 12-admin-case-open')
  const openBtn = page.locator('button:has-text("Open")').first()
  if (await openBtn.isVisible()) {
    await openBtn.click()
    await page.waitForTimeout(800)
  }
  // Scroll to the case drawer
  const caseDrawer = page.locator('text=Case data').first()
  if (await caseDrawer.isVisible()) {
    await caseDrawer.scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
  }
  await page.screenshot({ path: `${DIR}/12-admin-case-open.png`, fullPage: true })

  // 13. Admin case - zoomed on solution/feedback textarea
  console.log('📷 13-admin-case-solution')
  const feedbackLabel = page.locator('text=Staff Feedback / Solution').first()
  if (await feedbackLabel.isVisible()) {
    await feedbackLabel.scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
  }
  await page.screenshot({ path: `${DIR}/13-admin-case-solution.png` })

  await browser.close()
  console.log(`\n✅ Done — ${pages.length} screenshots saved to ${DIR}/`)
}

main().catch(e => { console.error(e); process.exit(1) })