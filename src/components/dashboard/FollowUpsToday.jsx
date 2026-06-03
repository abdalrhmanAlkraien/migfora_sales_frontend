import './styles/FollowUpsToday.css'

const TYPE_MAP = {
  CALL:     { label: 'Call',     icon: '📞' },
  VISIT:    { label: 'Visit',    icon: '🏢' },
  MEETING:  { label: 'Meeting',  icon: '🤝' },
  EMAIL:    { label: 'Email',    icon: '✉' },
  WHATSAPP: { label: 'WhatsApp', icon: '💬' },
}

export default function FollowUpsToday({ followUps, loading, onContactClick }) {
  return (
    <div className="fud-today">
      <div className="fud-today__header">
        <div className="fud-today__header-left">
          <h2 className="fud-today__title">Follow-ups Today</h2>
          {!loading && followUps.length > 0 && (
            <span className="fud-today__badge">{followUps.length}</span>
          )}
        </div>
        <span className="fud-today__date">
          {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        </span>
      </div>

      {loading ? (
        <div className="fud-today__loading">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="fud-today__skeleton-row" />
          ))}
        </div>
      ) : followUps.length === 0 ? (
        <div className="fud-today__empty">
          <svg viewBox="0 0 48 48" fill="none" className="fud-today__empty-icon">
            <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M24 16v8M24 28h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p>No follow-ups scheduled for today</p>
        </div>
      ) : (
        <div className="fud-today__list">
          {followUps.map((fu) => {
            const type = TYPE_MAP[fu.type] || { label: fu.type, icon: '📋' }
            return (
              <div
                key={fu.id}
                className="fud-today__item"
                onClick={() => onContactClick(fu)}
                role="button" tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onContactClick(fu)}
              >
                <div className="fud-today__item-left">
                  <span className="fud-today__type-icon">{type.icon}</span>
                  <div className="fud-today__item-info">
                    <div className="fud-today__item-top">
                      <span className="fud-today__contact">{fu.contactName}</span>
                      <span className="fud-today__company">{fu.companyName}</span>
                    </div>
                    {fu.notes && <p className="fud-today__notes">{fu.notes}</p>}
                  </div>
                </div>
                <div className="fud-today__item-right">
                  <span className="fud-today__time">{fu.scheduledAt?.slice(11, 16)}</span>
                  <span className="fud-today__type-label">{type.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}