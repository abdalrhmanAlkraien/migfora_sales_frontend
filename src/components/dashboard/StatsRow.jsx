import './styles/StatsRow.css'

const STATS = [
  {
    label: 'Total Clients',
    value: '48',
    change: '+3 this month',
    trend: 'up',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    label: 'Active Projects',
    value: '12',
    change: '+2 this week',
    trend: 'up',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
  {
    label: 'Monthly Revenue',
    value: '$84,200',
    change: '+12% vs last month',
    trend: 'up',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    label: 'Open Tickets',
    value: '7',
    change: '-2 since yesterday',
    trend: 'down',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
]

export default function StatsRow() {
  return (
    <div className="stats-row">
      {STATS.map((stat) => (
        <div key={stat.label} className="stat-card">
          <div className="stat-card__icon">{stat.icon}</div>
          <span className="stat-card__label">{stat.label}</span>
          <span className="stat-card__value">{stat.value}</span>
          <span className={`stat-card__change stat-card__change--${stat.trend}`}>
            {stat.change}
          </span>
        </div>
      ))}
    </div>
  )
}