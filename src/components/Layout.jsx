import React, { useState, useEffect } from 'react'
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import Icon from './Icon.jsx'
import logoDark from '../assets/cbe-birr-logo.png'
import logoLight from '../assets/cbe-birr-logo-white.png'

// Official CBE Birr logo. `onDark` swaps to the white-type variant so the
// wordmark stays legible on the purple footer.
export function Logo({ height = 38, onDark = false }) {
  return (
    <img
      src={onDark ? logoLight : logoDark}
      alt="CBE Birr — Commercial Bank of Ethiopia"
      style={{ height, width: 'auto', display: 'block' }}
    />
  )
}

export default function Layout() {
  const [open, setOpen] = useState(false)
  const [lang, setLang] = useState('EN')
  const loc = useLocation()

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
            <span className="utility-item"><Icon name="phoneCall" size={13} /> Call Centre: 951</span>
            <span className="utility-item"><Icon name="mail" size={13} /> feedback@cbe.com.et</span>
            <span className="utility-item"><Icon name="shield" size={13} /> Report fraud: CustFraudMsg@cbe.com.et</span>
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
        <div className="wrap">
          <Link to="/" className="brand">
            <Logo height={40} />
            <span className="brand-rule" aria-hidden="true" />
            <div className="brand-text">
              <div className="n1">CBE Care</div>
              <div className="n2">Complaint · Feedback · Appointments</div>
            </div>
          </Link>

          <nav className={`nav ${open ? 'open' : ''}`}>
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/submit">Submit Feedback</NavLink>
            <NavLink to="/track">Track Ticket</NavLink>
            <NavLink to="/appointment">Book Appointment</NavLink>
            <NavLink to="/my-appointments">My Appointments</NavLink>
            <NavLink to="/admin">Staff Desk</NavLink>
          </nav>

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
                <Logo height={38} onDark />
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
                <li><a href="#/">Branch directory</a></li>
              </ul>
            </div>
            <div>
              <h5>Reach us</h5>
              <ul>
                <li>Call Centre: 951 (toll free)</li>
                <li>+251 11 551 5004</li>
                <li>feedback@cbe.com.et</li>
                <li>Ras Desta Damtew St, Addis Ababa</li>
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
