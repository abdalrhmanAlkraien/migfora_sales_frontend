import './styles/CompanyStatsBar.css'

export default function CompanyStatsBar({ investigations, contacts, reports }) {
  const stats = [
    { label: 'Investigations', value: investigations,
      icon: (
        <svg viewBox="0 0 16 16" fill="none">
          <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      )
    },
    { label: 'Contacts', value: contacts,
      icon: (
        <svg viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M2.5 14c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      )
    },
    { label: 'Reports', value: reports,
      icon: (
        <svg viewBox="0 0 16 16" fill="none">
          <rect x="2.5" y="1.5" width="11" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      )
    },
  ]

  return (
    <div className="stats-bar">
      {stats.map((s) => (
        <div key={s.label} className="stats-bar__item">
          <div className="stats-bar__icon">{s.icon}</div>
          <div className="stats-bar__body">
            <span className="stats-bar__value">{s.value}</span>
            <span className="stats-bar__label">{s.label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}