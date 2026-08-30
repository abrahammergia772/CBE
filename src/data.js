// ============================================================
// CBE Care — mock reference data + local persistence layer
// Replace the store functions with real API calls when a
// backend is available. Shapes are intentionally API-like.
// ============================================================

export const BRAND = {
  purple: '#9C278B',
  purpleDeep: '#910096',
  gold: '#E8A029',
  grey: '#A6A6A6',
}

export const COMPLAINT_CATEGORIES = [
  { id: 'atm', label: 'ATM / Card Services', desc: 'Cash not dispensed, card captured, wrong amount', sla: 3, icon: 'card' },
  { id: 'mobile', label: 'CBE Birr / Mobile Banking', desc: 'Failed transfer, login issue, wrong debit', sla: 2, icon: 'phone' },
  { id: 'account', label: 'Account & Deposits', desc: 'Balance error, statement, dormant account', sla: 5, icon: 'wallet' },
  { id: 'loan', label: 'Loan & Credit', desc: 'Application status, repayment, interest query', sla: 7, icon: 'doc' },
  { id: 'forex', label: 'Foreign Exchange / Remittance', desc: 'Transfer delay, rate dispute, LC issues', sla: 5, icon: 'globe' },
  { id: 'service', label: 'Branch Service Quality', desc: 'Staff conduct, long queues, facilities', sla: 4, icon: 'users' },
  { id: 'digital', label: 'Internet Banking', desc: 'Portal access, OTP, statement download', sla: 3, icon: 'monitor' },
  { id: 'other', label: 'Other', desc: 'Anything not listed above', sla: 5, icon: 'dots' },
]

export const FEEDBACK_TYPES = [
  { id: 'complaint', label: 'Complaint', desc: 'Something went wrong and needs a fix', icon: 'alert' },
  { id: 'suggestion', label: 'Suggestion', desc: 'An idea to improve our service', icon: 'bulb' },
  { id: 'compliment', label: 'Compliment', desc: 'Recognise great service you received', icon: 'heart' },
  { id: 'inquiry', label: 'Inquiry', desc: 'A question about a product or process', icon: 'help' },
]

export const CHANNELS = [
  'Branch counter', 'ATM', 'CBE Birr', 'Mobile Banking App',
  'Internet Banking', 'POS terminal', 'Call centre (951)', 'Agent banking',
]

export const SEVERITIES = [
  { id: 'low', label: 'Low', desc: 'Minor inconvenience' },
  { id: 'medium', label: 'Medium', desc: 'Service disrupted' },
  { id: 'high', label: 'High', desc: 'Funds or access affected' },
  { id: 'critical', label: 'Critical', desc: 'Suspected fraud / large loss' },
]

export const REGIONS = [
  'Addis Ababa', 'Oromia', 'Amhara', 'Tigray', 'Sidama', 'South Ethiopia',
  'Central Ethiopia', 'Somali', 'Afar', 'Benishangul-Gumuz', 'Gambella', 'Harari', 'Dire Dawa',
]

export const BRANCHES = [
  { id: 'br-nek', name: 'Nekemte Main Branch', region: 'Oromia', city: 'Nekemte', address: 'Burka Jato, Main Road', open: '8:00 AM – 5:00 PM' },
  { id: 'br-nek2', name: 'Nekemte Bake Jama Branch', region: 'Oromia', city: 'Nekemte', address: 'Bake Jama Sub-city', open: '8:00 AM – 5:00 PM' },
  { id: 'br-amb', name: 'Ambo Branch', region: 'Oromia', city: 'Ambo', address: 'Ambo Town Centre', open: '8:00 AM – 5:00 PM' },
  { id: 'br-jim', name: 'Jimma Branch', region: 'Oromia', city: 'Jimma', address: 'Hermata, Jimma', open: '8:00 AM – 5:00 PM' },
  { id: 'br-adama', name: 'Adama Main Branch', region: 'Oromia', city: 'Adama', address: 'Dembela Sub-city', open: '8:00 AM – 5:00 PM' },
  { id: 'br-hq', name: 'CBE Headquarters Branch', region: 'Addis Ababa', city: 'Addis Ababa', address: 'Ras Desta Damtew St, Kirkos', open: '8:00 AM – 5:00 PM' },
  { id: 'br-bole', name: 'Bole Branch', region: 'Addis Ababa', city: 'Addis Ababa', address: 'Bole Medhanialem', open: '8:00 AM – 5:00 PM' },
  { id: 'br-mer', name: 'Merkato Branch', region: 'Addis Ababa', city: 'Addis Ababa', address: 'Addis Ketema, Merkato', open: '8:00 AM – 6:00 PM' },
  { id: 'br-piaz', name: 'Piassa Branch', region: 'Addis Ababa', city: 'Addis Ababa', address: 'Arada, Piassa', open: '8:00 AM – 5:00 PM' },
  { id: 'br-bdr', name: 'Bahir Dar Branch', region: 'Amhara', city: 'Bahir Dar', address: 'Belay Zeleke Street', open: '8:00 AM – 5:00 PM' },
  { id: 'br-gon', name: 'Gondar Branch', region: 'Amhara', city: 'Gondar', address: 'Piassa, Gondar', open: '8:00 AM – 5:00 PM' },
  { id: 'br-hwa', name: 'Hawassa Branch', region: 'Sidama', city: 'Hawassa', address: 'Piassa, Hawassa', open: '8:00 AM – 5:00 PM' },
  { id: 'br-mek', name: 'Mekelle Branch', region: 'Tigray', city: 'Mekelle', address: 'Hadnet Sub-city', open: '8:00 AM – 5:00 PM' },
  { id: 'br-dd', name: 'Dire Dawa Branch', region: 'Dire Dawa', city: 'Dire Dawa', address: 'Kezira, Dire Dawa', open: '8:00 AM – 5:00 PM' },
]

