import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { PageHead, Stepper, Field, Alert } from '../components/UI.jsx'
import {
  FEEDBACK_TYPES, COMPLAINT_CATEGORIES, CHANNELS, SEVERITIES, LOCALITIES, BRANCH,
  makeTicketId, saveTicket, addBusinessDays, fmtDate, categoryById,
} from '../data.js'

const STEPS = ['Type', 'Details', 'Contact', 'Review']

const empty = {
  type: 'complaint', category: '', channel: '', severity: 'medium',
  subject: '', description: '', amount: '', txnRef: '', incidentDate: '',
  name: '', phone: '', email: '', account: '', region: '', branch: BRANCH.id,
  anonymous: false, consent: false, contactPref: 'sms', rating: 0, files: [],
}

export default function Complaint() {
  const nav = useNavigate()
  const [step, setStep] = useState(0)
  const [f, setF] = useState(empty)
  const [errs, setErrs] = useState({})
  const [done, setDone] = useState(null)

  const set = (k, v) => {
    setF((p) => ({ ...p, [k]: v }))
    setErrs((p) => ({ ...p, [k]: '' }))
  }

  const cat = categoryById(f.category)
  const sla = cat?.sla ?? 5
  const dueDate = useMemo(() => addBusinessDays(new Date(), sla), [sla])

  // ---------------- validation ----------------
  function validate(s) {
    const e = {}
    if (s === 0) {
      if (!f.type) e.type = 'Please choose what you would like to submit.'
      if (!f.category) e.category = 'Please select the service area.'
    }
    if (s === 1) {
      if (!f.channel) e.channel = 'Tell us where this happened.'
      if (!f.subject.trim()) e.subject = 'A short subject line is required.'
      else if (f.subject.trim().length < 8) e.subject = 'Please use at least 8 characters.'
      if (!f.description.trim()) e.description = 'Please describe what happened.'
      else if (f.description.trim().length < 25) e.description = `Please add a little more detail (${f.description.trim().length}/25 characters).`
      if (f.amount && !/^\d+(\.\d{1,2})?$/.test(f.amount)) e.amount = 'Enter a valid amount, e.g. 5000 or 5000.50'
    }
    if (s === 2) {
      if (!f.anonymous) {
        if (!f.name.trim()) e.name = 'Your full name is required.'
        if (!f.phone.trim()) e.phone = 'A phone number is required so we can reach you.'
        else if (!/^(\+251|0)?9\d{8}$/.test(f.phone.replace(/[\s-]/g, ''))) e.phone = 'Use an Ethiopian mobile format, e.g. 0911234567 or +251911234567.'
        if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Enter a valid email address.'
        if (f.account && !/^\d{10,16}$/.test(f.account.replace(/\s/g, ''))) e.account = 'Account number should be 10–16 digits.'
      }
      if (!f.region) e.region = 'Please tell us where you are based.'
      if (!f.consent) e.consent = 'You must accept the data processing notice to continue.'
    }
    setErrs(e)
    return Object.keys(e).length === 0
  }

  const next = () => { if (validate(step)) setStep((s) => Math.min(s + 1, 3)) }
  const back = () => setStep((s) => Math.max(s - 1, 0))

  function submit() {
    if (!validate(2)) { setStep(2); return }
    const id = makeTicketId()
    const now = Date.now()
    const label = FEEDBACK_TYPES.find((t) => t.id === f.type)?.label || 'Submission'
    const ticket = {
      ...f,
      id,
      branch: BRANCH.id,
      status: 'received',
      created: now,
      updated: now,
      assignee: 'Busa Branch — Customer Service Desk',
      name: f.anonymous ? 'Anonymous' : f.name,
      phone: f.anonymous ? '' : f.phone,
      email: f.anonymous ? '' : f.email,
      account: f.anonymous ? '' : f.account,
      events: [
        { t: now, title: `${label} received`, msg: `Logged via the CBE Care portal and queued for triage at ${BRANCH.name}.`, done: true },
        { t: now + 1000, title: 'Acknowledgement sent', msg: f.anonymous ? 'Anonymous submission — keep your reference number safe.' : `Confirmation sent to ${f.phone}.`, done: true },
      ],
    }
    saveTicket(ticket)
    setDone({ id, due: dueDate, ticket })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function addFiles(list) {
    const names = Array.from(list).slice(0, 4).map((x) => x.name)
    set('files', [...new Set([...f.files, ...names])].slice(0, 4))
  }

  // ---------------- success view ----------------
  if (done) {
    return (
      <div className="fade-in">
        <PageHead kicker="Submission complete" title="Thank you — we have your case" crumb="Submit Feedback"
          sub="Your reference number is shown below. Keep it safe: you will need it to track progress." />
        <div className="wrap page-body">
          <div className="card success-wrap" style={{ padding: '38px 28px' }}>
            <div className="success-ico"><Icon name="checkCircle" size={38} stroke={2} /></div>
            <h2 style={{ fontSize: 24, marginBottom: 8 }}>Submission received successfully</h2>
            <p style={{ color: 'var(--ink-2)' }}>
              {f.anonymous
                ? 'You submitted anonymously, so no SMS was sent. Please save this reference number now.'
                : `A confirmation has been sent to ${done.ticket.phone}${done.ticket.email ? ` and ${done.ticket.email}` : ''}.`}
            </p>

            <div className="ticket-box">
              <div className="lbl">Your reference number</div>
              <div className="code">{done.id}</div>
              <div className="sub">Submitted {fmtDate(Date.now())} · Target resolution by {fmtDate(done.due)}</div>
            </div>

            <div className="grid-3" style={{ textAlign: 'left', marginBottom: 22 }}>
              <div className="stat-tile">
                <div className="k">Service area</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginTop: 4 }}>{cat?.label}</div>
              </div>
              <div className="stat-tile">
                <div className="k">Priority</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginTop: 4, textTransform: 'capitalize' }}>{f.severity}</div>
              </div>
              <div className="stat-tile">
                <div className="k">SLA</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginTop: 4 }}>{sla} business days</div>
              </div>
            </div>

            <Alert tone="gold" icon="bell">
              You will receive an update at every stage. If we miss the target date, your case is escalated
              automatically to the Customer Experience Directorate.
            </Alert>

            <div style={{ display: 'flex', gap: 11, justifyContent: 'center', flexWrap: 'wrap', marginTop: 24 }}>
              <Link className="btn btn-primary" to={`/track?id=${done.id}`}>
                <Icon name="search" size={16} /> Track this case
              </Link>
              <button className="btn btn-ghost" onClick={() => window.print()}>
                <Icon name="print" size={16} /> Print receipt
              </button>
              <button className="btn btn-ghost" onClick={() => { setDone(null); setF(empty); setStep(0) }}>
                <Icon name="refresh" size={16} /> Submit another
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ---------------- form ----------------
  return (
    <div className="fade-in">
      <PageHead kicker="Customer voice" title="Submit a Complaint or Feedback" crumb="Submit Feedback"
        sub="Tell us what happened. It takes about three minutes, and you will get a tracking number straight away." />

      <div className="wrap page-body">
        <div className="split">
          <div className="card" style={{ padding: '26px 26px 22px' }}>
            <Stepper steps={STEPS} current={step} />

            {/* ---- STEP 0 ---- */}
            {step === 0 && (
              <div className="fade-in">
                <div className="form-section-title">Step 1 of 4</div>
                <div className="form-section-desc">What would you like to submit today?</div>

                <Field label="Submission type" required error={errs.type}>
                  <div className="pick-grid">
                    {FEEDBACK_TYPES.map((t) => (
                      <button type="button" key={t.id} className={`pick ${f.type === t.id ? 'on' : ''}`} onClick={() => set('type', t.id)}>
                        <span className="pick-ico"><Icon name={t.icon} size={18} /></span>
                        <span>
                          <span className="pick-t" style={{ display: 'block' }}>{t.label}</span>
                          <span className="pick-d">{t.desc}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </Field>

                <div className="divider" />

                <Field label="Which service area does it concern?" required error={errs.category}>
                  <div className="pick-grid">
                    {COMPLAINT_CATEGORIES.map((c) => (
                      <button type="button" key={c.id} className={`pick ${f.category === c.id ? 'on' : ''}`} onClick={() => set('category', c.id)}>
                        <span className="pick-ico"><Icon name={c.icon} size={18} /></span>
                        <span>
                          <span className="pick-t" style={{ display: 'block' }}>{c.label}</span>
                          <span className="pick-d">{c.desc}</span>
                          <span className="badge b-purple" style={{ marginTop: 6 }}>SLA {c.sla} days</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </Field>

                <div className="form-nav">
                  <Link className="btn btn-ghost" to="/"><Icon name="back" size={16} /> Cancel</Link>
                  <button className="btn btn-primary" onClick={next}>Continue <Icon name="arrow" size={16} /></button>
                </div>
              </div>
            )}

            {/* ---- STEP 1 ---- */}
            {step === 1 && (
              <div className="fade-in">
                <div className="form-section-title">Step 2 of 4</div>
                <div className="form-section-desc">Describe what happened in as much detail as you can.</div>

                <Field label="Where did this happen?" required error={errs.channel}>
                  <div className="chip-row">
                    {CHANNELS.map((c) => (
                      <button type="button" key={c} className={`chip ${f.channel === c ? 'on' : ''}`} onClick={() => set('channel', c)}>{c}</button>
                    ))}
                  </div>
                </Field>

                {f.type === 'complaint' && (
                  <Field label="How serious is it?" required help="This determines your response time — please be accurate.">
                    <div className="chip-row">
                      {SEVERITIES.map((s) => (
                        <button type="button" key={s.id} className={`chip ${f.severity === s.id ? 'on' : ''}`} onClick={() => set('severity', s.id)}
                          title={s.desc}>{s.label} — {s.desc}</button>
                      ))}
                    </div>
                  </Field>
                )}

                <Field label="Subject" required error={errs.subject} help="One line summarising the issue.">
                  <input className={`input ${errs.subject ? 'bad' : ''}`} maxLength={110}
                    placeholder="e.g. ATM debited my account but did not dispense cash"
                    value={f.subject} onChange={(e) => set('subject', e.target.value)} />
                  <div className="counter">{f.subject.length}/110</div>
                </Field>

                <Field label="Full description" required error={errs.description}
                  help="Include dates, amounts, branch or terminal names and anything else that helps us investigate.">
                  <textarea className={`textarea ${errs.description ? 'bad' : ''}`} maxLength={1500}
                    placeholder="Describe what happened, when it happened, and what outcome you expect…"
                    value={f.description} onChange={(e) => set('description', e.target.value)} />
                  <div className="counter">{f.description.length}/1500</div>
                </Field>

                <div className="grid-3">
                  <Field label="Date of incident" optional>
                    <input type="date" className="input" max={new Date().toISOString().slice(0, 10)}
                      value={f.incidentDate} onChange={(e) => set('incidentDate', e.target.value)} />
                  </Field>
                  <Field label="Amount involved (ETB)" optional error={errs.amount}>
                    <input className={`input ${errs.amount ? 'bad' : ''}`} inputMode="decimal" placeholder="5000"
                      value={f.amount} onChange={(e) => set('amount', e.target.value)} />
                  </Field>
                  <Field label="Transaction reference" optional>
                    <input className="input" placeholder="e.g. ATM88213904"
                      value={f.txnRef} onChange={(e) => set('txnRef', e.target.value)} />
                  </Field>
                </div>

                <Field label="Supporting documents" optional help="Receipts, screenshots or SMS confirmations. Up to 4 files, 5 MB each.">
                  <label className="dropzone">
                    <input type="file" multiple hidden accept="image/*,.pdf" onChange={(e) => addFiles(e.target.files)} />
                    <Icon name="upload" size={26} style={{ color: 'var(--cbe-purple)' }} />
                    <div style={{ fontWeight: 700, marginTop: 8, fontSize: 14 }}>Click to upload evidence</div>
                    <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>JPG, PNG or PDF</div>
                  </label>
                  {f.files.map((n) => (
                    <div className="file-row" key={n}>
                      <Icon name="doc" size={15} /> {n}
                      <button type="button" onClick={() => set('files', f.files.filter((x) => x !== n))}>Remove</button>
                    </div>
                  ))}
                </Field>

                <div className="form-nav">
                  <button className="btn btn-ghost" onClick={back}><Icon name="back" size={16} /> Back</button>
                  <button className="btn btn-primary" onClick={next}>Continue <Icon name="arrow" size={16} /></button>
                </div>
              </div>
            )}

            {/* ---- STEP 2 ---- */}
            {step === 2 && (
              <div className="fade-in">
                <div className="form-section-title">Step 3 of 4</div>
                <div className="form-section-desc">How should we reach you with the outcome?</div>

                <div className="card" style={{ background: 'var(--cbe-purple-soft)', borderColor: 'var(--cbe-purple-soft-2)', marginBottom: 20, padding: 16 }}>
                  <label className="check">
                    <input type="checkbox" checked={f.anonymous} onChange={(e) => set('anonymous', e.target.checked)} />
                    <span>
                      <strong style={{ color: 'var(--ink)' }}>Submit anonymously</strong>
                      <div style={{ fontSize: 12.5, marginTop: 2 }}>
                        We will still investigate, but we cannot send you updates or a resolution notice.
                        You will need your reference number to check progress.
                      </div>
                    </span>
                  </label>
                </div>

                {!f.anonymous && (
                  <>
                    <div className="grid-2">
                      <Field label="Full name" required error={errs.name}>
                        <input className={`input ${errs.name ? 'bad' : ''}`} placeholder="e.g. Abebe Tolera"
                          value={f.name} onChange={(e) => set('name', e.target.value)} />
                      </Field>
                      <Field label="Mobile number" required error={errs.phone}>
                        <input className={`input ${errs.phone ? 'bad' : ''}`} placeholder="0911234567"
                          value={f.phone} onChange={(e) => set('phone', e.target.value)} />
                      </Field>
                    </div>
                    <div className="grid-2">
                      <Field label="Email address" optional error={errs.email}>
                        <input className={`input ${errs.email ? 'bad' : ''}`} type="email" placeholder="you@example.com"
                          value={f.email} onChange={(e) => set('email', e.target.value)} />
                      </Field>
                      <Field label="CBE account number" optional error={errs.account} help="Helps us locate the transaction faster.">
                        <input className={`input ${errs.account ? 'bad' : ''}`} inputMode="numeric" placeholder="1000123456789"
                          value={f.account} onChange={(e) => set('account', e.target.value)} />
                      </Field>
                    </div>
                    <Field label="Preferred contact method">
                      <div className="chip-row">
                        {[{ id: 'sms', l: 'SMS' }, { id: 'call', l: 'Phone call' }, { id: 'email', l: 'Email' }].map((o) => (
                          <button type="button" key={o.id} className={`chip ${f.contactPref === o.id ? 'on' : ''}`}
                            onClick={() => set('contactPref', o.id)}>{o.l}</button>
                        ))}
                      </div>
                    </Field>
                  </>
                )}

                <Field label="Where are you based?" required error={errs.region}
                  help="Helps the branch plan outreach. All cases are handled by CBE Busa Branch.">
                  <select className={`select ${errs.region ? 'bad' : ''}`} value={f.region}
                    onChange={(e) => set('region', e.target.value)}>
                    <option value="">Select your locality…</option>
                    {LOCALITIES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </Field>

                <div className="divider" />

                <Field error={errs.consent}>
                  <label className="check">
                    <input type="checkbox" checked={f.consent} onChange={(e) => set('consent', e.target.checked)} />
                    <span>
                      I confirm the information provided is accurate and I consent to the Commercial Bank of Ethiopia
                      processing it to investigate and resolve my case, in line with the bank's data privacy policy
                      and NBE consumer protection directives.
                    </span>
                  </label>
                </Field>

                <div className="form-nav">
                  <button className="btn btn-ghost" onClick={back}><Icon name="back" size={16} /> Back</button>
                  <button className="btn btn-primary" onClick={next}>Review submission <Icon name="arrow" size={16} /></button>
                </div>
              </div>
            )}

            {/* ---- STEP 3 ---- */}
            {step === 3 && (
              <div className="fade-in">
                <div className="form-section-title">Step 4 of 4</div>
                <div className="form-section-desc">Please check everything before you submit.</div>

                <div className="review-block">
                  <h4>Submission</h4>
                  <div className="review-row"><span className="k">Type</span><span className="v" style={{ textTransform: 'capitalize' }}>{f.type}</span></div>
                  <div className="review-row"><span className="k">Service area</span><span className="v">{cat?.label}</span></div>
                  <div className="review-row"><span className="k">Channel</span><span className="v">{f.channel}</span></div>
                  {f.type === 'complaint' && <div className="review-row"><span className="k">Priority</span><span className="v" style={{ textTransform: 'capitalize' }}>{f.severity}</span></div>}
                  <div className="review-row"><span className="k">Subject</span><span className="v">{f.subject}</span></div>
                  <div className="review-row"><span className="k">Description</span><span className="v" style={{ fontWeight: 500 }}>{f.description}</span></div>
                  {f.incidentDate && <div className="review-row"><span className="k">Incident date</span><span className="v">{fmtDate(f.incidentDate)}</span></div>}
                  {f.amount && <div className="review-row"><span className="k">Amount</span><span className="v">ETB {Number(f.amount).toLocaleString()}</span></div>}
                  {f.txnRef && <div className="review-row"><span className="k">Transaction ref</span><span className="v">{f.txnRef}</span></div>}
                  {f.files.length > 0 && <div className="review-row"><span className="k">Attachments</span><span className="v">{f.files.join(', ')}</span></div>}
                </div>

                <div className="review-block">
                  <h4>Contact</h4>
                  {f.anonymous ? (
                    <div className="review-row"><span className="k">Identity</span><span className="v">Anonymous submission</span></div>
                  ) : (
                    <>
                      <div className="review-row"><span className="k">Name</span><span className="v">{f.name}</span></div>
                      <div className="review-row"><span className="k">Mobile</span><span className="v">{f.phone}</span></div>
                      {f.email && <div className="review-row"><span className="k">Email</span><span className="v">{f.email}</span></div>}
                      {f.account && <div className="review-row"><span className="k">Account</span><span className="v">{f.account}</span></div>}
                      <div className="review-row"><span className="k">Contact preference</span><span className="v" style={{ textTransform: 'capitalize' }}>{f.contactPref}</span></div>
                    </>
                  )}
                  <div className="review-row"><span className="k">Your locality</span><span className="v">{f.region}</span></div>
                  <div className="review-row"><span className="k">Handled by</span><span className="v">{BRANCH.bank} — {BRANCH.name}</span></div>
                </div>

                <Alert tone="gold" icon="clock">
                  Based on your selection, the target resolution date is <strong>{fmtDate(dueDate)}</strong> ({sla} business days).
                </Alert>

                <div className="form-nav">
                  <button className="btn btn-ghost" onClick={back}><Icon name="back" size={16} /> Back to edit</button>
                  <button className="btn btn-gold" onClick={submit}><Icon name="check" size={17} /> Confirm &amp; Submit</button>
                </div>
              </div>
            )}
          </div>

          {/* ---------- SIDEBAR ---------- */}
          <div className="sticky">
            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 15.5, marginBottom: 12 }}>Your submission so far</h3>
              <div className="kv"><span className="k">Type</span><span className="v" style={{ textTransform: 'capitalize' }}>{f.type || '—'}</span></div>
              <div className="kv"><span className="k">Service area</span><span className="v">{cat?.label || '—'}</span></div>
              <div className="kv"><span className="k">Channel</span><span className="v">{f.channel || '—'}</span></div>
              <div className="kv"><span className="k">Target SLA</span><span className="v">{cat ? `${sla} business days` : '—'}</span></div>
              <div style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6, color: 'var(--ink-3)', fontWeight: 600 }}>
                  <span>Progress</span><span>{Math.round(((step + 1) / 4) * 100)}%</span>
                </div>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${((step + 1) / 4) * 100}%` }} /></div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 9, alignItems: 'center', marginBottom: 10 }}>
                <Icon name="lock" size={17} style={{ color: 'var(--cbe-purple)' }} />
                <h3 style={{ fontSize: 15 }}>Your data is protected</h3>
              </div>
              <p style={{ fontSize: 13, color: 'var(--ink-2)' }}>
                Submissions are encrypted in transit and handled only by authorised CBE resolution staff.
                <strong> Never share your PIN, password or full card number</strong> — no CBE employee will ever ask for them.
              </p>
            </div>

            <div className="card">
              <h3 style={{ fontSize: 15, marginBottom: 10 }}>Need urgent help?</h3>
              <div style={{ display: 'grid', gap: 9, fontSize: 13.5 }}>
                <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}><Icon name="phoneCall" size={15} style={{ color: 'var(--cbe-gold-dark)' }} /> Call centre: <strong>951</strong></div>
                <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}><Icon name="shield" size={15} style={{ color: 'var(--cbe-gold-dark)' }} /> Fraud: CustFraudMsg@cbe.com.et</div>
                <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}><Icon name="mail" size={15} style={{ color: 'var(--cbe-gold-dark)' }} /> feedback@cbe.com.et</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
