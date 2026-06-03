import './styles/DashboardStats.css'

const ADMIN_CARDS = [
  { key: 'totalCompanies',      label: 'Companies',        icon: 'building', color: 'navy'   },
  { key: 'totalContacts',       label: 'Contacts',         icon: 'users',    color: 'blue'   },
  { key: 'totalInvestigations', label: 'Investigations',   icon: 'search',   color: 'purple' },
  { key: 'totalReports',        label: 'Reports',          icon: 'file',     color: 'teal'   },
  { key: 'totalUsers',          label: 'Users',            icon: 'user',     color: 'orange' },
  { key: 'followUpsDueToday',   label: 'Due Today',        icon: 'bell',     color: 'red'    },
  { key: 'pendingFollowUps',    label: 'Pending Follow-ups', icon: 'clock',  color: 'amber'  },
]

const SALES_CARDS = [
  { key: 'totalCompanies',    label: 'Companies',          icon: 'building', color: 'navy'   },
  { key: 'totalContacts',     label: 'Contacts',           icon: 'users',    color: 'blue'   },
  { key: 'followUpsDueToday', label: 'Due Today',          icon: 'bell',     color: 'red'    },
  { key: 'pendingFollowUps',  label: 'Pending Follow-ups', icon: 'clock',    color: 'amber'  },
]

const COLOR_MAP = {
  navy:   { bg: 'rgba(13,27,42,.08)',      color: 'var(--color-navy)',  icon: 'rgba(13,27,42,.06)'   },
  blue:   { bg: 'rgba(59,130,246,.08)',    color: '#2563eb',            icon: 'rgba(59,130,246,.12)' },
  purple: { bg: 'rgba(124,58,237,.08)',    color: '#7c3aed',            icon: 'rgba(124,58,237,.12)' },
  teal:   { bg: 'rgba(20,184,166,.08)',    color: '#0d9488',            icon: 'rgba(20,184,166,.12)' },
  orange: { bg: 'rgba(255,153,0,.08)',     color: '#b96d00',            icon: 'rgba(255,153,0,.12)'  },
  red:    { bg: 'rgba(220,38,38,.08)',     color: '#dc2626',            icon: 'rgba(220,38,38,.12)'  },
  amber:  { bg: 'rgba(245,158,11,.08)',    color: '#b45309',            icon: 'rgba(245,158,11,.12)' },
}

const ICONS = {
  building: (
    <svg viewBox="0 0 20 20" fill="none">
      <path d="M3 19V7l7-4 7 4v12" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M8 19v-5h4v5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M8 9h.01M12 9h.01M8 13h.01M12 13h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  users: (
    <svg viewBox="0 0 20 20" fill="none">
      <circle cx="8" cy="7" r="3" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M2 18c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M14 5a3 3 0 1 1 0 6M18 18c0-3-1.8-5.4-4-5.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  search: (
    <svg viewBox="0 0 20 20" fill="none">
      <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  file: (
    <svg viewBox="0 0 20 20" fill="none">
      <rect x="4" y="2" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  user: (
    <svg viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M3 18c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 20 20" fill="none">
      <path d="M10 2a6 6 0 0 0-6 6c0 5-2 6-2 6h16s-2-1-2-6a6 6 0 0 0-6-6Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M11.73 17a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M10 6v4.5l3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
}

export default function DashboardStats({ stats, isAdmin }) {
  const cards = isAdmin ? ADMIN_CARDS : SALES_CARDS

  return (
    <div className={`dash-stats ${isAdmin ? 'dash-stats--admin' : 'dash-stats--sales'}`}>
      {cards.map((card) => {
        const c = COLOR_MAP[card.color]
        return (
          <div
            key={card.key}
            className="dash-stats__card"
            style={{ borderTop: `3px solid ${c.color}` }}
          >
            <div className="dash-stats__card-top">
              <div className="dash-stats__icon" style={{ background: c.icon, color: c.color }}>
                {ICONS[card.icon]}
              </div>
              <span className="dash-stats__label">{card.label}</span>
            </div>
            <span className="dash-stats__value" style={{ color: c.color }}>
              {stats[card.key] ?? 0}
            </span>
          </div>
        )
      })}
    </div>
  )
}