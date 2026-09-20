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

// ---------------------------------------------------------------
// This portal serves ONE branch: CBE Busa Branch.
// Busa is the district town of Dawo woreda, South West Shewa Zone,
// Oromia (~90 km south-west of Addis Ababa).
// ---------------------------------------------------------------
export const BRANCH = {
  id: 'br-busa',
  name: 'Busa Branch',
  bank: 'Commercial Bank of Ethiopia',
  town: 'Busa',
  woreda: 'Dawo Woreda',
  zone: 'South West Shewa Zone',
  region: 'Oromia',
  address: 'Main Road, Busa Town',
  addressFull: 'Main Road, Busa Town, Dawo Woreda, South West Shewa Zone, Oromia',
  hoursWeekday: 'Monday – Friday, 8:00 AM – 5:00 PM',
  hoursSaturday: 'Saturday, 8:00 AM – 12:30 PM',
  hoursShort: 'Mon–Fri 8:00 AM – 5:00 PM · Sat 8:00 AM – 12:30 PM',
  callCentre: '951',
  email: 'busa.branch@cbe.com.et',
  staffCount: 14,
  counters: 4,
}

// Where the customer is based, used instead of a nationwide region list.
export const LOCALITIES = [
  'Busa Town — Kebele 01',
  'Busa Town — Kebele 02',
  'Busa Town — Kebele 03',
  'Dawo Woreda — rural kebele',
  'Neighbouring woreda (Becho, Elu, Dendi, Waliso)',
  'Outside South West Shewa Zone',
]

