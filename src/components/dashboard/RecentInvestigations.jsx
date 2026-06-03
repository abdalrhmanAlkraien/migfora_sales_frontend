import './styles/RecentInvestigations.css'

const STATUS_COLORS = {
  OPEN:     { bg: 'rgba(255,153,0,.12)',   color: '#b96d00' },
  CLOSED:   { bg: 'rgba(13,27,42,.07)',    color: 'rgba(13,27,42,.5)' },
  ARCHIVED: { bg: 'rgba(107,114,128,.1)',  color: '#4b5563' },
}

export default function RecentInvestigations({ investigations, loading, onItemClick }) {
  return (
    <div className="dash-inv">
      <div className="dash-inv__header">
        <h2 className="dash-inv__title">Recent Investigations</h2>
      </div>

      {loading ? (
        <div className="dash-inv__loading">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="dash-inv__skeleton-row" />
          ))}
        </div>
      ) : investigations.length === 0 ? (
        <div className="dash-inv__empty">
          <p>No investigations yet</p>
        </div>
      ) : (
        <div className="dash-inv__list">
          {investigations.map((inv) => {
            const s = STATUS_COLORS[inv.status] || STATUS_COLORS.OPEN
            return (
              <div
                key={inv.id}
                className="dash-inv__item"
                onClick={() => onItemClick(inv)}
                role="button" tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onItemClick(inv)}
              >
                <div className="dash-inv__item-left">
                  <div className="dash-inv__icon">
                    <svg viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M7 1.5C7 1.5 5.5 3.5 5.5 7s1.5 5.5 1.5 5.5M7 1.5C7 1.5 8.5 3.5 8.5 7S7 12.5 7 12.5M1.5 7h11"
                        stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                  </div>
                  <div className="dash-inv__info">
                    <span className="dash-inv__domain">{inv.domain}</span>
                    <span className="dash-inv__company">{inv.companyName}</span>
                  </div>
                </div>
                <div className="dash-inv__item-right">
                  <span className="dash-inv__status" style={{ background: s.bg, color: s.color }}>
                    {inv.status}
                  </span>
                  <span className="dash-inv__date">{inv.createdAt?.slice(0, 10)}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}