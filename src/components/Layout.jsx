import React, { useState, useEffect } from 'react'
import { NavLink, Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import Icon from './Icon.jsx'
import logoSeal from '../assets/cbe-logo.png'
import { BRANCH, currentUser, logout } from '../data.js'

// Official Commercial Bank of Ethiopia seal. The bronze emblem has enough
// contrast to sit on both the white masthead and the purple footer, so a
// single asset covers every placement.
export function Logo({ height = 44 }) {
  return (
    <img
      src={logoSeal}
      alt="Commercial Bank of Ethiopia"
      width={height}
      height={height}
      style={{ height, width: height, display: 'block', objectFit: 'contain' }}
    />
  )
}

export default function Layout() {
  const [open, setOpen] = useState(false)
  const [lang, setLang] = useState('EN')
  const loc = useLocation()
  const nav = useNavigate()
  // Re-read on each navigation so signing in/out updates the chrome.
  const user = currentUser()

  function signOut() {
    logout()
    nav('/', { replace: true })
  }

  useEffect(() => {
    setOpen(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [loc.pathname])

  return (
    <div className="shell">
      {/* Utility strip */}
      <div className="utility no-print">
        <div className="wrap">
          <div className="utility-left">
            <span className="utility-item u-branch"><Icon name="pin" size={13} /> {BRANCH.name}<span className="u-long"> · {BRANCH.woreda}, {BRANCH.zone}</span></span>
            <span className="utility-item u-call"><Icon name="phoneCall" size={13} /> Call Centre: {BRANCH.callCentre}</span>
            <span className="utility-item u-mail"><Icon name="mail" size={13} /> {BRANCH.email}</span>
          </div>
          <div className="lang-switch">
            {['EN', 'አማ', 'OM'].map((l) => (
              <button key={l} className={lang === l ? 'on' : ''} onClick={() => setLang(l)}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Masthead */}
      <header className="masthead no-print">
        <div className={`wrap ${user ? 'has-session' : ''}`}>
          <Link to="/" className="brand">
            <Logo height={52} />
            <span className="brand-rule" aria-hidden="true" />
            <div className="brand-text">
              <div className="n1">Commercial Bank of Ethiopia</div>
              <div className="n2">{BRANCH.name} · CBE Care Portal</div>
            </div>
          </Link>

          <nav className={`nav ${open ? 'open' : ''}`}>
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/submit">Submit Feedback</NavLink>
            <NavLink to="/track">Track Ticket</NavLink>
            <NavLink to="/appointment">Book Appointment</NavLink>
            <NavLink to="/my-appointments">My Appointments</NavLink>
            {user ? (
              <NavLink to="/admin">Staff Desk</NavLink>
            ) : (
              <NavLink to="/login" className="nav-staff">Staff Sign In</NavLink>
            )}
          </nav>

          {user && (
            <div className="session no-print">
              <span className="session-avatar">
                {user.name.split(' ').slice(-2).map((w) => w[0]).join('')}
              </span>
              <span className="session-meta">
                <span className="session-name">{user.name}</span>
                <span className="session-role">{user.role}</span>
              </span>
              <button className="session-out" onClick={signOut} title="Sign out" aria-label="Sign out">
                <Icon name="signOut" size={15} />
              </button>
            </div>
          )}

          <button className="burger" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            <Icon name={open ? 'x' : 'menu'} size={21} />
          </button>
        </div>
      </header>

      <main><Outlet /></main>

      {/* Footer */}
      <footer className="footer no-print">
        <div className="wrap">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">
                <Logo height={44} />
                <div>
                  <div className="n">Commercial Bank of Ethiopia</div>
                  <div className="n-sub">CBE Care · Customer Voice Portal</div>
                </div>
              </div>
              <p className="footer-note">
                The official complaint, feedback and appointment channel of the Commercial Bank of Ethiopia —
                the nation's most trusted and leading bank, serving customers since 1942.
              </p>
            </div>
            <div>
              <h5>Services</h5>
              <ul>
                <li><Link to="/submit">Lodge a complaint</Link></li>
                <li><Link to="/submit">Give feedback</Link></li>
                <li><Link to="/track">Track a ticket</Link></li>
                <li><Link to="/appointment">Book an appointment</Link></li>
              </ul>
            </div>
            <div>
              <h5>Support</h5>
              <ul>
                <li><a href="#/track">Resolution timelines</a></li>
                <li><a href="#/">Customer charter</a></li>
                <li><a href="#/">Data privacy</a></li>
                <li><Link to="/login">Staff sign in</Link></li>
              </ul>
            </div>
            <div>
              <h5>Visit the branch</h5>
              <ul>
                <li>{BRANCH.address}</li>
                <li>{BRANCH.woreda}, {BRANCH.zone}</li>
                <li>{BRANCH.hoursWeekday}</li>
                <li>{BRANCH.hoursSaturday}</li>
                <li style={{ paddingTop: 6 }}>Call Centre: {BRANCH.callCentre} (toll free)</li>
                <li>{BRANCH.email}</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Commercial Bank of Ethiopia. All rights reserved.</span>
            <span>Demonstration front-end · Not connected to live banking systems</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