// Kept as a one-element list so existing lookups keep working.
export const BRANCHES = [
  {
    id: BRANCH.id,
    name: BRANCH.name,
    region: BRANCH.region,
    city: BRANCH.town,
    address: BRANCH.address,
    open: BRANCH.hoursShort,
  },
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

// ---------------------------------------------------------------
// Mock staff accounts (demo only).
// A real deployment would authenticate against CBE staff SSO / LDAP;
// nothing here is a credential store.
// ---------------------------------------------------------------
export const STAFF_USERS = [
  {
    id: 'u-manager',
    username: 'manager',
    password: 'busa@123',
    name: 'Ato Getachew Bekele',
    role: 'Branch Manager',
    roleId: 'manager',
    unit: 'Branch Management',
    permissions: ['view_all', 'update_status', 'escalate', 'close', 'manage_appointments', 'view_reports'],
  },
  {
    id: 'u-officer',
    username: 'officer',
    password: 'busa@123',
    name: 'W/ro Meseret Alemu',
    role: 'Customer Service Officer',
    roleId: 'officer',
    unit: 'Customer Experience Desk',
    permissions: ['view_all', 'update_status', 'escalate', 'manage_appointments'],
  },
  {
    id: 'u-teller',
    username: 'teller',
    password: 'busa@123',
    name: 'Ato Dawit Fikru',
    role: 'Senior Teller',
    roleId: 'teller',
    unit: 'Counter Operations',
    permissions: ['view_all', 'manage_appointments'],
  },
]

export const ROLE_LABELS = {
  manager: 'Branch Manager',
  officer: 'Customer Service Officer',
  teller: 'Senior Teller',
}

export const can = (user, perm) => !!user && user.permissions.includes(perm)

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
        description: 'I withdrew 5,000 ETB at the Busa Branch ATM on 22 Aug. The machine did not dispense the cash but my account was debited immediately.',
        name: 'Abebe Tolera', phone: '+251911234567', email: 'abebe.t@example.com',
        account: '1000••••4471', region: 'Oromia', branch: 'br-busa',
        amount: '5000', txnRef: 'ATM88213904', status: 'progress',
        created: now - day * 3, updated: now - day * 1, rating: 0, files: ['atm-slip.jpg'],
        assignee: 'Busa Branch — Digital Banking', anonymous: false,
        solution: '',
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
        account: '', region: 'Oromia', branch: 'br-busa',
        amount: '', txnRef: '', status: 'review',
        created: now - day * 6, updated: now - day * 4, rating: 0, files: [], assignee: 'Busa Branch — Customer Experience', anonymous: false,
        solution: '',
        events: [
          { t: now - day * 6, title: 'Feedback received', msg: 'Logged as a product suggestion.', done: true },
          { t: now - day * 4, title: 'Under review', msg: 'Shared with the digital product backlog committee.', done: true },
        ],
      },
      {
        id: 'CBE-2607-9902', type: 'complaint', category: 'service', channel: 'Branch counter',
        severity: 'medium', subject: 'Long waiting time at the counter',
        description: 'I waited more than one hour for a simple deposit. Only two counters were open during peak hours.',
        name: 'Anonymous', phone: '', email: '', account: '', region: 'Oromia', branch: 'br-busa',
        amount: '', txnRef: '', status: 'resolved',
        created: now - day * 15, updated: now - day * 9, rating: 4, files: [], assignee: 'Busa Branch — Operations', anonymous: true,
        solution: 'Queue management system has been installed and the staffing schedule has been revised. Two additional counters are now open during peak hours (9–11 AM) to reduce waiting times. We appreciate your feedback.',
        events: [
          { t: now - day * 15, title: 'Complaint received', msg: 'Submitted anonymously via web portal.', done: true },
          { t: now - day * 13, title: 'Under review', msg: 'The Busa branch manager requested a staffing report.', done: true },
          { t: now - day * 11, title: 'In progress', msg: 'Two additional counters opened for peak hours (9–11 AM).', done: true },
          { t: now - day * 9, title: 'Resolved', msg: 'Queue management system installed and staffing schedule revised.', done: true },
        ],
      },
      {
        id: 'CBE-2608-7788', type: 'complaint', category: 'forex', channel: 'Branch counter',
        severity: 'critical', subject: 'Inbound remittance not credited after 6 days',
        description: 'A remittance of USD 1,200 sent from Dubai on 20 Aug has still not reached my account.',
        name: 'Yonas Bekele', phone: '+251933445566', email: 'yonas.b@example.com',
        account: '1000••••7788', region: 'Oromia', branch: 'br-busa',
        amount: '68400', txnRef: 'RMT-DXB-88120', status: 'escalated',
        created: now - day * 2, updated: now - 3600000 * 5, rating: 0, files: ['swift-copy.pdf'],
        assignee: 'Busa Branch — International Banking', anonymous: false,
        solution: '',
        events: [
          { t: now - day * 2, title: 'Complaint received', msg: 'Flagged as critical — funds not credited.', done: true },
          { t: now - day * 1, title: 'Under review', msg: 'SWIFT MT103 trace initiated with the correspondent bank.', done: true },
          { t: now - 3600000 * 5, title: 'Escalated', msg: 'Escalated to the International Banking Directorate for same-day action.', done: true },
        ],
      },
      {
        id: 'CBE-2608-1122', type: 'compliment', category: 'service', channel: 'Branch counter',
        severity: 'low', subject: 'Excellent help from the Busa branch team',
        description: 'Officer Meseret at Busa Branch patiently helped my elderly mother open a savings account. Outstanding service.',
        name: 'Lensa Dinku', phone: '+251944556677', email: 'lensa.d@example.com',
        account: '', region: 'Oromia', branch: 'br-busa',
        amount: '', txnRef: '', status: 'closed',
        created: now - day * 8, updated: now - day * 7, rating: 5, files: [], assignee: 'Busa Branch — Operations', anonymous: false,
        solution: 'Thank you for your kind words. Officer Meseret has been recognised for her outstanding service. Your feedback has been shared with the branch manager and noted in the staff recognition file.',
        events: [
          { t: now - day * 8, title: 'Compliment received', msg: 'Thank you for recognising our staff.', done: true },
          { t: now - day * 7, title: 'Closed', msg: 'Shared with the Busa branch manager and noted in the staff recognition file.', done: true },
        ],
      },
    ]
    write(K_TICKETS, demo)
  }

  if (!rawGet(K_APTS)) {
    const days = nextDays(10)
    const demo = [
      {
        id: 'APT-48213', service: 'loan', branch: 'br-busa',
        date: toISODate(days[1]), time: '10:00',
        name: 'Abebe Tolera', phone: '+251911234567', email: 'abebe.t@example.com',
        notes: 'Housing loan for a family home in Busa town.', status: 'confirmed', created: Date.now() - 86400000 * 2,
      },
      {
        id: 'APT-51907', service: 'acc-open', branch: 'br-busa',
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


// -------------------- Staff session --------------------
const K_SESSION = 'cbe_care_session_v1'

export function login(username, password) {
  const u = STAFF_USERS.find(
    (x) => x.username.toLowerCase() === String(username || '').trim().toLowerCase()
  )
  if (!u) return { ok: false, error: 'No staff account found with that username.' }
  if (u.password !== password) return { ok: false, error: 'Incorrect password. Please try again.' }
  const { password: _pw, ...safe } = u
  const session = { ...safe, loginAt: Date.now() }
  write(K_SESSION, session)
  return { ok: true, user: session }
}

export function logout() {
  try { rawSet(K_SESSION, '') } catch { /* ignore */ }
  if (hasLS) { try { window.localStorage.removeItem(K_SESSION) } catch { /* ignore */ } }
  memory.delete(K_SESSION)
}

export function currentUser() {
  const u = read(K_SESSION, null)
  return u && u.id ? u : null
}
