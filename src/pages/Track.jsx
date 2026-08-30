import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { PageHead, Field, Alert, Badge, Empty, useToast } from '../components/UI.jsx'
import {
  findTicket, updateTicket, STATUSES, categoryById, branchById,
  fmtDate, fmtDateTime, addBusinessDays,
} from '../data.js'

const FLOW = ['received', 'review', 'progress', 'resolved']

export default function Track() {
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState(params.get('id') || '')
  const [t, setT] = useState(null)
  const [searched, setSearched] = useState(false)
  const [rating, setRating] = useState(0)
  const toast = useToast()

  useEffect(() => {
    const id = params.get('id')
    if (id) { const found = findTicket(id); setT(found); setSearched(true); setRating(found?.rating || 0) }
  }, [params])

  const search = (e) => {
    e?.preventDefault()
    const found = findTicket(q)
    setT(found); setSearched(true); setRating(found?.rating || 0)
    setParams(q.trim() ? { id: q.trim() } : {})
  }

  function rate(n) {
    setRating(n)
    updateTicket(t.id, { rating: n })
    setT((p) => ({ ...p, rating: n }))
    toast.show('Thank you — your rating has been recorded')
  }

  const cat = t ? categoryById(t.category) : null
  const stageIdx = t ? (t.status === 'closed' ? 3 : t.status === 'escalated' ? 2 : FLOW.indexOf(t.status)) : -1
  const due = t && cat ? addBusinessDays(t.created, cat.sla) : null
  const overdue = due && Date.now() > due.getTime() && !['resolved', 'closed'].includes(t?.status)

  return (
    <div className="fade-in">
      {toast.node}
      <PageHead kicker="Case tracking" title="Track Your Complaint or Feedback" crumb="Track Ticket"
        sub="Enter the reference number from your confirmation SMS or email to see a live timeline of your case." />

      <div className="wrap page-body">
        <div className="card" style={{ marginBottom: 20 }}>
          <form onSubmit={search}>
            <div style={{ display: 'flex', gap: 11, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, minWidth: 240 }}>
                <Field label="Reference number">
                  <div className="search-box">
                    <Icon name="search" size={17} />
                    <input className="input" placeholder="CBE-2608-4471" value={q}
                      onChange={(e) => setQ(e.target.value)} style={{ textTransform: 'uppercase' }} />
                  </div>
                </Field>
              </div>
              <div className="field">
                <button className="btn btn-primary" type="submit">
                  <Icon name="search" size={16} /> Track case
                </button>
              </div>
            </div>
          </form>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 12.5, color: 'var(--ink-3)', alignItems: 'center' }}>
            <span style={{ fontWeight: 600 }}>Try a demo:</span>
            {['CBE-2608-4471', 'CBE-2608-7788', 'CBE-2607-9902'].map((s) => (
              <button key={s} className="chip" style={{ padding: '4px 11px', fontSize: 12 }}
                onClick={() => { setQ(s); setParams({ id: s }) }}>{s}</button>
            ))}
          </div>
        </div>

        {searched && !t && (
          <div className="card">
            <Empty icon="search" title="No case found with that reference"
              sub="Check the number and try again. Reference numbers look like CBE-2608-4471 and are shown on your confirmation message."
              action={<Link className="btn btn-primary" to="/submit"><Icon name="alert" size={16} /> Submit a new case</Link>} />
          </div>
        )}

        {t && (
          <div className="split fade-in">
            <div>
              {/* Summary */}
              <div className="card" style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div>
                    <div className="mono" style={{ fontSize: 17 }}>{t.id}</div>
                    <h2 style={{ fontSize: 19, marginTop: 5 }}>{t.subject}</h2>
                  </div>
                  <Badge status={t.status} map={STATUSES} />
                </div>

                {overdue && (
                  <div style={{ marginBottom: 14 }}>
                    <Alert tone="bad" icon="alert">
                      This case has passed its target date of {fmtDate(due)} and has been flagged for escalation
                      to the Customer Experience Directorate.
                    </Alert>
                  </div>
                )}

                {t.status === 'escalated' && (
                  <div style={{ marginBottom: 14 }}>
                    <Alert tone="bad" icon="alert">
                      Your case has been <strong>escalated</strong> to a senior resolution team for priority handling.
                    </Alert>
                  </div>
                )}

                <div className="grid-4" style={{ gap: 12 }}>
                  <div className="stat-tile"><div className="k">Submitted</div><div style={{ fontWeight: 700, fontSize: 14, marginTop: 3 }}>{fmtDate(t.created)}</div></div>
                  <div className="stat-tile"><div className="k">Target date</div><div style={{ fontWeight: 700, fontSize: 14, marginTop: 3, color: overdue ? 'var(--danger)' : undefined }}>{due ? fmtDate(due) : '—'}</div></div>
                  <div className="stat-tile"><div className="k">Priority</div><div style={{ fontWeight: 700, fontSize: 14, marginTop: 3, textTransform: 'capitalize' }}>{t.severity}</div></div>
                  <div className="stat-tile"><div className="k">Handled by</div><div style={{ fontWeight: 700, fontSize: 14, marginTop: 3 }}>{t.assignee}</div></div>
                </div>

                <div className="divider" />

                <div style={{ marginBottom: 6, fontSize: 12.5, fontWeight: 700, color: 'var(--ink-3)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>CASE PROGRESS</span>
                  <span>{Math.round(((stageIdx + 1) / 4) * 100)}% complete</span>
                </div>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${((stageIdx + 1) / 4) * 100}%` }} /></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11.5, color: 'var(--ink-3)', fontWeight: 600 }}>
                  <span>Received</span><span>Under review</span><span>In progress</span><span>Resolved</span>
                </div>
              </div>

              {/* Timeline */}
              <div className="card" style={{ marginBottom: 18 }}>
                <h3 style={{ fontSize: 16, marginBottom: 18 }}>Case timeline</h3>
                <div className="timeline">
                  {t.events.map((e, i) => (
                    <div key={i} className={`tl-item ${i === t.events.length - 1 ? 'active' : 'done'}`}>
                      <div className="tl-dot">{i < t.events.length - 1 && <Icon name="check" size={10} stroke={3.5} style={{ color: '#fff' }} />}</div>
                      <div className="tl-t">{e.title}</div>
                      <div className="tl-m">{e.msg}</div>
                      <div className="tl-d">{fmtDateTime(e.t)}</div>
                    </div>
                  ))}
                  {!['resolved', 'closed'].includes(t.status) && (
                    <div className="tl-item" style={{ opacity: 0.6 }}>
                      <div className="tl-dot" />
                      <div className="tl-t">Resolution</div>
                      <div className="tl-m">Expected by {due ? fmtDate(due) : 'the target date'}.</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Rating */}
              {['resolved', 'closed'].includes(t.status) && (
                <div className="card">
                  <h3 style={{ fontSize: 16, marginBottom: 6 }}>How did we handle your case?</h3>
                  <p style={{ fontSize: 13.5, color: 'var(--ink-2)', marginBottom: 14 }}>
                    Your rating helps us improve service quality across all 1,300+ branches.
                  </p>
                  <div className="rating">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} className={`star ${n <= rating ? 'on' : ''}`} onClick={() => rate(n)} aria-label={`${n} star`}>
                        <Icon name="star" size={21} stroke={n <= rating ? 1.6 : 1.8} />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <div style={{ marginTop: 14 }}>
                      <Alert tone="ok" icon="checkCircle">Thank you — you rated this resolution {rating} out of 5.</Alert>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="sticky">
              <div className="card" style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, marginBottom: 12 }}>Case details</h3>
                <div className="kv"><span className="k">Type</span><span className="v" style={{ textTransform: 'capitalize' }}>{t.type}</span></div>
                <div className="kv"><span className="k">Service area</span><span className="v">{cat?.label}</span></div>
                <div className="kv"><span className="k">Channel</span><span className="v">{t.channel}</span></div>
                <div className="kv"><span className="k">Region</span><span className="v">{t.region}</span></div>
                {t.branch && <div className="kv"><span className="k">Branch</span><span className="v">{branchById(t.branch)?.name}</span></div>}
                {t.amount && <div className="kv"><span className="k">Amount</span><span className="v">ETB {Number(t.amount).toLocaleString()}</span></div>}
                {t.txnRef && <div className="kv"><span className="k">Txn ref</span><span className="v mono">{t.txnRef}</span></div>}
                <div className="kv"><span className="k">Last update</span><span className="v">{fmtDate(t.updated)}</span></div>
              </div>

              <div className="card" style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, marginBottom: 10 }}>Description you submitted</h3>
                <p style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.6 }}>{t.description}</p>
                {t.files?.length > 0 && (
                  <>
                    <div className="divider" />
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-3)', marginBottom: 8 }}>ATTACHMENTS</div>
                    {t.files.map((n) => <div className="file-row" key={n} style={{ marginTop: 6 }}><Icon name="doc" size={14} /> {n}</div>)}
                  </>
                )}
              </div>

              <div className="card">
                <h3 style={{ fontSize: 15, marginBottom: 10 }}>Not satisfied?</h3>
                <p style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 13 }}>
                  Request a face-to-face review with a resolution officer at your branch.
                </p>
                <Link className="btn btn-gold btn-block btn-sm" to="/appointment?service=complaint-mtg">
                  <Icon name="calendar" size={15} /> Book a review meeting
                </Link>
                <button className="btn btn-ghost btn-block btn-sm" style={{ marginTop: 9 }} onClick={() => window.print()}>
                  <Icon name="download" size={15} /> Download case summary
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
