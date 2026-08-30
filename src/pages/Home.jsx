import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { getTickets, getAppointments, FEEDBACK_TYPES } from '../data.js'

export default function Home() {
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const tickets = useMemo(() => getTickets(), [])
  const apts = useMemo(() => getAppointments(), [])

  const resolved = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length
  const rate = tickets.length ? Math.round((resolved / tickets.length) * 100) : 0

  const go = (e) => {
    e.preventDefault()
    if (q.trim()) nav(`/track?id=${encodeURIComponent(q.trim())}`)
  }

  return (
    <div className="fade-in">
      {/* ---------- HERO ---------- */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <div className="eyebrow"><span className="dot" /> Customer Voice Portal · Since 1942</div>
              <h1>Your voice shapes <em>better banking</em> at CBE</h1>
              <p className="hero-sub">
                Lodge a complaint, share feedback, or book a branch appointment in minutes.
                Every submission gets a tracking number and a guaranteed response time — no queues, no paperwork.
              </p>
              <div className="hero-cta">
                <Link className="btn btn-gold" to="/submit">
                  <Icon name="alert" size={17} /> Submit Complaint or Feedback
                </Link>
                <Link className="btn btn-outline-white" to="/appointment">
                  <Icon name="calendar" size={17} /> Book an Appointment
                </Link>
              </div>
              <div className="hero-stats">
                <div className="hero-stat"><div className="v">1,300+</div><div className="l">Branches nationwide</div></div>
                <div className="hero-stat"><div className="v">48 hrs</div><div className="l">First response target</div></div>
                <div className="hero-stat"><div className="v">{rate || 92}%</div><div className="l">Cases resolved on SLA</div></div>
                <div className="hero-stat"><div className="v">24/7</div><div className="l">Digital intake</div></div>
              </div>
            </div>

            <div className="hero-card">
              <h3>Track your case</h3>
              <p className="hint">Enter the reference number you received by SMS or email.</p>
              <form onSubmit={go}>
                <div className="search-box" style={{ marginBottom: 12 }}>
                  <Icon name="search" size={17} />
                  <input
                    className="input"
                    placeholder="e.g. CBE-2608-4471"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    aria-label="Ticket reference number"
                  />
                </div>
                <button className="btn btn-primary btn-block" type="submit">
                  Track Status <Icon name="arrow" size={16} />
                </button>
              </form>
              <div className="divider" />
              <div style={{ display: 'grid', gap: 10 }}>
                <Link to="/track?id=CBE-2608-4471" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, fontWeight: 600, color: 'var(--cbe-purple)' }}>
                  <Icon name="doc" size={15} /> Try a sample: CBE-2608-4471
                </Link>
                <Link to="/my-appointments" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, fontWeight: 600, color: 'var(--ink-2)' }}>
                  <Icon name="calendar" size={15} /> View my appointments ({apts.filter((a) => a.status !== 'cancelled').length})
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- WHAT WOULD YOU LIKE TO DO ---------- */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="kicker">How can we help</div>
            <h2>Choose the service you need</h2>
            <p>Four dedicated channels, one portal. Everything is tracked end-to-end and answered within a published service level.</p>
          </div>

          <div className="grid-4">
            {[
              { icon: 'alert', gold: false, t: 'Lodge a Complaint', d: 'Report a failed transaction, service issue or staff conduct concern. Attach evidence and get an SLA-backed resolution.', to: '/submit', cta: 'Start complaint' },
              { icon: 'bulb', gold: true, t: 'Share Feedback', d: 'Send a suggestion, compliment or inquiry. Your ideas feed directly into our service improvement programme.', to: '/submit', cta: 'Give feedback' },
              { icon: 'search', gold: false, t: 'Track Your Ticket', d: 'Follow every step of your case with a live timeline, assigned unit and expected resolution date.', to: '/track', cta: 'Track now' },
              { icon: 'calendar', gold: true, t: 'Book an Appointment', d: 'Reserve a time with a branch officer for loans, account opening, forex and more. Skip the queue.', to: '/appointment', cta: 'Book a slot' },
            ].map((c) => (
              <Link key={c.t} to={c.to} className="svc-card">
                <div className={`svc-icon ${c.gold ? 'gold' : ''}`}><Icon name={c.icon} size={23} /></div>
                <h3>{c.t}</h3>
                <p>{c.d}</p>
                <span className="svc-link">{c.cta} <Icon name="arrow" size={15} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section className="section">
        <div className="wrap">
          <div className="card" style={{ padding: '34px 30px' }}>
            <div className="section-head" style={{ marginBottom: 26 }}>
              <div className="kicker">The process</div>
              <h2>From submission to resolution in four steps</h2>
            </div>
            <div className="steps">
              {[
                { t: 'Submit', d: 'Fill the guided form in under three minutes. Anonymous submission is supported.' },
                { t: 'Acknowledge', d: 'You receive a reference number by SMS and email immediately.' },
                { t: 'Investigate', d: 'A specialist unit reviews your case and updates the timeline as it progresses.' },
                { t: 'Resolve', d: 'You get the outcome and are invited to rate how we handled it.' },
              ].map((s, i) => (
                <div className="step" key={s.t}>
                  <div className="step-n">{i + 1}</div>
                  <h4>{s.t}</h4>
                  <p>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- SLA + FEEDBACK TYPES ---------- */}
      <section className="section">
        <div className="wrap">
          <div className="split">
            <div className="card">
              <div className="section-head" style={{ marginBottom: 18 }}>
                <div className="kicker">Our commitment</div>
                <h2 style={{ fontSize: 22 }}>Published resolution times</h2>
              </div>
              <div className="table-wrap" style={{ boxShadow: 'none' }}>
                <table style={{ minWidth: 460 }}>
                  <thead>
                    <tr><th>Case type</th><th>First response</th><th>Target resolution</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><strong>Critical</strong> — suspected fraud, large loss</td><td>4 hours</td><td>1 business day</td></tr>
                    <tr><td><strong>High</strong> — funds or access affected</td><td>24 hours</td><td>3 business days</td></tr>
                    <tr><td><strong>Medium</strong> — service disrupted</td><td>48 hours</td><td>5 business days</td></tr>
                    <tr><td><strong>Low</strong> — suggestion, minor issue</td><td>72 hours</td><td>7 business days</td></tr>
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: 16 }}>
                <div className="alert alert-purple">
                  <Icon name="shield" size={17} />
                  <div>
                    <strong>Unresolved after the target date?</strong> Your case is escalated automatically to the
                    Customer Experience Directorate, and you can request a Complaint Review Meeting at your branch.
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="card" style={{ marginBottom: 18 }}>
                <h3 style={{ fontSize: 16, marginBottom: 14 }}>What can you submit?</h3>
                <div style={{ display: 'grid', gap: 12 }}>
                  {FEEDBACK_TYPES.map((f) => (
                    <div key={f.id} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
                      <div className="svc-icon" style={{ width: 34, height: 34, marginBottom: 0, borderRadius: 9 }}>
                        <Icon name={f.icon} size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{f.label}</div>
                        <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ background: 'linear-gradient(135deg, var(--cbe-purple) 0%, var(--cbe-purple-dark) 100%)', borderColor: 'transparent', color: '#fff' }}>
                <Icon name="phoneCall" size={22} style={{ color: 'var(--cbe-gold)' }} />
                <h3 style={{ fontSize: 16, margin: '10px 0 6px' }}>Prefer to speak to us?</h3>
                <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.85)', marginBottom: 14 }}>
                  Our call centre is open 24 hours a day, seven days a week, in Amharic, Afaan Oromoo and English.
                </p>
                <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--cbe-gold)', lineHeight: 1.2 }}>951</div>
                <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.75)' }}>Toll free from any Ethio Telecom line</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