export const APPOINTMENT_SERVICES = [
  { id: 'acc-open', label: 'New Account Opening', mins: 30, icon: 'wallet', desc: 'Personal, business or diaspora accounts' },
  { id: 'loan', label: 'Loan Consultation', mins: 45, icon: 'doc', desc: 'Housing, vehicle, SME and personal loans' },
  { id: 'forex', label: 'Foreign Exchange Service', mins: 30, icon: 'globe', desc: 'FX purchase, remittance, LC advisory' },
  { id: 'card', label: 'Card & Digital Banking', mins: 20, icon: 'card', desc: 'Card issue/replacement, CBE Birr, mobile banking' },
  { id: 'complaint-mtg', label: 'Complaint Review Meeting', mins: 30, icon: 'alert', desc: 'Discuss an open ticket with a resolution officer' },
  { id: 'business', label: 'Business / Corporate Banking', mins: 60, icon: 'briefcase', desc: 'Trade finance, payroll, corporate facilities' },
  { id: 'diaspora', label: 'Diaspora Banking', mins: 40, icon: 'users', desc: 'Diaspora accounts, bonds and investment' },
  { id: 'other-apt', label: 'Other Enquiry', mins: 20, icon: 'dots', desc: 'General banking assistance' },
]

export const TIME_SLOTS = [
  '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
]

export const STATUSES = {
  received:   { label: 'Received',    cls: 'b-new' },
  review:     { label: 'Under Review', cls: 'b-prog' },
  progress:   { label: 'In Progress', cls: 'b-prog' },
  escalated:  { label: 'Escalated',   cls: 'b-esc' },
  resolved:   { label: 'Resolved',    cls: 'b-res' },
  closed:     { label: 'Closed',      cls: 'b-grey' },
}

export const APT_STATUS = {
  confirmed: { label: 'Confirmed', cls: 'b-res' },
  pending:   { label: 'Pending',   cls: 'b-prog' },
  completed: { label: 'Completed', cls: 'b-grey' },
  cancelled: { label: 'Cancelled', cls: 'b-esc' },
}

// -------------------- ID helpers --------------------
const pad = (n, w = 4) => String(n).padStart(w, '0')

export function makeTicketId() {
  const d = new Date()
  const y = String(d.getFullYear()).slice(2)
  const m = pad(d.getMonth() + 1, 2)
  const rand = Math.floor(Math.random() * 9000) + 1000
  return `CBE-${y}${m}-${rand}`
}

export function makeAptId() {
  const rand = Math.floor(Math.random() * 90000) + 10000
  return `APT-${rand}`
}

// -------------------- Dates --------------------
export function addBusinessDays(from, days) {
  const d = new Date(from)
  let left = days
  while (left > 0) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0) left-- // Sunday closed
  }
  return d
}

