import React, { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { PageHead, Stepper, Field, Alert } from '../components/UI.jsx'
import {
  APPOINTMENT_SERVICES, BRANCH, TIME_SLOTS, nextDays,
  makeAptId, saveAppointment, bookedSlots, busySlots, serviceById, fmtDate, toISODate,
} from '../data.js'

const STEPS = ['Service', 'Date & Time', 'Your Details']

export default function Appointment() {
  const [params] = useSearchParams()
  const [step, setStep] = useState(0)
  const [f, setF] = useState({
    service: params.get('service') || '',
    region: '', branch: BRANCH.id, date: '', time: '',
    name: '', phone: '', email: '', notes: '', ticketRef: '',
    reminder: true, consent: false,
  })
  const [errs, setErrs] = useState({})
  const [done, setDone] = useState(null)

  const set = (k, v) => { setF((p) => ({ ...p, [k]: v })); setErrs((p) => ({ ...p, [k]: '' })) }

  const days = useMemo(() => nextDays(14), [])
  const svc = serviceById(f.service)
  const br = BRANCH

  const unavailable = useMemo(() => {
    if (!f.branch || !f.date) return []
    return [...new Set([...bookedSlots(f.branch, f.date), ...busySlots(f.branch, f.date)])]
  }, [f.branch, f.date])

  function validate(s) {
    const e = {}
    if (s === 0 && !f.service) e.service = 'Please choose the service you need.'
    if (s === 1) {
      if (!f.date) e.date = 'Pick a date for your visit.'
      if (!f.time) e.time = 'Pick an available time slot.'
    }
    if (s === 2) {
      if (!f.name.trim()) e.name = 'Your full name is required.'
      if (!f.phone.trim()) e.phone = 'A phone number is required for confirmation.'
      else if (!/^(\+251|0)?9\d{8}$/.test(f.phone.replace(/[\s-]/g, ''))) e.phone = 'Use an Ethiopian mobile format, e.g. 0911234567.'
      if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Enter a valid email address.'
      if (!f.consent) e.consent = 'Please accept the appointment terms.'
    }
    setErrs(e)
    return Object.keys(e).length === 0
  }

  const next = () => { if (validate(step)) setStep((s) => Math.min(s + 1, 2)) }
  const back = () => setStep((s) => Math.max(s - 1, 0))

  function book() {
    if (!validate(3)) return
    const id = makeAptId()
    const apt = { ...f, id, status: 'confirmed', created: Date.now() }
    saveAppointment(apt)
    setDone(apt)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ---------------- confirmation ----------------
  if (done) {
    return (
      <div className="fade-in">
        <PageHead kicker="Booking confirmed" title="Your appointment is reserved" crumb="Book Appointment"
          sub={`Please arrive 10 minutes early at ${BRANCH.name} and bring a valid ID.`} />
        <div className="wrap page-body">
          <div className="card success-wrap" style={{ padding: '38px 28px' }}>
            <div className="success-ico"><Icon name="calendar" size={36} stroke={2} /></div>
            <h2 style={{ fontSize: 24, marginBottom: 8 }}>Appointment confirmed</h2>
            <p style={{ color: 'var(--ink-2)' }}>A confirmation SMS has been sent to {done.phone}.</p>

            <div className="ticket-box">
              <div className="lbl">Booking reference</div>
              <div className="code">{done.id}</div>
              <div className="sub">{fmtDate(done.date)} at {done.time} · {BRANCH.name}</div>
            </div>

            <div className="review-block" style={{ textAlign: 'left' }}>
              <h4>Appointment details</h4>
              <div className="review-row"><span className="k">Service</span><span className="v">{serviceById(done.service)?.label}</span></div>
              <div className="review-row"><span className="k">Duration</span><span className="v">{serviceById(done.service)?.mins} minutes</span></div>
              <div className="review-row"><span className="k">Branch</span><span className="v">{BRANCH.name}</span></div>
              <div className="review-row"><span className="k">Address</span><span className="v">{BRANCH.addressFull}</span></div>
              <div className="review-row"><span className="k">Date &amp; time</span><span className="v">{fmtDate(done.date)} at {done.time}</span></div>
              <div className="review-row"><span className="k">Booked for</span><span className="v">{done.name}</span></div>
              {done.ticketRef && <div className="review-row"><span className="k">Linked case</span><span className="v mono">{done.ticketRef}</span></div>}
            </div>

            <Alert tone="gold" icon="info">
              <strong>What to bring:</strong> a valid photo ID (Kebele ID, passport or driving licence), and any
              documents relevant to your request. Arriving more than 15 minutes late may release your slot.
            </Alert>

            <div style={{ display: 'flex', gap: 11, justifyContent: 'center', flexWrap: 'wrap', marginTop: 24 }}>
              <Link className="btn btn-primary" to="/my-appointments"><Icon name="calendar" size={16} /> View my appointments</Link>
              <button className="btn btn-ghost" onClick={() => window.print()}><Icon name="print" size={16} /> Print confirmation</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ---------------- wizard ----------------
  return (
    <div className="fade-in">
      <PageHead kicker="Branch appointments" title="Book an Appointment" crumb="Book Appointment"
        sub={`Reserve a dedicated time with an officer at ${BRANCH.name} and skip the queue. ${BRANCH.hoursShort}.`} />

      <div className="wrap page-body">
        <div className="split">
          <div className="card" style={{ padding: '26px 26px 22px' }}>
            <Stepper steps={STEPS} current={step} />

            {/* STEP 0 — service */}
            {step === 0 && (
              <div className="fade-in">
                <div className="form-section-title">Step 1 of 3</div>
                <div className="form-section-desc">What do you need help with?</div>
                <Field required error={errs.service}>
                  <div className="pick-grid">
                    {APPOINTMENT_SERVICES.map((s) => (
                      <button type="button" key={s.id} className={`pick ${f.service === s.id ? 'on' : ''}`} onClick={() => set('service', s.id)}>
                        <span className="pick-ico"><Icon name={s.icon} size={18} /></span>
                        <span>
                          <span className="pick-t" style={{ display: 'block' }}>{s.label}</span>
                          <span className="pick-d">{s.desc}</span>
                          <span className="badge b-purple" style={{ marginTop: 6 }}><Icon name="clock" size={11} /> {s.mins} min</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </Field>

                {f.service === 'complaint-mtg' && (
                  <Field label="Related case reference" optional help="If this meeting is about an existing complaint, enter its reference.">
                    <input className="input mono" placeholder="CBE-2608-4471" value={f.ticketRef}
                      onChange={(e) => set('ticketRef', e.target.value.toUpperCase())} />
                  </Field>
                )}

                <div className="form-nav">
                  <Link className="btn btn-ghost" to="/"><Icon name="back" size={16} /> Cancel</Link>
                  <button className="btn btn-primary" onClick={next}>Continue <Icon name="arrow" size={16} /></button>
                </div>
              </div>
            )}

            {/* STEP 1 — date & time */}
            {step === 1 && (
              <div className="fade-in">
                <div className="form-section-title">Step 2 of 3</div>
                <div className="form-section-desc">Pick a date and an available time slot.</div>

                <Field label="Choose a date" required error={errs.date} help="Branches are closed on Sundays and public holidays.">
                  <div className="daystrip">
                    {days.map((d) => {
                      const iso = toISODate(d)
                      const sat = d.getDay() === 6
                      return (
                        <button type="button" key={iso} className={`day ${f.date === iso ? 'on' : ''}`}
                          onClick={() => { set('date', iso); set('time', '') }}>
                          <div className="dw">{d.toLocaleDateString('en-GB', { weekday: 'short' })}</div>
                          <div className="dd">{d.getDate()}</div>
                          <div className="dm">{d.toLocaleDateString('en-GB', { month: 'short' })}{sat ? ' ½' : ''}</div>
                        </button>
                      )
                    })}
                  </div>
                </Field>

                {f.date && (
                  <Field label="Available time slots" required error={errs.time}>
                    <div className="slot-grid">
                      {TIME_SLOTS.map((s) => {
                        const isSat = new Date(f.date).getDay() === 6
                        const afterNoonOnSat = isSat && Number(s.split(':')[0]) >= 13
                        const taken = unavailable.includes(s) || afterNoonOnSat
                        return (
                          <button type="button" key={s} className={`slot ${f.time === s ? 'on' : ''}`}
                            disabled={taken} onClick={() => set('time', s)}>
                            {s}
                            <small>{taken ? (afterNoonOnSat ? 'closed' : 'booked') : 'available'}</small>
                          </button>
                        )
                      })}
                    </div>
                    <div className="help" style={{ marginTop: 10 }}>
                      Showing slots for {br.name} on {fmtDate(f.date)}. Each session lasts about {svc?.mins} minutes.
                    </div>
                  </Field>
                )}

                {!f.date && <Alert tone="purple" icon="calendar">Select a date above to see the live slot availability for {br.name}.</Alert>}

                <div className="form-nav">
                  <button className="btn btn-ghost" onClick={back}><Icon name="back" size={16} /> Back</button>
                  <button className="btn btn-primary" onClick={next}>Continue <Icon name="arrow" size={16} /></button>
                </div>
              </div>
            )}

            {/* STEP 2 — details */}
            {step === 2 && (
              <div className="fade-in">
                <div className="form-section-title">Step 3 of 3</div>
                <div className="form-section-desc">Who is this appointment for?</div>

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

                <Field label="Email address" optional error={errs.email} help="For a calendar invitation and reminder.">
                  <input className={`input ${errs.email ? 'bad' : ''}`} type="email" placeholder="you@example.com"
                    value={f.email} onChange={(e) => set('email', e.target.value)} />
                </Field>

                <Field label="Anything the officer should know?" optional>
                  <textarea className="textarea" style={{ minHeight: 100 }} maxLength={500}
                    placeholder="e.g. I want to discuss a housing loan of 2 million ETB and have my documents ready."
                    value={f.notes} onChange={(e) => set('notes', e.target.value)} />
                  <div className="counter">{f.notes.length}/500</div>
                </Field>

                <Field>
                  <label className="check" style={{ marginBottom: 12 }}>
                    <input type="checkbox" checked={f.reminder} onChange={(e) => set('reminder', e.target.checked)} />
                    <span>Send me an SMS reminder 24 hours before my appointment.</span>
                  </label>
                </Field>

                <Field error={errs.consent}>
                  <label className="check">
                    <input type="checkbox" checked={f.consent} onChange={(e) => set('consent', e.target.checked)} />
                    <span>
                      I understand I should arrive 10 minutes early with a valid ID, and that my slot may be
                      released if I am more than 15 minutes late.
                    </span>
                  </label>
                </Field>

                <div className="review-block" style={{ marginTop: 18 }}>
                  <h4>Booking summary</h4>
                  <div className="review-row"><span className="k">Service</span><span className="v">{svc?.label} ({svc?.mins} min)</span></div>
                  <div className="review-row"><span className="k">Branch</span><span className="v">{br.name}</span></div>
                  <div className="review-row"><span className="k">Address</span><span className="v">{br.addressFull}</span></div>
                  <div className="review-row"><span className="k">Date &amp; time</span><span className="v">{fmtDate(f.date)} at {f.time}</span></div>
                </div>

                <div className="form-nav">
                  <button className="btn btn-ghost" onClick={back}><Icon name="back" size={16} /> Back</button>
                  <button className="btn btn-gold" onClick={book}><Icon name="check" size={17} /> Confirm Booking</button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="sticky">
            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 15.5, marginBottom: 12 }}>Your booking</h3>
              <div className="kv"><span className="k">Service</span><span className="v">{svc?.label || '—'}</span></div>
              <div className="kv"><span className="k">Duration</span><span className="v">{svc ? `${svc.mins} min` : '—'}</span></div>
              <div className="kv"><span className="k">Branch</span><span className="v">{br.name}</span></div>
              <div className="kv"><span className="k">Date</span><span className="v">{f.date ? fmtDate(f.date) : '—'}</span></div>
              <div className="kv"><span className="k">Time</span><span className="v">{f.time || '—'}</span></div>
              <div style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6, color: 'var(--ink-3)', fontWeight: 600 }}>
                  <span>Progress</span><span>{Math.round(((step + 1) / 4) * 100)}%</span>
                </div>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${((step + 1) / 4) * 100}%` }} /></div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, marginBottom: 10 }}>Good to know</h3>
              <div style={{ display: 'grid', gap: 11, fontSize: 13, color: 'var(--ink-2)' }}>
                <div style={{ display: 'flex', gap: 9 }}><Icon name="clock" size={15} style={{ color: 'var(--cbe-purple)', flex: 'none' }} /> Arrive 10 minutes before your slot.</div>
                <div style={{ display: 'flex', gap: 9 }}><Icon name="shield" size={15} style={{ color: 'var(--cbe-purple)', flex: 'none' }} /> Bring a valid photo ID.</div>
                <div style={{ display: 'flex', gap: 9 }}><Icon name="refresh" size={15} style={{ color: 'var(--cbe-purple)', flex: 'none' }} /> Reschedule free of charge up to 2 hours before.</div>
                <div style={{ display: 'flex', gap: 9 }}><Icon name="bell" size={15} style={{ color: 'var(--cbe-purple)', flex: 'none' }} /> SMS reminder sent 24 hours ahead.</div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: 15, marginBottom: 8 }}>Already booked?</h3>
              <p style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 12 }}>Look up, reschedule or cancel an existing appointment.</p>
              <Link className="btn btn-ghost btn-block btn-sm" to="/my-appointments">
                <Icon name="search" size={15} /> Manage appointments
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
