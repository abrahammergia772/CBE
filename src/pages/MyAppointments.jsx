import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { PageHead, Badge, Empty, useToast, Alert } from '../components/UI.jsx'
import {
  getAppointments, updateAppointment, APT_STATUS, serviceById, branchById,
  fmtDate, nextDays, TIME_SLOTS, bookedSlots, busySlots, toISODate,
} from '../data.js'

export default function MyAppointments() {
  const [list, setList] = useState(() => getAppointments())
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('upcoming')
  const [resched, setResched] = useState(null)
  const [nd, setNd] = useState({ date: '', time: '' })
  const toast = useToast()

  const days = useMemo(() => nextDays(14), [])

  const filtered = useMemo(() => {
    const today = toISODate(new Date())
    return list
      .filter((a) => {
        if (tab === 'upcoming') return a.date >= today && a.status !== 'cancelled' && a.status !== 'completed'
        if (tab === 'past') return a.date < today || a.status === 'completed'
        return a.status === 'cancelled'
      })
      .filter((a) => {
        if (!q.trim()) return true
        const s = q.toLowerCase()
        return a.id.toLowerCase().includes(s) || a.name.toLowerCase().includes(s) || a.phone.includes(s)
      })
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  }, [list, tab, q])

  function cancel(id) {
    updateAppointment(id, { status: 'cancelled' })
    setList(getAppointments())
    toast.show('Appointment cancelled')
  }

  function doResched() {
    if (!nd.date || !nd.time) return
    updateAppointment(resched.id, { date: nd.date, time: nd.time, status: 'confirmed' })
    setList(getAppointments())
    setResched(null); setNd({ date: '', time: '' })
    toast.show('Appointment rescheduled successfully')
  }

  const unavailable = useMemo(() => {
    if (!resched || !nd.date) return []
    return [...new Set([...bookedSlots(resched.branch, nd.date), ...busySlots(resched.branch, nd.date)])]
      .filter((t) => !(resched.date === nd.date && resched.time === t))
  }, [resched, nd.date])

  return (
    <div className="fade-in">
      {toast.node}
      <PageHead kicker="Manage bookings" title="My Appointments" crumb="My Appointments"
        sub="View, reschedule or cancel your branch appointments. Search by booking reference, name or phone number." />

      <div className="wrap page-body">
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="toolbar" style={{ marginBottom: 0 }}>
            <div className="search-box">
              <Icon name="search" size={17} />
              <input className="input" placeholder="Search by reference, name or phone…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <Link className="btn btn-primary" to="/appointment"><Icon name="calendar" size={16} /> New appointment</Link>
          </div>
        </div>

        <div className="tabs">
          {[
            { id: 'upcoming', l: 'Upcoming' },
            { id: 'past', l: 'Past' },
            { id: 'cancelled', l: 'Cancelled' },
          ].map((t) => (
            <button key={t.id} className={`tab ${tab === t.id ? 'on' : ''}`} onClick={() => setTab(t.id)}>{t.l}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="card">
            <Empty icon="calendar" title={`No ${tab} appointments`}
              sub={tab === 'upcoming' ? 'Book a slot with a branch officer and skip the queue entirely.' : 'Nothing to show here yet.'}
              action={<Link className="btn btn-primary" to="/appointment"><Icon name="calendar" size={16} /> Book an appointment</Link>} />
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 14 }}>
            {filtered.map((a) => {
              const svc = serviceById(a.service)
              const br = branchById(a.branch)
              return (
                <div className="card" key={a.id}>
                  <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    <div style={{
                      width: 74, flex: 'none', textAlign: 'center', borderRadius: 14, overflow: 'hidden',
                      border: '1px solid var(--line)',
                    }}>
                      <div style={{ background: 'var(--cbe-purple)', color: '#fff', fontSize: 11, fontWeight: 800, padding: '4px 0', letterSpacing: '0.06em' }}>
                        {new Date(a.date).toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()}
                      </div>
                      <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.3, color: 'var(--cbe-purple-dark)' }}>{new Date(a.date).getDate()}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--ink-3)', paddingBottom: 6, fontWeight: 600 }}>{a.time}</div>
                    </div>

                    <div style={{ flex: 1, minWidth: 220 }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 5 }}>
                        <span className="mono">{a.id}</span>
                        <Badge status={a.status} map={APT_STATUS} />
                      </div>
                      <h3 style={{ fontSize: 17, marginBottom: 6 }}>{svc?.label}</h3>
                      <div style={{ display: 'grid', gap: 4, fontSize: 13.5, color: 'var(--ink-2)' }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Icon name="pin" size={14} style={{ color: 'var(--cbe-purple)' }} /> {br?.name} — {br?.address}, {br?.city}</div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Icon name="clock" size={14} style={{ color: 'var(--cbe-purple)' }} /> {fmtDate(a.date)} at {a.time} · {svc?.mins} minutes</div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Icon name="users" size={14} style={{ color: 'var(--cbe-purple)' }} /> {a.name} · {a.phone}</div>
                        {a.ticketRef && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Icon name="doc" size={14} style={{ color: 'var(--cbe-purple)' }} /> Linked case: <span className="mono">{a.ticketRef}</span></div>}
                      </div>
                      {a.notes && (
                        <div style={{ marginTop: 10, padding: '9px 12px', background: 'var(--bg)', borderRadius: 9, fontSize: 13, color: 'var(--ink-2)' }}>
                          <strong style={{ color: 'var(--ink)' }}>Note:</strong> {a.notes}
                        </div>
                      )}
                    </div>

                    {tab === 'upcoming' && (
                      <div style={{ display: 'grid', gap: 8, minWidth: 150 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => { setResched(a); setNd({ date: a.date, time: '' }) }}>
                          <Icon name="refresh" size={14} /> Reschedule
                        </button>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)', borderColor: '#f3d7d4' }} onClick={() => cancel(a.id)}>
                          <Icon name="x" size={14} /> Cancel
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => window.print()}>
                          <Icon name="print" size={14} /> Print
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Reschedule panel */}
                  {resched?.id === a.id && (
                    <div className="fade-in" style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--line-2)' }}>
                      <h4 style={{ fontSize: 15, marginBottom: 12 }}>Choose a new date and time</h4>
                      <div className="daystrip" style={{ marginBottom: 16 }}>
                        {days.map((d) => {
                          const iso = toISODate(d)
                          return (
                            <button key={iso} className={`day ${nd.date === iso ? 'on' : ''}`} onClick={() => setNd({ date: iso, time: '' })}>
                              <div className="dw">{d.toLocaleDateString('en-GB', { weekday: 'short' })}</div>
                              <div className="dd">{d.getDate()}</div>
                              <div className="dm">{d.toLocaleDateString('en-GB', { month: 'short' })}</div>
                            </button>
                          )
                        })}
                      </div>
                      {nd.date && (
                        <div className="slot-grid" style={{ marginBottom: 16 }}>
                          {TIME_SLOTS.map((s) => {
                            const taken = unavailable.includes(s)
                            return (
                              <button key={s} className={`slot ${nd.time === s ? 'on' : ''}`} disabled={taken}
                                onClick={() => setNd((p) => ({ ...p, time: s }))}>
                                {s}<small>{taken ? 'booked' : 'available'}</small>
                              </button>
                            )
                          })}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <button className="btn btn-primary btn-sm" disabled={!nd.date || !nd.time} onClick={doResched}>
                          <Icon name="check" size={15} /> Confirm new time
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => { setResched(null); setNd({ date: '', time: '' }) }}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div style={{ marginTop: 20 }}>
          <Alert tone="purple" icon="info">
            Appointments can be rescheduled free of charge up to two hours before the start time.
            For urgent changes, call the branch directly or our 24/7 call centre on <strong>951</strong>.
          </Alert>
        </div>
      </div>
    </div>
  )
}