// Local-timezone-safe ISO date (avoids the UTC shift of toISOString in UTC+3)
export const toISODate = (d) => {
  const x = new Date(d)
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`
}

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

export const fmtDateTime = (d) =>
  new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export function nextDays(count = 21) {
  const out = []
  const now = new Date()
  for (let i = 1; out.length < count; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    if (d.getDay() === 0) continue // Sunday closed
    out.push(d)
  }
  return out
}

// -------------------- Store (localStorage) --------------------
const K_TICKETS = 'cbe_care_tickets_v1'
const K_APTS = 'cbe_care_appointments_v1'

// Sandboxed iframes and private-mode browsers can throw on any localStorage
// access, so every call is guarded and falls back to an in-memory map.
const memory = new Map()

const hasLS = (() => {
  try {
    const probe = '__cbe_probe__'
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return true
  } catch { return false }
})()

const rawGet = (k) => {
  if (!hasLS) return memory.has(k) ? memory.get(k) : null
  try { return window.localStorage.getItem(k) } catch { return memory.get(k) ?? null }
}
const rawSet = (k, v) => {
  memory.set(k, v)
  if (!hasLS) return
  try { window.localStorage.setItem(k, v) } catch { /* quota or blocked */ }
}

const read = (k, fallback) => {
  try {
    const raw = rawGet(k)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}
const write = (k, v) => { try { rawSet(k, JSON.stringify(v)) } catch { /* ignore */ } }

// -------------------- Seed demo records --------------------
function seed() {
  if (!rawGet(K_TICKETS)) {
    const now = Date.now()
    const day = 86400000
    const demo = [
      {
        id: 'CBE-2608-4471', type: 'complaint', category: 'atm', channel: 'ATM',
        severity: 'high', subject: 'ATM did not dispense cash but account debited',
        description: 'I withdrew 5,000 ETB at the Nekemte Main ATM on 22 Aug. The machine did not dispense the cash but my account was debited immediately.',
        name: 'Abebe Tolera', phone: '+251911234567', email: 'abebe.t@example.com',
        account: '1000••••4471', region: 'Oromia', branch: 'br-nek',
        amount: '5000', txnRef: 'ATM88213904', status: 'progress',
        created: now - day * 3, updated: now - day * 1, rating: 0, files: ['atm-slip.jpg'],
        assignee: 'Digital Banking Unit', anonymous: false,
        events: [
          { t: now - day * 3, title: 'Complaint received', msg: 'Logged via web portal and routed to Digital Banking Unit.', done: true },
          { t: now - day * 3 + 7200000, title: 'Acknowledged', msg: 'SMS confirmation sent to +251911234567.', done: true },
          { t: now - day * 2, title: 'Under review', msg: 'ATM journal and switch logs requested from the terminal owner.', done: true },
          { t: now - day * 1, title: 'In progress', msg: 'Reconciliation confirmed. Reversal is queued for the next settlement run.', done: true },
        ],
      },
      {
        id: 'CBE-2608-2210', type: 'suggestion', category: 'mobile', channel: 'CBE Birr',
        severity: 'low', subject: 'Add fingerprint login to the CBE Birr app',
        description: 'Typing the PIN every time is slow. Please add biometric login for faster and safer access.',
        name: 'Hanna Girma', phone: '+251922334455', email: 'hanna.g@example.com',
        account: '', region: 'Addis Ababa', branch: 'br-bole',
        amount: '', txnRef: '', status: 'review',
        created: now - day * 6, updated: now - day * 4, rating: 0, files: [], assignee: 'Digital Product Team', anonymous: false,
        events: [
          { t: now - day * 6, title: 'Feedback received', msg: 'Logged as a product suggestion.', done: true },
          { t: now - day * 4, title: 'Under review', msg: 'Shared with the digital product backlog committee.', done: true },
        ],
      },
      {
        id: 'CBE-2607-9902', type: 'complaint', category: 'service', channel: 'Branch counter',
        severity: 'medium', subject: 'Long waiting time at the counter',
        description: 'I waited more than one hour for a simple deposit. Only two counters were open during peak hours.',
        name: 'Anonymous', phone: '', email: '', account: '', region: 'Amhara', branch: 'br-bdr',
        amount: '', txnRef: '', status: 'resolved',
        created: now - day * 15, updated: now - day * 9, rating: 4, files: [], assignee: 'Branch Operations', anonymous: true,
        events: [
          { t: now - day * 15, title: 'Complaint received', msg: 'Submitted anonymously via web portal.', done: true },
          { t: now - day * 13, title: 'Under review', msg: 'Branch manager asked for a staffing report.', done: true },
          { t: now - day * 11, title: 'In progress', msg: 'Two additional counters opened for peak hours (9–11 AM).', done: true },
          { t: now - day * 9, title: 'Resolved', msg: 'Queue management system installed and staffing schedule revised.', done: true },
        ],
      },
      {
        id: 'CBE-2608-7788', type: 'complaint', category: 'forex', channel: 'Branch counter',
        severity: 'critical', subject: 'Inbound remittance not credited after 6 days',
        description: 'A remittance of USD 1,200 sent from Dubai on 20 Aug has still not reached my account.',
        name: 'Yonas Bekele', phone: '+251933445566', email: 'yonas.b@example.com',
        account: '1000••••7788', region: 'Addis Ababa', branch: 'br-hq',
        amount: '68400', txnRef: 'RMT-DXB-88120', status: 'escalated',
        created: now - day * 2, updated: now - 3600000 * 5, rating: 0, files: ['swift-copy.pdf'],
        assignee: 'International Banking', anonymous: false,
        events: [
          { t: now - day * 2, title: 'Complaint received', msg: 'Flagged as critical — funds not credited.', done: true },
          { t: now - day * 1, title: 'Under review', msg: 'SWIFT MT103 trace initiated with the correspondent bank.', done: true },
          { t: now - 3600000 * 5, title: 'Escalated', msg: 'Escalated to the International Banking Directorate for same-day action.', done: true },
        ],
      },
      {
        id: 'CBE-2608-1122', type: 'compliment', category: 'service', channel: 'Branch counter',
        severity: 'low', subject: 'Excellent help from the Nekemte branch team',
        description: 'Officer Meseret patiently helped my elderly mother open a savings account. Outstanding service.',
        name: 'Lensa Dinku', phone: '+251944556677', email: 'lensa.d@example.com',
        account: '', region: 'Oromia', branch: 'br-nek',
        amount: '', txnRef: '', status: 'closed',
        created: now - day * 8, updated: now - day * 7, rating: 5, files: [], assignee: 'Branch Operations', anonymous: false,
        events: [
          { t: now - day * 8, title: 'Compliment received', msg: 'Thank you for recognising our staff.', done: true },
          { t: now - day * 7, title: 'Closed', msg: 'Shared with the branch manager and noted in the staff recognition file.', done: true },
        ],
      },
    ]
    write(K_TICKETS, demo)
  }

  if (!rawGet(K_APTS)) {
    const days = nextDays(10)
    const demo = [
      {
        id: 'APT-48213', service: 'loan', branch: 'br-nek',
        date: toISODate(days[1]), time: '10:00',
        name: 'Abebe Tolera', phone: '+251911234567', email: 'abebe.t@example.com',
        notes: 'Housing loan for a 3-bedroom unit in Nekemte.', status: 'confirmed', created: Date.now() - 86400000 * 2,
      },
      {
        id: 'APT-51907', service: 'acc-open', branch: 'br-bole',
        date: toISODate(days[3]), time: '14:00',
        name: 'Hanna Girma', phone: '+251922334455', email: 'hanna.g@example.com',
        notes: 'Opening a business account for a new trading company.', status: 'pending', created: Date.now() - 86400000,
      },
    ]
    write(K_APTS, demo)
  }
}

// -------------------- Public API --------------------
export function getTickets() { seed(); return read(K_TICKETS, []) }

export function saveTicket(t) {
  const all = getTickets()
  all.unshift(t)
  write(K_TICKETS, all)
  return t
}

export function findTicket(id) {
  const q = String(id || '').trim().toUpperCase()
  return getTickets().find((t) => t.id.toUpperCase() === q) || null
}

export function updateTicket(id, patch) {
  const all = getTickets().map((t) => (t.id === id ? { ...t, ...patch, updated: Date.now() } : t))
  write(K_TICKETS, all)
  return all.find((t) => t.id === id)
}

export function getAppointments() { seed(); return read(K_APTS, []) }

export function saveAppointment(a) {
  const all = getAppointments()
  all.unshift(a)
  write(K_APTS, all)
  return a
}

export function updateAppointment(id, patch) {
  const all = getAppointments().map((a) => (a.id === id ? { ...a, ...patch } : a))
  write(K_APTS, all)
  return all.find((a) => a.id === id)
}

export function bookedSlots(branchId, date) {
  return getAppointments()
    .filter((a) => a.branch === branchId && a.date === date && a.status !== 'cancelled')
    .map((a) => a.time)
}

// Deterministic pseudo-busy slots so the calendar feels alive without a backend
export function busySlots(branchId, date) {
  if (!branchId || !date) return []
  const seedNum = [...(branchId + date)].reduce((a, c) => a + c.charCodeAt(0), 0)
  return TIME_SLOTS.filter((_, i) => (seedNum + i * 7) % 5 === 0)
}

export const branchById = (id) => BRANCHES.find((b) => b.id === id)
export const serviceById = (id) => APPOINTMENT_SERVICES.find((s) => s.id === id)
export const categoryById = (id) => COMPLAINT_CATEGORIES.find((c) => c.id === id)
