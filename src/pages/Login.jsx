import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { Field, Alert } from '../components/UI.jsx'
import { login, currentUser, STAFF_USERS, BRANCH } from '../data.js'

export default function Login() {
  const nav = useNavigate()
  const loc = useLocation()
  const from = loc.state?.from || '/admin'

  const [f, setF] = useState({ username: '', password: '', remember: true })
  const [errs, setErrs] = useState({})
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)
  const [show, setShow] = useState(false)

  // Already signed in? Skip the form.
  useEffect(() => {
    if (currentUser()) nav('/admin', { replace: true })
  }, [nav])

  const set = (k, v) => {
    setF((p) => ({ ...p, [k]: v }))
    setErrs((p) => ({ ...p, [k]: '' }))
    setFormError('')
  }

  function submit(e) {
    e.preventDefault()
    const next = {}
    if (!f.username.trim()) next.username = 'Enter your staff username.'
    if (!f.password) next.password = 'Enter your password.'
    setErrs(next)
    if (Object.keys(next).length) return

    setBusy(true)
    // Simulated round-trip so the pending state is visible.
    setTimeout(() => {
      const res = login(f.username, f.password)
      setBusy(false)
      if (!res.ok) {
        setFormError(res.error)
        return
      }
      nav(from, { replace: true })
    }, 550)
  }

  function useDemo(u) {
    setF({ username: u.username, password: u.password, remember: true })
    setErrs({})
    setFormError('')
  }

  return (
    <div className="fade-in">
      <div className="login-page">
        <div className="wrap">
          <div className="login-grid">
            {/* ---------- Form ---------- */}
            <div className="card login-card">
              <div className="login-lock"><Icon name="lock" size={22} /></div>
              <h1>Staff sign in</h1>
              <p className="login-sub">
                Restricted to authorised {BRANCH.name} staff. Customer services do not
                require an account.
              </p>

              {formError && (
                <div style={{ marginBottom: 16 }}>
                  <Alert tone="bad" icon="alert">{formError}</Alert>
                </div>
              )}

              <form onSubmit={submit} noValidate>
                <Field label="Staff username" required error={errs.username}>
                  <input
                    className={`input ${errs.username ? 'bad' : ''}`}
                    type="text"
                    name="username"
                    placeholder="e.g. officer"
                    autoComplete="username"
                    autoFocus
                    value={f.username}
                    onChange={(e) => set('username', e.target.value)}
                  />
                </Field>

                <Field label="Password" required error={errs.password}>
                  <div className="pw-wrap">
                    <input
                      className={`input ${errs.password ? 'bad' : ''}`}
                      type={show ? 'text' : 'password'}
                      name="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      value={f.password}
                      onChange={(e) => set('password', e.target.value)}
                    />
                    <button
                      type="button"
                      className="pw-toggle"
                      onClick={() => setShow((v) => !v)}
                      aria-label={show ? 'Hide password' : 'Show password'}
                    >
                      {show ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </Field>

                <div className="login-row">
                  <label className="check" style={{ fontSize: 13 }}>
                    <input
                      type="checkbox"
                      checked={f.remember}
                      onChange={(e) => set('remember', e.target.checked)}
                    />
                    <span>Keep me signed in</span>
                  </label>
                  <span className="login-help">Forgot password? Contact the branch manager.</span>
                </div>

                <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
                  {busy ? (
                    <>
                      <span className="spinner" /> Signing in…
                    </>
                  ) : (
                    <>
                      <Icon name="lock" size={16} /> Sign in
                    </>
                  )}
                </button>
              </form>

              <div className="divider" />
              <Link className="btn btn-ghost btn-block btn-sm" to="/">
                <Icon name="back" size={15} /> Back to the customer portal
              </Link>
            </div>

            {/* ---------- Demo accounts ---------- */}
            <div>
              <div className="card demo-card">
                <div className="demo-head">
                  <Icon name="users" size={17} />
                  <h3>Demo accounts</h3>
                </div>
                <p className="demo-sub">
                  This is a demonstration portal. Select an account to fill the form,
                  then press <strong>Sign in</strong>.
                </p>

                <div className="demo-list">
                  {STAFF_USERS.map((u) => (
                    <button key={u.id} type="button" className="demo-user" onClick={() => useDemo(u)}>
                      <span className="demo-avatar">
                        {u.name.split(' ').slice(-2).map((w) => w[0]).join('')}
                      </span>
                      <span className="demo-meta">
                        <span className="demo-name">{u.name}</span>
                        <span className="demo-role">{u.role}</span>
                        <span className="demo-creds">
                          <code>{u.username}</code> / <code>{u.password}</code>
                        </span>
                      </span>
                      <Icon name="arrow" size={15} />
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: 16 }}>
                  <Alert tone="gold" icon="info">
                    Roles differ: the <strong>Branch Manager</strong> can close and escalate cases,
                    the <strong>Officer</strong> can update and escalate, and the
                    {' '}<strong>Teller</strong> has read-only access with appointment handling.
                  </Alert>
                </div>
              </div>

              <div className="card" style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', gap: 9, alignItems: 'center', marginBottom: 10 }}>
                  <Icon name="shield" size={17} style={{ color: 'var(--cbe-purple)' }} />
                  <h3 style={{ fontSize: 15 }}>Security notice</h3>
                </div>
                <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>
                  In production this desk authenticates against CBE staff single sign-on with
                  role-based access control and a full audit trail. Never share your credentials,
                  and always sign out on shared branch terminals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
