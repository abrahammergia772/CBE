import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

export function PageHead({ kicker, title, sub, crumb }) {
  return (
    <div className="page-head">
      <div className="wrap">
        <div className="crumb">
          <Link to="/">Home</Link> <span style={{ opacity: 0.55 }}>/</span> {crumb || title}
        </div>
        {kicker && (
          <div style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#E8A029', marginBottom: 8 }}>
            {kicker}
          </div>
        )}
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
    </div>
  )
}

export function Stepper({ steps, current }) {
  return (
    <div className="stepper" role="list">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div className={`stepper-item ${i < current ? 'done' : ''} ${i === current ? 'current' : ''}`} role="listitem">
            <div className="stepper-bubble">{i < current ? <Icon name="check" size={15} stroke={3} /> : i + 1}</div>
            <span className="stepper-label">{s}</span>
          </div>
          {i < steps.length - 1 && <div className={`stepper-bar ${i < current ? 'filled' : ''}`} />}
        </React.Fragment>
      ))}
    </div>
  )
}

export function Field({ label, required, optional, error, help, children }) {
  return (
    <div className="field">
      {label && (
        <label>
          {label}
          {required && <span className="req">*</span>}
          {optional && <span className="opt">(optional)</span>}
        </label>
      )}
      {children}
      {error && <div className="err"><Icon name="alert" size={13} /> {error}</div>}
      {help && !error && <div className="help">{help}</div>}
    </div>
  )
}

export function Alert({ tone = 'info', icon = 'info', children }) {
  return (
    <div className={`alert alert-${tone}`}>
      <Icon name={icon} size={17} />
      <div>{children}</div>
    </div>
  )
}

export function Badge({ status, map }) {
  const s = map[status] || { label: status, cls: 'b-grey' }
  return <span className={`badge ${s.cls}`}><span className="bdot" />{s.label}</span>
}

export function Toast({ msg, onDone }) {
  useEffect(() => {
    if (!msg) return
    const t = setTimeout(onDone, 2600)
    return () => clearTimeout(t)
  }, [msg, onDone])
  if (!msg) return null
  return <div className="toast"><Icon name="checkCircle" size={17} /> {msg}</div>
}

export function useToast() {
  const [msg, setMsg] = useState('')
  return { msg, show: setMsg, clear: () => setMsg(''), node: <Toast msg={msg} onDone={() => setMsg('')} /> }
}

export function Empty({ icon = 'inbox', title, sub, action }) {
  return (
    <div className="empty">
      <div className="empty-ico"><Icon name={icon} size={26} /></div>
      <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>{title}</div>
      {sub && <div style={{ fontSize: 13.5, maxWidth: 380, margin: '0 auto 16px' }}>{sub}</div>}
      {action}
    </div>
  )
}
