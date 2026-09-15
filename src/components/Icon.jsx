import React from 'react'

const P = {
  card: <><rect x="2" y="5" width="20" height="14" rx="2.5" /><path d="M2 10h20" /></>,
  phone: <><rect x="6" y="2" width="12" height="20" rx="2.5" /><path d="M11 18.5h2" /></>,
  wallet: <><path d="M20 12V8.5A2.5 2.5 0 0 0 17.5 6H5a2 2 0 0 1 0-4h12" /><rect x="2" y="6" width="20" height="14" rx="2.5" /><path d="M17 13h.01" /></>,
  doc: <><path d="M14 2H6.5A1.5 1.5 0 0 0 5 3.5v17A1.5 1.5 0 0 0 6.5 22h11a1.5 1.5 0 0 0 1.5-1.5V7z" /><path d="M14 2v5h5" /><path d="M9 13h6M9 17h4" /></>,
  globe: <><circle cx="12" cy="12" r="9.5" /><path d="M2.5 12h19" /><path d="M12 2.5a15 15 0 0 1 0 19a15 15 0 0 1 0-19z" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 5.2a3.5 3.5 0 0 1 0 6.6M17.5 20a6.4 6.4 0 0 0-2-4.6" /></>,
  monitor: <><rect x="2" y="3.5" width="20" height="13" rx="2" /><path d="M8 20.5h8M12 16.5v4" /></>,
  dots: <><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></>,
  alert: <><path d="M10.3 3.2 1.9 17.5A2 2 0 0 0 3.6 20.5h16.8a2 2 0 0 0 1.7-3L13.7 3.2a2 2 0 0 0-3.4 0z" /><path d="M12 9v4.5M12 17h.01" /></>,
  bulb: <><path d="M9 18h6M10 21.5h4" /><path d="M12 2.5a6.5 6.5 0 0 0-4 11.6V16h8v-1.9a6.5 6.5 0 0 0-4-11.6z" /></>,
  heart: <><path d="M20.4 5.6a5.1 5.1 0 0 0-7.2 0L12 6.8l-1.2-1.2a5.1 5.1 0 1 0-7.2 7.2l8.4 8.4 8.4-8.4a5.1 5.1 0 0 0 0-7.2z" /></>,
  help: <><circle cx="12" cy="12" r="9.5" /><path d="M9.2 9.2a2.9 2.9 0 0 1 5.6 1c0 2-2.8 2.6-2.8 2.6" /><path d="M12 17h.01" /></>,
  briefcase: <><rect x="2" y="7" width="20" height="14" rx="2.2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M2 13h20" /></>,
  search: <><circle cx="11" cy="11" r="7.2" /><path d="m20.5 20.5-4.2-4.2" /></>,
  check: <><path d="M20 6 9.5 17 4 11.5" /></>,
  checkCircle: <><circle cx="12" cy="12" r="9.5" /><path d="m8 12.2 2.7 2.8L16 9.5" /></>,
  clock: <><circle cx="12" cy="12" r="9.5" /><path d="M12 6.8V12l3.4 2" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2.2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  pin: <><path d="M20 10.5c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10.3" r="3" /></>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  back: <><path d="M19 12H5M11 18l-6-6 6-6" /></>,
  menu: <><path d="M3 6h18M3 12h18M3 18h18" /></>,
  x: <><path d="M18 6 6 18M6 6l12 12" /></>,
  shield: <><path d="M12 2.5 4 6v6c0 5 3.4 8.6 8 9.5 4.6-.9 8-4.5 8-9.5V6l-8-3.5z" /><path d="m9 12 2.2 2.2L15.4 10" /></>,
  star: <><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z" /></>,
  upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7.5 8.5 12 4l4.5 4.5M12 4v12" /></>,
  bell: <><path d="M18 8.5a6 6 0 1 0-12 0c0 6-2.5 7.5-2.5 7.5h17S18 14.5 18 8.5z" /><path d="M13.7 20a2 2 0 0 1-3.4 0" /></>,
  mail: <><rect x="2" y="4.5" width="20" height="15" rx="2.2" /><path d="m3 6.5 9 6.5 9-6.5" /></>,
  phoneCall: <><path d="M21.5 16.9v2.5a2 2 0 0 1-2.2 2 19.6 19.6 0 0 1-8.5-3 19.3 19.3 0 0 1-6-6 19.6 19.6 0 0 1-3-8.6A2 2 0 0 1 3.8 1.5h2.5a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L7.5 9.4a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.8 2.4z" /></>,
  chart: <><path d="M3 3v18h18" /><path d="M7 15l3.5-4 3 2.5L20 7" /></>,
  filter: <><path d="M3 4.5h18l-7 8.2V20l-4 1.5v-8.8L3 4.5z" /></>,
  inbox: <><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.5 5h13l3.5 7v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6l3.5-7z" /></>,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7.5 11 12 15.5 16.5 11M12 3.5v12" /></>,
  print: <><path d="M6 9V2.5h12V9" /><rect x="3" y="9" width="18" height="8" rx="2" /><path d="M6 14h12v7.5H6z" /></>,
  info: <><circle cx="12" cy="12" r="9.5" /><path d="M12 16v-4.5M12 8h.01" /></>,
  lock: <><rect x="4" y="10.5" width="16" height="11" rx="2.2" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" /></>,
  signOut: <><path d="M15 3.5h3.5A2 2 0 0 1 20.5 5.5v13a2 2 0 0 1-2 2H15" /><path d="M10 16.5 14.5 12 10 7.5" /><path d="M14.5 12H3.5" /></>,
  refresh: <><path d="M3 12a9 9 0 0 1 15.4-6.4L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15.4 6.4L3 16" /><path d="M3 21v-5h5" /></>,
}

export default function Icon({ name, size = 20, stroke = 1.8, className = '', style }) {
  const path = P[name] || P.dots
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {path}
    </svg>
  )
}
