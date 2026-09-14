import React, { useState, useMemo } from 'react'
import Icon from '../components/Icon.jsx'
import { PageHead, Badge, Empty, useToast, Alert } from '../components/UI.jsx'
import {
  getTickets, updateTicket, getAppointments, updateAppointment,
  STATUSES, APT_STATUS, COMPLAINT_CATEGORIES, categoryById, branchById, serviceById,
  fmtDate, fmtDateTime, addBusinessDays,
} from '../data.js'

export default function Admin() {
  const [tab, setTab] = useState('cases')
  const [tickets, setTickets] = useState(() => getTickets())
  const [apts, setApts] = useState(() => getAppointments())
  const [q, setQ] = useState('')
  const [fStatus, setFStatus] = useState('all')
  const [fCat, setFCat] = useState('all')
  const [open, setOpen] = useState(null)
  const [note, setNote] = useState('')
  const toast = useToast()

  const stats = useMemo(() => {
    const total = tickets.length
    const openCount = tickets.filter((t) => !['resolved', 'closed'].includes(t.status)).length
    const esc = tickets.filter((t) => t.status === 'escalated').length
    const resolved = tickets.filter((t) => ['resolved', 'closed'].includes(t.status)).length
    const rated = tickets.filter((t) => t.rating > 0)
    const csat = rated.length ? (rated.reduce((a, t) => a + t.rating, 0) / rated.length).toFixed(1) : '—'
    const overdue = tickets.filter((t) => {
      const cat = categoryById(t.category)
      if (!cat || ['resolved', 'closed'].includes(t.status)) return false
      return Date.now() > addBusinessDays(t.created, cat.sla).getTime()
    }).length
    return { total, openCount, esc, resolved, csat, overdue, rate: total ? Math.round((resolved / total) * 100) : 0 }
  }, [tickets])

  const byCat = useMemo(() => {
    const m = {}
    tickets.forEach((t) => { m[t.category] = (m[t.category] || 0) + 1 })
    return Object.entries(m).sort((a, b) => b[1] - a[1])
  }, [tickets])

  const filtered = useMemo(() => tickets.filter((t) => {
    if (fStatus !== 'all' && t.status !== fStatus) return false
    if (fCat !== 'all' && t.category !== fCat) return false
    if (q.trim()) {
      const s = q.toLowerCase()
      return t.id.toLowerCase().includes(s) || t.subject.toLowerCase().includes(s) || t.name.toLowerCase().includes(s)
    }
    return true
  }), [tickets, fStatus, fCat, q])

  function setStatus(id, status) {
    const labels = {
      review: ['Under review', 'A resolution officer has started reviewing this case.'],
      progress: ['In progress', 'Investigation underway with the responsible unit.'],
      escalated: ['Escalated', 'Escalated to the Customer Experience Directorate for priority handling.'],
      resolved: ['Resolved', 'A resolution has been reached and communicated to the customer.'],
      closed: ['Closed', 'Case closed. Thank you for your feedback.'],
    }
    const t = tickets.find((x) => x.id === id)
    const [title, msg] = labels[status] || ['Updated', 'Status updated.']
    const events = [...t.events, { t: Date.now(), title, msg: note.trim() || msg, done: true }]
    updateTicket(id, { status, events })
    setTickets(getTickets())
    setOpen((p) => (p ? { ...p, status, events } : p))
    setNote('')
    toast.show(`${id} marked as ${STATUSES[status].label}`)
  }

  function setApt(id, status) {
    updateAppointment(id, { status })
    setApts(getAppointments())
    toast.show(`Appointment ${id} → ${APT_STATUS[status].label}`)
  }

  return (
    <div className="fade-in">
      {toast.node}
      <PageHead kicker="Internal · Customer Experience Directorate" title="Staff Resolution Desk" crumb="Staff Desk"
        sub="Monitor complaint volumes, SLA compliance and branch appointments across the network." />

      <div className="wrap page-body">
        <div style={{ marginBottom: 18 }}>
          <Alert tone="gold" icon="lock">
            <strong>Demonstration view.</strong> In production this desk sits behind CBE staff single sign-on with
            role-based access control and a full audit trail.
          </Alert>
        </div>

        {/* KPI tiles */}
        <div className="grid-4" style={{ marginBottom: 20 }}>
          <div className="stat-tile accent">
            <div className="k">Total cases</div>
            <div className="v">{stats.total}</div>
            <div className="d">All channels, all regions</div>
          </div>
          <div className="stat-tile">
            <div className="k">Open</div>
            <div className="v">{stats.openCount}</div>
            <div className="d">{stats.esc} escalated · {stats.overdue} past SLA</div>
          </div>
          <div className="stat-tile">
            <div className="k">Resolution rate</div>
            <div className="v">{stats.rate}%</div>
            <div className="d">{stats.resolved} resolved or closed</div>
          </div>
          <div className="stat-tile">
            <div className="k">Avg. satisfaction</div>
            <div className="v">{stats.csat}<span style={{ fontSize: 16, color: 'var(--ink-3)' }}> /5</span></div>
            <div className="d">From rated resolutions</div>
          </div>
        </div>

        <div className="tabs">
          <button className={`tab ${tab === 'cases' ? 'on' : ''}`} onClick={() => setTab('cases')}>Cases ({tickets.length})</button>
          <button className={`tab ${tab === 'apts' ? 'on' : ''}`} onClick={() => setTab('apts')}>Appointments ({apts.length})</button>
          <button className={`tab ${tab === 'insight' ? 'on' : ''}`} onClick={() => setTab('insight')}>Insights</button>
        </div>

        {/* ---------- CASES ---------- */}
        {tab === 'cases' && (
          <>
            <div className="toolbar">
              <div className="search-box">
                <Icon name="search" size={17} />
                <input className="input" placeholder="Search reference, subject or customer…" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <select className="select" style={{ width: 'auto', minWidth: 160 }} value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
                <option value="all">All statuses</option>
                {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <select className="select" style={{ width: 'auto', minWidth: 180 }} value={fCat} onChange={(e) => setFCat(e.target.value)}>
                <option value="all">All service areas</option>
                {COMPLAINT_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="card"><Empty icon="filter" title="No cases match your filters" sub="Try clearing the search box or selecting a different status." /></div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Reference</th><th>Subject</th><th>Service area</th><th>Priority</th>
                      <th>Customer</th><th>Submitted</th><th>SLA</th><th>Status</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((t) => {
                      const cat = categoryById(t.category)
                      const due = addBusinessDays(t.created, cat?.sla || 5)
                      const late = Date.now() > due.getTime() && !['resolved', 'closed'].includes(t.status)
                      return (
                        <tr key={t.id}>
                          <td className="nowrap"><span className="mono">{t.id}</span></td>
                          <td className="col-subject">
                            <div style={{ fontWeight: 600 }}>{t.subject}</div>
                            <div style={{ fontSize: 12, color: 'var(--ink-3)', textTransform: 'capitalize' }}>{t.type} · {t.channel}</div>
                          </td>
                          <td>{cat?.label}</td>
                          <td style={{ textTransform: 'capitalize' }}>
                            <span className={`badge ${t.severity === 'critical' ? 'b-esc' : t.severity === 'high' ? 'b-prog' : 'b-grey'}`}>{t.severity}</span>
                          </td>
                          <td>{t.anonymous ? <em style={{ color: 'var(--ink-3)' }}>Anonymous</em> : t.name}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>{fmtDate(t.created)}</td>
                          <td style={{ whiteSpace: 'nowrap', color: late ? 'var(--danger)' : 'var(--ink-2)', fontWeight: late ? 700 : 500 }}>
                            {late ? 'Overdue' : fmtDate(due)}
                          </td>
                          <td><Badge status={t.status} map={STATUSES} /></td>
                          <td>
                            <button className="btn btn-ghost btn-sm" onClick={() => { setOpen(t); setNote('') }}>Open</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Case drawer */}
            {open && (
              <div className="card fade-in" style={{ marginTop: 18, borderColor: 'var(--cbe-purple-soft-2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div>
                    <span className="mono" style={{ fontSize: 16 }}>{open.id}</span>
                    <h3 style={{ fontSize: 18, marginTop: 4 }}>{open.subject}</h3>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => setOpen(null)}><Icon name="x" size={15} /> Close</button>
                </div>

                <div className="grid-2" style={{ gap: 18 }}>
                  <div>
                    <div className="review-block">
                      <h4>Case data</h4>
                      <div className="review-row"><span className="k">Status</span><span className="v"><Badge status={open.status} map={STATUSES} /></span></div>
                      <div className="review-row"><span className="k">Type</span><span className="v" style={{ textTransform: 'capitalize' }}>{open.type}</span></div>
                      <div className="review-row"><span className="k">Service area</span><span className="v">{categoryById(open.category)?.label}</span></div>
                      <div className="review-row"><span className="k">Channel</span><span className="v">{open.channel}</span></div>
                      <div className="review-row"><span className="k">Region</span><span className="v">{open.region}</span></div>
                      {open.branch && <div className="review-row"><span className="k">Branch</span><span className="v">{branchById(open.branch)?.name}</span></div>}
                      {open.amount && <div className="review-row"><span className="k">Amount</span><span className="v">ETB {Number(open.amount).toLocaleString()}</span></div>}
                      {open.txnRef && <div className="review-row"><span className="k">Txn ref</span><span className="v mono">{open.txnRef}</span></div>}
                      <div className="review-row"><span className="k">Customer</span><span className="v">{open.anonymous ? 'Anonymous' : `${open.name} · ${open.phone}`}</span></div>
                      <div className="review-row"><span className="k">Assigned unit</span><span className="v">{open.assignee}</span></div>
                    </div>

                    <div className="review-block">
                      <h4>Customer description</h4>
                      <p style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.6 }}>{open.description}</p>
                    </div>
                  </div>

                  <div>
                    <div className="review-block">
                      <h4>Update this case</h4>
                      <textarea className="textarea" style={{ minHeight: 90, marginBottom: 12 }}
                        placeholder="Add a note that the customer will see on their timeline (optional)…"
                        value={note} onChange={(e) => setNote(e.target.value)} />
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {['review', 'progress', 'escalated', 'resolved', 'closed'].map((s) => (
                          <button key={s} className={`btn btn-sm ${s === 'resolved' ? 'btn-primary' : s === 'escalated' ? 'btn-gold' : 'btn-ghost'}`}
                            disabled={open.status === s} onClick={() => setStatus(open.id, s)}>
                            {STATUSES[s].label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="review-block">
                      <h4>Timeline</h4>
                      <div className="timeline">
                        {open.events.map((e, i) => (
                          <div key={i} className={`tl-item ${i === open.events.length - 1 ? 'active' : 'done'}`}>
                            <div className="tl-dot">{i < open.events.length - 1 && <Icon name="check" size={10} stroke={3.5} style={{ color: '#fff' }} />}</div>
                            <div className="tl-t">{e.title}</div>
                            <div className="tl-m">{e.msg}</div>
                            <div className="tl-d">{fmtDateTime(e.t)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ---------- APPOINTMENTS ---------- */}
        {tab === 'apts' && (
          apts.length === 0 ? (
            <div className="card"><Empty icon="calendar" title="No appointments booked yet" /></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Reference</th><th>Service</th><th>Branch</th><th>Date &amp; time</th><th>Customer</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {[...apts].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).map((a) => (
                    <tr key={a.id}>
                      <td><span className="mono">{a.id}</span></td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{serviceById(a.service)?.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{serviceById(a.service)?.mins} min</div>
                      </td>
                      <td>{branchById(a.branch)?.name}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{fmtDate(a.date)}<div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{a.time}</div></td>
                      <td>{a.name}<div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{a.phone}</div></td>
                      <td><Badge status={a.status} map={APT_STATUS} /></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-ghost btn-sm" disabled={a.status === 'confirmed'} onClick={() => setApt(a.id, 'confirmed')}>Confirm</button>
                          <button className="btn btn-ghost btn-sm" disabled={a.status === 'completed'} onClick={() => setApt(a.id, 'completed')}>Complete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* ---------- INSIGHTS ---------- */}
        {tab === 'insight' && (
          <div className="split">
            <div className="card">
              <h3 style={{ fontSize: 16, marginBottom: 4 }}>Cases by service area</h3>
              <p style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 18 }}>Where customers are experiencing the most friction.</p>
              {byCat.length === 0 ? <Empty icon="chart" title="No data yet" /> : (
                <div style={{ display: 'grid', gap: 15 }}>
                  {byCat.map(([id, n]) => {
                    const pct = Math.round((n / tickets.length) * 100)
                    return (
                      <div key={id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 6 }}>
                          <span style={{ fontWeight: 600 }}>{categoryById(id)?.label || id}</span>
                          <span style={{ color: 'var(--ink-3)', fontWeight: 600 }}>{n} case{n > 1 ? 's' : ''} · {pct}%</span>
                        </div>
                        <div className="bar-track"><div className="bar-fill" style={{ width: `${pct}%` }} /></div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div>
              <div className="card" style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, marginBottom: 12 }}>SLA health</h3>
                <div className="kv"><span className="k">On-track cases</span><span className="v" style={{ color: 'var(--ok)' }}>{stats.openCount - stats.overdue}</span></div>
                <div className="kv"><span className="k">Past target date</span><span className="v" style={{ color: 'var(--danger)' }}>{stats.overdue}</span></div>
                <div className="kv"><span className="k">Escalated</span><span className="v" style={{ color: 'var(--warn)' }}>{stats.esc}</span></div>
                <div className="kv"><span className="k">Resolved / closed</span><span className="v">{stats.resolved}</span></div>
              </div>

              <div className="card">
                <h3 style={{ fontSize: 15, marginBottom: 12 }}>Status breakdown</h3>
                <div style={{ display: 'grid', gap: 9 }}>
                  {Object.entries(STATUSES).map(([k, v]) => {
                    const n = tickets.filter((t) => t.status === k).length
                    return (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Badge status={k} map={STATUSES} />
                        <span style={{ fontWeight: 700 }}>{n}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
